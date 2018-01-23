import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import ResizableContainer from '../resizable/ResizableContainer';
import { componentIsResizable } from '../../util/gridUtils';

import {
  COLUMN_TYPE,
  SPACER_TYPE,
  INVISIBLE_ROW_TYPE,
  GRID_GUTTER_SIZE,
  GRID_ROW_HEIGHT_UNIT,
  GRID_COLUMN_COUNT,
  GRID_MIN_COLUMN_COUNT,
  GRID_MIN_ROW_UNITS,
  GRID_MAX_ROW_UNITS,
} from '../../util/constants';

import { COMPONENT_TYPE_LOOKUP } from './';

const propTypes = {
  entity: PropTypes.object,
  entities: PropTypes.object,
  columnWidth: PropTypes.number,
  onResizeStart: PropTypes.func,
  onResize: PropTypes.func,
  onResizeStop: PropTypes.func,
};

const defaultProps = {
  entity: {},
  entities: {},
  columnWidth: 0,
  onResizeStop: null,
  onResize: null,
  onResizeStart: null,
};

class Row extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modifiedEntities: {
        ...props.entities,
      },
    };
    this.handleResizeStart = this.handleResizeStart.bind(this);
    this.handleResizeStop = this.handleResizeStop.bind(this);
  }

  componentWillReceiveProps() {
    // @TODO
  }

  handleResizeStart(args) {
    const { onResizeStart } = this.props;
    if (onResizeStart) onResizeStart(args);
  }

  handleResizeStop({ id, widthMultiple, heightMultiple }) {
    const { onResizeStop } = this.props;
    this.setState(({ modifiedEntities }) => {
      const entity = modifiedEntities[id];
      if (entity.meta.width !== widthMultiple || entity.meta.height !== heightMultiple) {
        return {
          modifiedEntities: {
            ...modifiedEntities,
            [id]: {
              ...entity,
              meta: {
                ...entity.meta,
                width: widthMultiple || entity.meta.width,
                height: heightMultiple || entity.meta.height,
              },
            },
          },
        };
      }
      return null;
    }, onResizeStop);
  }

  serializeRow() {
    // @TODO
  }

  render() {
    const { entity: rowEntity, columnWidth, onResize } = this.props;
    const { modifiedEntities } = this.state;

    let totalColumns = 0;
    let maxItemHeight = 0;
    const rowItems = [];

    (rowEntity.children || []).forEach((id, index) => {
      const entity = modifiedEntities[id];
      totalColumns += (entity.meta || {}).width || 0;
      rowItems.push(entity);
      if (index < rowEntity.children.length - 1) rowItems.push(`gutter-${index}`);
      if ((entity.meta || {}).height) maxItemHeight = Math.max(maxItemHeight, entity.meta.height);
    });

    return (
      <div
        className={cx(
          'grid-row',
          rowEntity.type !== INVISIBLE_ROW_TYPE && 'grid-row-container',
        )}
      >
        {rowItems.map((entity) => {
          const id = entity.id || entity;
          const Component = COMPONENT_TYPE_LOOKUP[entity.type];
          const isSpacer = entity.type === SPACER_TYPE;
          const isResizable = componentIsResizable(entity);

          // Rows may have Column children which are resizable
          let RowItem = Component ? (
            <Component
              key={id}
              id={id}
              entity={entity}
              entities={modifiedEntities}
              onResizeStop={this.handleResizeStop}
              onResize={onResize}
              onResizeStart={this.handleResizeStart}
            />
          ) : <div key={id} style={{ width: GRID_GUTTER_SIZE }} />;

          if (isResizable) {
            RowItem = (
              <ResizableContainer
                key={id}
                id={id}
                adjustableWidth
                adjustableHeight={[COLUMN_TYPE, SPACER_TYPE].indexOf(entity.type) === -1}
                widthStep={columnWidth + GRID_GUTTER_SIZE} // step includes gutter
                heightStep={GRID_ROW_HEIGHT_UNIT}
                widthMultiple={entity.meta.width || 0}
                heightMultiple={
                  entity.meta.height || (entity.type !== COLUMN_TYPE ? maxItemHeight : null)
                }
                minWidthMultiple={isSpacer ? 1 : GRID_MIN_COLUMN_COUNT}
                maxWidthMultiple={GRID_COLUMN_COUNT - totalColumns + (entity.meta.width || 0)}
                minHeightMultiple={GRID_MIN_ROW_UNITS}
                maxHeightMultiple={GRID_MAX_ROW_UNITS}
                onResizeStop={this.handleResizeStop}
                onResize={onResize}
                onResizeStart={this.handleResizeStart}
                gutterWidth={GRID_GUTTER_SIZE}
              >
                {RowItem}
              </ResizableContainer>
            );
          }
          return RowItem;
        })}

        {(!rowEntity.children || !rowEntity.children.length) &&
          <div style={{ padding: 16 }}>
            Empty row
          </div>}
      </div>
    );
  }
}

Row.propTypes = propTypes;
Row.defaultProps = defaultProps;

export default Row;

import React from 'react';
import PropTypes from 'prop-types';
import ResizableContainer from './ResizableContainer';

import {
  COLUMN_TYPE,
  CHART_TYPE,
  MARKDOWN_TYPE,
  GRID_ROW_HEIGHT_UNIT,
  GRID_MIN_ROW_HEIGHT,
  GRID_COLUMN_COUNT,
  GRID_MIN_COLUMN_COUNT,
  GRID_MIN_ROW_UNITS,
  GRID_MAX_ROW_UNITS,
} from '../util/constants';

const propTypes = {
  row: PropTypes.object,
  entities: PropTypes.object,
  rowWidth: PropTypes.number,
  columnWidth: PropTypes.number,
  minElementWidth: PropTypes.number,
  onResizeStart: PropTypes.func,
  onResizeStop: PropTypes.func,
};

const defaultProps = {
  row: {},
  entities: {},
  rowWidth: 0,
  columnWidth: 0,
  minElementWidth: 0,
  onResizeStop: null,
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

  handleResizeStart({ id }) {
    const { onResizeStart } = this.props;
    if (onResizeStart) onResizeStart({ id });
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
                width: widthMultiple,
                height: heightMultiple,
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
    const { row, rowWidth, columnWidth, minElementWidth } = this.props;
    const { modifiedEntities } = this.state;

    const totalColumns = row.children.reduce((sum, curr) => (
      sum + modifiedEntities[curr].meta.width
    ), 0);

    return (
      <div
        style={{
          width: '100%',
          height: 'fit-content', // @TODO this only works in chrome, how to fix?
          minHeight: GRID_MIN_ROW_HEIGHT,
          background: '#76218a',
          opacity: 0.75,
          color: '#fff',
        }}
      >
        {row.children.map((id) => {
          const entity = modifiedEntities[id];
          const isResizable = [COLUMN_TYPE, CHART_TYPE, MARKDOWN_TYPE].indexOf(entity.type) > -1;
          if (isResizable) {
            return (
              <ResizableContainer
                key={id}
                id={id}
                adjustableWidth
                adjustableHeight={entity.type !== COLUMN_TYPE}
                widthStep={columnWidth}
                heightStep={GRID_ROW_HEIGHT_UNIT}
                widthMultiple={entity.meta.width}
                heightMultiple={entity.meta.height}
                minWidthMultiple={GRID_MIN_COLUMN_COUNT}
                maxWidthMultiple={GRID_COLUMN_COUNT - totalColumns + entity.meta.width}
                minHeightMultiple={GRID_MIN_ROW_UNITS}
                maxHeightMultiple={GRID_MAX_ROW_UNITS}
                onResizeStop={this.handleResizeStop}
                onResizeStart={this.handleResizeStart}
              />
            );
          }
          return null;
        })}
        {!row.children.length && 'Empty row'}
      </div>
    );
  }
}

Row.propTypes = propTypes;
Row.defaultProps = defaultProps;

export default Row;

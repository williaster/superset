import React from 'react';
import PropTypes from 'prop-types';

import ResizableContainer from '../resizable/ResizableContainer';

import { COMPONENT_TYPE_LOOKUP } from './';
import { componentIsResizable } from '../../util/gridUtils';

import {
  SPACER_TYPE,
  GRID_GUTTER_SIZE,
  GRID_ROW_HEIGHT_UNIT,
  GRID_MIN_ROW_UNITS,
  GRID_MAX_ROW_UNITS,
} from '../../util/constants';

const propTypes = {
  entity: PropTypes.object,
  entities: PropTypes.object,
  onResizeStart: PropTypes.func,
  onResize: PropTypes.func,
  onResizeStop: PropTypes.func,
};

const defaultProps = {
  entity: {},
  entities: {},
  onResizeStop: null,
  onResize: null,
  onResizeStart: null,
};

class Column extends React.PureComponent {
  render() {
    const { entity: columnEntity, entities, onResizeStop, onResize, onResizeStart } = this.props;

    const columnItems = [];

    (columnEntity.children || []).forEach((id, index) => {
      const entity = entities[id];
      columnItems.push(entity);
      if (index < columnEntity.children.length - 1) columnItems.push(`gutter-${index}`);
    });

    return (
      <div className="grid-column">
        {columnItems.map((entity) => {
          const id = entity.id || entity;
          const Component = COMPONENT_TYPE_LOOKUP[entity.type];
          const isResizable = componentIsResizable(entity);

          let ColumnItem = Component ? (
            <Component
              key={id}
              id={id}
              entity={entity}
              entities={entities}
              onResizeStop={onResizeStop}
              onResize={onResize}
              onResizeStart={onResizeStart}
            />
          ) : <div key={id} style={{ height: GRID_GUTTER_SIZE }} />;

          if (isResizable) {
            ColumnItem = (
              <ResizableContainer
                key={id}
                id={id}
                adjustableWidth={false} // everything in a column inherits the Columns's width
                adjustableHeight
                heightStep={GRID_ROW_HEIGHT_UNIT}
                heightMultiple={entity.meta.height}
                minHeightMultiple={entity.type === SPACER_TYPE ? 1 : GRID_MIN_ROW_UNITS}
                maxHeightMultiple={GRID_MAX_ROW_UNITS}
                onResizeStop={onResizeStop}
                onResize={onResize}
                onResizeStart={onResizeStart}
              >
                {ColumnItem}
              </ResizableContainer>
            );
          }
          return ColumnItem;
        })}

        {(!columnEntity.children || !columnEntity.children.length)
          && 'Empty column'}
      </div>
    );
  }
}

Column.propTypes = propTypes;
Column.defaultProps = defaultProps;

export default Column;

import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Draggable, Droppable } from 'react-beautiful-dnd';

import ResizableContainer from '../resizable/ResizableContainer';
import isValidChild from '../../util/isValidChild';
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
  DROPPABLE_DIRECTION_HORIZONTAL,
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

class Row extends React.PureComponent {
  // shouldComponentUpdate() {
  //   // @TODO check foro updates to this row only
  // }

  render() {
    const {
      entities,
      entity: rowEntity,
      columnWidth,
      onResizeStart,
      onResize,
      onResizeStop,
      draggingEntity,
      disableDrop,
      disableDrag,
    } = this.props;

    let totalColumns = 0;
    let maxItemHeight = 0;
    const rowItems = [];

    (rowEntity.children || []).forEach((id, index) => {
      const entity = entities[id];
      totalColumns += (entity.meta || {}).width || 0;
      rowItems.push(entity);
      if (index < rowEntity.children.length - 1) rowItems.push(`gutter-${index}`);
      if ((entity.meta || {}).height) maxItemHeight = Math.max(maxItemHeight, entity.meta.height);
    });

    if (!rowEntity.children || !rowEntity.children.length) {
      return (
        <div style={{ padding: 16 }}>
          Empty row
        </div>
      );
    }

    return (
      <Droppable
        droppableId={rowEntity.id}
        isDropDisabled={disableDrop || !isValidChild({
          childType: draggingEntity && draggingEntity.type,
          parentType: rowEntity.type,
        })}
        direction={DROPPABLE_DIRECTION_HORIZONTAL}
      >
        {(droppableProvided, droppableSnapshot) => (
          <div
            ref={droppableProvided.innerRef}
            style={{ backgroundColor: droppableSnapshot.isDraggingOver ? 'coral' : 'transparent' }}
            className={cx(
              'grid-row',
              rowEntity.type !== INVISIBLE_ROW_TYPE && 'grid-row-container',
            )}
          >
            {droppableProvided.placeholder}

            {rowItems.map((entity, index) => {
              const id = entity.id || entity;
              const Component = COMPONENT_TYPE_LOOKUP[entity.type];
              const isSpacer = entity.type === SPACER_TYPE;
              const isResizable = componentIsResizable(entity);

              let RowItem = Component ? (
                <Component
                  key={id}
                  id={id}
                  entity={entity}
                  entities={entities}
                  onResizeStop={onResizeStop} // Column children are are resizable
                  onResize={onResize}
                  onResizeStart={onResizeStart}
                />
              ) : <div key={id} style={{ width: GRID_GUTTER_SIZE }} />;

              if (isResizable && Component) {
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
                    onResizeStop={onResizeStop}
                    onResize={onResize}
                    onResizeStart={onResizeStart}
                    gutterWidth={GRID_GUTTER_SIZE}
                  >
                    {RowItem}
                  </ResizableContainer>
                );
              }

              if (Component) {
                return (
                  <Draggable
                    key={id}
                    draggableId={id}
                    index={index / 2} // account for spacers
                    isDragDisabled={disableDrag}
                  >
                    {draggableProvided => (
                      <div className="draggable-row-item">
                        {draggableProvided.placeholder}
                        <div
                          ref={draggableProvided.innerRef}
                          {...draggableProvided.draggableProps}
                        >
                          <div
                            className={cx(!disableDrag && 'draggable-row-item-handle')}
                            {...draggableProvided.dragHandleProps}
                          />
                          {RowItem}
                        </div>
                      </div>
                      )}
                  </Draggable>
                );
              }

              return RowItem;
            })}
          </div>
        )}
      </Droppable>
    );
  }
}

Row.propTypes = propTypes;
Row.defaultProps = defaultProps;

export default Row;

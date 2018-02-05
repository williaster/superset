import React from 'react';
import PropTypes from 'prop-types';
import ParentSize from '@vx/responsive/build/components/ParentSize';
import cx from 'classnames';
import { Droppable, Draggable } from 'react-beautiful-dnd';

import isValidChild from '../util/isValidChild';

import {
  DROPPABLE_ID_DASHBOARD_ROOT,
  GRID_GUTTER_SIZE,
  GRID_COLUMN_COUNT,
  GRID_ROOT_TYPE,
} from '../util/constants';

import { COMPONENT_TYPE_LOOKUP } from './gridComponents';
import './gridComponents/grid.css';

const propTypes = {
  layout: PropTypes.object,
  draggingEntity: PropTypes.shape({
    type: PropTypes.string.isRequired, // @TODO enumerate
  }),
  updateEntity: PropTypes.func,
};

const defaultProps = {
  layout: {
    children: [],
    entities: {},
  },
  draggingEntity: null,
  updateEntity() {},
};

class DashboardGrid extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showGrid: false,
      rowGuide: null,
      disableDrop: false,
      disableDrag: false,
      selectedEntityId: null,
    };

    this.handleToggleSelectEntityId = this.handleToggleSelectEntityId.bind(this);
    this.handleResizeStart = this.handleResizeStart.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.handleResizeStop = this.handleResizeStop.bind(this);
    this.getRowGuidePosition = this.getRowGuidePosition.bind(this);
  }

  getRowGuidePosition(resizeRef) {
    if (resizeRef && this.grid) {
      return resizeRef.getBoundingClientRect().bottom - this.grid.getBoundingClientRect().top - 1;
    }
    return null;
  }

  handleResizeStart({ ref, direction }) {
    console.log('resize start');
    let rowGuide = null;
    if (direction === 'bottom' || direction === 'bottomRight') {
      rowGuide = this.getRowGuidePosition(ref);
    }

    this.setState(() => ({
      showGrid: true,
      rowGuide,
      disableDrag: true,
      disableDrop: true,
    }));
  }

  handleResize({ ref, direction }) {
    console.log('resize');
    if (direction === 'bottom' || direction === 'bottomRight') {
      this.setState(() => ({ rowGuide: this.getRowGuidePosition(ref) }));
    }
  }

  handleResizeStop({ id, widthMultiple, heightMultiple }) {
    console.log('resize stop');
    const { layout, updateEntity } = this.props;
    const entity = layout.entities[id];
    debugger;
    if (entity && (entity.meta.width !== widthMultiple || entity.meta.height !== heightMultiple)) {
      updateEntity({
        ...entity,
        meta: {
          ...entity.meta,
          width: widthMultiple || entity.meta.width,
          height: heightMultiple || entity.meta.height,
        },
      });
    }
    this.setState(() => ({
      showGrid: false,
      rowGuide: null,
      disableDrag: false,
      disableDrop: false,
    }));
  }

  handleToggleSelectEntityId(id) {
    // only enable selection if no drag is occurring
    if (!this.props.draggingEntity) {
      this.setState(({ selectedEntityId }) => {
        const nextSelectedEntityId = id === selectedEntityId ? null : id;
        const disableDragDrop = Boolean(nextSelectedEntityId);
        return {
          selectedEntityId: nextSelectedEntityId,
          disableDrop: disableDragDrop,
          disableDrag: disableDragDrop,
        };
      });
    }
  }

  render() {
    const { layout, draggingEntity } = this.props;
    const { showGrid, rowGuide, disableDrop, disableDrag, selectedEntityId } = this.state;
    const { entities } = layout;
    const rootEntity = entities[DROPPABLE_ID_DASHBOARD_ROOT];

    console.log('dragging', draggingEntity, 'selected', selectedEntityId);

    return (
      <div
        ref={(ref) => { this.grid = ref; }}
        className={cx('grid-container', showGrid && 'grid-container--resizing')}
      >
        <ParentSize>
          {({ width }) => {
            // account for (COLUMN_COUNT - 1) gutters
            const columnPlusGutterWidth = (width + GRID_GUTTER_SIZE) / GRID_COLUMN_COUNT;
            const columnWidth = columnPlusGutterWidth - GRID_GUTTER_SIZE;

            return width < 50 ? null : (
              <Droppable
                droppableId={DROPPABLE_ID_DASHBOARD_ROOT}
                isDropDisabled={disableDrop || !isValidChild({
                  childType: draggingEntity && draggingEntity.type,
                  parentType: GRID_ROOT_TYPE,
                })}
              >
                {(droppableProvided, droppableSnapshot) => (
                  <div
                    ref={droppableProvided.innerRef}
                    style={{ backgroundColor: droppableSnapshot.isDraggingOver ? '#eee' : undefined }}
                  >
                    {rootEntity.children.map((id, index) => {
                      const entity = entities[id] || {};
                      const Component = COMPONENT_TYPE_LOOKUP[entity.type];
                      return (
                        <Draggable
                          key={id}
                          draggableId={id}
                          index={index}
                        >
                          {draggableProvided => (
                            <div className="draggable-row">
                              <div
                                ref={draggableProvided.innerRef}
                                {...draggableProvided.draggableProps}
                              >
                                <div
                                  className={cx(!disableDrag && 'draggable-row-handle')}
                                  {...draggableProvided.dragHandleProps}
                                />
                                <Component
                                  id={id}
                                  entity={entities[id]}
                                  entities={entities}
                                  rowWidth={width}
                                  columnWidth={columnWidth}
                                  toggleSelectEntity={this.handleToggleSelectEntityId}
                                  selectedEntityId={selectedEntityId}
                                  onResizeStart={this.handleResizeStart}
                                  onResize={this.handleResize}
                                  onResizeStop={this.handleResizeStop}
                                  draggingEntity={draggingEntity}
                                  disableDrop={disableDrop}
                                  disableDrag={disableDrag}
                                />
                              </div>
                              {draggableProvided.placeholder}
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                    {droppableProvided.placeholder}
                    {showGrid && Array(GRID_COLUMN_COUNT).fill(null).map((_, i) => (
                      <div
                        key={`grid-column-${i}`}
                        className="grid-column-guide"
                        style={{
                          left: (i * GRID_GUTTER_SIZE) + (i * columnWidth),
                          width: columnWidth,
                        }}
                      />
                    ))}

                    {showGrid && rowGuide &&
                      <div
                        className="grid-row-guide"
                        style={{
                          top: rowGuide,
                          width,
                        }}
                      />}
                  </div>
                )}
              </Droppable>
            );
          }}
        </ParentSize>
      </div>
    );
  }
}

DashboardGrid.propTypes = propTypes;
DashboardGrid.defaultProps = defaultProps;

export default DashboardGrid;

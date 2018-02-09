import React from 'react';
import PropTypes from 'prop-types';
import { DragSource, DropTarget } from 'react-dnd';
import cx from 'classnames';
import throttle from 'lodash.throttle';

import ResizableContainer from '../resizable/ResizableContainer';
import componentIsResizable from '../../util/componentIsResizable';

import {
  GRID_GUTTER_SIZE,
  GRID_ROW_HEIGHT_UNIT,
  GRID_COLUMN_COUNT,
  GRID_MIN_COLUMN_COUNT,
  GRID_MIN_ROW_UNITS,
  GRID_MAX_ROW_UNITS,
} from '../../util/constants';

import { SPACER_TYPE, COLUMN_TYPE } from '../../util/componentTypes';
import { COMPONENT_TYPE_LOOKUP } from '../gridComponents';

import isValidChild from '../../util/isValidChild';

const HOVER_THROTTLE_MS = 200;

const propTypes = {
  // depth: PropTypes.number.isRequired,
  entity: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  parentId: PropTypes.string.isRequired,
  disableDrop: PropTypes.bool,
  disableDrag: PropTypes.bool,

  // from HOCs
  isDragging: PropTypes.bool.isRequired,
  droppableRef: PropTypes.func.isRequired,
  dragSourceRef: PropTypes.func.isRequired,
  dragPreviewRef: PropTypes.func.isRequired,
};

const defaultProps = {
  disableDrag: false,
  disableDrop: false,
};

class DraggableColumn extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      horizontalDropIndicator: null,
    };

    this.handleBeginDrag = this.handleBeginDrag.bind(this);
    this.handleHover = throttle(this.hover.bind(this), HOVER_THROTTLE_MS).bind(this);
    this.handleDrop = this.handleDrop.bind(this);

    this.renderDropIndicator = this.renderDropIndicator.bind(this);
    this.renderComponent = this.renderComponent.bind(this);
  }

  handleBeginDrag() {
    const { entity, index, parentId } = this.props;
    return { draggableId: entity.id, index, parentId, type: entity.type };
  }

  hover(props, monitor, component) {
    const { entity } = this.props;
    const draggingItem = monitor.getItem();

    if (!draggingItem || draggingItem.draggableId === entity.id) {
      return;
    }

    const draggingItemIsValidChild = isValidChild({
      parentType: entity.type,
      childType: draggingItem.type,
    });

    if (draggingItemIsValidChild) { // vertical indicator, append to container
      this.setState(() => ({
        dropIndicator: {
          position: 'relative',
          width: 'auto',
          minWidth: 20,
          margin: 'auto',
          left: 0,
          right: 0,
        },
      }));
    } else { // vertical indicator, left or right
      const colBoundingRect = this.ref.getBoundingClientRect();
      const clientOffset = monitor.getClientOffset();

      if (clientOffset) {
        const colMiddleX = colBoundingRect.left
          + (colBoundingRect.right - colBoundingRect.left) / 2;

        let dropIndicatorLeft = 0;
        if (clientOffset.x >= colMiddleX) { // place indicator right of col
          dropIndicatorLeft = colBoundingRect.width;
        }

        this.setState(() => ({
          dropIndicator: {
            left: dropIndicatorLeft,
            height: '100%',
            width: 3,
          },
        }));
      }
    }
  }

  handleDrop(props, monitor, component) {
    console.log('column  drop');
    // check if a nested drop target handled the drop
    if (monitor.didDrop()) return;

    const { entity, parentId: columnParentId, index: columnIndex } = this.props;
    const draggingItem = monitor.getItem();

    // if dropped self on self, do nothing
    if (draggingItem && draggingItem.draggableId === entity.id) return;

    // append to self, or parent
    const acceptChild = isValidChild({ parentType: entity.type, childType: draggingItem.type });

    // if (!acceptChild) return undefined;

    const dropResult = {
      source: draggingItem.parentId ? {
        droppableId: draggingItem.parentId,
        index: draggingItem.index,
      } : null,
      draggableId: draggingItem.draggableId,
    };

    if (acceptChild) { // if it's a valid child, append it to entity.children
      dropResult.destination = {
        droppableId: entity.id,
        index: entity.children.length,
      };
    } else {
      let nextIndex = columnIndex;
      const colBoundingRect = this.ref.getBoundingClientRect();
      const clientOffset = monitor.getClientOffset();

      if (clientOffset) {
        const colMiddleX = colBoundingRect.left +
          (colBoundingRect.right - colBoundingRect.left) / 2;

        if (clientOffset.x >= colMiddleX) { // right of column
          nextIndex += 1;
        }
      }

      if (draggingItem.parentId === columnParentId && draggingItem.index < columnIndex) {
        nextIndex = Math.max(0, nextIndex - 1);
      }

      dropResult.destination = {
        droppableId: columnParentId,
        index: nextIndex,
      };
    }
    // @TODO this should be a redux action
    this.props.onDrop(dropResult);

    return dropResult;
  }

  renderResizableContainer(children) {
    const { entity, gridProps } = this.props;
    const isResizable = componentIsResizable(entity);
    const isSpacer = entity.type === SPACER_TYPE;

    if (!isResizable) return children;

    const {
      onResizeStart,
      onResize,
      onResizeStop,
      columnWidth,
      occupiedColumnCount,
      currentRowHeight,
    } = gridProps;

    return (
      <ResizableContainer
        id={entity.id}
        adjustableWidth
        adjustableHeight={[COLUMN_TYPE, SPACER_TYPE].indexOf(entity.type) === -1}
        widthStep={columnWidth + GRID_GUTTER_SIZE} // step includes gutter!
        heightStep={GRID_ROW_HEIGHT_UNIT}
        widthMultiple={entity.meta.width || 0}
        heightMultiple={
          entity.meta.height || (entity.type !== COLUMN_TYPE ? currentRowHeight : null)
        }
        minWidthMultiple={isSpacer ? 1 : GRID_MIN_COLUMN_COUNT}
        maxWidthMultiple={GRID_COLUMN_COUNT - occupiedColumnCount + (entity.meta.width || 0)}
        minHeightMultiple={GRID_MIN_ROW_UNITS}
        maxHeightMultiple={GRID_MAX_ROW_UNITS}
        onResizeStop={onResizeStop}
        onResize={onResize}
        onResizeStart={onResizeStart}
        gutterWidth={GRID_GUTTER_SIZE}
      >
        {children}
      </ResizableContainer>
    );
  }

  renderComponent() {
    const { entity, entities, gridProps } = this.props;
    const Component = COMPONENT_TYPE_LOOKUP[entity.type];

    return (
      <Component
        entity={entity}
        entities={entities}
        gridProps={gridProps}
      />
    );
  }

  renderDropIndicator() {
    const { dropIndicator } = this.state;
    const { isDraggingOverShallow } = this.props;
    return dropIndicator && isDraggingOverShallow && (
      <div
        className="dnd-drop-indicator"
        style={{
          backgroundColor: '#44C0FF',
          position: 'absolute',
          zIndex: 10,
          ...dropIndicator,
        }}
      />
    );
  }

  render() {
    const {
      droppableRef,
      dragSourceRef,
      dragPreviewRef,
      isDragging,
      disableDrag,
      // isDraggingOverShallow
    } = this.props;

    return (
      <div
        ref={(ref) => {
          this.ref = ref;
          dragPreviewRef(ref);
          droppableRef(ref);
        }}
        className={cx(
          'draggable',
          'draggable-row-item', // @TODO update to draggable-column
          isDragging && 'draggable--dragging',
          disableDrag && 'draggable--disabled',
        )}
        style={{
          display: 'flex',
          flexDirection: 'row',
          opacity: isDragging && 0.25,
          position: 'relative',
          backgroundColor: isDragging ? '#ccc' : null,
        }}
      >

        <div ref={dragSourceRef} className={cx('draggable-row-item-handle')} />

        {this.renderResizableContainer(
          this.renderComponent(),
        )}

        {this.renderDropIndicator()}
      </div>
    );
  }
}

DraggableColumn.propTypes = propTypes;
DraggableColumn.defaultProps = defaultProps;

const dragConfig = [
  'DEFAULT',
  {
    beginDrag(props, monitor, component) {
      return component.handleBeginDrag(monitor);
    },
  },
  function dragStateToProps(connect, monitor) {
    return {
      dragSourceRef: connect.dragSource(), // @TODO non-ref if this doesn't work
      dragPreviewRef: connect.dragPreview(),
      isDragging: monitor.isDragging(),
    };
  },

];

const dropConfig = [
  'DEFAULT',
  {
    hover(props, monitor, component) {
      if (monitor.isOver({ shallow: true })) {
        component.decoratedComponentInstance.handleHover(props, monitor, component);
      }
    },
    drop(props, monitor, component) {
      if (!component) return undefined
      return component.decoratedComponentInstance.handleDrop(props, monitor, component);
    },
  },
  function dropStateToProps(connect, monitor) {
    return {
      droppableRef: connect.dropTarget(),
      isDraggingOverShallow: monitor.isOver({ shallow: true }),
      draggableId: (monitor.getItem() || {}).draggableId || null,
    };
  },
];

// note that the composition order here determines using
// component.method() vs decoratedComponentInstance.method() in the above config
export default DropTarget(...dropConfig)(
  DragSource(...dragConfig)(DraggableColumn),
);

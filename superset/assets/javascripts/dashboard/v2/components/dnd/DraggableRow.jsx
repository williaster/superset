import React from 'react';
import PropTypes from 'prop-types';
import { DragSource, DropTarget } from 'react-dnd';
import cx from 'classnames';
import throttle from 'lodash.throttle';

import isValidChild from '../../util/isValidChild';
import { COMPONENT_TYPE_LOOKUP } from '../gridComponents';

const HOVER_THROTTLE_MS = 200;

const propTypes = {
  // depth: PropTypes.number.isRequired,
  entity: PropTypes.object.isRequired,
  parentId: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
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

class DraggableRow extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      dropIndicator: null,
    };

    this.handleBeginDrag = this.handleBeginDrag.bind(this);
    this.handleHover = throttle(this.hover.bind(this), HOVER_THROTTLE_MS).bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.renderDropIndicator = this.renderDropIndicator.bind(this);
    this.renderComponent = this.renderComponent.bind(this);
  }

  handleBeginDrag() {
    const { entity, index, parentId, type } = this.props;
    return { draggableId: entity.id, index, parentId, type };
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
          height: '50%',
          minHeight: 16,
          top: 0,
          right: 24,
          width: 3,
        },
      }));
    } else { // horizontal indicator, top or bottom
      const rowBoundingRect = this.ref.getBoundingClientRect();
      const clientOffset = monitor.getClientOffset();
      if (clientOffset) {
        const rowMiddleY = rowBoundingRect.top + (rowBoundingRect.bottom - rowBoundingRect.top) / 2;

        let dropIndicatorTop = null;
        if (clientOffset.y < rowMiddleY) { // place indicator above row
          dropIndicatorTop = 0;
        } else if (clientOffset.y >= rowMiddleY) { // place indicator below row
          dropIndicatorTop = rowBoundingRect.height;
        }

        this.setState(() => ({
          dropIndicator: {
            top: dropIndicatorTop,
            width: '100%',
            height: 3,
          },
        }));
      }
    }
  }

  handleDrop(props, monitor, component) {
    console.log('handle drop');
    // check if a nested drop target handled the drop
    if (monitor.didDrop()) return;

    const { entity, entities, parentId: rowParentId, index: rowIndex } = this.props;
    const draggingItem = monitor.getItem();

    // if dropped self on self, do nothing
    if (!draggingItem || draggingItem.draggableId === entity.id) return;

    // append to self, or parent
    const acceptChild = isValidChild({ parentType: entity.type, childType: draggingItem.type });

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
      let nextIndex = rowIndex;
      const rowBoundingRect = this.ref.getBoundingClientRect();
      const clientOffset = monitor.getClientOffset();

      if (clientOffset) {
        const rowMiddleY = rowBoundingRect.top + (rowBoundingRect.bottom - rowBoundingRect.top) / 2;

        if (clientOffset.y >= rowMiddleY) { // place indicator below row
          nextIndex += 1;
        }
      }

      if (draggingItem.parentId === rowParentId && draggingItem.index < rowIndex) {
        nextIndex = Math.max(0, nextIndex - 1);
      }

      dropResult.destination = {
        droppableId: rowParentId,
        index: nextIndex,
      };
    }
    // @TODO this should be a redux action
    this.props.onDrop(dropResult);

    return dropResult;
  }

  renderComponent() {
    const {
      entity,
      droppableRef,
      dragSourceRef,
      dragPreviewRef,
      ...restProps
    } = this.props;

    const Component = COMPONENT_TYPE_LOOKUP[entity.type];

    return (
      <Component
        entity={entity}
        {...restProps} // @TODO be explicit
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
      // isDraggingOver,
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
          'draggable-row',
          isDragging && 'draggable--dragging',
          disableDrag && 'draggable--disabled',
        )}
        style={{
          opacity: isDragging && 0.25,
          position: 'relative',
          backgroundColor: isDragging ? '#ccc' : null,
        }}
      >

        <div ref={dragSourceRef} className={cx('draggable-row-handle')} />

        {this.renderComponent()}
        {this.renderDropIndicator()}
      </div>
    );
  }
}

DraggableRow.propTypes = propTypes;
DraggableRow.defaultProps = defaultProps;

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
      if (!component) return undefined;
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
  DragSource(...dragConfig)(DraggableRow),
);

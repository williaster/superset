import React from 'react';
import PropTypes from 'prop-types';
import { DragSource, DropTarget } from 'react-dnd';
import cx from 'classnames';
import throttle from 'lodash.throttle';

import DragHandle from './DragHandle';
import isValidChild from '../../util/isValidChild';
import { dragConfig, dropConfig } from './dragDroppableConfig';
import { componentShape } from '../../util/propShapes';
import { TABS_TYPE } from '../../util/componentTypes';

const HOVER_THROTTLE_MS = 200;

const propTypes = {
  children: PropTypes.node.isRequired,
  component: componentShape.isRequired,
  components: PropTypes.object.isRequired,
  depth: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
  parentId: PropTypes.string,
  useChildAsDragHandle: PropTypes.bool,

  // from react-dnd
  isDragging: PropTypes.bool.isRequired,
  isDraggingOverShallow: PropTypes.bool.isRequired,
  droppableRef: PropTypes.func.isRequired,
  dragSourceRef: PropTypes.func.isRequired,
  dragPreviewRef: PropTypes.func.isRequired,

  // from redux (@TODO)
  // dropIndicator: PropTypes.node,
  // handleHover: PropTypes.func.isRequired,
  // handleDrop: PropTypes.func.isRequired,
};

const defaultProps = {
  parentId: null,
  useChildAsDragHandle: false,
  dropIndicator: null,
};

class DragDroppable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dropIndicator: null,
    };
    this.handleHover = throttle(this.hover.bind(this), HOVER_THROTTLE_MS).bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.renderDropIndicator = this.renderDropIndicator.bind(this);
  }

  componentDidMount() {
    if (this.props.hoverRef) {
      this.props.hoverRef(this.handleHover);
    };
  }

  hover(monitor) {
    const { component, components, parentId, depth, bubbleUpHover } = this.props;
    const draggingItem = monitor.getItem();
    const containerOrientation = depth % 2 === 0 ? 'horizontal' : 'vertical';

    if (!draggingItem || draggingItem.draggableId === component.id) {
      console.log(draggingItem ? 'drag self' : 'no item');
      return;
    }

    const validChild = isValidChild({
      parentType: component.type,
      childType: draggingItem.type,
    });

    const validSibling = isValidChild({
      parentType: components[parentId] && components[parentId].type,
      childType: draggingItem.type,
    });

    if (validChild) { // indicate drop in container
      console.log('valid child', component.type, draggingItem.type);
      const orientation =
        containerOrientation === 'horizontal' && component.type !== TABS_TYPE ? 'vertical' : 'horizontal';

      this.setState(() => ({
        dropIndicator: {
          top: 0,
          right: 8,
          height: orientation === 'vertical' ? '100%' : 3,
          width: orientation === 'vertical' ? 3 : '100%',
          minHeight: orientation === 'vertical' ? 16 : null,
          minWidth: orientation === 'vertical' ? null : 16,
          margin: 'auto',
          backgroundColor: '#44C0FF',
          position: 'absolute',
          zIndex: 10,
        },
      }));
    } else if (validSibling) { // indicate drop near parent
      console.log('valid sibling', components[parentId].type, draggingItem.type);
      const refBoundingRect = this.ref.getBoundingClientRect();
      const clientOffset = monitor.getClientOffset();

      if (clientOffset) {
        let dropOffset;
        const orientation = containerOrientation;
        if (orientation === 'horizontal') {
          const refMiddleY =
            refBoundingRect.top + (refBoundingRect.bottom - refBoundingRect.top) / 2;
          dropOffset = clientOffset.y < refMiddleY ? 0 : refBoundingRect.height;
        } else {
          const refMiddleX =
            refBoundingRect.left + (refBoundingRect.right - refBoundingRect.left) / 2;
          dropOffset = clientOffset.x < refMiddleX ? 0 : refBoundingRect.width;
        }

        this.setState(() => ({
          dropIndicator: {
            top: orientation === 'vertical' ? 0 : dropOffset,
            left: orientation === 'vertical' ? dropOffset : 0,
            height: orientation === 'vertical' ? '100%' : 3,
            width: orientation === 'vertical' ? 3 : '100%',
            backgroundColor: '#44C0FF',
            position: 'absolute',
            zIndex: 10,
          },
        }));
      }
    } else if (bubbleUpHover) {
      // console.log('bubble');
      // debugger;
      // bubbleUpHover(monitor);
    }
  }

  handleDrop(monitor) {
    console.log('drop');

    const { components, component, parentId, index: componentIndex, onDrop, depth } = this.props;
    const draggingItem = monitor.getItem();

    // if dropped self on self, do nothing
    if (!draggingItem || draggingItem.draggableId === component.id) {
      console.log(draggingItem ? 'drag self' : 'no item');
      return undefined;
    }

    // append to self, or parent
    const validChild = isValidChild({
      parentType: component.type,
      childType: draggingItem.type,
    });

    const validSibling = isValidChild({
      parentType: components[parentId] && components[parentId].type,
      childType: draggingItem.type,
    });

    if (!validChild && !validSibling) {
      console.log('not valid child or sibling')
      return undefined;
    }

    const dropResult = {
      source: draggingItem.parentId ? {
        droppableId: draggingItem.parentId,
        index: draggingItem.index,
      } : null,
      draggableId: draggingItem.draggableId,
    };

    if (validChild) { // append it to component.children
      dropResult.destination = {
        droppableId: component.id,
        index: component.children.length,
      };
    } else { // insert as sibling
      const containerOrientation = depth % 2 === 0 ? 'horizontal' : 'vertical';
      let nextIndex = componentIndex;
      const refBoundingRect = this.ref.getBoundingClientRect();
      const clientOffset = monitor.getClientOffset();

      if (clientOffset) {
        if (containerOrientation === 'horizontal') {
          const refMiddleY =
            refBoundingRect.top + (refBoundingRect.bottom - refBoundingRect.top) / 2;
          nextIndex += clientOffset.y >= refMiddleY ? 1 : 0;
        } else {
          const refMiddleX =
            refBoundingRect.left + (refBoundingRect.right - refBoundingRect.left) / 2;
          nextIndex += clientOffset.x >= refMiddleX ? 1 : 0;
        }
      }

      if (draggingItem.parentId === parentId && draggingItem.index < componentIndex) {
        nextIndex = Math.max(0, nextIndex - 1);
      }

      dropResult.destination = {
        droppableId: parentId,
        index: nextIndex,
      };
    }

    onDrop(dropResult);

    return dropResult;
  }

  renderDropIndicator() {
    const { dropIndicator } = this.state;
    const { isDraggingOverShallow } = this.props;
    return isDraggingOverShallow && dropIndicator && (
      <div
        className="dnd-drop-indicator"
        style={{ ...dropIndicator }}
      />
    );
  }

  render() {
    const {
      children,
      depth,
      droppableRef,
      dragSourceRef,
      dragPreviewRef,
      // dropIndicator,
      innerRef,
      isDragging,
      useChildAsDragHandle,
    } = this.props;

    return (
      <div
        ref={(ref) => {
          this.ref = ref;
          dragPreviewRef(ref);
          droppableRef(ref);
          if (innerRef) innerRef(ref);
        }}
        className={cx(
          'dragdroppable',
          depth % 2 === 0 ? 'dragdroppable-row' : 'dragdroppable-column',
          isDragging && 'dragdroppable--dragging',
        )}
      >

        {useChildAsDragHandle &&
          <div ref={dragSourceRef}>{children}</div>}

        {!useChildAsDragHandle && children}

        {!useChildAsDragHandle &&
          <DragHandle
            innerRef={dragSourceRef}
            position={depth % 2 === 0 ? 'left' : 'top'}
          />}

        {this.renderDropIndicator()}
      </div>
    );
  }
}

DragDroppable.propTypes = propTypes;
DragDroppable.defaultProps = defaultProps;

// note that the composition order here determines using
// component.method() vs decoratedComponentInstance.method() in the above config
export default DropTarget(...dropConfig)(
  DragSource(...dragConfig)(DragDroppable),
);

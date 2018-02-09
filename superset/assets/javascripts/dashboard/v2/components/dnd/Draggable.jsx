import React from 'react';
import PropTypes from 'prop-types';
import { DragSource } from 'react-dnd';

const propTypes = {
  draggableId: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  children: PropTypes.func.isRequired,
  beginDrag: PropTypes.func,
  endDrag: PropTypes.func,
  canDrag: PropTypes.func,
  // from react-dnd
  dragSourceRef: PropTypes.func.isRequired,
  dragPreviewRef: PropTypes.func.isRequired,
  isDragging: PropTypes.bool,
};

const defaultProps = {
  beginDrag: null,
  endDrag: null,
  canDrag: null,
  isDragging: false,
};

class Draggable extends React.Component {
  render() {
    const { children, dragSourceRef, dragPreviewRef, isDragging } = this.props;

    return children({
      dragSourceRef,
      dragPreviewRef,
      isDragging,
    });
  }
}

Draggable.propTypes = propTypes;
Draggable.defaultProps = defaultProps;

export default DragSource(
  'DEFAULT', // @TODO this should be a constant, not a useful hook for us
  {
    beginDrag(props, monitor, component) {
      return props.beginDrag ? props.beginDrag(props, monitor, component) : ({
        draggableId: props.draggableId,
        index: props.index,
        type: props.type,
      });
    },
    endDrag(props, monitor, component) {
      return props.endDrag && props.endDrag(props, monitor, component);
    },
    canDrag(props, monitor) { return props.canDrag ? props.canDrag(props, monitor) : true; },
  },
  function dndStateToProps(connect, monitor) {
    return {
      dragSourceRef: connect.dragSource(), // @TODO non-ref if this doesn't work
      dragPreviewRef: connect.dragPreview(),
      isDragging: monitor.isDragging(),
    };
  },
)(Draggable);

import React from 'react';
import PropTypes from 'prop-types';
import { DragSource, DropTarget } from 'react-dnd';
import cx from 'classnames';
import throttle from 'lodash.throttle';

import isValidChild from '../../util/isValidChild';
import handleHover from './handleHover';
import handleDrop from './handleDrop';
import { dragConfig, dropConfig } from './dragDroppableConfig';
import { componentShape } from '../../util/propShapes';

const HOVER_THROTTLE_MS = 200;

const propTypes = {
  children: PropTypes.func,
  component: componentShape.isRequired,
  components: PropTypes.object.isRequired,
  disableDragDrop: PropTypes.bool,
  orientation: PropTypes.oneOf(['row', 'column']),
  index: PropTypes.number.isRequired,
  parentId: PropTypes.string,

  // from react-dnd
  isDragging: PropTypes.bool.isRequired,
  isDraggingOver: PropTypes.bool.isRequired,
  isDraggingOverShallow: PropTypes.bool.isRequired,
  droppableRef: PropTypes.func.isRequired,
  dragSourceRef: PropTypes.func.isRequired,
  dragPreviewRef: PropTypes.func.isRequired,

  // from redux (@TODO)
  handleHover: PropTypes.func,
  handleDrop: PropTypes.func,
  onDrop: PropTypes.func, // @TODO rename broadcastDrop?
  isValidChild: PropTypes.func,
  isValidSibling: PropTypes.func,
};

const defaultProps = {
  disableDragDrop: false,
  children() {},
  onDrop() {},
  parentId: null,
  orientation: 'row',
  handleDrop,
  handleHover,
  isValidChild,
  isValidSibling({ parentType, siblingType: childType }) {
    return isValidChild({ parentType, childType });
  },
};

class DragDroppable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dropIndicator: null,
    };
    this.handleHover = throttle(this.hover.bind(this), HOVER_THROTTLE_MS).bind(this);
  }

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  hover(props, monitor, Component) {
    if (this.mounted) this.props.handleHover(props, monitor, Component);
  }

  render() {
    const {
      children,
      orientation,
      droppableRef,
      dragSourceRef,
      dragPreviewRef,
      isDragging,
      isDraggingOver,
    } = this.props;

    const { dropIndicator } = this.state;

    return (
      <div
        ref={(ref) => {
          this.ref = ref;
          dragPreviewRef(ref);
          droppableRef(ref);
        }}
        className={cx(
          'dragdroppable',
          orientation === 'row' && 'dragdroppable-row',
          orientation === 'column' && 'dragdroppable-column',
          isDragging && 'dragdroppable--dragging',
        )}
      >
        {children({
          dragSourceRef,
          dropIndicatorProps: isDraggingOver && dropIndicator && {
            className: 'drop-indicator',
            style: dropIndicator,
          },
        })}
      </div>
    );
  }
}

DragDroppable.propTypes = propTypes;
DragDroppable.defaultProps = defaultProps;

// note that the composition order here determines using
// component.method() vs decoratedComponentInstance.method() in the drag/drop config
export default DropTarget(...dropConfig)(
  DragSource(...dragConfig)(DragDroppable),
);

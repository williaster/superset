import React from 'react';
import PropTypes from 'prop-types';

import DimensionProvider from './resizable/DimensionProvider';
import DragDroppable from './dnd/DragDroppable';
import ComponentLookup from './gridComponents';
import { componentShape } from '../util/propShapes';

const propTypes = {
  component: componentShape.isRequired,
  components: PropTypes.object.isRequired,
  depth: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
  parentId: PropTypes.string.isRequired,

  // grid related
  availableColumnCount: PropTypes.number.isRequired,
  columnWidth: PropTypes.number.isRequired,
  rowHeight: PropTypes.number,
  onResizeStart: PropTypes.func.isRequired,
  onResize: PropTypes.func.isRequired,
  onResizeStop: PropTypes.func.isRequired,
};

const defaultProps = {
  rowHeight: null,
};

class DashboardComponent extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleHoverDragDroppable = this.handleHoverDragDroppable.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    document.addEventListener('click', this.handleClick, true);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClick, true);
  }

  handleClick(event) {
    if (!this.dragDroppable) return;
    debugger;
    if (!this.dragDroppable.contains(event.target)) {
      console.log('outside click', this.props.component.type);
    } else {
      console.log('inside click', event.target === this.dragDroppable, this.props.component.type);

    }
  }

  handleHoverDragDroppable(...args) {
    if (this.hoverDragDroppable) this.hoverDragDroppable(...args);
  }

  render() {
    const {
      component,
      components,
      depth,
      index,
      parentId,
      availableColumnCount,
      columnWidth,
      rowHeight,
      onResizeStart,
      onResize,
      onResizeStop,
      onDrop,
      bubbleUpHover,
    } = this.props;

    const componentType = component.type;
    const Component = ComponentLookup[componentType];

    return (
      <DragDroppable
        innerRef={(ref) => { this.dragDroppable = ref; }}
        hoverRef={(hover) => { this.hoverDragDroppable = hover; }}
        component={component}
        components={components}
        depth={depth} // @TODO might have to change this to direction: vertical/horizontal
        index={index}
        parentId={parentId}
        onDrop={onDrop}
        bubbleUpHover={bubbleUpHover}
      >
        <DimensionProvider
          component={component}
          availableColumnCount={availableColumnCount}
          columnWidth={columnWidth}
          rowHeight={rowHeight}
          onResizeStart={onResizeStart}
          onResize={onResize}
          onResizeStop={onResizeStop}
        >
          <Component
            component={component}
            components={components}
            depth={depth}
            parentId={parentId}
            availableColumnCount={availableColumnCount}
            columnWidth={columnWidth}
            // rowHeight={rowHeight}
            onResizeStart={onResizeStart}
            onResize={onResize}
            onResizeStop={onResizeStop}
            onDrop={onDrop}
            bubbleUpHover={this.handleHoverDragDroppable}
          />
        </DimensionProvider>
      </DragDroppable>
    );
  }
}

DashboardComponent.propTypes = propTypes;
DashboardComponent.defaultProps = defaultProps;

export default DashboardComponent;

// note: the 'type' hook is not useful for us as dropping is contigent on other properties
const TYPE = 'DRAG_DROPPABLE';

export const dragConfig = [
  TYPE,
  {
    canDrag(props) {
      return !props.disableDragDrop;
    },
    beginDrag(props /* , monitor, component */) {
      const { component, index, parentId } = props;
      return { draggableId: component.id, index, parentId, type: component.type };
    },
  },
  function dragStateToProps(connect, monitor) {
    return {
      dragSourceRef: connect.dragSource(),
      dragPreviewRef: connect.dragPreview(),
      isDragging: monitor.isDragging(),
    };
  },
];

export const dropConfig = [
  TYPE,
  {
    hover(props, monitor, component) {
      if (
        component
        && component.decoratedComponentInstance
        && component.decoratedComponentInstance.handleHover
      ) { // use the component instance so we can throttle calls
        component.decoratedComponentInstance.handleHover(
          props,
          monitor,
          component.decoratedComponentInstance,
        );
      }
    },
    // note:
    //  the react-dnd api requires that the drop() method return a result or undefined
    //  monitor.didDrop() cannot be used because it returns true only for the most-nested target
    drop(props, monitor, component) {
      const Component = component.decoratedComponentInstance;
      const dropResult = monitor.getDropResult();
      if ((!dropResult || !dropResult.destination) && Component.props.handleDrop) {
        return Component.props.handleDrop(props, monitor, Component);
      }
      return undefined;
    },
  },
  function dropStateToProps(connect, monitor) {
    return {
      droppableRef: connect.dropTarget(),
      isDraggingOver: monitor.isOver(),
      isDraggingOverShallow: monitor.isOver({ shallow: true }),
    };
  },
];

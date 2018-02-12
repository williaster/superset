const TYPE = 'DRAG_DROPPABLE'; // 'type' hook is not useful for us

export const dragConfig = [
  TYPE,
  {
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
        monitor.isOver({ shallow: true })
        && component
        && component.decoratedComponentInstance
        && component.decoratedComponentInstance.handleHover
      ) {
        component.decoratedComponentInstance.handleHover(monitor);
      }
    },
    // note:
    //  it's important that the drop() method return a result in order for the react-dnd
    //  monitor.didDrop() method to bubble up properly up nested droppables
    drop(props, monitor, component) {
      if (
        !monitor.didDrop()
        && component
        && component.decoratedComponentInstance
        && component.decoratedComponentInstance.handleDrop
      ) {
        return component.decoratedComponentInstance.handleDrop(monitor);
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

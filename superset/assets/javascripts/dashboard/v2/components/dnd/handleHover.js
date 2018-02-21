export default function handleHover(props, monitor, Component) {
  const {
    component,
    components,
    parentId,
    orientation,
    isDraggingOverShallow,
    isValidChild,
    isValidSibling,
  } = Component.props;

  const draggingItem = monitor.getItem();

  if (!draggingItem || draggingItem.draggableId === component.id) {
    Component.setState(() => ({ dropIndicator: null }));
    return;
  }

  const validChild = isValidChild({
    parentType: component.type,
    childType: draggingItem.type,
  });

  const validSibling = isValidSibling({
    parentType: components[parentId] && components[parentId].type,
    siblingType: draggingItem.type,
  });

  if (validChild && !isDraggingOverShallow) {
    Component.setState(() => ({ dropIndicator: null }));
    return;
  }

  if (validChild) { // indicate drop in container
    console.log('valid child', component.type, draggingItem.type);
    const indicatorOrientation = orientation === 'row' ? 'column' : 'row';

    Component.setState(() => ({
      dropIndicator: {
        top: 0,
        right: component.children.length ? 8 : null,
        height: indicatorOrientation === 'column' ? '100%' : 3,
        width: indicatorOrientation === 'column' ? 3 : '100%',
        minHeight: indicatorOrientation === 'column' ? 16 : null,
        minWidth: indicatorOrientation === 'column' ? null : 16,
        margin: 'auto',
        backgroundColor: '#44C0FF',
        position: 'absolute',
        zIndex: 10,
      },
    }));
  } else if (validSibling) { // indicate drop near parent
    console.log('valid sibling', components[parentId].type, draggingItem.type);
    const refBoundingRect = Component.ref.getBoundingClientRect();
    const clientOffset = monitor.getClientOffset();

    if (clientOffset) {
      let dropOffset;
      if (orientation === 'row') {
        const refMiddleY =
          refBoundingRect.top + ((refBoundingRect.bottom - refBoundingRect.top) / 2);
        dropOffset = clientOffset.y < refMiddleY ? 0 : refBoundingRect.height;
      } else {
        const refMiddleX =
          refBoundingRect.left + ((refBoundingRect.right - refBoundingRect.left) / 2);
        dropOffset = clientOffset.x < refMiddleX ? 0 : refBoundingRect.width;
      }

      Component.setState(() => ({
        dropIndicator: {
          top: orientation === 'column' ? 0 : dropOffset,
          left: orientation === 'column' ? dropOffset : 0,
          height: orientation === 'column' ? '100%' : 3,
          width: orientation === 'column' ? 3 : '100%',
          backgroundColor: '#44C0FF',
          position: 'absolute',
          zIndex: 10,
        },
      }));
    }
  }
}

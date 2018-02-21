import isValidChild from '../../util/isValidChild';
import shouldWrapChildInRow from '../../util/shouldWrapChildInRow';

export default function handleDrop(props, monitor, Component) {
  if (!Component.mounted) return undefined;

  Component.setState(() => ({ dropIndicator: null }));

  const {
    parentComponent,
    component,
    index: componentIndex,
    onDrop,
    orientation,
  } = Component.props;

  const draggingItem = monitor.getItem();

  // if dropped self on self, do nothing
  if (!draggingItem || draggingItem.draggableId === component.id) {
    return undefined;
  }

  // append to self, or parent
  const validChild = isValidChild({
    parentType: component.type,
    childType: draggingItem.type,
  });

  const validSibling = isValidChild({
    parentType: parentComponent && parentComponent.type,
    childType: draggingItem.type,
  });

  const shouldWrapSibling = shouldWrapChildInRow({
    parentType: parentComponent && parentComponent.type,
    childType: draggingItem.type,
  });

  if (!validChild && !validSibling) {
    return undefined;
  }

  const dropResult = {
    source: draggingItem.parentId ? {
      droppableId: draggingItem.parentId,
      index: draggingItem.index,
    } : null,
    draggableId: draggingItem.draggableId,
  };

  if (validChild && (!validSibling || shouldWrapSibling)) { // append it to component.children
    dropResult.destination = {
      droppableId: component.id,
      index: component.children.length,
    };
  } else { // insert as sibling
    // if the item is in the same list with a smaller index, you must account for the
    // "missing" index upon movement within the list
    const sameList =
      draggingItem.parentId && parentComponent && draggingItem.parentId === parentComponent.id;
    const sameListLowerIndex = sameList && draggingItem.index < componentIndex;

    let nextIndex = sameListLowerIndex ? componentIndex - 1 : componentIndex;
    const refBoundingRect = Component.ref.getBoundingClientRect();
    const clientOffset = monitor.getClientOffset();


    if (clientOffset) {
      if (orientation === 'row') {
        const refMiddleY =
          refBoundingRect.top + ((refBoundingRect.bottom - refBoundingRect.top) / 2);
        nextIndex += clientOffset.y >= refMiddleY ? 1 : 0;
      } else {
        const refMiddleX =
          refBoundingRect.left + ((refBoundingRect.right - refBoundingRect.left) / 2);
        nextIndex += clientOffset.x >= refMiddleX ? 1 : 0;
      }
    }

    dropResult.destination = {
      droppableId: parentComponent.id,
      index: nextIndex,
    };
  }

  onDrop(dropResult);

  return dropResult;
}

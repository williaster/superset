import throttle from 'lodash.throttle';
import isValidChild from '../../util/isValidChild';
import shouldWrapChildInRow from '../../util/shouldWrapChildInRow';

const HOVER_THROTTLE_MS = 200;

function handleHover(props, monitor, Component) {
  if (!Component.mounted) return;

  const {
    component,
    parentComponent,
    orientation,
    isDraggingOverShallow,
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

  const validSibling = isValidChild({
    parentType: parentComponent && parentComponent.type,
    childType: draggingItem.type,
  });

  const shouldWrapSibling = shouldWrapChildInRow({
    parentType: parentComponent && parentComponent.type,
    childType: draggingItem.type,
  });

  if ((validChild && !isDraggingOverShallow) || (!validChild && !validSibling)) {
    Component.setState(() => ({ dropIndicator: null }));
    return;
  }

  if (validChild && (!validSibling || shouldWrapSibling)) { // indicate drop in container
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
  } else { // indicate drop near parent
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

// this is called very frequently by react-dnd
export default throttle(handleHover, HOVER_THROTTLE_MS);

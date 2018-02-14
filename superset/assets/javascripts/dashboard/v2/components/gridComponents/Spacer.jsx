import React from 'react';
import PropTypes from 'prop-types';

import DimensionProvider from '../resizable/DimensionProvider';
import DragDroppable from '../dnd/DragDroppable';
import DragHandle from '../dnd/DragHandle';
import HoverMenu from '../menu/HoverMenu';
import { componentShape } from '../../util/propShapes';

const propTypes = {
  component: componentShape.isRequired,
  components: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  depth: PropTypes.number.isRequired,
  parentId: PropTypes.string.isRequired,

  // grid related
  availableColumnCount: PropTypes.number.isRequired,
  columnWidth: PropTypes.number.isRequired,
  rowHeight: PropTypes.number,
  onResizeStart: PropTypes.func.isRequired,
  onResize: PropTypes.func.isRequired,
  onResizeStop: PropTypes.func.isRequired,

  // dnd
  handleComponentDrop: PropTypes.func.isRequired,
};

const defaultProps = {
  rowHeight: null,
};

class Spacer extends React.PureComponent {
  render() {
    const {
      component,
      components,
      index,
      depth,
      parentId,
      availableColumnCount,
      columnWidth,
      rowHeight,
      onResizeStart,
      onResize,
      onResizeStop,
      handleComponentDrop,
    } = this.props;

    const hoverMenuPosition = depth % 2 !== 0 ? 'left' : 'top';
    return (
      <DragDroppable
        component={component}
        components={components}
        orientation={depth % 2 !== 0 ? 'row' : 'column'}
        index={index}
        parentId={parentId}
        onDrop={handleComponentDrop}
      >
        {({ dropIndicatorProps, dragSourceRef }) => (
          <DimensionProvider
            component={component}
            availableColumnCount={availableColumnCount}
            columnWidth={columnWidth}
            rowHeight={rowHeight}
            onResizeStart={onResizeStart}
            onResize={onResize}
            onResizeStop={onResizeStop}
          >
            <HoverMenu innerRef={dragSourceRef} position={hoverMenuPosition}>
              <DragHandle position={hoverMenuPosition} />
            </HoverMenu>

            <div className="grid-spacer" />

            {dropIndicatorProps && <div {...dropIndicatorProps} />}
          </DimensionProvider>
        )}
      </DragDroppable>
    );
  }
}

Spacer.propTypes = propTypes;
Spacer.defaultProps = defaultProps;

export default Spacer;

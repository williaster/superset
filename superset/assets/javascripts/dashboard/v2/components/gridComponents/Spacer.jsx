import React from 'react';
import PropTypes from 'prop-types';

import DeleteComponentButton from '../DeleteComponentButton';
import DragDroppable from '../dnd/DragDroppable';
import DragHandle from '../dnd/DragHandle';
import HoverMenu from '../menu/HoverMenu';
import ResizableContainer from '../resizable/ResizableContainer';
import { componentShape } from '../../util/propShapes';

// import {
//   GRID_MIN_COLUMN_COUNT,
//   GRID_MIN_ROW_UNITS,
// } from '../../util/constants';

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
  deleteComponent: PropTypes.func.isRequired,
  handleComponentDrop: PropTypes.func.isRequired,
};

const defaultProps = {
  rowHeight: null,
};

class Spacer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.handleDeleteComponent = this.handleDeleteComponent.bind(this);
  }

  handleDeleteComponent() {
    const { deleteComponent, component, parentId } = this.props;
    deleteComponent(component.id, parentId);
  }

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

    const orientation = depth % 2 === 0 ? 'row' : 'column';
    const hoverMenuPosition = depth % 2 === 0 ? 'left' : 'top';

    return (
      <DragDroppable
        component={component}
        components={components}
        orientation={orientation}
        index={index}
        parentId={parentId}
        onDrop={handleComponentDrop}
      >
        {({ dropIndicatorProps, dragSourceRef }) => (
          <ResizableContainer
            id={component.id}
            adjustableWidth={depth % 2 !== 0}
            adjustableHeight={depth % 2 === 0}
            widthStep={columnWidth}
            widthMultiple={component.meta.width}
            heightMultiple={component.meta.height || rowHeight}
            minWidthMultiple={1}
            minHeightMultiple={1}
            maxWidthMultiple={availableColumnCount + (component.meta.width || 0)}
            onResizeStart={onResizeStart}
            onResize={onResize}
            onResizeStop={onResizeStop}
          >
            <HoverMenu innerRef={dragSourceRef} position={hoverMenuPosition}>
              <DragHandle position={hoverMenuPosition} />
              <DeleteComponentButton onDelete={this.handleDeleteComponent} />
            </HoverMenu>

            <div className="grid-spacer" />

            {dropIndicatorProps && <div {...dropIndicatorProps} />}
          </ResizableContainer>
        )}
      </DragDroppable>
    );
  }
}

Spacer.propTypes = propTypes;
Spacer.defaultProps = defaultProps;

export default Spacer;

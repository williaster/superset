import React from 'react';
import PropTypes from 'prop-types';

import DeleteComponentButton from '../DeleteComponentButton';
import DragDroppable from '../dnd/DragDroppable';
import DragHandle from '../dnd/DragHandle';
import HoverMenu from '../menu/HoverMenu';
import ResizableContainer from '../resizable/ResizableContainer';
import { componentShape } from '../../util/propShapes';

import {
//   GRID_MIN_COLUMN_COUNT,
  GRID_MIN_ROW_UNITS,
} from '../../util/constants';

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
    const hoverMenuPosition = orientation === 'row' ? 'left' : 'top';
    const adjustableWidth = orientation === 'column';
    const adjustableHeight = orientation === 'row';

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
            adjustableWidth={adjustableWidth}
            adjustableHeight={adjustableHeight}
            widthStep={columnWidth}
            widthMultiple={component.meta.width}
            heightMultiple={adjustableHeight ? component.meta.height || 1 : undefined}
            staticHeightMultiple={!adjustableHeight ? rowHeight || 5 : undefined}
            minWidthMultiple={1}
            minHeightMultiple={1}
            maxWidthMultiple={availableColumnCount + (component.meta.width || 0)}
            onResizeStart={onResizeStart}
            onResize={onResize}
            onResizeStop={onResizeStop}
          >
            <HoverMenu position={hoverMenuPosition}>
              <DeleteComponentButton onDelete={this.handleDeleteComponent} />
            </HoverMenu>

            <div ref={dragSourceRef} className="grid-spacer" />

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

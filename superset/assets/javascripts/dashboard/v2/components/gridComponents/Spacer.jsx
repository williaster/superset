import React from 'react';
import PropTypes from 'prop-types';

import DimensionProvider from '../resizable/DimensionProvider';
import DragDroppable from '../dnd/DragDroppable';
import DragHandle from '../dnd/DragHandle';
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
  onDrop: PropTypes.func.isRequired,
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
      onDrop,
    } = this.props;

    return (
      <DragDroppable
        component={component}
        components={components}
        orientation={depth % 2 === 0 ? 'horizontal' : 'vertical'}
        index={index}
        parentId={parentId}
        onDrop={onDrop}
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
            <DragHandle
              innerRef={dragSourceRef}
              position={depth % 2 === 0 ? 'left' : 'top'}
            />

            <div className="grid-spacer" />

            {dropIndicatorProps && <div {...dropIndicatorProps} />}
          </DimensionProvider>
        )}
      </DragDroppable>
    );

    return ;
  }
}

Spacer.propTypes = propTypes;
Spacer.defaultProps = defaultProps;

export default Spacer;

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

class Chart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const {
      component,
      components,
      index,
      parentId,
      availableColumnCount,
      columnWidth,
      rowHeight,
      onResizeStart,
      onResize,
      onResizeStop,
      handleComponentDrop,
    } = this.props;

    return (
      <DragDroppable
        component={component}
        components={components}
        orientation="column"
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
            <DragHandle
              innerRef={dragSourceRef}
              position="top"
            />
            <div className="dashboard-component dashboard-component-chart">
              Chart
            </div>
            {dropIndicatorProps && <div {...dropIndicatorProps} />}
          </DimensionProvider>
        )}
      </DragDroppable>
    );
  }
}

Chart.propTypes = propTypes;
Chart.defaultProps = defaultProps;

export default Chart;

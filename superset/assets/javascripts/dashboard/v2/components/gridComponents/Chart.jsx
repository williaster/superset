import React from 'react';
import PropTypes from 'prop-types';

import DeleteComponentButton from '../DeleteComponentButton';
import DimensionProvider from '../resizable/DimensionProvider';
import DragDroppable from '../dnd/DragDroppable';
import DragHandle from '../dnd/DragHandle';
import HoverMenu from '../menu/HoverMenu';
import WithPopoverMenu from '../menu/WithPopoverMenu';
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
  deleteComponent: PropTypes.func.isRequired,
  handleComponentDrop: PropTypes.func.isRequired,
};

const defaultProps = {
  rowHeight: null,
};

class Chart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFocused: false,
    };

    this.handleChangeFocus = this.handleChangeFocus.bind(this);
    this.handleDeleteComponent = this.handleDeleteComponent.bind(this);
  }

  handleChangeFocus(nextFocus) {
    this.setState(() => ({ isFocused: nextFocus }));
  }

  handleDeleteComponent() {
    const { deleteComponent, component, parentId } = this.props;
    deleteComponent(component.id, parentId);
  }

  render() {
    const { isFocused } = this.state;

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
        disableDragDrop={isFocused}
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
            <HoverMenu innerRef={dragSourceRef} position="top">
              <DragHandle position="top" />
            </HoverMenu>

            <WithPopoverMenu
              onChangeFocus={this.handleChangeFocus}
              menuItems={[
                <DeleteComponentButton onDelete={this.handleDeleteComponent} />,
              ]}
            >
              <div className="dashboard-component dashboard-component-chart">
                <div className="fa fa-area-chart" />
              </div>

              {dropIndicatorProps && <div {...dropIndicatorProps} />}
            </WithPopoverMenu>
          </DimensionProvider>
        )}
      </DragDroppable>
    );
  }
}

Chart.propTypes = propTypes;
Chart.defaultProps = defaultProps;

export default Chart;

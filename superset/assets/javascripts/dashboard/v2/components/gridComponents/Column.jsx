import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import DashboardComponent from '../../containers/DashboardComponent';
import DeleteComponentButton from '../DeleteComponentButton';
import DragDroppable from '../dnd/DragDroppable';
import DragHandle from '../dnd/DragHandle';
import HoverMenu from '../menu/HoverMenu';
import ResizableContainer from '../resizable/ResizableContainer';
import { componentShape } from '../../util/propShapes';

import { GRID_GUTTER_SIZE, GRID_MIN_COLUMN_COUNT } from '../../util/constants';

const propTypes = {
  component: componentShape.isRequired,
  components: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  depth: PropTypes.number.isRequired,
  parentId: PropTypes.string.isRequired,
  rowHeight: PropTypes.number,

  // grid related
  availableColumnCount: PropTypes.number.isRequired,
  columnWidth: PropTypes.number.isRequired,
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

class Column extends React.PureComponent {
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
      component: columnComponent,
      components,
      index,
      parentId,
      availableColumnCount,
      columnWidth,
      rowHeight,
      depth,
      onResizeStart,
      onResize,
      onResizeStop,
      handleComponentDrop,
    } = this.props;

    const columnItems = [];

    (columnComponent.children || []).forEach((id, childIndex) => {
      const component = components[id];
      columnItems.push(component);
      if (childIndex < columnComponent.children.length - 1) {
        columnItems.push(`gutter-${childIndex}`);
      }
    });

    return (
      <DragDroppable
        component={columnComponent}
        components={components}
        orientation="column"
        index={index}
        parentId={parentId}
        onDrop={handleComponentDrop}
      >
        {({ dropIndicatorProps, dragSourceRef }) => (
          <ResizableContainer
            id={columnComponent.id}
            adjustableWidth
            adjustableHeight={false}
            widthStep={columnWidth}
            widthMultiple={columnComponent.meta.width}
            heightMultiple={rowHeight}
            minWidthMultiple={GRID_MIN_COLUMN_COUNT}
            maxWidthMultiple={availableColumnCount + (columnComponent.meta.width || 0)}
            onResizeStart={onResizeStart}
            onResize={onResize}
            onResizeStop={onResizeStop}
          >
            <div
              className={cx(
                'grid-column',
                columnItems.length === 0 && 'grid-column--empty',
              )}
            >
              <HoverMenu innerRef={dragSourceRef} position="top">
                <DragHandle position="top" />
                <DeleteComponentButton onDelete={this.handleDeleteComponent} />
              </HoverMenu>

              {columnItems.map((component, itemIndex) => {
                if (!component.id) {
                  return <div key={component} style={{ height: GRID_GUTTER_SIZE }} />;
                }

                return (
                  <DashboardComponent
                    key={component.id}
                    id={component.id}
                    depth={depth + 1}
                    index={itemIndex / 2} // account for gutters!
                    component={component}
                    components={components}
                    parentId={columnComponent.id}
                    availableColumnCount={availableColumnCount}
                    columnWidth={columnWidth}
                    onResizeStart={onResizeStart}
                    onResize={onResize}
                    onResizeStop={onResizeStop}
                  />
                );
              })}
              {dropIndicatorProps && <div {...dropIndicatorProps} />}
            </div>
          </ResizableContainer>
        )}
      </DragDroppable>

    );
  }
}

Column.propTypes = propTypes;
Column.defaultProps = defaultProps;

export default Column;

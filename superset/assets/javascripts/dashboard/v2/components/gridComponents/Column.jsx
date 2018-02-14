import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import DragDroppable from '../dnd/DragDroppable';
import DragHandle from '../dnd/DragHandle';
import DimensionProvider from '../resizable/DimensionProvider';
import DashboardComponent from '../../containers/DashboardComponent';
import { componentShape } from '../../util/propShapes';

import { GRID_GUTTER_SIZE } from '../../util/constants';

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
  handleComponentDrop: PropTypes.func.isRequired,
};

const defaultProps = {
  rowHeight: null,
};

class Column extends React.PureComponent {
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
      if (index < columnComponent.children.length - 1) {
        columnItems.push(`gutter-${childIndex}`);
      }
    });

    return (
      <DragDroppable
        component={columnComponent}
        components={components}
        orientation="vertical"
        index={index}
        parentId={parentId}
        onDrop={handleComponentDrop}
      >
        {({ dropIndicatorProps, dragSourceRef }) => (
          <DimensionProvider
            component={columnComponent}
            availableColumnCount={availableColumnCount}
            columnWidth={columnWidth}
            rowHeight={rowHeight}
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
              <DragHandle
                innerRef={dragSourceRef}
                position="top"
              />

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
          </DimensionProvider>
        )}
      </DragDroppable>

    );
  }
}

Column.propTypes = propTypes;
Column.defaultProps = defaultProps;

export default Column;

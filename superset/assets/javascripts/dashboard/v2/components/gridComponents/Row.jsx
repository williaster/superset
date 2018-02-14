import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import DragDroppable from '../dnd/DragDroppable';
import DragHandle from '../dnd/DragHandle';
import DashboardComponent from '../../containers/DashboardComponent';
import HoverMenu from '../menu/HoverMenu';
import { componentShape } from '../../util/propShapes';
import { GRID_GUTTER_SIZE } from '../../util/constants';
import { INVISIBLE_ROW_TYPE } from '../../util/componentTypes';

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

class Row extends React.PureComponent {
  render() {
    const {
      component: rowComponent,
      components,
      index,
      parentId,
      availableColumnCount,
      columnWidth,
      depth,
      onResizeStart,
      onResize,
      onResizeStop,
      handleComponentDrop,
    } = this.props;

    let occupiedColumnCount = 0;
    let rowHeight = 0;
    const rowItems = [];

    // this adds a gutter between each child in the row.
    (rowComponent.children || []).forEach((id, childIndex) => {
      const component = components[id];
      occupiedColumnCount += (component.meta || {}).width || 0;
      rowItems.push(component);
      if (childIndex < rowComponent.children.length - 1) {
        rowItems.push(`gutter-${childIndex}`);
      }
      if ((component.meta || {}).height) {
        rowHeight = Math.max(rowHeight, component.meta.height);
      }
    });

    return (
      <DragDroppable
        component={rowComponent}
        components={components}
        orientation="row"
        index={index}
        parentId={parentId}
        onDrop={handleComponentDrop}
      >
        {({ dropIndicatorProps, dragSourceRef }) => (
          <div
            className={cx(
              'grid-row',
              rowItems.length === 0 && 'grid-row--empty',
              rowComponent.type !== INVISIBLE_ROW_TYPE && 'grid-row-container',
            )}
          >
            <HoverMenu innerRef={dragSourceRef} position="left">
              <DragHandle position="left" />
            </HoverMenu>

            {rowItems.map((component, itemIndex) => {
              if (!component.id) {
                return <div key={component} style={{ width: GRID_GUTTER_SIZE }} />;
              }

              return (
                <DashboardComponent
                  key={component.id}
                  id={component.id}
                  depth={depth + 1}
                  index={itemIndex / 2} // account for gutters!
                  parentId={rowComponent.id}
                  availableColumnCount={availableColumnCount - occupiedColumnCount}
                  rowHeight={rowHeight}
                  columnWidth={columnWidth}
                  onResizeStart={onResizeStart}
                  onResize={onResize}
                  onResizeStop={onResizeStop}
                />
              );
            })}
            {dropIndicatorProps &&
              <div {...dropIndicatorProps} />}
          </div>
        )}
      </DragDroppable>
    );
  }
}

Row.propTypes = propTypes;
Row.defaultProps = defaultProps;

export default Row;

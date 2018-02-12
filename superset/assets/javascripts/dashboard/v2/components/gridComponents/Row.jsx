import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import DashboardComponent from '../DashboardComponent';
import { componentShape } from '../../util/propShapes';
import { GRID_GUTTER_SIZE } from '../../util/constants';
import { INVISIBLE_ROW_TYPE } from '../../util/componentTypes';

const propTypes = {
  component: componentShape.isRequired,
  components: PropTypes.object.isRequired,
  depth: PropTypes.number.isRequired,
  parentId: PropTypes.string.isRequired,

  // grid related
  availableColumnCount: PropTypes.number.isRequired,
  columnWidth: PropTypes.number.isRequired,
  onResizeStart: PropTypes.func.isRequired,
  onResize: PropTypes.func.isRequired,
  onResizeStop: PropTypes.func.isRequired,
};

const defaultProps = {
};

class Row extends React.PureComponent {
  render() {
    const {
      component: rowComponent,
      components,
      depth,
      availableColumnCount,
      columnWidth,
      onResizeStart,
      onResize,
      onResizeStop,
      onDrop,
      bubbleUpHover,
    } = this.props;

    let occupiedColumnCount = 0;
    let rowHeight = 0;
    const rowItems = [];

    // this adds a gutter between each child in the row.
    (rowComponent.children || []).forEach((id, index) => {
      const component = components[id];
      occupiedColumnCount += (component.meta || {}).width || 0;
      rowItems.push(component);
      if (index < rowComponent.children.length - 1) rowItems.push(`gutter-${index}`);
      if ((component.meta || {}).height) {
        rowHeight = Math.max(rowHeight, component.meta.height);
      }
    });

    return (
      <div
        className={cx(
          'grid-row',
          rowItems.length === 0 && 'grid-row--empty',
          rowComponent.type !== INVISIBLE_ROW_TYPE && 'grid-row-container',
        )}
      >
        {rowItems.map((component, index) => (
          !component.id ? (
            <div key={component} style={{ width: GRID_GUTTER_SIZE }} />
          ) : (
            <DashboardComponent
              key={component.id}
              depth={depth + 1}
              index={index / 2} // account for gutters!
              component={component}
              components={components}
              parentId={rowComponent.id}
              onDrop={onDrop}
              availableColumnCount={availableColumnCount - occupiedColumnCount}
              rowHeight={rowHeight}
              columnWidth={columnWidth}
              onResizeStart={onResizeStart}
              onResize={onResize}
              onResizeStop={onResizeStop}
              bubbleUpHover={bubbleUpHover}
            />
          )))}
      </div>
    );
  }
}

Row.propTypes = propTypes;
Row.defaultProps = defaultProps;

export default Row;

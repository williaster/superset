import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import DashboardComponent from '../DashboardComponent';
import { componentShape } from '../../util/propShapes';

import { GRID_GUTTER_SIZE } from '../../util/constants';

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

class Column extends React.PureComponent {
  render() {
    const {
      component: columnComponent,
      components,
      depth,
      availableColumnCount,
      columnWidth,
      onResizeStart,
      onResize,
      onResizeStop,
      onDrop,
    } = this.props;

    const columnItems = [];

    (columnComponent.children || []).forEach((id, index) => {
      const component = components[id];
      columnItems.push(component);
      if (index < columnComponent.children.length - 1) columnItems.push(`gutter-${index}`);
    });

    return (
      <div
        className={cx(
          'grid-column',
          columnItems.length === 0 && 'grid-column--empty',
        )}
      >
        {columnItems.map((component, index) => (
          !component.id ? (
            <div key={component} style={{ height: GRID_GUTTER_SIZE }} />
          ) : (
            <DashboardComponent
              key={component.id}
              depth={depth + 1}
              index={index / 2} // account for gutters!
              component={component}
              components={components}
              parentId={rowComponent.id}
              onDrop={onDrop}
              availableColumnCount={availableColumnCount}
              rowHeight={rowHeight}
              columnWidth={columnWidth}
              onResizeStart={onResizeStart}
              onResize={onResize}
              onResizeStop={onResizeStop}
            />
          )))}
      </div>
    );
  }
}

Column.propTypes = propTypes;
Column.defaultProps = defaultProps;

export default Column;

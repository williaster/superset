import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import DraggableColumn from '../dnd/DraggableColumn';
import { GRID_GUTTER_SIZE } from '../../util/constants';
import { INVISIBLE_ROW_TYPE } from '../../util/componentTypes';

const propTypes = {
  entity: PropTypes.object, // @TODO shape
  entities: PropTypes.object,
  columnWidth: PropTypes.number,
  onResizeStart: PropTypes.func,
  onResize: PropTypes.func,
  onResizeStop: PropTypes.func,
};

const defaultProps = {
  entity: {},
  entities: {},
  columnWidth: 0,
  onResizeStop: null,
  onResize: null,
  onResizeStart: null,
};

class Row extends React.PureComponent {
  // shouldComponentUpdate() {
  //   // @TODO check for updates to this row only
  // }

  render() {
    const {
      entities,
      entity: rowEntity,
      disableDrop,
      disableDrag,
      onDrop,
      gridProps,
    } = this.props;

    let occupiedColumnCount = 0;
    let currentRowHeight = 0;
    const rowItems = [];

    // this adds a gutter between each child in the row.
    (rowEntity.children || []).forEach((id, index) => {
      const entity = entities[id];
      occupiedColumnCount += (entity.meta || {}).width || 0;
      rowItems.push(entity);
      if (index < rowEntity.children.length - 1) rowItems.push(`gutter-${index}`);
      if ((entity.meta || {}).height) {
        currentRowHeight = Math.max(currentRowHeight, entity.meta.height);
      }
    });

    const modifiedGridProps = { ...gridProps, occupiedColumnCount, currentRowHeight };

    return (
      <div
        className={cx(
          'grid-row',
          rowEntity.type !== INVISIBLE_ROW_TYPE && 'grid-row-container',
        )}
      >
        {rowItems.map((entity, index) => (
          !entity.id ? (
            <div key={entity} style={{ width: GRID_GUTTER_SIZE }} />
          ) : (
            <DraggableColumn
              key={entity.id}
              entity={entity}
              entities={entities}
              index={index / 2} // account for gutters!
              parentId={rowEntity.id}
              gridProps={modifiedGridProps}
              disableDrop={disableDrop}
              disableDrag={disableDrag}
              onDrop={onDrop}
            />
          )
        ))}
      </div>
    );
  }
}

Row.propTypes = propTypes;
Row.defaultProps = defaultProps;

export default Row;

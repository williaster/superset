import React from 'react';
import PropTypes from 'prop-types';
import ParentSize from '@vx/responsive/build/components/ParentSize';
import cx from 'classnames';
import DraggableRow from './dnd/DraggableRow';

import {
  DASHBOARD_ROOT_ID,
  GRID_GUTTER_SIZE,
  GRID_COLUMN_COUNT,
} from '../util/constants';

import './gridComponents/grid.css';

const propTypes = {
  layout: PropTypes.object,
  updateEntity: PropTypes.func,
};

const defaultProps = {
  layout: {},
  updateEntity() {},
};

class DashboardGrid extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showGrid: false,
      rowGuideTop: null,
      disableDrop: false,
      disableDrag: false,
      selectedEntityId: null,
      dropIndicatorTop: null,
    };

    this.handleToggleSelectEntityId = this.handleToggleSelectEntityId.bind(this);
    this.handleResizeStart = this.handleResizeStart.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.handleResizeStop = this.handleResizeStop.bind(this);
    this.getRowGuidePosition = this.getRowGuidePosition.bind(this);
  }

  getRowGuidePosition(resizeRef) {
    if (resizeRef && this.grid) {
      return resizeRef.getBoundingClientRect().bottom - this.grid.getBoundingClientRect().top - 1;
    }
    return null;
  }

  handleResizeStart({ ref, direction }) {
    console.log('resize start');
    let rowGuideTop = null;
    if (direction === 'bottom' || direction === 'bottomRight') {
      rowGuideTop = this.getRowGuidePosition(ref);
    }

    this.setState(() => ({
      showGrid: true,
      rowGuideTop,
      disableDrag: true,
      disableDrop: true,
    }));
  }

  handleResize({ ref, direction }) {
    console.log('resize');
    if (direction === 'bottom' || direction === 'bottomRight') {
      this.setState(() => ({ rowGuideTop: this.getRowGuidePosition(ref) }));
    }
  }

  handleResizeStop({ id, widthMultiple, heightMultiple }) {
    console.log('resize stop');

    const { layout: entities, updateEntity } = this.props;
    const entity = entities[id];
    if (entity && (entity.meta.width !== widthMultiple || entity.meta.height !== heightMultiple)) {
      updateEntity({
        ...entity,
        meta: {
          ...entity.meta,
          width: widthMultiple || entity.meta.width,
          height: heightMultiple || entity.meta.height,
        },
      });
    }
    this.setState(() => ({
      showGrid: false,
      rowGuideTop: null,
      disableDrag: false,
      disableDrop: false,
    }));
  }

  handleToggleSelectEntityId(id) {
    // only enable selection if no drag is occurring
    if (!this.props.draggingEntity) {
      this.setState(({ selectedEntityId }) => {
        const nextSelectedEntityId = id === selectedEntityId ? null : id;
        const disableDragDrop = Boolean(nextSelectedEntityId);
        return {
          selectedEntityId: nextSelectedEntityId,
          disableDrop: disableDragDrop,
          disableDrag: disableDragDrop,
        };
      });
    }
  }

  render() {
    const { layout: entities, onDrop, canDrop } = this.props;
    const {
      showGrid,
      rowGuideTop,
      disableDrop,
      disableDrag,
      // selectedEntityId,
    } = this.state;

    const rootEntity = entities[DASHBOARD_ROOT_ID];

    return (
      <div
        ref={(ref) => { this.grid = ref; }}
        className={cx('grid-container', showGrid && 'grid-container--resizing')}
      >
        <ParentSize>
          {({ width }) => {
            // account for (COLUMN_COUNT - 1) gutters
            const columnPlusGutterWidth = (width + GRID_GUTTER_SIZE) / GRID_COLUMN_COUNT;
            const columnWidth = columnPlusGutterWidth - GRID_GUTTER_SIZE;
            const gridProps = {
              columnWidth,
              rowWidth: width,
              onResizeStart: this.handleResizeStart,
              onResize: this.handleResize,
              onResizeStop: this.handleResizeStop,
            };

            return width < 50 ? null : (
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {rootEntity.children.map((id, index) => (
                  <DraggableRow
                    key={id}
                    index={index}
                    entity={entities[id]}
                    entities={entities}
                    parentId={rootEntity.id}
                    onDrop={onDrop}
                    disableDrop={disableDrop}
                    disableDrag={disableDrag}
                    gridProps={gridProps}
                  />
                ))}

                {showGrid && Array(GRID_COLUMN_COUNT).fill(null).map((_, i) => (
                  <div
                    key={`grid-column-${i}`}
                    className="grid-column-guide"
                    style={{
                      left: (i * GRID_GUTTER_SIZE) + (i * columnWidth),
                      width: columnWidth,
                    }}
                  />
                ))}

                {showGrid && rowGuideTop &&
                  <div
                    className="grid-row-guide"
                    style={{
                      top: rowGuideTop,
                      width,
                    }}
                  />}
              </div>
            );
          }}
        </ParentSize>
      </div>
    );
  }
}

DashboardGrid.propTypes = propTypes;
DashboardGrid.defaultProps = defaultProps;

export default DashboardGrid;

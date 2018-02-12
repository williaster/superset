import React from 'react';
import PropTypes from 'prop-types';
import ParentSize from '@vx/responsive/build/components/ParentSize';
import cx from 'classnames';
import DashboardComponent from './DashboardComponent';

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
      isResizing: false,
      rowGuideTop: null,
      // disableDrop: false,
      // disableDrag: false,
      // selectedComponentId: null,
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
    let rowGuideTop = null;
    if (direction === 'bottom' || direction === 'bottomRight') {
      rowGuideTop = this.getRowGuidePosition(ref);
    }

    this.setState(() => ({
      isResizing: true,
      rowGuideTop,
    }));
  }

  handleResize({ ref, direction }) {
    if (direction === 'bottom' || direction === 'bottomRight') {
      this.setState(() => ({ rowGuideTop: this.getRowGuidePosition(ref) }));
    }
  }

  handleResizeStop({ id, widthMultiple, heightMultiple }) {
    const { layout: components, updateEntity } = this.props;
    const component = components[id];
    if (
      component &&
      (component.meta.width !== widthMultiple || component.meta.height !== heightMultiple)
    ) {
      updateEntity({
        ...component,
        meta: {
          ...component.meta,
          width: widthMultiple || component.meta.width,
          height: heightMultiple || component.meta.height,
        },
      });
    }
    this.setState(() => ({
      isResizing: false,
      rowGuideTop: null,
    }));
  }

  handleToggleSelectEntityId(id) {
    this.setState(({ selectedComponentId }) => ({
      selectedComponentId: id === selectedComponentId ? null : id,
    }));
  }

  render() {
    const { layout: components, onDrop, canDrop } = this.props;
    const { isResizing, rowGuideTop } = this.state;
    const rootComponent = components[DASHBOARD_ROOT_ID];

    return (
      <div
        ref={(ref) => { this.grid = ref; }}
        className={cx('grid-container', isResizing && 'grid-container--resizing')}
      >
        <ParentSize>
          {({ width }) => {
            // account for (COLUMN_COUNT - 1) gutters
            const columnPlusGutterWidth = (width + GRID_GUTTER_SIZE) / GRID_COLUMN_COUNT;
            const columnWidth = columnPlusGutterWidth - GRID_GUTTER_SIZE;

            return width < 50 ? null : (
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {(rootComponent.children || []).map((id, index) => (
                  <DashboardComponent
                    key={id}
                    depth={0}
                    index={index}
                    component={components[id]}
                    components={components}
                    parentId={rootComponent.id}
                    onDrop={onDrop}
                    availableColumnCount={GRID_COLUMN_COUNT}
                    columnWidth={columnWidth}
                    onResizeStart={this.handleResizeStart}
                    onResize={this.handleResize}
                    onResizeStop={this.handleResizeStop}
                  />
                ))}

                {isResizing && Array(GRID_COLUMN_COUNT).fill(null).map((_, i) => (
                  <div
                    key={`grid-column-${i}`}
                    className="grid-column-guide"
                    style={{
                      left: (i * GRID_GUTTER_SIZE) + (i * columnWidth),
                      width: columnWidth,
                    }}
                  />
                ))}

                {isResizing && rowGuideTop &&
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

import React from 'react';
// import PropTypes from 'prop-types';
import ParentSize from '@vx/responsive/build/components/ParentSize';

import { Row } from './gridComponents';
import './gridComponents/grid.css';

import {
  GRID_GUTTER_SIZE,
  GRID_COLUMN_COUNT,
} from '../util/constants';

import testLayout from '../fixtures/testLayout';

const propTypes = {
};

const defaultProps = {
};

class DashboardGrid extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showGrid: false,
      layout: testLayout,
      rowGuide: null,
    };

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
    let rowGuide = null;
    if (direction === 'bottom' || direction === 'bottomRight') {
      rowGuide = this.getRowGuidePosition(ref);
    }

    this.setState(() => ({ showGrid: true, rowGuide }));
  }

  handleResize({ ref, direction }) {
    if (direction === 'bottom' || direction === 'bottomRight') {
      this.setState(() => ({ rowGuide: this.getRowGuidePosition(ref) }));
    }
  }

  handleResizeStop() {
    this.setState(() => ({ showGrid: false, rowGuide: null }));
  }

  render() {
    const { showGrid, layout, rowGuide } = this.state;
    const { children, entities } = layout;

    return (
      <div className="grid-container">
        <ParentSize>
          {({ width }) => {
            // account for (COLUMN_COUNT - 1) gutters
            const columnPlusGutterWidth = (width + GRID_GUTTER_SIZE) / GRID_COLUMN_COUNT;
            const columnWidth = columnPlusGutterWidth - GRID_GUTTER_SIZE;

            return width < 50 ? null : (
              <div ref={(ref) => { this.grid = ref; }}>
                {children.map(id => (
                  <Row
                    key={id}
                    entity={entities[id]}
                    entities={entities}
                    rowWidth={width}
                    columnWidth={columnWidth}
                    onResizeStart={this.handleResizeStart}
                    onResize={this.handleResize}
                    onResizeStop={this.handleResizeStop}
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

                {showGrid && rowGuide &&
                  <div
                    className="grid-row-guide"
                    style={{
                      top: rowGuide,
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

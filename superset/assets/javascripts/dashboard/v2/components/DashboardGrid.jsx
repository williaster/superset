import React from 'react';
import PropTypes from 'prop-types';
import ParentSize from '@vx/responsive/build/components/ParentSize';

import Box from './Box';
import Header from './Header';
import Row from './Row';
import Divider from './Divider';

import {
  GRID_COLUMN_COUNT,
  GRID_MIN_COLUMN_COUNT,
  HEADER_TYPE,
  ROW_TYPE,
  CHART_TYPE,
  DIVIDER_TYPE,
} from '../util/constants';

const propTypes = {
};

const defaultProps = {
};

class DashboardGrid extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showGrid: false,
      children: [
        'header0',
        'row0',
        'divider0',
        'row1',
        'row2',
      ],
      entities: {
        header0: {
          id: 'header0',
          type: HEADER_TYPE,
          children: [],
          meta: {
            text: 'Section header',
          },
        },
        divider0: {
          id: 'divider0',
          type: DIVIDER_TYPE,
          children: [],
        },
        row0: {
          id: 'row0',
          type: ROW_TYPE,
          children: [],
        },
        row1: {
          id: 'row1',
          type: ROW_TYPE,
          children: [],
        },
        row2: {
          id: 'row2',
          type: ROW_TYPE,
          children: [
            'chart0',
            'chart1',
          ],
        },
        chart0: {
          id: 'chart0',
          type: CHART_TYPE,
          meta: {
            width: 3,
            height: 5,
          },
        },
        chart1: {
          id: 'chart1',
          type: CHART_TYPE,
          meta: {
            width: 3,
            height: 5,
          },
        },
      },
    };

    this.handleResizeStart = this.handleResizeStart.bind(this);
    this.handleResizeStop = this.handleResizeStop.bind(this);
  }

  handleResizeStart() {
    this.setState(() => ({ showGrid: true }));
  }

  handleResizeStop() {
    this.setState(() => ({ showGrid: false }));
  }

  render() {
    const { showGrid, children, entities } = this.state;

    return (
      <ParentSize>
        {({ width, height }) => {
          const columnWidth = width / GRID_COLUMN_COUNT;
          const minElementWidth = Math.floor(GRID_MIN_COLUMN_COUNT * columnWidth);

          return width < 10 ? null : (
            <div
              style={{
                width,
                height,
                position: 'relative',
                background: '#7affd2',
              }}
            >
              {children.map((id) => {
                if (/header/i.test(id)) return <Header key={id} entity={entities[id]} />;
                if (/divider/i.test(id)) return <Divider key={id} entity={entities[id]} />;
                if (/row/i.test(id)) {
                  return (
                    <Row
                      key={id}
                      row={entities[id]}
                      entities={entities}
                      columnWidth={columnWidth}
                      minElementWidth={minElementWidth}
                      onResizeStart={this.handleResizeStart}
                      onResizeStop={this.handleResizeStop}
                    />
                  );
                }
                return null;
              })}

              {showGrid && Array(GRID_COLUMN_COUNT + 1).fill(null).map((_, i) => (
                <div
                  key={`grid-column-${i}`}
                  style={{
                    position: 'absolute',
                    left: i * columnWidth,
                    top: 0,
                    width: 1,
                    height: '100%',
                    backgroundColor: '#ff269e',
                    pointerEvents: 'none',
                  }}
                />
              ))}
            </div>
          );
        }}
      </ParentSize>
    );
  }
}

DashboardGrid.propTypes = propTypes;
DashboardGrid.defaultProps = defaultProps;

export default DashboardGrid;

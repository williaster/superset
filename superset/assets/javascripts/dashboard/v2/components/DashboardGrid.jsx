import React from 'react';
import PropTypes from 'prop-types';
import ParentSize from '@vx/responsive/build/components/ParentSize';

import { Row, Header, Divider } from './gridComponents';

import {
  HEADER_TYPE,
  DIVIDER_TYPE,
  ROW_TYPE,
  GRID_COLUMN_COUNT,
  GRID_MIN_COLUMN_COUNT,
} from '../util/constants';

import testLayout from '../fixtures/testLayout';

const propTypes = {
};

const defaultProps = {
};

class DashboardGrid extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showGrid: false,
      layout: testLayout,
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
    const { showGrid, layout } = this.state;
    const { children, entities } = layout;

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
                background: 'transparent',
              }}
            >
              {children.map((id) => {
                // @TODO In the future these will all be rows or invisible rows
                const entity = entities[id];
                if (entity.type === HEADER_TYPE) return <Header key={id} entity={entity} />;
                if (entity.type === DIVIDER_TYPE) return <Divider key={id} entity={entity} />;
                if (entity.type === ROW_TYPE) {
                  return (
                    <Row
                      key={id}
                      entity={entity}
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

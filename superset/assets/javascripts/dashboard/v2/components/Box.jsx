import React from 'react';
import PropTypes from 'prop-types';
import Resizable from 're-resizable';

import { GRID_BASE_UNIT, GRID_ROW_HEIGHT_UNIT } from '../util/constants';

const propTypes = {
  snapToWidth: PropTypes.number,
  snapToHeight: PropTypes.number,
  onResizeStart: PropTypes.func,
  onResizeStop: PropTypes.func,
  minWidth: PropTypes.number,
  minHeight: PropTypes.number,
  maxWidth: PropTypes.number,
  maxHeight: PropTypes.number,
  initialWidth: PropTypes.number,
  initialHeight: PropTypes.number,
  // width: PropTypes.number,
  // height: PropTypes.number,
};

const defaultProps = {
  snapToWidth: GRID_BASE_UNIT,
  snapToHeight: 2 * GRID_ROW_HEIGHT_UNIT,
  minWidth: 3 * GRID_BASE_UNIT,
  minHeight: GRID_ROW_HEIGHT_UNIT,
  maxWidth: Infinity,
  maxHeight: Infinity,
  initialWidth: 3 * GRID_BASE_UNIT,
  initialHeight: GRID_ROW_HEIGHT_UNIT,
  onResizeStop: null,
  onResizeStart: null,
  // width: null,
  // height: null,
};

const ENABLE_CONFIG = {
  top: false,
  right: true,
  bottom: true,
  left: false,
  topRight: false,
  bottomRight: true,
  bottomLeft: false,
  topLeft: false,
};

class Box extends React.Component {
  constructor(props) {
    super(props);
    const { initialWidth, initialHeight, minWidth, minHeight } = props;

    this.state = {
      width: Math.max(initialWidth, minWidth),
      height: Math.max(initialHeight, minHeight),
    };

    this.handleResizeStart = this.handleResizeStart.bind(this);
    this.handleResizeStop = this.handleResizeStop.bind(this);
  }

  handleResizeStart() {
    if (this.props.onResizeStart) this.props.onResizeStart();
  }

  handleResizeStop(event, direction, ref, delta) {
    console.log('resize delta', delta, direction)
    const { onResizeStop, snapToWidth, snapToHeight, id } = this.props;
    let nextState = {};

    const callback = onResizeStop && (() => {
      onResizeStop({
        ...nextState,
        id,
        widthMultiple: Math.floor(nextState.width / snapToWidth),
        heightMultiple: Math.floor(nextState.height / snapToHeight),
      });
    });

    this.setState(({ width, height }) => {
      nextState = {
        width: width + delta.width,
        height: height + delta.height,
      };
      return nextState;
    }, callback);
  }

  render() {
    const {
      snapToWidth,
      snapToHeight,
      minWidth,
      minHeight,
      maxWidth,
      maxHeight,
      // width,
      // height,
    } = this.props;

    return (
      <Resizable
        enable={ENABLE_CONFIG}
        grid={[snapToWidth, snapToHeight]}
        minWidth={minWidth}
        minHeight={minHeight}
        maxWidth={maxWidth}
        maxHeight={maxHeight}
        size={this.state}
        onResizeStop={this.handleResizeStop}
        onResizeStart={this.handleResizeStart}
        style={{ display: 'inline-block' }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#ff269e',
            opacity: 0.9,
            boxShadow: '0 0 1px #fff',
          }}
        >
          <br />
          <div>width (remaining)</div>
          <div>{`${this.state.width}px (${maxWidth - this.state.width}px)`}</div>
        </div>
      </Resizable>
    );
  }
}

Box.propTypes = propTypes;
Box.defaultProps = defaultProps;

export default Box;

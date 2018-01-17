import React from 'react';
import PropTypes from 'prop-types';
import Resizable from 're-resizable';
import cx from 'classnames';

import { GRID_BASE_UNIT } from '../util/constants';

const propTypes = {
  id: PropTypes.string.isRequired,
  // adjustableWidth: PropTypes.bool,
  adjustableHeight: PropTypes.bool,
  widthStep: PropTypes.number,
  heightStep: PropTypes.number,
  widthMultiple: PropTypes.number,
  heightMultiple: PropTypes.number,
  minWidthMultiple: PropTypes.number,
  maxWidthMultiple: PropTypes.number,
  minHeightMultiple: PropTypes.number,
  maxHeightMultiple: PropTypes.number,
  onResizeStop: PropTypes.func,
  onResizeStart: PropTypes.func,
};

const defaultProps = {
  // adjustableWidth: true,
  adjustableHeight: true,
  widthStep: GRID_BASE_UNIT,
  heightStep: GRID_BASE_UNIT,
  widthMultiple: 1,
  heightMultiple: 1,
  minWidthMultiple: 1,
  maxWidthMultiple: Infinity,
  minHeightMultiple: 1,
  maxHeightMultiple: Infinity,
  onResizeStop: null,
  onResizeStart: null,
};

const ADJUSTABLE_W_AND_H_CONFIG = {
  top: false,
  right: false,
  bottom: false,
  left: false,
  topRight: false,
  bottomRight: true,
  bottomLeft: false,
  topLeft: false,
};

const ADJUSTABLE_W_CONFIG = {
  ...ADJUSTABLE_W_AND_H_CONFIG,
  right: true,
  bottomRight: false,
};

// These are preferrable to overriding classNames because we don't have to !important
const HANDLE_STYLES = {
  right: {
    width: 1,
    height: 20,
    right: 5,
    top: '45%',
    position: 'absolute',
    borderLeft: '1px solid #484848',
    borderRight: '1px solid #484848',
  },
  bottomRight: {
    border: 'solid #fff',
    borderWidth: '0 1px 1px 0',
    display: 'inline-block',
    right: GRID_BASE_UNIT * 0.5,
    bottom: GRID_BASE_UNIT * 0.5,
    width: GRID_BASE_UNIT,
    height: GRID_BASE_UNIT,
  },
};

class ResizableContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isResizing: false,
    };

    this.handleResizeStart = this.handleResizeStart.bind(this);
    this.handleResizeStop = this.handleResizeStop.bind(this);
  }

  handleResizeStart() {
    const { id, onResizeStart } = this.props;
    if (onResizeStart) onResizeStart({ id });
    this.setState(() => ({ isResizing: true }));
  }

  handleResizeStop(event, direction, ref, delta) {
    const { id, onResizeStop, widthStep, heightStep, widthMultiple, heightMultiple } = this.props;
    if (onResizeStop) {
      const nextWidthMultiple = Math.round(widthMultiple + (delta.width / widthStep));
      const nextHeightMultiple = Math.round(heightMultiple + (delta.height / heightStep));

      onResizeStop({
        id,
        widthMultiple: nextWidthMultiple,
        heightMultiple: nextHeightMultiple,
      });
      this.setState(() => ({ isResizing: false }));
    }
  }

  render() {
    const {
      adjustableHeight,
      widthStep,
      heightStep,
      widthMultiple,
      heightMultiple,
      minWidthMultiple,
      maxWidthMultiple,
      minHeightMultiple,
      maxHeightMultiple,
    } = this.props;

    const size = {
      width: widthStep * widthMultiple,
      height: heightStep * heightMultiple,
    };

    const enableConfig = adjustableHeight ? ADJUSTABLE_W_AND_H_CONFIG : ADJUSTABLE_W_CONFIG;

    return (
      <Resizable
        enable={enableConfig}
        grid={[widthStep, heightStep]}
        minWidth={minWidthMultiple * widthStep}
        minHeight={minHeightMultiple * heightStep}
        maxWidth={maxWidthMultiple * widthStep}
        maxHeight={maxHeightMultiple * heightStep}
        size={size}
        onResizeStop={this.handleResizeStop}
        onResizeStart={this.handleResizeStart}
        style={{ display: 'inline-block' }}
        handleStyles={HANDLE_STYLES}
      >
        <div className={cx(
          'grid-resizable-container',
          this.state.isResizing && 'grid-resizable-container--resizing'
        )}>
          <div>width (remaining)</div>
          <div>{`${widthMultiple} (${maxWidthMultiple - widthMultiple})`}</div>
        </div>
      </Resizable>
    );
  }
}

ResizableContainer.propTypes = propTypes;
ResizableContainer.defaultProps = defaultProps;

export default ResizableContainer;

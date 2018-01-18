import React from 'react';
import PropTypes from 'prop-types';
import Resizable from 're-resizable';
import cx from 'classnames';

import { GRID_BASE_UNIT } from '../util/constants';

const propTypes = {
  id: PropTypes.string.isRequired,
  children: PropTypes.node,
  adjustableWidth: PropTypes.bool,
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
  children: null,
  adjustableWidth: true,
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

const ADJUSTABLE_H_CONFIG = {
  ...ADJUSTABLE_W_AND_H_CONFIG,
  bottom: true,
  bottomRight: false,
};

// These are preferrable to overriding classNames because we don't have to !important
// @TODO move to utils
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
  bottom: {
    height: 1,
    width: 20,
    bottom: 5,
    left: '45%',
    position: 'absolute',
    borderTop: '1px solid #484848',
    borderBottom: '1px solid #484848',
  },
  bottomRight: {
    border: 'solid',
    borderWidth: `${0}px 1.5px 1.5px ${0}px`,
    // borderTopColor: 'transparent',
    // borderLeftColor: 'transparent',
    borderRightColor: '#484848',
    borderBottomColor: '#484848',
    display: 'inline-block',
    right: GRID_BASE_UNIT,
    bottom: GRID_BASE_UNIT,
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
    const {
      id,
      onResizeStop,
      widthStep,
      heightStep,
      widthMultiple,
      heightMultiple,
      adjustableHeight,
      adjustableWidth,
    } = this.props;

    if (onResizeStop) {
      const nextWidthMultiple = Math.round(widthMultiple + (delta.width / widthStep));
      const nextHeightMultiple = Math.round(heightMultiple + (delta.height / heightStep));

      onResizeStop({
        id,
        widthMultiple: adjustableWidth ? nextWidthMultiple : null,
        heightMultiple: adjustableHeight ? nextHeightMultiple : null,
      });

      this.setState(() => ({ isResizing: false }));
    }
  }

  render() {
    const {
      children,
      adjustableWidth,
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
      width: adjustableWidth ? widthStep * widthMultiple : '100%',
      height: adjustableHeight ? heightStep * heightMultiple : '100%',
    };

    let enableConfig = ADJUSTABLE_W_AND_H_CONFIG;
    if (!adjustableHeight) enableConfig = ADJUSTABLE_W_CONFIG;
    else if (!adjustableWidth) enableConfig = ADJUSTABLE_H_CONFIG;

    return (
      <Resizable
        enable={enableConfig}
        grid={[widthStep, heightStep]}
        minWidth={adjustableWidth ? minWidthMultiple * widthStep : '100%'}
        minHeight={adjustableHeight ? minHeightMultiple * heightStep : '100%'}
        maxWidth={adjustableWidth ? maxWidthMultiple * widthStep : '100%'}
        maxHeight={adjustableHeight ? maxHeightMultiple * heightStep : '100%'}
        size={size}
        onResizeStop={this.handleResizeStop}
        onResizeStart={this.handleResizeStart}
        style={{ display: 'inline-block' }}
        handleStyles={HANDLE_STYLES}
      >
        <div
          className={cx(
            'grid-resizable-container',
            this.state.isResizing && 'grid-resizable-container--resizing',
          )}
        >
          <div style={{ position: 'absolute', bottom: '50%', right: '50%', color: '#767676', fontSize: 10 }}>
            {`width ${widthMultiple} (rem ${maxWidthMultiple - widthMultiple})`}
          </div>
          {children}
        </div>
      </Resizable>
    );
  }
}

ResizableContainer.propTypes = propTypes;
ResizableContainer.defaultProps = defaultProps;

export default ResizableContainer;

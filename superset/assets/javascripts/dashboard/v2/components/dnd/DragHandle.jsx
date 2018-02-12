import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

const propTypes = {
  position: PropTypes.oneOf(['left', 'top']),
  innerRef: PropTypes.func,
};

const defaultProps = {
  position: 'left',
  innerRef: null,
};

export default class DragHandle extends React.PureComponent {
  render() {
    const { innerRef, position } = this.props;
    return (
      <div
        ref={innerRef}
        className={cx(
          position === 'left' && 'draggable-row-handle', // @TODO change class names
          position === 'top' && 'draggable-row-item-handle',
        )}
      >
        <div className="handle">
          {Array(8).fill(null).map((_, i) => (
            <div key={`handle-dot-${i}`} className="handle-dot" />
          ))}
        </div>
      </div>
    );
  }
}

DragHandle.propTypes = propTypes;
DragHandle.defaultProps = defaultProps;

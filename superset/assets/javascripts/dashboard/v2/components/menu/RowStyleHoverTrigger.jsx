import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

const propTypes = {
  onClick: PropTypes.func,
};

const defaultProps = {
  onClick() {},
};

// Note: this has to be a separate component because react-bootstrap injects the onClick prop
export default class RowStyleHoverTrigger extends React.PureComponent {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    const { onClick } = this.props;
    event.preventDefault();
    onClick(event);
  }

  render() {
    return (
      <a onClick={this.handleClick} href="">
        <div className={cx('row-style-button', 'fa fa-paint-brush')} />
      </a>
    );
  }
}

RowStyleHoverTrigger.propTypes = propTypes;
RowStyleHoverTrigger.defaultProps = defaultProps;

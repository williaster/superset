import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

const propTypes = {
  onDelete: PropTypes.func.isRequired,
};

const defaultProps = {
};

export default class DeleteComponentButton extends React.PureComponent {
  render() {
    const { onDelete } = this.props;
    return (
      <div
        onClick={onDelete}
        className={cx('delete-component-button', 'fa fa-trash')}
        role="button"
        tabIndex="-1"
      />
    );
  }
}

DeleteComponentButton.propTypes = propTypes;
DeleteComponentButton.defaultProps = defaultProps;

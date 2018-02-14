import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import DeleteComponentButton from '../DeleteComponentButton';

const propTypes = {
  children: PropTypes.node,
  onPressDelete: PropTypes.func,
};

const defaultProps = {
  children: null,
  onPressDelete() {},
};

class WithPopoverMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFocused: false,
    };
    this.setRef = this.setRef.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClick, true);
  }

  setRef(ref) {
    this.container = ref;
  }

  handleClick(event) {
    if (!this.state.isFocused) {
      // if not focused, set focus and add a window event listener to capture outside clicks
      // this enables us to not set a click listener for ever item on a dashboard
      document.addEventListener('click', this.handleClick, true);
      this.setState(() => ({ isFocused: true }));
    } else if (!this.container.contains(event.target)) {
      console.log('outside click');
      document.removeEventListener('click', this.handleClick, true);
      this.setState(() => ({ isFocused: false }));
    } else {
      console.log('inside click');
    }
  }

  renderMenu() {
    const { onPressDelete } = this.props;
    return (
      <div className="popover-menu" >
        Menu
        <div className="popover-menu-vertical-separator" />
        <DeleteComponentButton onDelete={onPressDelete} />
      </div>
    );
  }

  render() {
    const { children } = this.props;
    const { isFocused } = this.state;
    return (
      <div
        ref={this.setRef}
        onClick={this.handleClick}
        role="button" // @TODO maybe consider
        tabIndex="0"
        className={cx(
          'with-popover-menu',
          isFocused && 'with-popover-menu--focused',
        )}
      >
        {children}
        {isFocused && this.renderMenu()}
      </div>
    );
  }
}

WithPopoverMenu.propTypes = propTypes;
WithPopoverMenu.defaultProps = defaultProps;

export default WithPopoverMenu;

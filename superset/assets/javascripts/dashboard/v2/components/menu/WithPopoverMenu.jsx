import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

const propTypes = {
  children: PropTypes.node,
  menuItems: PropTypes.arrayOf(PropTypes.node),
  onChangeFocus: PropTypes.func,
};

const defaultProps = {
  children: null,
  onChangeFocus: null,
  onPressDelete() {},
  menuItems: [],
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
    const { onChangeFocus } = this.props;
    if (!this.state.isFocused) {
      // if not focused, set focus and add a window event listener to capture outside clicks
      // this enables us to not set a click listener for ever item on a dashboard
      document.addEventListener('click', this.handleClick, true);
      this.setState(() => ({ isFocused: true }));
      if (onChangeFocus) {
        onChangeFocus(true);
      }
    } else if (!this.container.contains(event.target)) {
      document.removeEventListener('click', this.handleClick, true);
      this.setState(() => ({ isFocused: false }));
      if (onChangeFocus) {
        onChangeFocus(false);
      }
    }
  }

  render() {
    const { children, menuItems } = this.props;
    const { isFocused } = this.state;
    return (
      <div
        ref={this.setRef}
        onClick={this.handleClick}
        role="button" // @TODO consider others?
        tabIndex="0"
        className={cx(
          'with-popover-menu',
          isFocused && 'with-popover-menu--focused',
        )}
      >
        {children}
        {isFocused && menuItems.length &&
          <div className="popover-menu" >
            {menuItems.map((node, i) => (
              <div className="menu-item" key={`menu-item-${i}`}>{node}</div>
            ))}
          </div>}
      </div>
    );
  }
}

WithPopoverMenu.propTypes = propTypes;
WithPopoverMenu.defaultProps = defaultProps;

export default WithPopoverMenu;

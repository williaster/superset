import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { MenuItem, Dropdown } from 'react-bootstrap';

import RowStyleHoverTrigger from './RowStyleHoverTrigger';
import rowStyleOptions from './rowStyleOptions';

const propTypes = {
  id: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};

const defaultProps = {
};

export default class RowStyleHoverDropdown extends React.PureComponent {
  constructor(props) {
    super(props);
    this.setRef = this.setRef.bind(this);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClick, true);
    document.removeEventListener('drag', this.handleClick, true);
  }

  setRef(ref) {
    this.container = ref;
  }

  render() {
    const { id, onChange, value = rowStyleOptions[0].value } = this.props;
    return (
      <Dropdown onSelect={onChange} id={id} className="hover-dropdown">
        <RowStyleHoverTrigger bsRole="toggle" />
        <Dropdown.Menu className="hover-dropdown-menu">
          {rowStyleOptions.map(option => (
            <MenuItem
              key={option.value}
              eventKey={option.value}
              active={option.value === value}
              onSelect={this.handleSelect}
              className="dropdown-item"
            >
              <div className={cx('row-style-option', option.className)}>
                {option.label} background
              </div>
            </MenuItem>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}

RowStyleHoverDropdown.propTypes = propTypes;
RowStyleHoverDropdown.defaultProps = defaultProps;

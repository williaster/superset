import React from 'react';
import PropTypes from 'prop-types';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import { t } from '../../../../locales';
import { SMALL_HEADER, MEDIUM_HEADER, LARGE_HEADER } from '../../util/constants';

export const headerStyleOptions = [
  { value: SMALL_HEADER, label: t('Small'), className: 'header-small' },
  { value: MEDIUM_HEADER, label: t('Medium'), className: 'header-medium' },
  { value: LARGE_HEADER, label: t('Large'), className: 'header-large' },
];

const propTypes = {
  id: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.oneOf(headerStyleOptions.map(opt => opt.value)).isRequired,
};

class HeaderStyleDropdown extends React.PureComponent {
  constructor(props) {
    super(props);
    this.handleSelect = this.handleSelect.bind(this);
  }

  handleSelect(nextStyle) {
    console.log(nextStyle);
    this.props.onChange(nextStyle);
  }

  render() {
    const { id, value } = this.props;
    const selected = headerStyleOptions.find(opt => opt.value === value);
    return (
      <DropdownButton
        id={id}
        bsSize="small"
        title={`${selected.label} ${t('header')}`}
        className="popover-dropdown"
      >
        {headerStyleOptions.map(option => (
          <MenuItem
            key={option.value}
            eventKey={option}
            active={option.value === value}
            onSelect={this.handleSelect}
            className="dropdown-item"
          >
            <div className={option.className}>{option.label}</div>
          </MenuItem>
        ))}
      </DropdownButton>
    );
  }
}

HeaderStyleDropdown.propTypes = propTypes;

export default HeaderStyleDropdown;

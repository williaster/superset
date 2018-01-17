import React from 'react';
import PropTypes from 'prop-types';

import { GRID_BASE_UNIT } from '../util/constants';

const propTypes = {
  entity: PropTypes.shape({
    id: PropTypes.string.isRequired,
    meta: PropTypes.shape({
      text: PropTypes.string,
    }),
  }),
};

const defaultProps = {
  entity: {},
};

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { entity: { id, meta } } = this.props;
    return !meta || !id ? null : (
      <div
        style={{
          width: '100%',
          padding: `${GRID_BASE_UNIT} 0`,
        }}
      >
        <div style={{ fontSize: 24, fontWeight: 700, color: '#484848' }}>
          {meta.text}
        </div>
      </div>
    );
  }
}

Header.propTypes = propTypes;
Header.defaultProps = defaultProps;

export default Header;

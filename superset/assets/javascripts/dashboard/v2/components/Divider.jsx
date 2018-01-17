import React from 'react';
import PropTypes from 'prop-types';

import { GRID_BASE_UNIT } from '../util/constants';

const propTypes = {
};

const defaultProps = {
};

class Divider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div
        style={{
          width: '100%',
          height: 2,
          background: '#ccc',
          margin: `${2 * GRID_BASE_UNIT}px 0`,
        }}
      />
    );
  }
}

Divider.propTypes = propTypes;
Divider.defaultProps = defaultProps;

export default Divider;

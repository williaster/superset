import React from 'react';
import PropTypes from 'prop-types';

import {  } from '../../util/constants';

const propTypes = {
};

const defaultProps = {
};

class Chart extends React.Component {
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
          height: '100%',
          color: '#ccc',
          backgroundColor: '#fff',
          // boxShadow: 'inset 0 0 0 1px #ccc',
          padding: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >Chart</div>
    );
  }
}

Chart.propTypes = propTypes;
Chart.defaultProps = defaultProps;

export default Chart;

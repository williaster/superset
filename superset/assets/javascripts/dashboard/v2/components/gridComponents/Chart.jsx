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
          backgroundColor: '#FFFCE1',
          padding: 16,
        }}
      >Chart</div>
    );
  }
}

Chart.propTypes = propTypes;
Chart.defaultProps = defaultProps;

export default Chart;

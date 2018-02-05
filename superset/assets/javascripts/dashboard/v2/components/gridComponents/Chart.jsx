import React from 'react';
// import PropTypes from 'prop-types';

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
      <div className="dashboard-component dashboard-component-chart">Chart</div>
    );
  }
}

Chart.propTypes = propTypes;
Chart.defaultProps = defaultProps;

export default Chart;

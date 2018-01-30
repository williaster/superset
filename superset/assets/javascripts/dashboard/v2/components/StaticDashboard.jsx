import React from 'react';
import PropTypes from 'prop-types';
import '../../../../stylesheets/static-grid.css';

const propTypes = {
  layout: PropTypes.arrayOf(PropTypes.object).isRequired,
};

class StaticDashboard extends React.Component {
  render() {
    let slices = this.props.layout
      .map((slice, index) => {
        const style = {
          'gridColumnStart': slice.x + 1,
          'gridColumnEnd': slice.x + 1 + slice.w,
          'gridRowStart': slice.y + 1,
          'gridRowEnd': slice.y + 1 + slice.h,
        };
        return (
          <div style={style} key={`grid_${index}`}>
            {slice.i}
          </div>
        );
      });
    return (
      <div className="grid-wrapper">
        {slices}
      </div>
    );
  }
}

StaticDashboard.propTypes = propTypes;

export default StaticDashboard;

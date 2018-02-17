import React from 'react';
// import PropTypes from 'prop-types';

import { CHART_TYPE } from '../../../util/componentTypes';
import DraggableNewComponent from './DraggableNewComponent';

const propTypes = {
};

export default class DraggableNewChart extends React.PureComponent {
  render() {
    return (
      <DraggableNewComponent
        id={CHART_TYPE}
        type={CHART_TYPE}
        label="Chart"
        className="fa fa-area-chart"
      />
    );
  }
}

DraggableNewChart.propTypes = propTypes;

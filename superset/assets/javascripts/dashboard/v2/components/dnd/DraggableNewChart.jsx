import React from 'react';
import PropTypes from 'prop-types';

import { DRAGGABLE_NEW_CHART } from '../../util/constants';
import DraggableNewComponent from './DraggableNewComponent';

const propTypes = {
  index: PropTypes.number.isRequired,
};

export default class DraggableNewChart extends React.Component {
  render() {
    const { index } = this.props;
    return <DraggableNewComponent id={DRAGGABLE_NEW_CHART} label="Chart" index={index} />;
  }
}

DraggableNewChart.propTypes = propTypes;

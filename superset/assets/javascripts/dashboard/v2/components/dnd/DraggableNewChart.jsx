import React from 'react';
// import PropTypes from 'prop-types';

import { DRAGGABLE_NEW_CHART } from '../../util/constants';
import DraggableNewComponent from './DraggableNewComponent';

const propTypes = {
};

export default class DraggableNewChart extends React.PureComponent {
  render() {
    return (
      <DraggableNewComponent
        id={DRAGGABLE_NEW_CHART}
        label="Chart"
      />
    );
  }
}

DraggableNewChart.propTypes = propTypes;

import React from 'react';
// import PropTypes from 'prop-types';

import { SPACER_TYPE } from '../../../util/componentTypes';
import DraggableNewComponent from './DraggableNewComponent';

const propTypes = {
};

export default class DraggableNewChart extends React.PureComponent {
  render() {
    return (
      <DraggableNewComponent
        type={SPACER_TYPE}
        label="Spacer"
      />
    );
  }
}

DraggableNewChart.propTypes = propTypes;

import React from 'react';
// import PropTypes from 'prop-types';

import { DIVIDER_TYPE } from '../../../util/componentTypes';
import DraggableNewComponent from './DraggableNewComponent';

const propTypes = {
};

export default class DraggableNewDivider extends React.PureComponent {
  render() {
    return (
      <DraggableNewComponent
        id={DIVIDER_TYPE}
        type={DIVIDER_TYPE}
        label="Divider"
      />
    );
  }
}

DraggableNewDivider.propTypes = propTypes;

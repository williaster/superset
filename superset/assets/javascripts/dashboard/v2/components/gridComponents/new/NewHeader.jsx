import React from 'react';
// import PropTypes from 'prop-types';

import { HEADER_TYPE } from '../../../util/componentTypes';
import DraggableNewComponent from './DraggableNewComponent';

const propTypes = {
};

export default class DraggableNewHeader extends React.Component {
  render() {
    return (
      <DraggableNewComponent
        id={HEADER_TYPE}
        type={HEADER_TYPE}
        label="Header"
      />
    );
  }
}

DraggableNewHeader.propTypes = propTypes;

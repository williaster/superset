import React from 'react';
// import PropTypes from 'prop-types';

import { DRAGGABLE_NEW_HEADER } from '../../util/constants';
import DraggableNewComponent from './DraggableNewComponent';

const propTypes = {
};

export default class DraggableNewHeader extends React.Component {
  render() {
    return (
      <DraggableNewComponent
        id={DRAGGABLE_NEW_HEADER}
        label="Header"
      />
    );
  }
}

DraggableNewHeader.propTypes = propTypes;

import React from 'react';
// import PropTypes from 'prop-types';

import { DRAGGABLE_NEW_DIVIDER } from '../../util/constants';
import DraggableNewComponent from './DraggableNewComponent';

const propTypes = {
};

export default class DraggableNewDivider extends React.PureComponent {
  render() {
    return (
      <DraggableNewComponent
        id={DRAGGABLE_NEW_DIVIDER}
        label="Divider"
      />
    );
  }
}

DraggableNewDivider.propTypes = propTypes;

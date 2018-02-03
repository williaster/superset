import React from 'react';
// import PropTypes from 'prop-types';

import { DRAGGABLE_NEW_ROW } from '../../util/constants';
import DraggableNewComponent from './DraggableNewComponent';

const propTypes = {
};

export default class DraggableNewRow extends React.PureComponent {
  render() {
    return (
      <DraggableNewComponent
        id={DRAGGABLE_NEW_ROW}
        label="Row"
      />
    );
  }
}

DraggableNewRow.propTypes = propTypes;

import React from 'react';
import PropTypes from 'prop-types';

import { DRAGGABLE_NEW_ROW, DRAGGABLE_ROW_TYPE } from '../../util/constants';
import DraggableNewComponent from './DraggableNewComponent';

const propTypes = {
  index: PropTypes.number.isRequired,
};

export default class DraggableNewRow extends React.Component {
  render() {
    const { index } = this.props;
    return (
      <DraggableNewComponent
        id={DRAGGABLE_NEW_ROW}
        label="Row"
        type={DRAGGABLE_ROW_TYPE}
        index={index}
      />
    );
  }
}

DraggableNewRow.propTypes = propTypes;

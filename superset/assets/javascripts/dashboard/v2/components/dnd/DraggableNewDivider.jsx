import React from 'react';
import PropTypes from 'prop-types';

import { DRAGGABLE_NEW_DIVIDER } from '../../util/constants';
import DraggableNewComponent from './DraggableNewComponent';

const propTypes = {
  index: PropTypes.number.isRequired,
};

export default class DraggableNewDivider extends React.Component {
  render() {
    const { index } = this.props;
    return (
      <DraggableNewComponent id={DRAGGABLE_NEW_DIVIDER} label="Divider" index={index} />
    );
  }
}

DraggableNewDivider.propTypes = propTypes;

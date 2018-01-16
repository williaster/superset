import React from 'react';
import PropTypes from 'prop-types';

import { DRAGGABLE_NEW_HEADER } from '../../util/constants';
import DraggableNewComponent from './DraggableNewComponent';

const propTypes = {
  index: PropTypes.number.isRequired,
};

export default class DraggableNewHeader extends React.Component {
  render() {
    const { index } = this.props;
    return (
      <DraggableNewComponent id={DRAGGABLE_NEW_HEADER} label="Header" index={index} />
    );
  }
}

DraggableNewHeader.propTypes = propTypes;

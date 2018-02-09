import React from 'react';

import { ROW_TYPE } from '../../util/componentTypes';
import DraggableNewComponent from './DraggableNewComponent';

const propTypes = {
};

export default class DraggableNewRow extends React.PureComponent {
  render() {
    return (
      <DraggableNewComponent
        type={ROW_TYPE}
        label="Row"
      />
    );
  }
}

DraggableNewRow.propTypes = propTypes;

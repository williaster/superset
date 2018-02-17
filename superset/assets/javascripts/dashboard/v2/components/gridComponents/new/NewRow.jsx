import React from 'react';

import { ROW_TYPE } from '../../../util/componentTypes';
import DraggableNewComponent from './DraggableNewComponent';

const propTypes = {
};

export default class DraggableNewRow extends React.PureComponent {
  render() {
    return (
      <DraggableNewComponent
        id={ROW_TYPE}
        type={ROW_TYPE}
        label="Row"
        className="fa fa-long-arrow-right"
      />
    );
  }
}

DraggableNewRow.propTypes = propTypes;

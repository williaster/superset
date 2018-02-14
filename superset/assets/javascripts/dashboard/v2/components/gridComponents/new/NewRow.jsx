import React from 'react';

import { INVISIBLE_ROW_TYPE } from '../../../util/componentTypes';
import DraggableNewComponent from './DraggableNewComponent';

const propTypes = {
};

export default class DraggableNewRow extends React.PureComponent {
  render() {
    return (
      <DraggableNewComponent
        id={INVISIBLE_ROW_TYPE}
        type={INVISIBLE_ROW_TYPE}
        label="Row"
      />
    );
  }
}

DraggableNewRow.propTypes = propTypes;

import React from 'react';
// import PropTypes from 'prop-types';

import { TABS_TYPE } from '../../../util/componentTypes';
import DraggableNewComponent from './DraggableNewComponent';

const propTypes = {
};

export default class DraggableNewTabs extends React.PureComponent {
  render() {
    return (
      <DraggableNewComponent
        type={TABS_TYPE}
        label="Tabs"
      />
    );
  }
}

DraggableNewTabs.propTypes = propTypes;

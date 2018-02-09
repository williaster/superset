import React from 'react';
import PropTypes from 'prop-types';

import DraggableNewChart from './dnd/DraggableNewChart';
import DraggableNewDivider from './dnd/DraggableNewDivider';
import DraggableNewHeader from './dnd/DraggableNewHeader';
import DraggableNewRow from './dnd/DraggableNewRow';

const propTypes = {
  editMode: PropTypes.bool,
};

class BuilderComponentPane extends React.Component {
  render() {
    return (
      <div className="dashboard-builder-sidepane">
        <div className="dashboard-builder-sidepane-header">
          Insert components
        </div>
        <DraggableNewChart index={0} />
        <DraggableNewDivider index={1} />
        <DraggableNewHeader index={2} />
        <DraggableNewRow index={3} />
      </div>
    );
  }
}

BuilderComponentPane.propTypes = propTypes;

export default BuilderComponentPane;

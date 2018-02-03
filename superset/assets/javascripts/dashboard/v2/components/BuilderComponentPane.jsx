import React from 'react';
import PropTypes from 'prop-types';
import { Droppable } from 'react-beautiful-dnd';

import DraggableNewChart from './dnd/DraggableNewChart';
import DraggableNewDivider from './dnd/DraggableNewDivider';
import DraggableNewHeader from './dnd/DraggableNewHeader';
import DraggableNewRow from './dnd/DraggableNewRow';

import { DROPPABLE_NEW_COMPONENT } from '../util/constants';

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
        <Droppable
          droppableId={DROPPABLE_NEW_COMPONENT}
          direction="vertical"
          isDropDisabled
        >
          {provided => (
            <div ref={provided.innerRef}>
              <DraggableNewChart />
              <DraggableNewDivider />
              <DraggableNewHeader />
              <DraggableNewRow />
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    );
  }
}

BuilderComponentPane.propTypes = propTypes;

export default BuilderComponentPane;

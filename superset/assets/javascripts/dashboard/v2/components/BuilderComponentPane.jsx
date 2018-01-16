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
        <div style={{ fontSize: 16, fontWeight: 700, borderBottom: '1px solid #ccc', padding: 16 }}>
          Insert components
        </div>
        <Droppable
          droppableId={DROPPABLE_NEW_COMPONENT}
          direction="vertical"
          isDropDisabled
        >
          {provided => (
            <div
              ref={provided.innerRef}
              style={{
                width: 376,
                marginTop: 1,
              }}
            >
              <DraggableNewChart index={0} />
              <DraggableNewDivider index={1} />
              <DraggableNewHeader index={2} />
              <DraggableNewRow index={3} />
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

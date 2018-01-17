import React from 'react';
import PropTypes from 'prop-types';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import BuilderComponentPane from './BuilderComponentPane';
import DashboardGrid from './DashboardGrid';
import { reorder, reorderRows } from '../util/dnd-reorder';

import { DROPPABLE_DASHBOARD_ROOT, DRAGGABLE_ROW_TYPE } from '../util/constants';

const propTypes = {
  editMode: PropTypes.bool,
};

const defaultProps = {
  editMode: true,
};

class DashboardBuilder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: [],
      entities: {},
    };

    this.handleDragEnd = this.handleDragEnd.bind(this);
    this.handleDragStart = this.handleDragStart.bind(this);
    this.handleReorder = this.handleReorder.bind(this);
    this.handleNewEntity = this.handleNewEntity.bind(this);
  }

  handleDragEnd(dropResult) {
    console.log('drag end', dropResult);
    if (dropResult.destination) {
      // if (isNewEntity(dropResult.draggableId)) {
      //   this.handleNewEntity(dropResult);
      // } else {
      //   this.handleReorder(dropResult);
      // }
    }
  }

  handleDragStart(obj) {
    console.log('drag start', obj);
  }

  handleNewEntity() {

  }

  handleReorder({ source, destination, draggableId }) {
    // this.setState(({ rows, entities }) => {
    //   const { type } = entities[draggableId];
    //
    //   if (isRowType(type)) { // re-ordering rows
    //     const nextRows = reorder(
    //       rows,
    //       source.index,
    //       destination.index,
    //     );
    //     return { rows: nextRows };
    //   }
    //
    //   // moving items between rows
    //   const nextEntities = reorderRows({
    //     entitiesMap: entities,
    //     source,
    //     destination,
    //   });
    //
    //   return { entities: nextEntities };
    // });
  }

  render() {
    return (
      <DragDropContext
        onDragStart={this.handleDragStart}
        onDragEnd={this.handleDragEnd}
      >
        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'noWrap', height: '100%' }}>
          <div style={{ flex: 1, minWidth: 0, margin: 16, height: '100%' }}>
            <DashboardGrid />
            {/* <Droppable
              droppableId={DROPPABLE_DASHBOARD_ROOT}
              direction={D}
              type={DRAGGABLE_ROW_TYPE}
            >
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  style={{
                    position: 'relative',
                    backgroundColor: snapshot.isDraggingOver ? '#e0e0e0' : null,
                    minHeight: 100,
                    height: '100%',
                  }}
                >
                  {this.state.rows.map(id => this.renderRow(id))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable> */}
          </div>
          <BuilderComponentPane />
        </div>
      </DragDropContext>
    );
  }
}

DashboardBuilder.propTypes = propTypes;
DashboardBuilder.defaultProps = defaultProps;

export default DashboardBuilder;

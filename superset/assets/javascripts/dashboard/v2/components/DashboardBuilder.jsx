import React from 'react';
import PropTypes from 'prop-types';

import { DragDropContext } from 'react-beautiful-dnd';
import cx from 'classnames';

import BuilderComponentPane from './BuilderComponentPane';
import DashboardGrid from './DashboardGrid';
// import getNewGridEntity from '../util/getNewGridEntity';
import { reorderRows } from '../util/dnd-reorder';

import './dnd/dnd.css';
import testLayout from '../fixtures/testLayout';


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
      layout: testLayout,
      draggingEntity: null,
    };

    this.handleDragEnd = this.handleDragEnd.bind(this);
    this.handleDragStart = this.handleDragStart.bind(this);
    this.handleMoveEntity = this.handleMoveEntity.bind(this);
    this.handleNewEntity = this.handleNewEntity.bind(this);
    this.handleUpdateEntity = this.handleUpdateEntity.bind(this);
  }

  handleDragEnd(dropResult) {
    console.log('drag end', dropResult);
    if (dropResult.destination) {
      if (/new/gi.test(dropResult.draggableId)) {
        this.handleNewEntity(dropResult);
      } else {
        this.handleMoveEntity(dropResult);
      }
    }
  }

  handleDragStart(result) {
    console.log('drag start', result);
    const { layout } = this.state;
    const draggingEntity = layout.entities[result.draggableId] || { type: result.draggableId };
    this.setState(() => ({ draggingEntity }));
  }

  handleNewEntity() {
    console.log('new entity');
  }

  handleMoveEntity({ source, destination, draggableId }) {
    console.log('source', source, 'destination', destination);

    this.setState(({ layout }) => {
      const { entities } = layout;

      const nextEntities = reorderRows({
        entitiesMap: entities,
        source,
        destination,
      });

      return {
        layout: {
          ...layout,
          entities: {
            ...nextEntities,
          },
        },
      };
    });
  }

  handleUpdateEntity(nextEntity) {
    console.log('update entity', nextEntity);

    this.setState(({ layout }) => ({
      layout: {
        ...layout,
        entities: {
          ...layout.entities,
          [nextEntity.id]: nextEntity,
        },
      },
    }));
  }

  render() {
    const { draggingEntity, layout } = this.state;

    return (
      <DragDropContext
        onDragStart={this.handleDragStart}
        onDragEnd={this.handleDragEnd}
      >
        <div className={cx('dashboard-builder', draggingEntity && 'dashboard-builder--dragging')}>
          <DashboardGrid
            layout={layout}
            draggingEntity={draggingEntity}
            updateEntity={this.handleUpdateEntity}
          />
          <BuilderComponentPane />
        </div>
      </DragDropContext>
    );
  }
}

DashboardBuilder.propTypes = propTypes;
DashboardBuilder.defaultProps = defaultProps;

export default DashboardBuilder;

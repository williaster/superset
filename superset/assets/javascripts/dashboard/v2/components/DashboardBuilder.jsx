import React from 'react';
import PropTypes from 'prop-types';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import cx from 'classnames';

import BuilderComponentPane from './BuilderComponentPane';
import DashboardGrid from './DashboardGrid';
import newEntitiesFromDrop from '../util/newEntitiesFromDrop';
import { reorderItem } from '../util/dnd-reorder';

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
    };

    // @TODO most of this can probably be moved into redux
    this.handleDrop = this.handleDrop.bind(this);
    this.handleMoveEntity = this.handleMoveEntity.bind(this);
    this.handleNewEntity = this.handleNewEntity.bind(this);
    this.handleUpdateEntity = this.handleUpdateEntity.bind(this);
  }

  handleDrop(dropResult) {
    console.log('builder handleDrop', dropResult);

    if (
      dropResult.destination
      && dropResult.source
      && !( // ensure it has moved
        dropResult.destination.droppableId === dropResult.source.droppableId
        && dropResult.destination.index === dropResult.source.index
      )
    ) {
      this.handleMoveEntity(dropResult);
    } else if (dropResult.destination && !dropResult.source) {
      this.handleNewEntity(dropResult);
    }
  }

  handleNewEntity(dropResult) {
    console.log('new entity');
    this.setState(({ layout }) => {
      debugger;
      const newEntities = newEntitiesFromDrop({ dropResult, entitiesMap: layout });
      return {
        layout: {
          ...layout,
          ...newEntities,
        },
      };
    });
  }

  handleMoveEntity({ source, destination }) {
    this.setState(({ layout }) => {
      const nextEntities = reorderItem({
        entitiesMap: layout,
        source,
        destination,
      });

      return {
        layout: {
          ...layout,
          ...nextEntities,
        },
      };
    });
  }

  handleUpdateEntity(nextEntity) {
    console.log('update entity', nextEntity);
    this.setState(({ layout }) => ({
      layout: {
        ...layout,
        [nextEntity.id]: nextEntity,
      },
    }));
  }

  render() {
    const { layout } = this.state;

    return (
      <div className={cx('dashboard-builder')}>
        <DashboardGrid
          layout={layout}
          updateEntity={this.handleUpdateEntity}
          onDrop={this.handleDrop}
        />
        <BuilderComponentPane
          onDragStart={this.handleDragStart}
        />
      </div>
    );
  }
}

DashboardBuilder.propTypes = propTypes;
DashboardBuilder.defaultProps = defaultProps;

export default DragDropContext(HTML5Backend)(DashboardBuilder);

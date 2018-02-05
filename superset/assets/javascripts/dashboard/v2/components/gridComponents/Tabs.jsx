import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Tabs as BootstrapTabs, Tab } from 'react-bootstrap';
import { Draggable, Droppable } from 'react-beautiful-dnd';

import { DROPPABLE_DIRECTION_VERTICAL } from '../../util/constants';
import isValidChild from '../../util/isValidChild';
import { COMPONENT_TYPE_LOOKUP } from './';

const propTypes = {
  id: PropTypes.string.isRequired,
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
    }),
  ),
  onChangeTab: PropTypes.func,
  entity: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.string),
  }),
  entities: PropTypes.object, // @TODO shape
};

const defaultProps = {
  tabs: [
    { label: 'Section Tab' },
    { label: 'Section Tab' },
    { label: 'Section Tab' },
  ],
  onChangeTab: null,
  children: null,
};

class Tabs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabIndex: 0,
    };
    this.handleClicKTab = this.handleClicKTab.bind(this);
  }

  handleClicKTab(tabIndex) {
    const { onChangeTab, tabs } = this.props;
    this.setState(() => ({ tabIndex }));
    if (onChangeTab) {
      onChangeTab({ tabIndex, tab: tabs[tabIndex] });
    }
  }

  render() {
    const { tabs, id: tabId, entity: tabEntity, ...restProps } = this.props;
    const { entities, draggingEntity, disableDrop, disableDrag } = restProps;
    const { tabIndex } = this.state;
    return (
      <div className="dashboard-component dashboard-component-tabs">
        <BootstrapTabs
          id={tabEntity.id}
          activeKey={tabIndex}
          onSelect={this.handleClicKTab}
          animation={false}
        >
          {tabs.map((tab, i) => (
            <Tab key={i} eventKey={i} title={<div>{tab.label}</div>} />
          ))}
        </BootstrapTabs>

        <Droppable
          droppableId={tabEntity.id}
          isDropDisabled={disableDrop || !isValidChild({
            childType: draggingEntity && draggingEntity.type,
            parentType: tabEntity.type,
          })}
          direction={DROPPABLE_DIRECTION_VERTICAL}
        >
          {(droppableProvided, droppableSnapshot) => (
            <div
              ref={droppableProvided.innerRef}
              style={{ backgroundColor: droppableSnapshot.isDraggingOver ? '#eee' : undefined }}
            >
              {(tabEntity.children || []).map((id, index) => {
                const entity = entities[id] || {};
                const Component = COMPONENT_TYPE_LOOKUP[entity.type];
                return Component && (
                  <Draggable
                    key={id}
                    draggableId={id}
                    index={index}
                  >
                    {draggableProvided => (
                      <div className="draggable-row">
                        <div
                          ref={draggableProvided.innerRef}
                          {...draggableProvided.draggableProps}
                        >
                          <div
                            className={cx(!disableDrag && 'draggable-row-handle')}
                            {...draggableProvided.dragHandleProps}
                          />
                          <Component
                            id={id}
                            {...restProps}
                            entity={entity}
                          />
                        </div>
                        {draggableProvided.placeholder}
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {droppableProvided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    );
  }
}

Tabs.propTypes = propTypes;
Tabs.defaultProps = defaultProps;

export default Tabs;

import React from 'react';
import PropTypes from 'prop-types';
import { Tabs as BootstrapTabs, Tab } from 'react-bootstrap';

import DragDroppable from '../dnd/DragDroppable';
import DragHandle from '../dnd/DragHandle';
import ComponentLookup from '../gridComponents';
import { componentShape } from '../../util/propShapes';

const propTypes = {
  component: componentShape.isRequired,
  components: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  depth: PropTypes.number.isRequired,
  parentId: PropTypes.string.isRequired,

  // grid related
  availableColumnCount: PropTypes.number.isRequired,
  columnWidth: PropTypes.number.isRequired,
  onResizeStart: PropTypes.func.isRequired,
  onResize: PropTypes.func.isRequired,
  onResizeStop: PropTypes.func.isRequired,

  // dnd
  onDrop: PropTypes.func.isRequired,
  onChangeTab: PropTypes.func,
};

const defaultProps = {
  onChangeTab: null,
  children: null,
};

const NEW_TAB_INDEX = -1;

class Tabs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabIndex: 0,
    };
    this.handleClicKTab = this.handleClicKTab.bind(this);
  }

  handleClicKTab(tabIndex) {
    const { onChangeTab, component, components } = this.props;
    if (tabIndex !== NEW_TAB_INDEX) {
      this.setState(() => ({ tabIndex }));
      if (onChangeTab) {
        onChangeTab({ tabIndex, tab: component.children[tabIndex] });
      }
    } else {
      const newTabId = `new-tab-${component.children.length}`;
      component.children.push(newTabId);
      components[newTabId] = { id: newTabId, type: 'DASHBOARD_TAB_TYPE', meta: { text: 'New Tab' } };
      this.setState(() => ({ forceUpdate: Math.random() }));
    }
  }

  render() {
    const {
      depth,
      component: tabsComponent,
      components,
      parentId,
      index,
      availableColumnCount,
      columnWidth,
      onResizeStart,
      onResize,
      onResizeStop,
      onDrop,
    } = this.props;

    const { tabIndex: selectedTabIndex } = this.state;
    const { children: tabIds } = tabsComponent;

    return (
      <DragDroppable
        component={tabsComponent}
        components={components}
        orientation="horizontal"
        index={index}
        parentId={parentId}
        onDrop={onDrop}
      >
        {({ dropIndicatorProps: tabsDropIndicatorProps, dragSourceRef: tabsDragSourceRef }) => (
          <div className="dashboard-component dashboard-component-tabs">
            <DragHandle orientation="left" innerRef={tabsDragSourceRef} />

            <BootstrapTabs
              id={tabsComponent.id}
              activeKey={selectedTabIndex}
              onSelect={this.handleClicKTab}
              animation={false}
            >
              {tabIds.map((tabId, tabIndex) => {
                const tabComponent = components[tabId];
                return (
                  <Tab
                    key={tabId}
                    eventKey={tabIndex}
                    title={
                      <DragDroppable
                        component={tabComponent}
                        components={components}
                        orientation="vertical"
                        index={tabIndex}
                        parentId={tabsComponent.id}
                        onDrop={(dropResult) => {
                          onDrop(dropResult);

                          // Ensure dropped tab is now visible
                          const { destination } = dropResult;
                          if (destination) {
                            const dropTabIndex = destination.droppableId === tabsComponent.id
                              ? destination.index // dropped ON tab
                              : tabIds.indexOf(destination.droppableId); // dropped IN tab

                            if (dropTabIndex > -1) {
                              setTimeout(() => {
                                this.handleClicKTab(dropTabIndex);
                              }, 20);
                            }
                          }
                        }}
                      >
                        {({ dropIndicatorProps, dragSourceRef }) => (
                          <div className="dragdroppable-tab" ref={dragSourceRef}>
                            {tabComponent.meta.text}
                            {dropIndicatorProps &&
                              <div {...dropIndicatorProps} />}
                          </div>
                        )}
                      </DragDroppable>
                    }
                  >
                    {/*
                      react-bootstrap renders all children with display:none, so we don't
                      render potentially-expensive charts (this also enables lazy loading
                      their content)
                    */}
                    {tabIndex === selectedTabIndex &&
                      <div className="dashboard-component-tabs-content">
                        {tabComponent.children.map((componentId, componentIndex) => {
                          const component = components[componentId];
                          const componentType = component.type;
                          const Component = ComponentLookup[componentType];
                          return (
                            <Component
                              key={componentId}
                              depth={depth}
                              index={componentIndex}
                              component={components[componentId]}
                              components={components}
                              parentId={tabComponent.id}
                              onDrop={onDrop}
                              availableColumnCount={availableColumnCount}
                              columnWidth={columnWidth}
                              onResizeStart={onResizeStart}
                              onResize={onResize}
                              onResizeStop={onResizeStop}
                            />
                          );
                        })}
                      </div>}
                  </Tab>
                );
              })}

              <Tab
                key="new-tab"
                eventKey={NEW_TAB_INDEX}
                title={<div className="fa fa-plus-square" />}
              />
            </BootstrapTabs>

            {tabsDropIndicatorProps
              && tabsDropIndicatorProps.style
              && tabsDropIndicatorProps.style.width === '100%'
              && <div {...tabsDropIndicatorProps} />}

          </div>
        )}
      </DragDroppable>
    );
  }
}

Tabs.propTypes = propTypes;
Tabs.defaultProps = defaultProps;

export default Tabs;

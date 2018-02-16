import React from 'react';
import PropTypes from 'prop-types';
import { Tabs as BootstrapTabs, Tab } from 'react-bootstrap';

import DragDroppable from '../dnd/DragDroppable';
import DragHandle from '../dnd/DragHandle';
import DashboardComponent from '../../containers/DashboardComponent';
import EditableTitle from '../../../../components/EditableTitle';
import DeleteComponentButton from '../DeleteComponentButton';
import HoverMenu from '../menu/HoverMenu';
import WithPopoverMenu from '../menu/WithPopoverMenu';
import { componentShape } from '../../util/propShapes';
import { TAB_TYPE } from '../../util/componentTypes';

const NEW_TAB_INDEX = -1;
const MAX_TAB_COUNT = 5;

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
  createComponent: PropTypes.func.isRequired,
  handleComponentDrop: PropTypes.func.isRequired,
  onChangeTab: PropTypes.func,
  deleteComponent: PropTypes.func.isRequired,
  updateComponents: PropTypes.func.isRequired,
};

const defaultProps = {
  onChangeTab: null,
  children: null,
};

class Tabs extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tabIndex: 0,
      focusedId: null,
    };
    this.handleClicKTab = this.handleClicKTab.bind(this);
    this.handleDeleteComponent = this.handleDeleteComponent.bind(this);
    this.handleDropOnTab = this.handleDropOnTab.bind(this);
    this.handleChangeFocus = this.handleChangeFocus.bind(this);
    this.handleChangeText = this.handleChangeText.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const maxIndex = Math.max(0, nextProps.component.children.length - 1);
    if (this.state.tabIndex > maxIndex) {
      this.setState(() => ({ tabIndex: maxIndex }));
    }
  }

  handleClicKTab(tabIndex) {
    const { onChangeTab, component, createComponent } = this.props;
    const { focusedId } = this.state;

    if (!focusedId && tabIndex !== NEW_TAB_INDEX && tabIndex !== this.state.tabIndex) {
      this.setState(() => ({ tabIndex }));
      if (onChangeTab) {
        onChangeTab({ tabIndex, tab: component.children[tabIndex] });
      }
    } else if (!focusedId && tabIndex === NEW_TAB_INDEX) {
      createComponent({
        destination: {
          droppableId: component.id,
          index: component.children.length,
        },
        draggableId: TAB_TYPE,
      });
    }
  }

  handleChangeFocus(nextFocus) {
    if (this.state.focusedId !== nextFocus) {
      this.setState(() => ({ focusedId: nextFocus }));
    }
  }

  handleChangeText({ id, nextTabText }) {
    const { updateComponents, components } = this.props;
    const tab = components[id];
    if (nextTabText && tab && nextTabText !== tab.meta.text) {
      updateComponents({
        [tab.id]: {
          ...tab,
          meta: {
            ...tab.meta,
            text: nextTabText,
          },
        },
      });
    }
  }

  handleDeleteComponent(id) {
    const { deleteComponent, component, parentId } = this.props;
    const isTabsComponent = id === component.id;
    deleteComponent(id, isTabsComponent ? parentId : component.id);
  }

  handleDropOnTab(dropResult) {
    const { component, handleComponentDrop } = this.props;
    handleComponentDrop(dropResult);

    // Ensure dropped tab is visible
    const { destination } = dropResult;
    if (destination) {
      const dropTabIndex = destination.droppableId === component.id
        ? destination.index // dropped ON tab
        : component.children.indexOf(destination.droppableId); // dropped IN tab

      if (dropTabIndex > -1) {
        setTimeout(() => {
          this.handleClicKTab(dropTabIndex);
        }, 30);
      }
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
      handleComponentDrop,
    } = this.props;

    const { tabIndex: selectedTabIndex, focusedId } = this.state;
    const { children: tabIds } = tabsComponent;

    return (
      <DragDroppable
        component={tabsComponent}
        components={components}
        orientation="row"
        index={index}
        parentId={parentId}
        onDrop={handleComponentDrop}
        disableDragDrop={Boolean(focusedId)}
      >
        {({ dropIndicatorProps: tabsDropIndicatorProps, dragSourceRef: tabsDragSourceRef }) => (
          <div className="dashboard-component dashboard-component-tabs">
            <HoverMenu innerRef={tabsDragSourceRef} position="left">
              <DragHandle position="left" />
              <DeleteComponentButton
                onDelete={() => {
                  this.handleDeleteComponent(tabsComponent.id);
                }}
              />
            </HoverMenu>

            <BootstrapTabs
              id={tabsComponent.id}
              activeKey={selectedTabIndex}
              onSelect={this.handleClicKTab}
              animation={false}
            >
              {tabIds.map((tabId, tabIndex) => {
                const tabComponent = components[tabId];
                return ( // Bootstrap doesn't render a Tab if we move this to its own Tab.jsx
                  <Tab
                    key={tabId}
                    eventKey={tabIndex}
                    title={
                      <DragDroppable
                        component={tabComponent}
                        components={components}
                        orientation="column"
                        index={tabIndex}
                        parentId={tabsComponent.id}
                        onDrop={this.handleDropOnTab}
                        disableDragDrop={Boolean(focusedId)}
                      >
                        {({ dropIndicatorProps, dragSourceRef }) => (
                          <div className="dragdroppable-tab" ref={dragSourceRef}>
                            <WithPopoverMenu
                              onChangeFocus={(nextFocus) => {
                                this.handleChangeFocus(nextFocus && tabId);
                              }}
                              menuItems={[
                                <DeleteComponentButton
                                  onDelete={() => {
                                    this.handleDeleteComponent(tabId);
                                  }}
                                />,
                              ]}
                            >
                              <EditableTitle
                                title={tabComponent.meta.text}
                                canEdit={focusedId === tabId}
                                onSaveTitle={(nextTabText) => {
                                  this.handleChangeText({ id: tabId, nextTabText });
                                }}
                                showTooltip={false}
                              />
                            </WithPopoverMenu>

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
                        {tabComponent.children.map((componentId, componentIndex) => (
                          <DashboardComponent
                            key={componentId}
                            id={componentId}
                            depth={depth}
                            index={componentIndex}
                            parentId={tabComponent.id}
                            onDrop={handleComponentDrop}
                            availableColumnCount={availableColumnCount}
                            columnWidth={columnWidth}
                            onResizeStart={onResizeStart}
                            onResize={onResize}
                            onResizeStop={onResizeStop}
                          />
                        ))}
                      </div>}
                  </Tab>
                );
              })}

              {tabIds.length < MAX_TAB_COUNT &&
                <Tab
                  key="new-tab"
                  eventKey={NEW_TAB_INDEX}
                  title={<div className="fa fa-plus-square" />}
                />}
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

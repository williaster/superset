import React from 'react';
import PropTypes from 'prop-types';
import { Tabs as BootstrapTabs, Tab } from 'react-bootstrap';

import DashboardComponent from '../DashboardComponent';
import { componentShape } from '../../util/propShapes';

const propTypes = {
  tabs: PropTypes.arrayOf( // @TODO this should be parth of the component definition
    PropTypes.shape({
      label: PropTypes.string,
    }),
  ),
  onChangeTab: PropTypes.func,
  component: componentShape.isRequired,
  components: PropTypes.object,
  depth: PropTypes.number.isRequired,

  // grid props
  availableColumnCount: PropTypes.number.isRequired,
  columnWidth: PropTypes.number.isRequired,
  onResizeStart: PropTypes.func.isRequired,
  onResize: PropTypes.func.isRequired,
  onResizeStop: PropTypes.func.isRequired,
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
    const {
      tabs,
      depth,
      component: tabEntity,
      components,
      availableColumnCount,
      columnWidth,
      onResizeStart,
      onResize,
      onResizeStop,
      onDrop,
    } = this.props;

    return (
      <div className="dashboard-component dashboard-component-tabs">
        <BootstrapTabs
          id={tabEntity.id}
          activeKey={this.state.tabIndex}
          onSelect={this.handleClicKTab}
          animation={false}
        >
          {tabs.map((tab, i) => (
            <Tab key={i} eventKey={i} title={<div>{tab.label}</div>} />
          ))}
        </BootstrapTabs>
        <div className="dashboard-component-tabs-content">

          {(tabEntity.children || []).map((id, index) => (
            <DashboardComponent
              key={id}
              depth={depth}
              index={index}
              component={components[id]}
              components={components}
              parentId={tabEntity.id}
              onDrop={onDrop}
              availableColumnCount={availableColumnCount}
              columnWidth={columnWidth}
              onResizeStart={onResizeStart}
              onResize={onResize}
              onResizeStop={onResizeStop}
            />
          ))}
        </div>
      </div>
    );
  }
}

Tabs.propTypes = propTypes;
Tabs.defaultProps = defaultProps;

export default Tabs;

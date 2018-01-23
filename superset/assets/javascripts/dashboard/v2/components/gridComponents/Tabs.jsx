import React from 'react';
import { Tabs as BootstrapTabs, Tab } from 'react-bootstrap';
import PropTypes from 'prop-types';

const propTypes = {
  id: PropTypes.string.isRequired,
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
    }),
  ),
  onChangeTab: PropTypes.func,
};

const defaultProps = {
  tabs: [
    { label: 'Section Tab' },
    { label: 'Section Tab' },
    { label: 'Section Tab' },
  ],
  onChangeTab: null,
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
    const { tabs, id } = this.props;
    const { tabIndex } = this.state;
    return (
      <div className="dashboard-component dashboard-component-tabs">
        <BootstrapTabs
          id={id}
          activeKey={tabIndex}
          onSelect={this.handleClicKTab}
          animation={false}
        >
          {tabs.map((tab, i) => (
            <Tab key={i} eventKey={i} title={<div>{tab.label}</div>} />
          ))}
        </BootstrapTabs>
      </div>
    );
  }
}

Tabs.propTypes = propTypes;
Tabs.defaultProps = defaultProps;

export default Tabs;

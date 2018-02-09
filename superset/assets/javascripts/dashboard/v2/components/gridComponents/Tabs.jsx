import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Tabs as BootstrapTabs, Tab } from 'react-bootstrap';

import DraggableRow from '../dnd/DraggableRow';

const propTypes = {
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
    const {
      tabs,
      entity: tabEntity,
      entities,
      gridProps,
      disableDrop,
      disableDrag,
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

        {(tabEntity.children || []).map((id, index) => (
          <DraggableRow
            key={id}
            index={index}
            entity={entities[id]}
            entities={entities}
            parentId={tabEntity.id}
            onDrop={onDrop}
            disableDrop={disableDrop}
            disableDrag={disableDrag}
            gridProps={gridProps}
          />
        ))}
      </div>
    );
  }
}

Tabs.propTypes = propTypes;
Tabs.defaultProps = defaultProps;

export default Tabs;

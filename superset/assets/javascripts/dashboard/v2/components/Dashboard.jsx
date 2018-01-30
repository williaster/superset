import React from 'react';
import PropTypes from 'prop-types';

import DashboardBuilder from './DashboardBuilder';
import StaticDashboard from './StaticDashboard';
import Header from './Header';

import '../../../../stylesheets/dashboard-v2.css';

const propTypes = {
  actions: PropTypes.shape({
    updateDashboardTitle: PropTypes.func.isRequired,
    setEditMode: PropTypes.func.isRequired,
  }),
  dashboard: PropTypes.object.isRequired,
  editMode: PropTypes.bool,
};

class Dashboard extends React.Component {
  render() {
    const { editMode, actions, dashboard } = this.props;
    const { setEditMode, updateDashboardTitle } = actions;
    return (
      <div className="dashboard-v2">
        <Header
          editMode={editMode}
          setEditMode={setEditMode}
          updateDashboardTitle={updateDashboardTitle}
        />

        {editMode ?
          <DashboardBuilder /> : <StaticDashboard layout={dashboard.layout} />}
      </div>
    );
  }
}

Dashboard.propTypes = propTypes;

export default Dashboard;

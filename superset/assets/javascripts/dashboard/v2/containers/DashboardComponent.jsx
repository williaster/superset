import React from 'react';
import PropTypes from 'prop-types';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import ComponentLookup from '../components/gridComponents';
import { componentShape } from '../util/propShapes';

import {
  createComponent,
  deleteComponent,
  updateComponents,
  handleComponentDrop,
} from '../actions';

const propTypes = {
  component: componentShape.isRequired,
  components: PropTypes.object.isRequired,
  createComponent: PropTypes.func.isRequired,
  deleteComponent: PropTypes.func.isRequired,
  updateComponents: PropTypes.func.isRequired,
  handleComponentDrop: PropTypes.func.isRequired,
};

function mapStateToProps({ dashboard = {} }, ownProps) {
  const { id } = ownProps;
  return {
    component: dashboard[id],
    components: dashboard,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    createComponent,
    deleteComponent,
    updateComponents,
    handleComponentDrop,
  }, dispatch);
}

class DashboardComponent extends React.PureComponent {
  render() {
    const { component } = this.props;
    const Component = ComponentLookup[component.type];
    return Component ? <Component {...this.props} /> : null;
  }
}

DashboardComponent.propTypes = propTypes;

export default connect(mapStateToProps, mapDispatchToProps)(DashboardComponent);

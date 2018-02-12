import React from 'react';
import PropTypes from 'prop-types';

import { componentShape } from '../../util/propShapes';

const propTypes = {
  component: componentShape.isRequired,
};

const defaultProps = {
  component: {},
};

class Header extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { component: { id, meta } } = this.props;
    return !meta || !id ? null : (
      <div className="dashboard-component dashboard-component-header">
        {meta.text}
      </div>
    );
  }
}

Header.propTypes = propTypes;
Header.defaultProps = defaultProps;

export default Header;

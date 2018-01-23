import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  entity: PropTypes.shape({
    id: PropTypes.string.isRequired,
    meta: PropTypes.shape({
      text: PropTypes.string,
    }),
  }),
};

const defaultProps = {
  entity: {},
};

class Header extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { entity: { id, meta } } = this.props;
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

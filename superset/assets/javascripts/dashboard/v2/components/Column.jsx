import React from 'react';
import PropTypes from 'prop-types';

import {  } from '../util/constants';

const propTypes = {
};

const defaultProps = {
};

class Column extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div
        style={{
          minWidth: 8 * 8,
          height: '100%',
          backgroundColor: '#ff269e',
        }}
      />
    );
  }
}

Column.propTypes = propTypes;
Column.defaultProps = defaultProps;

export default Column;

import React from 'react';

const propTypes = {
};

const defaultProps = {
};

class Spacer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div
        className="grid-spacer"
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: 'transparent',
          boxShadow: 'inset 0 0 0 1px #484848',
        }}
      />
    );
  }
}

Spacer.propTypes = propTypes;
Spacer.defaultProps = defaultProps;

export default Spacer;

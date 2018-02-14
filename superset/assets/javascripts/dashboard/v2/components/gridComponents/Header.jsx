import React from 'react';
import PropTypes from 'prop-types';

import DragDroppable from '../dnd/DragDroppable';
import DragHandle from '../dnd/DragHandle';
import { componentShape } from '../../util/propShapes';

const propTypes = {
  component: componentShape.isRequired,
  components: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  parentId: PropTypes.string.isRequired,
  // dnd
  onDrop: PropTypes.func.isRequired,
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
    const {
      component,
      components,
      index,
      parentId,
      onDrop,
    } = this.props;

    return (
      <DragDroppable
        component={component}
        components={components}
        orientation="horizontal"
        index={index}
        parentId={parentId}
        onDrop={onDrop}
      >
        {({ dropIndicatorProps, dragSourceRef }) => (
          <div ref={dragSourceRef}>
            <DragHandle position="left" />

            <div className="dashboard-component dashboard-component-header">
              {component.meta.text}
            </div>

            {dropIndicatorProps && <div {...dropIndicatorProps} />}
          </div>
        )}
      </DragDroppable>
    );
  }
}

Header.propTypes = propTypes;
Header.defaultProps = defaultProps;

export default Header;

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
  onDrop: PropTypes.func.isRequired,
};

class Divider extends React.PureComponent {
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

            <div className="dashboard-component dashboard-component-divider">
              <div />
            </div>

            {dropIndicatorProps && <div {...dropIndicatorProps} />}
          </div>
        )}
      </DragDroppable>
    );
  }
}

Divider.propTypes = propTypes;

export default Divider;

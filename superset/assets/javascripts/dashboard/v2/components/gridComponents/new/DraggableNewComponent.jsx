import React from 'react';
import PropTypes from 'prop-types';

import DragDroppable from '../../dnd/DragDroppable';

const propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

export default class DraggableNewComponent extends React.PureComponent {
  render() {
    const { label, id, type } = this.props;
    return (
      <DragDroppable
        component={{ type, id }}
        components={{}}
        index={0}
      >
        {({ dragSourceRef }) => (
          <div ref={dragSourceRef} className="new-component">
            <div className="new-component-placeholder" />
            {label}
          </div>
        )}
      </DragDroppable>
    );
  }
}

DraggableNewComponent.propTypes = propTypes;

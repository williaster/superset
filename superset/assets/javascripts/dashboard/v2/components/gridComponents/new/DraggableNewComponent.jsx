import React from 'react';
import PropTypes from 'prop-types';
import DragDroppable from '../../dnd/DragDroppable';

const propTypes = {
  // id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

export default class DraggableNewComponent extends React.PureComponent {
  render() {
    const { type, label } = this.props;
    return (
      <DragDroppable
        component={{ type, id: type }}
        components={{}}
        index={0}
        depth={0}
        useChildAsDragHandle
      >
        <div className="new-component">
          <div className="new-component-placeholder" />
          {label}
        </div>
      </DragDroppable>
    );
  }
}

DraggableNewComponent.propTypes = propTypes;

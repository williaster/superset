import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Draggable } from 'react-beautiful-dnd';

const propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  type: PropTypes.string,
};

export default class DraggableNewComponent extends React.Component {
  render() {
    const { id, label, index, type = undefined } = this.props;

    return (
      <Draggable
        draggableId={id}
        index={index}
        type={type}
      >
        {(provided, snapshot) => (
          <div>
            <div
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              ref={provided.innerRef}
            >
              <div
                className={cx(
                  'new-draggable-component',
                  snapshot.isDragging && 'new-draggable-component--dragging',
                )}
              >
                <div className="new-draggable-placeholder" />
                {label}
              </div>
            </div>
            {provided.placeholder}
          </div>
        )}
      </Draggable>
    );
  }
}

DraggableNewComponent.propTypes = propTypes;

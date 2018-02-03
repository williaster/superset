import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Draggable } from 'react-beautiful-dnd';

const propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

export default class DraggableNewComponent extends React.PureComponent {
  render() {
    const { id, label } = this.props;
    return (
      <Draggable draggableId={id}>
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

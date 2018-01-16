import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Draggable } from 'react-beautiful-dnd';

const propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  draggableType: PropTypes.string,
};

export default class DraggableNewComponent extends React.Component {
  render() {
    const { id, label, index, draggableType = undefined} = this.props;
    if (!id) console.warn(`no 'id' provided for NewComponent ${type}`);
    if (typeof index === 'undefined') console.warn(`no 'index' provided for NewComponent ${type}`);

    return (
      <Draggable
        draggableId={id}
        index={index}
        type={draggableType}
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

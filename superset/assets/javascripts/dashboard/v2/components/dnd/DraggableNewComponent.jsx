import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Draggable from './Draggable';

const propTypes = {
  // id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

export default class DraggableNewComponent extends React.PureComponent {
  render() {
    const { type, label } = this.props;
    return (
      <Draggable type={type} draggableId={type} index={0}>
        {({ dragSourceRef, dragPreviewRef, isDragging }) => (
          <div
            ref={(ref) => {
              dragSourceRef(ref);
              dragPreviewRef(ref);
            }}
            className={cx(
              'new-draggable-component',
              isDragging && 'draggable--dragging',
            )}
          >
            <div className="new-draggable-placeholder" />
            {label}
          </div>
        )}
      </Draggable>
    );
  }
}

DraggableNewComponent.propTypes = propTypes;

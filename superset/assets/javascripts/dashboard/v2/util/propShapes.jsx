import PropTypes from 'prop-types';
import componentTypes from './componentTypes';

export const componentShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  type: PropTypes.oneOf(
    Object.values(componentTypes),
  ).isRequired,
  childIds: PropTypes.arrayOf(PropTypes.string),
  meta: PropTypes.shape({
    // Dimensions
    width: PropTypes.number,
    height: PropTypes.number,

    // Header
    text: PropTypes.string,
  }),
});

export const componentProps = {
  component: componentShape.isRequired,
  components: PropTypes.object.isRequired,
  depth: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
  parentId: PropTypes.string.isRequired,

  // grid related
  availableColumnCount: PropTypes.number.isRequired,
  columnWidth: PropTypes.number.isRequired,
  rowHeight: PropTypes.number,
  onResizeStart: PropTypes.func.isRequired,
  onResize: PropTypes.func.isRequired,
  onResizeStop: PropTypes.func.isRequired,

  // dnd
  onDrop: PropTypes.func.isRequired,
};

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

// export const gridPropsShape = PropTypes.shape({
//   availableColumnCount: PropTypes.number.isRequired,
//   columnWidth: PropTypes.number.isRequired,
//   rowWidth: PropTypes.number.isRequired,
//   onResizeStart: PropTypes.func.isRequired,
//   onResize: PropTypes.func.isRequired,
//   onResizeStop: PropTypes.func.isRequired,
// });

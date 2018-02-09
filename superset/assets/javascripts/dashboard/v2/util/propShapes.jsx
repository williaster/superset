import PropTypes from 'prop-types';

export const entityShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  childIds: PropTypes.arrayOf(PropTypes.string),
  parentId: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired, // @TODO enumerate
  meta: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number,
  }),
});

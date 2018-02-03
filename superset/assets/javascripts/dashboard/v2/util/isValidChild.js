import {
  CHART_TYPE,
  COLUMN_TYPE,
  DIVIDER_TYPE,
  HEADER_TYPE,
  GRID_ROOT_TYPE,
  INVISIBLE_ROW_TYPE,
  MARKDOWN_TYPE,
  ROW_TYPE,
  SPACER_TYPE,
  TABS_TYPE,

  DRAGGABLE_NEW_CHART,
  DRAGGABLE_NEW_DIVIDER,
  DRAGGABLE_NEW_HEADER,
  DRAGGABLE_NEW_ROW,
  DRAGGABLE_NEW_SPACER,
} from './constants';

const typeToValidChildType = {
  // root
  [GRID_ROOT_TYPE]: {
    [ROW_TYPE]: true,
    [INVISIBLE_ROW_TYPE]: true,
    [TABS_TYPE]: true,

    [DRAGGABLE_NEW_CHART]: true,
    [DRAGGABLE_NEW_DIVIDER]: true,
    [DRAGGABLE_NEW_HEADER]: true,
    [DRAGGABLE_NEW_ROW]: true,
  },

  // row types
  [ROW_TYPE]: {
    [CHART_TYPE]: true,
    [MARKDOWN_TYPE]: true,
    [COLUMN_TYPE]: true,
    [SPACER_TYPE]: true,
    [DRAGGABLE_NEW_SPACER]: true,
    [DRAGGABLE_NEW_CHART]: true,
    [DRAGGABLE_NEW_HEADER]: true,
  },

  [INVISIBLE_ROW_TYPE]: {
    [CHART_TYPE]: true,
    [MARKDOWN_TYPE]: true,
    [COLUMN_TYPE]: true,
    [SPACER_TYPE]: true,
    [DRAGGABLE_NEW_SPACER]: true,
    [DRAGGABLE_NEW_CHART]: true,
    [DRAGGABLE_NEW_HEADER]: true,
  },

  [TABS_TYPE]: {
    [ROW_TYPE]: true,
    [CHART_TYPE]: true,
    [MARKDOWN_TYPE]: true,
    [SPACER_TYPE]: true,
    [COLUMN_TYPE]: true,

    [DRAGGABLE_NEW_SPACER]: true,
  },

  [COLUMN_TYPE]: {
    [CHART_TYPE]: true,
    [MARKDOWN_TYPE]: true,
    [HEADER_TYPE]: true,
    [SPACER_TYPE]: true,

    [DRAGGABLE_NEW_SPACER]: true,
    [DRAGGABLE_NEW_CHART]: true,
    [DRAGGABLE_NEW_HEADER]: true,
    // divider?
    // row?
  },

  // these have no valid children
  [CHART_TYPE]: {},
  [MARKDOWN_TYPE]: {},
  [DIVIDER_TYPE]: {},
  [HEADER_TYPE]: {},
  [SPACER_TYPE]: {},
};

export default function isValidChild({ parentType, childType }) {
  if (!parentType || !childType) return false;
  return Boolean(
    typeToValidChildType[parentType][childType],
  );
}

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
} from './componentTypes';

const typeToValidChildType = {
  // root
  [GRID_ROOT_TYPE]: {
    [ROW_TYPE]: true,
    [INVISIBLE_ROW_TYPE]: true,
    [TABS_TYPE]: true,
    [DIVIDER_TYPE]: true,
    [HEADER_TYPE]: true,
  },

  [ROW_TYPE]: {
    [CHART_TYPE]: true,
    [MARKDOWN_TYPE]: true,
    [COLUMN_TYPE]: true,
    [SPACER_TYPE]: true,
    [HEADER_TYPE]: true,
  },

  [INVISIBLE_ROW_TYPE]: {
    [CHART_TYPE]: true,
    [MARKDOWN_TYPE]: true,
    [COLUMN_TYPE]: true,
    [SPACER_TYPE]: true,
  },

  [TABS_TYPE]: {
    [ROW_TYPE]: true,
    [INVISIBLE_ROW_TYPE]: true,
    [DIVIDER_TYPE]: true,
    [HEADER_TYPE]: true,
  },

  [COLUMN_TYPE]: {
    [CHART_TYPE]: true,
    [MARKDOWN_TYPE]: true,
    [HEADER_TYPE]: true,
    [SPACER_TYPE]: true,
    [DIVIDER_TYPE]: true,
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
  const isValid = Boolean(
    typeToValidChildType[parentType][childType],
  );

  return isValid;
}

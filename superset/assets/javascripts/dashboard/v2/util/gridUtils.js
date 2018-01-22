import {
  SPACER_TYPE,
  COLUMN_TYPE,
  CHART_TYPE,
  MARKDOWN_TYPE,
} from './constants';

export function componentIsResizable(entity) {
  return [
    SPACER_TYPE,
    COLUMN_TYPE,
    CHART_TYPE,
    MARKDOWN_TYPE,
  ].indexOf(entity.type) > -1;
}

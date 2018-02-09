import {
  COLUMN_TYPE,
  HEADER_TYPE,
  ROW_TYPE,
  INVISIBLE_ROW_TYPE,
  SPACER_TYPE,
  TABS_TYPE,
  CHART_TYPE,
  DIVIDER_TYPE,
} from '../util/componentTypes';

import { DASHBOARD_ROOT_ID } from '../util/constants';

export default {
  [DASHBOARD_ROOT_ID]: {
    id: DASHBOARD_ROOT_ID,
    children: [
      'header0',
      'row0',
      'divider0',
      'row1',
      'tabs0',
      'divider1',
    ],
  },
  row0: {
    id: 'row0',
    type: INVISIBLE_ROW_TYPE,
    children: [
      'charta',
      'chartb',
      'chartc',
    ],
  },
  row1: {
    id: 'row1',
    type: ROW_TYPE,
    children: [
      'header1',
    ],
  },
  row2: {
    id: 'row2',
    type: ROW_TYPE,
    children: [
      'chartd',
      'spacer0',
      'charte',
    ],
  },
  tabs0: {
    id: 'tabs0',
    type: TABS_TYPE,
    children: [
      'row2',
    ],
    meta: {
    },
  },
  header0: {
    id: 'header0',
    type: HEADER_TYPE,
    meta: {
      text: 'Header 1',
    },
  },
  header1: {
    id: 'header1',
    type: HEADER_TYPE,
    meta: {
      text: 'Header 2',
    },
  },
  divider0: {
    id: 'divider0',
    type: DIVIDER_TYPE,
  },
  divider1: {
    id: 'divider1',
    type: DIVIDER_TYPE,
  },
  charta: {
    id: 'charta',
    type: CHART_TYPE,
    meta: {
      width: 3,
      height: 10,
    },
  },
  chartb: {
    id: 'chartb',
    type: CHART_TYPE,
    meta: {
      width: 3,
      height: 10,
    },
  },
  chartc: {
    id: 'chartc',
    type: CHART_TYPE,
    meta: {
      width: 3,
      height: 10,
    },
  },
  chartd: {
    id: 'chartd',
    type: CHART_TYPE,
    meta: {
      width: 6,
      height: 10,
    },
  },
  charte: {
    id: 'charte',
    type: CHART_TYPE,
    meta: {
      width: 6,
      height: 10,
    },
  },
  spacer0: {
    id: 'spacer0',
    type: SPACER_TYPE,
    meta: {
      width: 1,
    },
  },
};

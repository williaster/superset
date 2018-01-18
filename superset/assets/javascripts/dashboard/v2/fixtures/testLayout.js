import {
  COLUMN_TYPE,
  HEADER_TYPE,
  ROW_TYPE,
  CHART_TYPE,
  DIVIDER_TYPE,
} from '../util/constants';

export default {
  children: [
    'header0',
    'row0',
    'divider0',
    'row1',
    'row2',
  ],
  entities: {
    header0: {
      id: 'header0',
      type: HEADER_TYPE,
      children: [],
      meta: {
        text: 'Section header',
      },
    },
    divider0: {
      id: 'divider0',
      type: DIVIDER_TYPE,
      children: [],
    },
    row0: {
      id: 'row0',
      type: ROW_TYPE,
      children: [],
    },
    row1: {
      id: 'row1',
      type: ROW_TYPE,
      children: [],
    },
    row2: {
      id: 'row2',
      type: ROW_TYPE,
      children: [
        'column0',
        'chart0',
        'chart1',
      ],
    },
    chart0: {
      id: 'chart0',
      type: CHART_TYPE,
      meta: {
        width: 3,
        height: 10,
      },
    },
    chart1: {
      id: 'chart1',
      type: CHART_TYPE,
      meta: {
        width: 3,
        height: 10,
      },
    },
    column0: {
      id: 'column0',
      type: COLUMN_TYPE,
      meta: {
        width: 3,
        height: 5,
      },
    },
  },
};

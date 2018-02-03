import {
  COLUMN_TYPE,
  HEADER_TYPE,
  ROW_TYPE,
  INVISIBLE_ROW_TYPE,
  SPACER_TYPE,
  TABS_TYPE,
  CHART_TYPE,
  DIVIDER_TYPE,
  DROPPABLE_ID_DASHBOARD_ROOT,
} from '../util/constants';

export default {
  entities: {
    [DROPPABLE_ID_DASHBOARD_ROOT]: {
      id: DROPPABLE_ID_DASHBOARD_ROOT,
      children: [
        'header0',
        'row1',
        'row2',
        'row3',
        'row4',
        'row5',
      ],
    },
    // row0: {
    //   id: 'row0',
    //   type: INVISIBLE_ROW_TYPE,
    //   children: ['header0'],
    // },
    row1: {
      id: 'row1',
      type: INVISIBLE_ROW_TYPE,
      children: [
        'charta',
        'chartb',
        'chartc',
      ],
    },
    row2: {
      id: 'row2',
      type: INVISIBLE_ROW_TYPE,
      children: [
        'divider0',
      ],
    },
    row3: {
      id: 'row3',
      type: ROW_TYPE,
      children: [
        'header1',
      ],
    },
    row4: {
      id: 'row4',
      type: ROW_TYPE,
      children: [
        'tabs0',
      ],
    },
    row5: {
      id: 'row5',
      type: ROW_TYPE,
      children: [
        'column0',
        'spacer0',
        'chart3',
        'spacer1',
        'chart4',
      ],
    },
    header0: {
      id: 'header0',
      type: HEADER_TYPE,
      meta: {
        text: 'Section header',
      },
    },
    header1: {
      id: 'header1',
      type: HEADER_TYPE,
      meta: {
        text: 'Header in row',
      },
    },
    divider0: {
      id: 'divider0',
      type: DIVIDER_TYPE,
      children: [],
    },

    chart0: {
      id: 'chart0',
      type: CHART_TYPE,
      meta: {
        height: 6,
      },
    },
    chart1: {
      id: 'chart1',
      type: CHART_TYPE,
      meta: {
        height: 6,
      },
    },
    chart2: {
      id: 'chart2',
      type: CHART_TYPE,
      meta: {
        height: 6,
      },
    },
    chart3: {
      id: 'chart3',
      type: CHART_TYPE,
      meta: {
        width: 3,
        height: 20,
      },
    },
    chart4: {
      id: 'chart4',
      type: CHART_TYPE,
      meta: {
        width: 3,
        height: 20,
      },
    },
    charta: {
      id: 'charta',
      type: CHART_TYPE,
      meta: {
        width: 3,
        height: 20,
      },
    },
    chartb: {
      id: 'chartb',
      type: CHART_TYPE,
      meta: {
        width: 6,
        height: 20,
      },
    },
    chartc: {
      id: 'chartc',
      type: CHART_TYPE,
      meta: {
        width: 3,
        height: 20,
      },
    },
    column0: {
      id: 'column0',
      type: COLUMN_TYPE,
      children: [
        'chart0',
        'chart1',
        'chart2',
      ],
      meta: {
        width: 3,
      },
    },
    spacer0: {
      id: 'spacer0',
      type: SPACER_TYPE,
      meta: {
        width: 1,
      },
    },
    spacer1: {
      id: 'spacer1',
      type: SPACER_TYPE,
      meta: {
        width: 1,
      },
    },
    tabs0: {
      id: 'tabs0',
      type: TABS_TYPE,
      meta: {
        width: 1,
      },
    },
  },
};

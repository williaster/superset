import {
  CHART_TYPE,
  COLUMN_TYPE,
  DIVIDER_TYPE,
  HEADER_TYPE,
  ROW_TYPE,
} from '../../util/constants';

import Chart from './Chart';
import Column from './Column';
import Divider from './Divider';
import Header from './Header';
import Row from './Row';

export { default as Chart } from './Chart';
export { default as Column } from './Column';
export { default as Divider } from './Divider';
export { default as Header } from './Header';
export { default as Row } from './Row';

export const COMPONENT_TYPE_LOOKUP = {
  [CHART_TYPE]: Chart,
  [COLUMN_TYPE]: Column,
  [DIVIDER_TYPE]: Divider,
  [HEADER_TYPE]: Header,
  [ROW_TYPE]: Row,
};

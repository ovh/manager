import { ChartConfig } from '../charts/base';
import { WidgetTooltip } from './WidgetTooltip.type';

export type ChartWidget = {
  id: string;
  title: string;
  chart: ChartConfig;
  unit?: string;
  colspan?: number;
  rowspan?: number;
  tooltip?: WidgetTooltip;
  query: string;
};

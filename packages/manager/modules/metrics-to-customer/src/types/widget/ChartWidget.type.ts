import { ChartConfig } from '@/types/charts/base/Chart.type';
import { WidgetTooltip } from '@/types/widget/WidgetTooltip.type';

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

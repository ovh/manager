import { WidgetTooltip } from './WidgetTooltip.type';

export interface ChartWidgetProps {
  id: string;
  title: string;
  unit?: string;
  tooltip?: WidgetTooltip;
  isLoading?: boolean;
  colspan?: number;
  rowspan?: number;
  children: React.ReactNode;
}

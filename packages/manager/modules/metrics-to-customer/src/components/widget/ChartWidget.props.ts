import { WidgetTooltip } from '@/types/widget/WidgetTooltip.type';

export interface ChartWidgetProps {
  id: string;
  title: string;
  unit?: string;
  tooltip?: WidgetTooltip;
  isLoading?: boolean;
  disabled?: boolean;
  colspan?: number;
  rowspan?: number;
  children: React.ReactNode;
}

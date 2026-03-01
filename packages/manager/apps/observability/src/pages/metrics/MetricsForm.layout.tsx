import { MetricsFormLayoutProps } from '@/pages/metrics/MetricsFormLayout.props';

export const MetricsFormLayout = ({ children, className = '' }: MetricsFormLayoutProps) => {
  return <div className={`grid grid-cols-1 w-1/2 ${className}`.trim()}>{children}</div>;
};

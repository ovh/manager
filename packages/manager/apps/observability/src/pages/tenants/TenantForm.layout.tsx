import { TenantFormLayoutProps } from '@/pages/tenants/TenantFormLayout.props';

export const TenantFormLayout = ({ children, className = '' }: TenantFormLayoutProps) => {
  return <div className={`grid grid-cols-1 w-1/2 ${className}`.trim()}>{children}</div>;
};

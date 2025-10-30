import { TenantsFormLayoutProps } from '@/pages/tenants/TenantsForm.props';

export const TenantsFormLayout = ({ children, className = '' }: TenantsFormLayoutProps) => {
  return <div className={`grid grid-cols-1 w-1/2 ${className}`.trim()}>{children}</div>;
};

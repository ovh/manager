import { OdsBreadcrumb, OdsBreadcrumbItem } from '@ovhcloud/ods-components/react';

import { useApplicationBreadcrumbItems } from '@/hooks/layout/useApplicationBreadcrumbItems';
import { useBreadcrumb } from '@/hooks/layout/useBreadcrumb';

function Breadcrumb(): JSX.Element {
  const applicationBreadcrumbItems = useApplicationBreadcrumbItems();
  const breadcrumbItems = useBreadcrumb({ items: applicationBreadcrumbItems });

  return (
    <OdsBreadcrumb>
      {breadcrumbItems.map(({ label, href }) => (
        <OdsBreadcrumbItem key={`${label}-${href}`} label={label} href={href} />
      ))}
    </OdsBreadcrumb>
  );
}

export default Breadcrumb;

import { OdsBreadcrumb, OdsBreadcrumbItem } from '@ovhcloud/ods-components/react';

import { useBreadcrumb } from '@/hooks/breadcrumb/useBreadcrumb';
import appConfig from '@/vmware-public-vcf-aas.config';

export interface BreadcrumbProps {
  customRootLabel?: string;
  appName?: string;
}

function Breadcrumb({ customRootLabel }: BreadcrumbProps): JSX.Element {
  const rootLabel = customRootLabel || appConfig.rootLabel;

  const breadcrumbItems = useBreadcrumb({ rootLabel });

  // The key is used to force re-render breadcrumb items when the breadcrumb length changes, to update items states (`collapsed` / `last`)
  return (
    <OdsBreadcrumb>
      {breadcrumbItems.map(({ label, ...props }, index) => (
        <OdsBreadcrumbItem
          key={`${label}-${index}-${breadcrumbItems.length}`}
          label={label}
          {...props}
        />
      ))}
    </OdsBreadcrumb>
  );
}

export default Breadcrumb;

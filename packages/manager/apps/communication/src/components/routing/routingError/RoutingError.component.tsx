import { useMemo } from 'react';
import { OdsIcon } from '@ovhcloud/ods-components/react';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { NotificationRoutingRule } from '@/data/types';

export default function RoutingError({
  rules,
}: {
  rules: NotificationRoutingRule[];
}) {
  const hasRoutingError = useMemo(() => {
    return rules.some((rule) =>
      rule.contactMeans.some((contactMean) => contactMean.error),
    );
  }, [rules]);

  if (!hasRoutingError) {
    return null;
  }

  return (
    <OdsIcon
      name={ODS_ICON_NAME.triangleExclamation}
      className="text-[1.5rem] cursor-pointer text-[--ods-color-critical-500]"
      id="routing-error"
    />
  );
}

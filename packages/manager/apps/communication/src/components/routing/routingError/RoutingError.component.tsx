import { useMemo } from 'react';
import { NotificationRoutingRule } from '@/data/types';
import { Icon } from '@ovhcloud/ods-react';

type RoutingErrorProps = {
  rules: NotificationRoutingRule[];
};

export default function RoutingError({
  rules,
}: RoutingErrorProps) {
  const hasRoutingError = useMemo(() => {
    return rules.some((rule) =>
      rule.contactMeans.some((contactMean) => contactMean.error),
    );
  }, [rules]);

  if (!hasRoutingError) {
    return null;
  }

  return (
    <Icon
      name="triangle-exclamation"
      className="text-[1.5rem] cursor-pointer text-[--ods-color-critical-500]"
      id="routing-error"
    />
  );
}

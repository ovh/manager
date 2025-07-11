import { ComponentProps, useMemo } from 'react';
import { Badge } from '@ovh-ux/manager-pci-common';

type StatusComponentProps = {
  statusGroup: string;
  status: string;
};
export default function StatusComponent({
  statusGroup,
  status,
}: Readonly<StatusComponentProps>) {
  const chipAttribute = useMemo<Partial<ComponentProps<typeof Badge>>>(() => {
    switch (statusGroup) {
      case 'ACTIVE':
        return {
          color: 'success',
        };
      case 'PENDING':
        return {
          color: 'warning',
        };
      case 'ERROR':
        return {
          color: 'critical',
        };
      default:
        return {
          color: 'information',
        };
    }
  }, [statusGroup]);

  return (
    <Badge {...chipAttribute} className="w-fit" size="sm" label={status} />
  );
}

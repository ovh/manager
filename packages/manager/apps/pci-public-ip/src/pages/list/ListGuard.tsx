import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OsdsSpinner } from '@ovhcloud/ods-components/react';
import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { useAllFailoverIPs } from '@/api/hooks/useFailoverIP';
import { useAllFloatingIP } from '@/api/hooks/useFloatingIP';
import { useAllBasicIp } from '@/api/hooks/useBasicIp';
import { useOrderStore } from '@/hooks/order/useStore';
import { useRepricing } from '@/hooks/useRepricing';

export default function ListGuard({
  projectId,
  children,
}: {
  projectId: string;
  children: JSX.Element;
}): JSX.Element {
  const navigate = useNavigate();
  const [isValid, setIsValid] = useState(false);
  const { floatingIpCreation } = useOrderStore();

  const {
    data: failoverIPs,
    isLoading: isFailoverIPsLoading,
  } = useAllFailoverIPs(projectId);

  const {
    data: floatingIPs,
    isLoading: isFloatingIPsLoading,
  } = useAllFloatingIP(projectId);

  const { isRepricingEnabled } = useRepricing();
  const { data: basicIPs, isLoading: isBasicIPsLoading } = useAllBasicIp(
    projectId,
    isRepricingEnabled,
  );

  useEffect(() => {
    if (!isFailoverIPsLoading && !isFloatingIPsLoading && !isBasicIPsLoading) {
      if (
        floatingIpCreation ||
        failoverIPs?.length > 0 ||
        floatingIPs?.length > 0 ||
        basicIPs?.length > 0
      ) {
        setIsValid(true);
      } else {
        navigate(`/pci/projects/${projectId}/public-ips/onboarding`);
      }
    }
  }, [
    navigate,
    failoverIPs,
    floatingIPs,
    basicIPs,
    isFailoverIPsLoading,
    isFloatingIPsLoading,
    isBasicIPsLoading,
  ]);

  return isValid ? (
    children
  ) : (
    <OsdsSpinner inline={true} size={ODS_SPINNER_SIZE.md} />
  );
}

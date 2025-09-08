import React, { useContext, useEffect } from 'react';
import { LogsToCustomerModule } from '@ovh-ux/logs-to-customer';
import { useFeatureAvailability } from '@ovh-ux/manager-react-components';
import { useParams } from 'react-router-dom';
import { OdsSpinner } from '@ovhcloud/ods-components/react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { FEATURES } from '@/utils/features.constant';
import { useVmwareVsphere } from '@/data/hooks/useVmwareVsphere';
import LogsOnboarding from './LogsOnboarding.component';

const LogsPage: React.FC = () => {
  const { serviceName } = useParams();
  const { data: vmwareVsphere, isLoading: isLoadingVsphere } = useVmwareVsphere(
    serviceName,
  );
  const { data: features, isLoading } = useFeatureAvailability([FEATURES.LOGS]);
  const isLogDisabled = Boolean(features && !features[FEATURES.LOGS]);
  const {
    shell: { navigation },
  } = useContext(ShellContext);

  const isAccessNotAllowed =
    (!isLoadingVsphere && !vmwareVsphere) || (!isLoading && isLogDisabled);

  useEffect(() => {
    const loadLegacyApp = async () => {
      const legacyAppUrl = (await navigation.getURL(
        'dedicated',
        `#/dedicated_cloud/${vmwareVsphere.data.serviceName ?? ''}`,
        {},
      )) as string;
      window.location.href = legacyAppUrl;
    };
    if (vmwareVsphere && isAccessNotAllowed) {
      loadLegacyApp();
    }
  }, [navigation, vmwareVsphere, isAccessNotAllowed]);

  if (isLoadingVsphere || isLoading || isAccessNotAllowed) {
    return (
      <div className="flex pt-10">
        <OdsSpinner />
      </div>
    );
  }

  return (
    <LogsOnboarding>
      <div className="flex flex-col gap-4">
        <LogsToCustomerModule
          logApiVersion="v6"
          logApiUrls={{
            logKind: `/dedicatedCloud/${serviceName}/log/kind`,
            logSubscription: `/dedicatedCloud/${serviceName}/log/subscription`,
            logUrl: `/dedicatedCloud/${serviceName}/log/url`,
          }}
          logIamActions={{
            postSubscription: [
              'pccVMware:apiovh:log/subscription/create',
              'ldp:apiovh:output/graylog/stream/forwardTo',
            ],
            deleteSubscription: ['pccVMware:apiovh:log/subscription/delete'],
          }}
          resourceURN={vmwareVsphere.data.iam.urn}
          trackingOptions={{ trackingSuffix: 'managed-vmware' }}
        />
      </div>
    </LogsOnboarding>
  );
};

export default LogsPage;

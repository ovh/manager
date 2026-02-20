import React, { useContext } from 'react';

import { useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { OdsButton } from '@ovhcloud/ods-components/react';
import { BUTTON_SIZE, BUTTON_VARIANT, ICON_NAME } from '@ovhcloud/ods-react';

import { LogsToCustomerModule } from '@ovh-ux/logs-to-customer';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

import Loading from '@/components/loading/Loading.component';
import { useGetHostingService } from '@/data/hooks/webHostingDashboard/useWebHostingDashboard';
import { useHostingUrl } from '@/hooks/useHostingUrl';

export default function LogsPage() {
  const { serviceName } = useParams<{ serviceName: string }>();
  const { data: hosting, isPending } = useGetHostingService(serviceName || '');
  const { environment } = useContext(ShellContext);
  const region = environment.getRegion().toLowerCase();
  const generalUrl = useHostingUrl(serviceName || '');
  const { t } = useTranslation('dashboard');

  if (isPending) {
    return <Loading />;
  }

  if (!hosting || !serviceName) {
    return null;
  }

  const resourceURN = hosting.iam?.urn || `urn:v1:${region}:resource:webHosting:${serviceName}`;

  return (
    <div className="flex flex-col gap-4">
      {generalUrl && (
        <OdsButton
          icon={ICON_NAME.arrowLeft}
          iconAlignment="left"
          size={BUTTON_SIZE.sm}
          variant={BUTTON_VARIANT.outline}
          label={t('hosting_logs_back_to_general')}
          className="[&::part(button)]:border-none"
          onClick={() => {
            window.location.href = generalUrl;
          }}
        />
      )}
      <LogsToCustomerModule
        logApiVersion="v6"
        logApiUrls={{
          logKind: `/hosting/web/${serviceName}/log/kind`,
          logSubscription: `/hosting/web/${serviceName}/log/subscription`,
          logUrl: `/hosting/web/${serviceName}/log/url`,
        }}
        logIamActions={{
          postSubscription: ['hosting:apiovh:log/subscription/create'],
          deleteSubscription: ['hosting:apiovh:log/subscription/delete'],
        }}
        resourceURN={resourceURN}
        trackingOptions={{ trackingSuffix: 'web-hosting' }}
      />
    </div>
  );
}

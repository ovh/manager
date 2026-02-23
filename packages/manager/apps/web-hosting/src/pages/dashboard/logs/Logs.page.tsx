import React from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { BUTTON_SIZE, BUTTON_VARIANT, Button, ICON_NAME, Icon } from '@ovhcloud/ods-react';

import { LogsToCustomerModule } from '@ovh-ux/logs-to-customer';

import Loading from '@/components/loading/Loading.component';
import { useGetHostingService } from '@/data/hooks/webHostingDashboard/useWebHostingDashboard';

export default function LogsPage() {
  const { serviceName } = useParams<{ serviceName: string }>();
  const { data: hosting, isPending } = useGetHostingService(serviceName || '');
  const navigate = useNavigate();
  const { t } = useTranslation('dashboard');

  if (isPending) {
    return <Loading />;
  }

  if (!hosting || !serviceName) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-start">
        <Button
          size={BUTTON_SIZE.sm}
          variant={BUTTON_VARIANT.ghost}
          onClick={() => {
            navigate(-1);
          }}
        >
          <Icon name={ICON_NAME.arrowLeft} className="mr-2" />
          {t('hosting_logs_back_to_previous_page')}
        </Button>
      </div>
      <LogsToCustomerModule
        logApiVersion="v6"
        logApiUrls={{
          logKind: `/hosting/web/${serviceName}/log/kind`,
          logSubscription: `/hosting/web/${serviceName}/log/subscription`,
          logUrl: `/hosting/web/${serviceName}/log/url`,
        }}
        logIamActions={{
          postSubscription: [
            'webHosting:apiovh:log/subscription/create',
            'ldp:apiovh:output/graylog/stream/forwardTo',
          ],
          deleteSubscription: ['webHosting:apiovh:log/subscription/delete'],
        }}
        resourceURN={hosting.iam?.urn}
        trackingOptions={{ trackingSuffix: 'web-hosting' }}
      />
    </div>
  );
}

import React, { useState } from 'react';

import { Outlet, useParams } from 'react-router-dom';

import { Trans, useTranslation } from 'react-i18next';

import { ODS_ICON_NAME, ODS_MESSAGE_COLOR, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsLink, OdsMessage, OdsText } from '@ovhcloud/ods-components/react';

import {
  BaseLayout,
  Breadcrumb,
  Notifications,
  useFormatDate,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import { useNavigationGetUrl } from '@ovh-ux/manager-react-shell-client';

import Loading from '@/alldoms/components/loading/Loading';
import ServiceDetailDomains from '@/alldoms/components/service-detail/ServiceDetailDomains';
import ServiceDetailInformation from '@/alldoms/components/service-detail/ServiceDetailInformation';
import ServiceDetailSubscribing from '@/alldoms/components/service-detail/service-detail-subscribing/ServiceDetailSubscribing.component';
import { CANCEL_TERMINATE_URL } from '@/alldoms/constants';
import { LifecycleCapacitiesEnum } from '@/alldoms/enum/service.enum';
import { useGetAllDom } from '@/alldoms/hooks/data/useGetAllDom';
import appConfig from '@/web-domains.config';

export default function ServiceDetail() {
  const [isManualRenewMessage, setIsManualRenewMessage] = useState<boolean>(true);
  const { serviceName } = useParams<{ serviceName: string }>();
  const { t } = useTranslation(['allDom']);
  const { notifications } = useNotifications();
  const formatDate = useFormatDate();

  const header = {
    title: serviceName,
  };

  const { data: alldomService, isLoading } = useGetAllDom({
    serviceName,
  });

  const { data: url } = useNavigationGetUrl([
    appConfig.rootLabel,
    `/alldoms/${serviceName}/${CANCEL_TERMINATE_URL()}`,
    {},
  ]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <BaseLayout
      breadcrumb={<Breadcrumb rootLabel={t('title')} appName={appConfig.rootLabel} hideRootLabel />}
      header={header}
      message={notifications.length ? <Notifications /> : null}
    >
      <section>
        {alldomService.lifecycleCapacities.includes(
          LifecycleCapacitiesEnum.TerminateAtExpirationDate,
        ) &&
          isManualRenewMessage && (
            <OdsMessage
              color={ODS_MESSAGE_COLOR.warning}
              className="mb-8 w-full"
              isDismissible={true}
              onOdsRemove={() => setIsManualRenewMessage(false)}
            >
              <div className="flex flex-col gap-y-2">
                <OdsText preset={ODS_TEXT_PRESET.paragraph} className="text-warning">
                  <Trans
                    t={t}
                    i18nKey="allDom_detail_page_manuel_renew_warning"
                    values={{
                      expirationDate: formatDate({
                        date: alldomService.expirationDate,
                        format: 'PP',
                      }),
                    }}
                    components={{ strong: <strong /> }}
                  />
                </OdsText>
                <OdsLink
                  href={url as string}
                  label={t('allDom_detail_page_manuel_renew_warning_link')}
                  icon={ODS_ICON_NAME.arrowRight}
                  className="link-banner"
                />
              </div>
            </OdsMessage>
          )}
        <div className="grid grid-cols-1 gap-6 items-start mb-8 lg:grid-cols-2">
          <ServiceDetailInformation currentState={alldomService.currentState} />
          <ServiceDetailSubscribing alldomService={alldomService} />
        </div>
        <ServiceDetailDomains items={alldomService.currentState.domains} />
      </section>
      <Outlet />
    </BaseLayout>
  );
}

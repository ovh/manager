import {
  BaseLayout,
  Breadcrumb,
  Notifications,
  useFormatDate,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import React, { useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { OdsLink, OdsMessage, OdsText } from '@ovhcloud/ods-components/react';
import {
  ODS_ICON_NAME,
  ODS_MESSAGE_COLOR,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import appConfig from '@/web-domains.config';
import ServiceDetailDomains from '@/alldoms/components/ServiceDetail/ServiceDetailDomains';
import ServiceDetailInformation from '@/alldoms/components/ServiceDetail/ServiceDetailInformation';
import ServiceDetailSubscribing from '@/alldoms/components/ServiceDetail/ServiceDetailSubscribing/ServiceDetailSubscribing.component';
import { useGetAllDom } from '@/alldoms/hooks/data/useGetAllDom';
import Loading from '@/alldoms/components/Loading/Loading';
import { LifecycleCapacitiesEnum } from '@/alldoms/enum/service.enum';

export default function ServiceDetail() {
  const [isManualRenewMessage, setIsManualRenewMessage] = useState<boolean>(
    true,
  );
  const { serviceName } = useParams<{ serviceName: string }>();
  const { t } = useTranslation(['allDom', 'web-domains/error']);
  const { notifications } = useNotifications();
  const formatDate = useFormatDate();

  const header = {
    title: serviceName,
  };

  const { data: alldomService, isLoading } = useGetAllDom({
    serviceName,
  });

  if (isLoading) {
    return <Loading />;
  }

  return (
    <BaseLayout
      breadcrumb={
        <Breadcrumb
          rootLabel={t('title')}
          appName={appConfig.rootLabel}
          hideRootLabel
        />
      }
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
                <OdsText
                  preset={ODS_TEXT_PRESET.paragraph}
                  className="text-warning"
                >
                  <Trans
                    t={t}
                    i18nKey="allDom_detail_page_manuel_renew_warning"
                    values={{
                      t0: formatDate({
                        date: alldomService.expirationDate,
                        format: 'PP',
                      }),
                    }}
                    components={{ strong: <strong /> }}
                  />
                </OdsText>
                <OdsLink
                  href={``} // Currently empty for a future
                  label={t('allDom_detail_page_manuel_renew_warning_link')}
                  icon={ODS_ICON_NAME.arrowRight}
                  target="_blank"
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

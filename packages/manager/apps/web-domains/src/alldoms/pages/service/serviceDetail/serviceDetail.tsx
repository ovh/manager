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
import ServiceDetailSubscribing from '@/alldoms/components/ServiceDetail/ServiceDetailSubscribing';
import { useGetAllDom } from '@/alldoms/hooks/data/useGetAllDom';
import Loading from '@/alldoms/components/Loading/Loading';
import { ServiceInfoRenewMode } from '@/alldoms/enum/service.enum';

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

  const { data: serviceInfoDetail, isLoading } = useGetAllDom({
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
        {serviceInfoDetail.serviceInfo.billing.renew.current.mode ===
          ServiceInfoRenewMode.Manual &&
          isManualRenewMessage && (
            <OdsMessage
              color={ODS_MESSAGE_COLOR.warning}
              className="mb-8"
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
                        date:
                          serviceInfoDetail.serviceInfo.billing.expirationDate,
                        format: 'PP',
                      }),
                    }}
                    components={{ strong: <strong /> }}
                  />
                </OdsText>
                <OdsLink
                  href={`https://www.ovh.com/cgi-bin/order/renew.cgi?domainChooser=${serviceName}`}
                  label={t('allDom_detail_page_manuel_renew_warning_link')}
                  icon={ODS_ICON_NAME.arrowRight}
                  target="_blank"
                />
              </div>
            </OdsMessage>
          )}
        <div className="grid grid-cols-1 gap-6 items-start mb-8 lg:grid-cols-2">
          <ServiceDetailInformation
            allDomProperty={serviceInfoDetail.allDomProperty}
            extensionsList={
              serviceInfoDetail.domainAttached.currentState.extensions
            }
            status={serviceInfoDetail.serviceInfo.billing.renew.current.mode}
          />
          <ServiceDetailSubscribing serviceInfoDetail={serviceInfoDetail} />
        </div>
        <ServiceDetailDomains
          items={serviceInfoDetail.domainAttached.currentState.domains}
        />
      </section>
      <Outlet />
    </BaseLayout>
  );
}

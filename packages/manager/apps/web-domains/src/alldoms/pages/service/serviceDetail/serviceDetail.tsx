import {
  BaseLayout,
  Breadcrumb,
  Notifications,
  useFormatDate,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import React, { useState } from 'react';
import {
  Outlet,
  useParams,
  useNavigate,
  Link as RouterLink,
} from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  Icon,
  ICON_NAME,
  Message,
  MESSAGE_COLOR,
  MessageIcon,
  Text,
  TEXT_PRESET,
  Link as OdsLink,
} from '@ovhcloud/ods-react';
import ServiceDetailDomains from '@/alldoms/components/ServiceDetail/ServiceDetailDomains';
import ServiceDetailInformation from '@/alldoms/components/ServiceDetail/ServiceDetailInformation';
import ServiceDetailSubscribing from '@/alldoms/components/ServiceDetail/ServiceDetailSubscribing/ServiceDetailSubscribing.component';
import { useGetAllDom } from '@/alldoms/hooks/data/useGetAllDom';
import Loading from '@/alldoms/components/loading/Loading';
import { CANCEL_TERMINATE_URL } from '@/alldoms/constants';
import { hasTerminateAtExpirationDateAction } from '@/alldoms/utils/utils';
import { urls } from '@/alldoms/routes/routes.constant';
import appConfig from '@/web-domains.config';
import { useGetServices } from '@/alldoms/hooks/data/useGetServices';
import { ServiceRoutes } from '@/alldoms/enum/service.enum';

export default function ServiceDetail() {
  const [isManualRenewMessage, setIsManualRenewMessage] = useState<boolean>(
    true,
  );
  const { serviceName } = useParams<{ serviceName: string }>();
  const { t } = useTranslation(['allDom', NAMESPACES.ACTIONS]);
  const { notifications } = useNotifications();
  const formatDate = useFormatDate();
  const navigate = useNavigate();

  const header = {
    title: serviceName,
  };

  const { data: alldom, isLoading } = useGetAllDom({
    serviceName,
  });

  const {
    data: domainServiceList,
    listLoading: domainServiceListLoading,
  } = useGetServices({
    names: alldom?.currentState?.domains.map((domain) => domain.name),
    serviceRoute: ServiceRoutes.Domain,
  });

  const alldomService = alldom;
  if (
    !isLoading &&
    alldomService &&
    !domainServiceListLoading &&
    domainServiceList
  ) {
    alldomService.currentState.domains.forEach((domain) => {
      const service = domainServiceList.find(
        (s) => s.resource.name === domain.name,
      );
      if (service?.billing?.expirationDate) {
        return {
          ...domain,
          expiresAt: service.billing.expirationDate,
        };
      }
      return domain;
    });
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <BaseLayout
      header={header}
      message={notifications.length ? <Notifications /> : null}
      onClickReturn={() => navigate(urls.alldomsRoot)}
      backLinkLabel={t(`${NAMESPACES.ACTIONS}:back_to_list`)}
      breadcrumb={
        <Breadcrumb
          rootLabel={t('title')}
          appName={appConfig.rootLabel}
          hideRootLabel
        />
      }
    >
      <section>
        {hasTerminateAtExpirationDateAction(alldomService.pendingActions) &&
          isManualRenewMessage && (
            <Message
              color={MESSAGE_COLOR.warning}
              className="mb-8 w-full"
              dismissible={true}
              onRemove={() => setIsManualRenewMessage(false)}
            >
              <MessageIcon name={ICON_NAME.triangleExclamation} />
              <div className="flex flex-col gap-y-2">
                <Text
                  preset={TEXT_PRESET.paragraph}
                  className="text-[var(--ods-color-warning-700)]"
                >
                  <Trans
                    t={t}
                    i18nKey="allDom_detail_page_manuel_renew_warning"
                    values={{
                      expirationDate: formatDate({
                        date: alldomService.expirationDate,
                        format: 'PPP',
                      }),
                    }}
                    components={{ strong: <span className="font-bold" /> }}
                  />
                </Text>
                <OdsLink
                  as={RouterLink}
                  to={`/alldoms/${serviceName}/${CANCEL_TERMINATE_URL()}`}
                >
                  <Icon name={ICON_NAME.arrowRight} />
                  {t('allDom_detail_page_manuel_renew_warning_link')}
                </OdsLink>
              </div>
            </Message>
          )}
        <div className="grid grid-cols-1 gap-6 items-start mb-8 lg:grid-cols-2">
          <ServiceDetailInformation currentState={alldomService.currentState} />
          <ServiceDetailSubscribing alldomService={alldomService} />
        </div>
        <ServiceDetailDomains
          alldomTerminated={hasTerminateAtExpirationDateAction(
            alldomService.pendingActions,
          )}
          items={alldomService.currentState.domains}
        />
      </section>
      <Outlet />
    </BaseLayout>
  );
}

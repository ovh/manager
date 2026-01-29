import { useGetEnvironmentData } from '@/common/hooks/environment/data';
import {
  ServiceInfoContactEnum,
  ServiceRoutes,
} from '@/common/enum/common.enum';
import { useGetServiceInformationByRoutes } from '@/common/hooks/data/query';
import { findContact, handleOrderClick } from '@/common/utils/utils';
import GeneralInformation from '@/domain-reseller/components/Dashboard/GeneralInformation';
import { useGetDomainsList } from '@/domain-reseller/hooks/data/query';
import Loading from '@/domain/components/Loading/Loading';
import { getOrderURL } from '@ovh-ux/manager-module-order';
import { BaseLayout } from '@ovh-ux/muk';
import {
  Button,
  BUTTON_VARIANT,
  Icon,
  ICON_NAME,
  Message,
  MESSAGE_COLOR,
  MessageBody,
  MessageIcon,
} from '@ovhcloud/ods-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export default function DomainResellerDashboard() {
  const { t } = useTranslation('domain-reseller');
  const { region, ovhSubsidiary } = useGetEnvironmentData();
  const orderUrl = getOrderURL('orderDomain', region, ovhSubsidiary);
  const header = {
    title: t('domain_reseller_title'),
  };
  const {
    serviceInfo,
    isServiceInfoLoading,
  } = useGetServiceInformationByRoutes(ServiceRoutes.DomainReseller);

  const nicAdmin = useMemo(() => {
    if (!serviceInfo?.customer?.contacts) return undefined;
    return findContact(
      serviceInfo.customer.contacts,
      ServiceInfoContactEnum.Administrator,
    );
  }, [serviceInfo]);

  const { data: domainslist = [], isLoading } = useGetDomainsList(
    nicAdmin,
  );

  if (isServiceInfoLoading || isLoading) {
    return <Loading />;
  }

  return (
    <BaseLayout header={header}>
      <Message
        className="w-full mb-6"
        dismissible={false}
        color={MESSAGE_COLOR.information}
      >
        <MessageIcon name={ICON_NAME.circleInfo} />
        <MessageBody className="flex flex-col">
          <span className="font-bold">
            {t('domain_reseller_message_title')}
          </span>
          {t('domain_reseller_message_text')}
        </MessageBody>
      </Message>
      <section>
        <div className="flex items-center gap-x-4 mb-6">
          <Button onClick={() => handleOrderClick(orderUrl)}>
            {t('domain_reseller_button_add_domain')}
          </Button>
          {/* The button is not usable for the moment, waiting for order API */}
          <Button variant={BUTTON_VARIANT.outline}>
            {t('domain_reseller_button_download_catalog')}
            <Icon name={ICON_NAME.download} />
          </Button>
        </div>
        <div className="grid grid-cols-1 md:!grid-cols-2">
          <GeneralInformation domainsLength={domainslist?.length} />
        </div>
      </section>
    </BaseLayout>
  );
}

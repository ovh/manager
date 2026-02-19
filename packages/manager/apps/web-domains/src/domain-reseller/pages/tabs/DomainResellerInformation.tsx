import {
  Button,
  BUTTON_SIZE,
  ICON_NAME,
  Message,
  MESSAGE_COLOR,
  MessageBody,
  MessageIcon,
} from '@ovhcloud/ods-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ServiceInfoContactEnum,
  ServiceRoutes,
} from '@/common/enum/common.enum';
import { useGetServiceInformationByRoutes } from '@/common/hooks/data/query';
import { findContact, handleOrderClick } from '@/common/utils/utils';
import GeneralInformation from '@/domain-reseller/components/Dashboard/GeneralInformation';
import Subscription from '@/domain-reseller/components/Dashboard/Subscription';
import Loading from '@/domain/components/Loading/Loading';
import { getOrderURL } from '@ovh-ux/manager-module-order';
import { useGetEnvironmentData } from '@/common/hooks/environment/data';
import { useGetDomainsListByResellerNicAdmin } from '@/domain-reseller/hooks/data/query';

export default function DomainResellerInformation() {
  const { t } = useTranslation('domain-reseller');
  const { region, ovhSubsidiary } = useGetEnvironmentData();
  const orderUrl = getOrderURL('orderDomain', region, ovhSubsidiary);
  const {
    serviceInfo,
    isServiceInfoLoading,
  } = useGetServiceInformationByRoutes(ServiceRoutes.DomainReseller);

  const resellerNicAdmin = useMemo(() => {
    if (!serviceInfo?.customer?.contacts) return undefined;
    return findContact(
      serviceInfo.customer.contacts,
      ServiceInfoContactEnum.Administrator,
    );
  }, [serviceInfo]);

  const {
    data: domainslist = [],
    isLoading,
  } = useGetDomainsListByResellerNicAdmin(resellerNicAdmin);

  if (isServiceInfoLoading || isLoading) {
    return <Loading />;
  }
  return (
    <section data-testid="domain-reseller-informations">
      <Message
        className="w-full mb-6"
        dismissible={false}
        color={MESSAGE_COLOR.information}
        data-testid="info-message"
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
          <Button
            onClick={() => handleOrderClick(orderUrl)}
            data-testid="add-domain-button"
            size={BUTTON_SIZE.sm}
          >
            {t('domain_reseller_order_domain')}
          </Button>
        </div>
        <div
          className="grid grid-cols-1 gap-x-6 md:!grid-cols-2"
          data-testid="dashboard-grid"
        >
          <GeneralInformation domainsLength={domainslist.length} />
          <Subscription
            creationDate={
              serviceInfo?.billing?.lifecycle?.current?.creationDate
            }
            expirationDate={serviceInfo?.billing?.expirationDate}
            contacts={serviceInfo?.customer?.contacts}
            serviceName={serviceInfo?.resource?.name}
          />
        </div>
      </section>
    </section>
  );
}

import { useParams } from 'react-router-dom';
import { Spinner, SPINNER_SIZE, TEXT_PRESET, Text } from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import { useGetServiceInformation } from '@/common/hooks/data/query';
import {
  ServiceInfoContactEnum,
  ServiceRoutes,
} from '@/common/enum/common.enum';
import HolderCard from '@/domain/components/ContactCards/HolderCard';
import NichandleCard from '@/domain/components/ContactCards/NichandleCard';
import { findContact } from '@/common/utils/utils';

export default function ContactManagement() {
  const { t } = useTranslation('domain');
  const { serviceName } = useParams<{ serviceName: string }>();
  const { serviceInfo, isServiceInfoLoading } = useGetServiceInformation(
    'domain',
    serviceName,
    ServiceRoutes.Domain,
  );

  if (isServiceInfoLoading || !serviceInfo) {
    return <Spinner size={SPINNER_SIZE.xs} />;
  }

  const administratorContact = findContact(
    serviceInfo?.customer?.contacts,
    ServiceInfoContactEnum.Administrator,
  );

  return (
    <div>
      <Text preset={TEXT_PRESET.heading2} className="pb-8">
        {t('domain_tab_contact_management_tile_title')}
      </Text>
      <Text preset={TEXT_PRESET.heading6} className="pb-4">
        {t('domain_tab_contact_management_tile_subtitle')}
      </Text>
      <Text preset={TEXT_PRESET.paragraph} className="pb-4">
        {t('domain_tab_contact_management_configuration_information')}
      </Text>
      <div
        className="grid grid-cols-3 grid-rows-2 gap-6"
        data-testid={'contact-management-grid'}
      >
        <div className="row-span-1">
          <HolderCard
            serviceName={serviceName}
            administratorContact={administratorContact}
          />
        </div>
        <div className="row-span-1 col-start-2 row-start-1">
          <NichandleCard
            serviceName={serviceName}
            cardType={ServiceInfoContactEnum.Administrator}
            nichandle={administratorContact}
          />
        </div>
        <div className="row-span-1 col-start-3 row-start-1">
          <NichandleCard
            serviceName={serviceName}
            cardType={ServiceInfoContactEnum.Technical}
            nichandle={findContact(
              serviceInfo?.customer?.contacts,
              ServiceInfoContactEnum.Technical,
            )}
          />
        </div>
        <div className="row-span-1 col-start-1 row-start-2">
          <NichandleCard
            serviceName={serviceName}
            cardType={ServiceInfoContactEnum.Billing}
            nichandle={findContact(
              serviceInfo?.customer?.contacts,
              ServiceInfoContactEnum.Billing,
            )}
          />
        </div>
      </div>
    </div>
  );
}

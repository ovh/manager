import { useParams } from 'react-router-dom';
import { Spinner, SPINNER_SIZE, TEXT_PRESET, Text } from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import { useGetServiceInformation } from '@/common/hooks/data/query';
import {
  ServiceInfoContactEnum,
  ServiceRoutes,
} from '@/common/enum/common.enum';
import { useNichandleInformations } from '@/common/hooks/nichandle/useNichandleInformations';
import HolderCards from '@/domain/components/ContactCards/HolderCards';
import NichandleCards from '@/domain/components/ContactCards/NichandleCards';
import { findContact } from '@/common/utils/utils';

export default function ContactManagement() {
  const { t } = useTranslation('domain');
  const { serviceName } = useParams<{ serviceName: string }>();
  const { nichandleInformations } = useNichandleInformations();
  const { serviceInfo, isServiceInfoLoading } = useGetServiceInformation(
    serviceName,
    ServiceRoutes.Domain,
  );

  if (isServiceInfoLoading || !nichandleInformations || !serviceInfo) {
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
          <HolderCards
            serviceName={serviceName}
            isAdminConnected={
              administratorContact === nichandleInformations.nichandle
            }
          />
        </div>
        <div className="row-span-1 col-start-2 row-start-1">
          <NichandleCards
            serviceName={serviceName}
            administratorNichandle={administratorContact}
            cardType={ServiceInfoContactEnum.Administrator}
            nichandle={administratorContact}
            nichandleInformations={nichandleInformations}
          />
        </div>
        <div className="row-span-1 col-start-3 row-start-1">
          <NichandleCards
            serviceName={serviceName}
            administratorNichandle={administratorContact}
            cardType={ServiceInfoContactEnum.Technical}
            nichandle={findContact(
              serviceInfo?.customer?.contacts,
              ServiceInfoContactEnum.Technical,
            )}
            nichandleInformations={nichandleInformations}
          />
        </div>
        <div className="row-span-1 col-start-1 row-start-2">
          <NichandleCards
            serviceName={serviceName}
            administratorNichandle={administratorContact}
            cardType={ServiceInfoContactEnum.Billing}
            nichandle={findContact(
              serviceInfo?.customer?.contacts,
              ServiceInfoContactEnum.Billing,
            )}
            nichandleInformations={nichandleInformations}
          />
        </div>
      </div>
    </div>
  );
}

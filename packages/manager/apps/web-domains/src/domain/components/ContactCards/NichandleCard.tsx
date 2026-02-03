import { useTranslation } from 'react-i18next';
import {
  Card,
  CARD_COLOR, TEXT_PRESET,
  Text,
  BUTTON_SIZE,
  Button,
  BUTTON_VARIANT
} from '@ovhcloud/ods-react';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useNavigation } from '@ovh-ux/manager-react-shell-client';
import { ServiceInfoContactEnum } from '@/common/enum/common.enum';
import NichandleInformation from './NichandleInformation';
import { useGetConnectedNichandleId } from '@/common/hooks/nichandle/useGetConnectedNichandleId';

interface NichandleCardProps {
  readonly serviceName: string;
  readonly cardType: ServiceInfoContactEnum;
  readonly nichandle: string;
}

interface ServiceInfoContactContactTranslations {
  [ServiceInfoContactEnum.Administrator]: {
    title: string;
    description: string;
  };
  [ServiceInfoContactEnum.Technical]: {
    title: string;
    description: string;
  };
  [ServiceInfoContactEnum.Billing]: {
    title: string;
    description: string;
  };
}

export default function NichandleCard({
  serviceName,
  cardType,
  nichandle,
}: NichandleCardProps) {
  const { t } = useTranslation(['domain', NAMESPACES.ACTIONS]);
  const { navigateTo } = useNavigation();
  const { nichandle: connectedNichandle } = useGetConnectedNichandleId();

  const translations: ServiceInfoContactContactTranslations = {
    [ServiceInfoContactEnum.Administrator]: {
      title: t('domain_tab_contact_management_admin_title'),
      description: t('domain_tab_contact_management_admin_description'),
    },
    [ServiceInfoContactEnum.Technical]: {
      title: t('domain_tab_contact_management_tech_title'),
      description: t('domain_tab_contact_management_tech_description'),
    },
    [ServiceInfoContactEnum.Billing]: {
      title: t('domain_tab_contact_management_billing_title'),
      description: t('domain_tab_contact_management_billing_description'),
    },
  };

  return (
    <Card
      data-testid="nichandle-card"
      className="flex w-full flex-col h-full p-6 justify-between"
      color={CARD_COLOR.neutral}
    >
      <div className="flex flex-col gap-y-6 mb-6 text-[--ods-color-heading]">
        <Text preset={TEXT_PRESET.heading4}>
          {translations[cardType].title} ({nichandle})
        </Text>
        <NichandleInformation
          nichandle={nichandle}
        />
        <div>{translations[cardType].description}</div>
      </div>
      <div className="flex gap-4">
        <Button
          size={BUTTON_SIZE.sm}
          data-testid="modify-button"
          disabled={connectedNichandle !== nichandle}
          onClick={() => navigateTo('account', '/useraccount/infos', {})}
        >
          {t(`${NAMESPACES.ACTIONS}:modify`)}
        </Button>
        <Button
          size={BUTTON_SIZE.sm}
          data-testid="reassign-button"
          disabled={connectedNichandle !== nichandle}
          onClick={() =>
            navigateTo('account', '/contacts/services/edit', {
              serviceName,
              category: 'DOMAIN',
              service: serviceName,
              categoryType: 'DOMAIN',
            })
          }
          variant={BUTTON_VARIANT.ghost}
        >
          {t('domain_tab_contact_management_button_reassign')}
        </Button>
      </div>
    </Card>
  );
}

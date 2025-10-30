import { useTranslation } from 'react-i18next';
import { User } from '@ovh-ux/manager-config/dist/types/environment/user';
import {
  Card,
  CARD_COLOR,
  Spinner,
  SPINNER_SIZE,
  TEXT_PRESET,
  Text,
  BUTTON_SIZE,
  Button,
  BUTTON_VARIANT,
} from '@ovhcloud/ods-react';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useNavigationGetUrl } from '@ovh-ux/manager-react-shell-client';
import { useNavigate } from 'react-router-dom';
import { ServiceInfoContactEnum } from '@/common/enum/common.enum';
import NichandleInformation from './NichandleInformation';
import { useNichandleInformation } from '@/common/hooks/nichandle/useNichandleInformation';

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
  const navigate = useNavigate();
  const { nichandleInformation } = useNichandleInformation();

  const { data: reassignContactUrl } = useNavigationGetUrl([
    'account',
    '/contacts/services/edit',
    {
      serviceName,
      category: 'DOMAIN',
      service: serviceName,
      categoryType: 'DOMAIN',
    },
  ]);
  const { data: accountUrl } = useNavigationGetUrl([
    'account',
    '/useraccount/infos',
    {},
  ]);

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

  if (!nichandleInformation) {
    return <Spinner size={SPINNER_SIZE.xs} />;
  }

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
          nichandleInformation={nichandleInformation}
        />
        <div>{translations[cardType].description}</div>
      </div>
      <div className="flex gap-4">
        <Button
          size={BUTTON_SIZE.sm}
          data-testid="modify-button"
          disabled={nichandleInformation.nichandle !== nichandle}
          onClick={() => navigate(accountUrl)}
        >
          {t(`${NAMESPACES.ACTIONS}:modify`)}
        </Button>
        <Button
          size={BUTTON_SIZE.sm}
          data-testid="reassign-button"
          disabled={nichandleInformation.nichandle !== nichandle}
          onClick={() => navigate(reassignContactUrl)}
          variant={BUTTON_VARIANT.ghost}
        >
          {t('domain_tab_contact_management_button_reassign')}
        </Button>
      </div>
    </Card>
  );
}

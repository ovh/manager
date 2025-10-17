import { useTranslation } from 'react-i18next';
import { User } from '@ovh-ux/manager-config/dist/types/environment/user';
import {
  Button,
  BUTTON_SIZE,
  BUTTON_VARIANT,
  Card,
  CARD_COLOR,
  Spinner,
  SPINNER_SIZE,
  TEXT_PRESET,
  Text,
} from '@ovhcloud/ods-react';
import { useNavigate } from 'react-router-dom';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useNavigationGetUrl } from '@ovh-ux/manager-react-shell-client';
import {
  LegalFormEnum,
  ServiceInfoContactEnum,
} from '@/common/enum/common.enum';

interface NichandleCardsProps {
  readonly serviceName: string;
  readonly administratorNichandle: string;
  readonly cardType: ServiceInfoContactEnum;
  readonly nichandle: string;
  readonly nichandleInformations: User;
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

export default function NichandleCards({
  serviceName,
  administratorNichandle,
  cardType,
  nichandle,
  nichandleInformations,
}: NichandleCardsProps) {
  const { t } = useTranslation(['domain', NAMESPACES.ACTIONS]);
  const navigate = useNavigate();

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

  if (!nichandleInformations) {
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
        <ul className="list-none p-0 m-0 font-bold">
          {nichandle === nichandleInformations.nichandle && [
            nichandleInformations.legalform !== LegalFormEnum.Individual && (
              <li key={'organisation'}>
                {nichandleInformations.organisation}{' '}
                {nichandleInformations.corporationType}
              </li>
            ),
            <li key={'name'}>
              {nichandleInformations.firstname} {nichandleInformations.name}
            </li>,
            <li key={'adress'}>
              {nichandleInformations.address}{' '}
              {nichandleInformations.complementaryAddress}{' '}
              {nichandleInformations.zip} {nichandleInformations.country}
            </li>,
            <li key={'email'}>{nichandleInformations.email}</li>,
            <li key={'phone'}>{nichandleInformations.phone}</li>,
            nichandleInformations.legalform !== LegalFormEnum.Individual && [
              <li key={'nat'}>
                {nichandleInformations.nationalIdentificationNumber}
              </li>,
              <li key={'cnat'}>
                {nichandleInformations.companyNationalIdentificationNumber}
              </li>,
              <li key={'vat'}>{nichandleInformations.vat}</li>,
            ],
          ]}
        </ul>
        <div>{translations[cardType].description}</div>
      </div>
      <div className="flex gap-4">
        <Button
          data-testid="modify-button"
          size={BUTTON_SIZE.sm}
          disabled={nichandle !== nichandleInformations.nichandle}
          onClick={() => navigate(accountUrl)}
        >
          {t(`${NAMESPACES.ACTIONS}:modify`)}
        </Button>
        <Button
          data-testid="reassign-button"
          variant={BUTTON_VARIANT.ghost}
          disabled={nichandle !== administratorNichandle}
          size={BUTTON_SIZE.sm}
          onClick={() => navigate(reassignContactUrl)}
        >
          {t('domain_tab_contact_management_button_reassign')}
        </Button>
      </div>
    </Card>
  );
}

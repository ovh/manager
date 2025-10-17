import { useTranslation } from 'react-i18next';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useNavigationGetUrl } from '@ovh-ux/manager-react-shell-client';
import { useNavigate } from 'react-router-dom';
import {
  useGetDomainContact,
  useGetDomainResource,
} from '@/domain/hooks/data/query';
import { TDomainContact } from '@/common/types/common.types';
import { LegalFormEnum } from '@/common/enum/common.enum';
import {
  Button,
  BUTTON_SIZE,
  Card,
  Spinner,
  SPINNER_SIZE,
  TEXT_PRESET,
  Text,
  MessageBody,
  Message,
} from '@ovhcloud/ods-react';

interface HolderCardsProps {
  readonly serviceName: string;
  readonly isAdminConnected: boolean;
}

export default function HolderCards({
  serviceName,
  isAdminConnected,
}: HolderCardsProps) {
  const { t } = useTranslation(['domain']);
  const navigate = useNavigate();
  const { domainResource } = useGetDomainResource(serviceName);

  const contactID =
    domainResource.currentState.contactsConfiguration.contactOwner.id;

  let editContactUrl: string = '';
  let domainContact: TDomainContact = null;

  if (isAdminConnected) {
    const { domainContact: dc } = useGetDomainContact(contactID);
    domainContact = dc;

    const { data: url } = useNavigationGetUrl([
      'web',
      `/domain/${serviceName}/contact-management/edit-contact/${contactID}/`,
      {},
    ]);
    editContactUrl = url as string;

    if (!domainContact) {
      return <Spinner size={SPINNER_SIZE.xs} />;
    }
  }

  return (
    <Card
      data-testid="holder-card"
      className="flex w-full flex-col h-full p-6 justify-between"
    >
      <div className="flex flex-col gap-y-6 mb-6 text-[--ods-color-heading]">
        <Text preset={TEXT_PRESET.heading4}>
          {t('domain_tab_contact_management_holder_title')}{' '}
          {isAdminConnected && `(${contactID})`}
        </Text>

        {!isAdminConnected && (
          <Message dismissible={false} className="mb-6 w-full">
            <MessageBody>
              {t(
                'domain_tab_contact_management_holder_placeholder_personal_informations',
              )}
            </MessageBody>
          </Message>
        )}
        <ul className="list-none p-0 m-0 font-bold">
          {isAdminConnected &&
            domainContact && [
              domainContact.legalForm !== LegalFormEnum.Individual && (
                <li key={'organisation'}>{domainContact.organisationName}</li>
              ),
              <li key={'name'}>
                {domainContact.firstName} {domainContact.lastName}
              </li>,
              <li key={'adress'}>
                {domainContact.address.line1} {domainContact.address.zip}{' '}
                {domainContact.address.city}
              </li>,
              <li key={'email'}>{domainContact.email}</li>,
              <li key={'phone'}>{domainContact.phone}</li>,
              domainContact.legalForm !== LegalFormEnum.Individual && [
                <li key={'organisation'}>
                  {domainContact.nationalIdentificationNumber}
                </li>,
                <li key={'vat'}>{domainContact.vat}</li>,
              ],
            ]}
        </ul>
        {t('domain_tab_contact_management_holder_description')}
      </div>
      <div className="flex gap-4">
        <Button
          size={BUTTON_SIZE.sm}
          disabled={!isAdminConnected}
          onClick={() => navigate(editContactUrl)}
        >
          {t(`${NAMESPACES.ACTIONS}:modify`)}
        </Button>
      </div>
    </Card>
  );
}

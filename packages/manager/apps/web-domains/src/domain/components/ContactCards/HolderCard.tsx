import { useTranslation } from 'react-i18next';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useNavigation } from '@ovh-ux/manager-react-shell-client';
import {
  Button,
  BUTTON_SIZE,
  Card,
  TEXT_PRESET,
  Text,
  MessageBody,
  Message,
} from '@ovhcloud/ods-react';
import { useGetDomainResource } from '@/domain/hooks/data/query';
import HolderInformation from './HolderInformation';
import { useGetConnectedNichandleId } from '@/common/hooks/nichandle/useGetConnectedNichandleId';

interface HolderCardProps {
  readonly serviceName: string;
  readonly administratorContact: string;
}

export default function HolderCard({
  serviceName,
  administratorContact,
}: HolderCardProps) {
  const { t } = useTranslation(['domain']);
  const { navigateTo } = useNavigation();
  const { domainResource } = useGetDomainResource(serviceName);
  const { nichandle: connectedNichandle } = useGetConnectedNichandleId();
  const isAuthorized = administratorContact === connectedNichandle;

  const contactID =
    domainResource.currentState.contactsConfiguration.contactOwner.id;

  return (
    <Card
      data-testid="holder-card"
      className="flex w-full flex-col h-full p-6 justify-between"
    >
      <div className="flex flex-col gap-y-6 mb-6 text-[--ods-color-heading]">
        <Text preset={TEXT_PRESET.heading4}>
          {t('domain_tab_contact_management_holder_title')}
          {isAuthorized && ` (${contactID})`}
        </Text>

        {isAuthorized ? (
          <HolderInformation contactID={contactID} />
        ) : (
          <Message dismissible={false} className="mb-6 w-full">
            <MessageBody>
              {t(
                'domain_tab_contact_management_holder_placeholder_personal_informations',
              )}
            </MessageBody>
          </Message>
        )}

        {t('domain_tab_contact_management_holder_description')}
      </div>
      <div className="flex gap-4">
        <Button
          size={BUTTON_SIZE.sm}
          disabled={!isAuthorized}
          onClick={() =>
            isAuthorized &&
            navigateTo(
              'web',
              `/domain/${serviceName}/contact-management/edit-contact/${contactID}/`,
              {},
            )
          }
        >
          {t(`${NAMESPACES.ACTIONS}:modify`)}
        </Button>
      </div>
    </Card>
  );
}

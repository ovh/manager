import { useTranslation } from 'react-i18next';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useNavigationGetUrl } from '@ovh-ux/manager-react-shell-client';
import { useNavigate } from 'react-router-dom';
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

interface HolderCardProps {
  readonly serviceName: string;
  readonly isAdminConnected: boolean;
}

export default function HolderCard({
  serviceName,
  isAdminConnected,
}: HolderCardProps) {
  const { t } = useTranslation(['domain']);
  const navigate = useNavigate();
  const { domainResource } = useGetDomainResource(serviceName);

  const contactID =
    domainResource.currentState.contactsConfiguration.contactOwner.id;

  const { data: editContactUrl } = useNavigationGetUrl([
    'web',
    `/domain/${serviceName}/contact-management/edit-contact/${contactID}/`,
    {},
  ]);

  return (
    <Card
      data-testid="holder-card"
      className="flex w-full flex-col h-full p-6 justify-between"
    >
      <div className="flex flex-col gap-y-6 mb-6 text-[--ods-color-heading]">
        <Text preset={TEXT_PRESET.heading4}>
          {t('domain_tab_contact_management_holder_title')}
          {isAdminConnected && ` (${contactID})`}
        </Text>

        {isAdminConnected ? (
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
          disabled={!isAdminConnected}
          onClick={() => navigate(editContactUrl)}
        >
          {t(`${NAMESPACES.ACTIONS}:modify`)}
        </Button>
      </div>
    </Card>
  );
}

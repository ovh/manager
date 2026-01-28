import { Dispatch, SetStateAction } from 'react';

import { useTranslation } from 'react-i18next';

import {
  Card,
  Checkbox,
  CheckboxControl,
  CheckboxLabel,
  FormField,
  Icon,
  Message,
  Text,
} from '@ovhcloud/ods-react';

import { MukLink } from '@/common/components/link/Link.component';

type CreateCredentialConfirmationPrivateKeyProps = {
  privateKey?: string;
  credentialId: string;
  isKeyDownloaded: boolean;
  setIsKeyDownloaded: Dispatch<SetStateAction<boolean>>;
};

export const CreateCredentialConfirmationPrivateKey = ({
  privateKey,
  credentialId,
  isKeyDownloaded,
  setIsKeyDownloaded,
}: CreateCredentialConfirmationPrivateKeyProps) => {
  const { t } = useTranslation('key-management-service/credential');

  if (!privateKey) {
    return null;
  }

  return (
    <Card className="p-4">
      <div className="flex w-full flex-col gap-4 md:gap-5">
        <Text preset="heading-3">
          {t('key_management_service_credential_create_confirmation_private-key_title')}
        </Text>
        <Message color="warning" dismissible={false}>
          {t('key_management_service_credential_create_confirmation_private-key_warn')}
        </Message>
        <MukLink
          href={`data:text/plain;charset=utf-8,${encodeURIComponent(
            privateKey.replace(/\n/g, '\r\n'),
          )}`}
          download={`${credentialId}_privatekey.pem`}
        >
          <>
            {t('key_management_service_credential_create_confirmation_private-key_download_label')}
            <Icon name="download" />
          </>
        </MukLink>
        <FormField>
          <Checkbox
            data-testid="confirmation-private-key"
            name="confirmation-private-key"
            checked={isKeyDownloaded}
            onCheckedChange={() => setIsKeyDownloaded(!isKeyDownloaded)}
          >
            <CheckboxControl />
            <CheckboxLabel data-testid="confirmation-private-key-label">
              <Text preset={'span'}>
                {t(
                  'key_management_service_credential_create_confirmation_private-key_checkbox_label',
                )}
              </Text>
            </CheckboxLabel>
          </Checkbox>
        </FormField>
      </div>
    </Card>
  );
};

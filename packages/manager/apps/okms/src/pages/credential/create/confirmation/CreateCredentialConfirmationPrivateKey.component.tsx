import React, { Dispatch, SetStateAction } from 'react';
import { Subtitle } from '@ovh-ux/manager-react-components';
import {
  ODS_ICON_NAME,
  ODS_LINK_COLOR,
  ODS_MESSAGE_COLOR,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import {
  OdsLink,
  OdsCheckbox,
  OdsMessage,
  OdsText,
  OdsCard,
  OdsFormField,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';

type CreateCredentialConfirmationPrivateKeyProps = {
  privateKey?: string;
  credentialId: string;
  isKeyDownloaded: boolean;
  setIsKeyDownloaded: Dispatch<SetStateAction<boolean>>;
};

const CreateCredentialConfirmationPrivateKey = ({
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
    <OdsCard className="p-4">
      <div className="flex flex-col w-full gap-4 md:gap-5">
        <Subtitle>
          {t(
            'key_management_service_credential_create_confirmation_private-key_title',
          )}
        </Subtitle>
        <OdsMessage color={ODS_MESSAGE_COLOR.warning} isDismissible={false}>
          {t(
            'key_management_service_credential_create_confirmation_private-key_warn',
          )}
        </OdsMessage>
        <OdsLink
          icon={ODS_ICON_NAME.download}
          color={ODS_LINK_COLOR.primary}
          href={`data:text/plain;charset=utf-8,${encodeURIComponent(
            privateKey.replace(/\n/g, '\r\n'),
          )}`}
          download={`${credentialId}_privatekey.pem`}
          label={t(
            'key_management_service_credential_create_confirmation_private-key_download_label',
          )}
        />
        <OdsFormField className="flex flex-row items-center">
          <OdsCheckbox
            data-testid="confirmation-private-key"
            name="confirmation-private-key"
            inputId="confirmation-private-key"
            isChecked={isKeyDownloaded}
            onOdsChange={() => setIsKeyDownloaded(!isKeyDownloaded)}
          />
          <label
            data-testid="confirmation-private-key-label"
            className="ml-2 cursor-pointer"
            htmlFor="confirmation-private-key"
          >
            <OdsText preset={ODS_TEXT_PRESET.span}>
              {t(
                'key_management_service_credential_create_confirmation_private-key_checkbox_label',
              )}
            </OdsText>
          </label>
        </OdsFormField>
      </div>
    </OdsCard>
  );
};

export default CreateCredentialConfirmationPrivateKey;

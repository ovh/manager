import { Subtitle } from '@ovh-ux/manager-react-components';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
} from '@ovhcloud/ods-components';
import {
  OsdsButton,
  OsdsCheckbox,
  OsdsCheckboxButton,
  OsdsMessage,
  OsdsText,
  OsdsTile,
} from '@ovhcloud/ods-components/react';
import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';

type CreateCredentialConfirmationPrivateKeyProps = {
  privateKey: string;
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
  return (
    <OsdsTile>
      <div className="flex flex-col w-full gap-7 md:gap-9">
        <Subtitle>
          {t(
            'key_management_service_credential_create_confirmation_private-key_title',
          )}
        </Subtitle>
        <OsdsMessage
          icon={ODS_ICON_NAME.WARNING}
          color={ODS_THEME_COLOR_INTENT.warning}
        >
          {t(
            'key_management_service_credential_create_confirmation_private-key_warn',
          )}
        </OsdsMessage>
        <span>
          <OsdsButton
            variant={ODS_BUTTON_VARIANT.stroked}
            color={ODS_THEME_COLOR_INTENT.primary}
            href={`data:text/plain;charset=utf-8,${encodeURIComponent(
              privateKey.replace(/\n/g, '\r\n'),
            )}`}
            download={`${credentialId}_privatekey.pem`}
            inline
            size={ODS_BUTTON_SIZE.sm}
          >
            {t(
              'key_management_service_credential_create_confirmation_private-key_download_label',
            )}
          </OsdsButton>
        </span>
        <OsdsCheckbox
          checked={isKeyDownloaded}
          onOdsCheckedChange={() => setIsKeyDownloaded(!isKeyDownloaded)}
        >
          <OsdsCheckboxButton color={ODS_THEME_COLOR_INTENT.primary}>
            <span slot="end">
              <OsdsText color={ODS_THEME_COLOR_INTENT.text}>
                {t(
                  'key_management_service_credential_create_confirmation_private-key_checkbox_label',
                )}
              </OsdsText>
            </span>
          </OsdsCheckboxButton>
        </OsdsCheckbox>
      </div>
    </OsdsTile>
  );
};

export default CreateCredentialConfirmationPrivateKey;

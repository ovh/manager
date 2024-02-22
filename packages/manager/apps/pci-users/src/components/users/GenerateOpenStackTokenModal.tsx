import { useState } from 'react';
import {
  OsdsButton,
  OsdsClipboard,
  OsdsFormField,
  OsdsMessage,
  OsdsModal,
  OsdsPassword,
  OsdsSpinner,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_VARIANT,
  ODS_MESSAGE_TYPE,
  ODS_SPINNER_SIZE,
} from '@ovhcloud/ods-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
} from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';
import { useGenerateOpenStackToken, useUser } from '@/hooks/useUser';
import { OpenStackTokenResponse } from '@/interface';
import { OpenStackTokenListing } from '@/components/users/OpenStackTokenListing';

interface GenerateOpenStackTokenModalProps {
  projectId: string;
  userId: string;
  onClose: () => void;
  onError: (cause: Error) => void;
}

export default function GenerateOpenStackTokenModal({
  projectId,
  userId,
  onClose,
  onError,
}: GenerateOpenStackTokenModalProps) {
  const [token, setToken] = useState<OpenStackTokenResponse>();
  const { t } = useTranslation('common');
  const { data: user, isPending: isUserPending } = useUser(
    `${projectId}`,
    userId,
  );
  const [password, setPassword] = useState('');
  const {
    generate,
    isPending: isTokenGenerationPending,
  } = useGenerateOpenStackToken({
    projectId: `${projectId}`,
    userId,
    password,
    onError: (err) => {
      onClose();
      onError(err);
    },
    onSuccess: setToken,
  });
  const isPending = isUserPending || isTokenGenerationPending;

  return (
    <>
      <OsdsModal
        headline={t('pci_projects_project_users_openstack-token_title')}
        onOdsModalClose={onClose}
      >
        <slot name="content">
          {!isPending && !token && (
            <>
              <OsdsText
                slot="label"
                level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
                color={ODS_THEME_COLOR_INTENT.text}
              >
                {t('pci_projects_project_users_openstack-token_content', {
                  user: user?.username,
                })}
              </OsdsText>
              <OsdsFormField>
                <OsdsText slot="label">
                  {t(
                    'pci_projects_project_users_openstack-token_password_label',
                  )}
                </OsdsText>
                <OsdsPassword
                  inline={true}
                  value={password}
                  onOdsValueChange={(e) => setPassword(`${e.detail.value}`)}
                ></OsdsPassword>
              </OsdsFormField>
            </>
          )}
          {isPending && <OsdsSpinner inline size={ODS_SPINNER_SIZE.md} />}

          {token && (
            <>
              <OsdsText>
                {t('pci_projects_project_users_openstack-token_token_label')}
              </OsdsText>
              <OsdsClipboard value={token['X-Auth-Token']}></OsdsClipboard>
              <OsdsMessage
                className="mt-2 mb-4"
                type={ODS_MESSAGE_TYPE.warning}
              >
                {t(
                  'pci_projects_project_users_openstack-token_token_alert_message',
                )}
              </OsdsMessage>
              <OpenStackTokenListing token={token} />
            </>
          )}
        </slot>
        <OsdsButton
          slot="actions"
          color={ODS_THEME_COLOR_INTENT.primary}
          variant={ODS_BUTTON_VARIANT.ghost}
          onClick={onClose}
        >
          {token && t('pci_projects_project_users_openstack-token_close_label')}
          {!token && t('common_cancel')}
        </OsdsButton>
        {!token && (
          <OsdsButton
            slot="actions"
            color={ODS_THEME_COLOR_INTENT.primary}
            onClick={generate}
            {...((isPending || !password) && { disabled: true })}
            data-testid="submitButton"
          >
            {t('common_confirm')}
          </OsdsButton>
        )}
      </OsdsModal>
    </>
  );
}

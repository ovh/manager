import { Clipboard } from '@ovh-ux/manager-react-components';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_VARIANT,
  ODS_SPINNER_SIZE,
  ODS_TEXT_COLOR_INTENT,
  ODS_TEXT_LEVEL,
} from '@ovhcloud/ods-components';
import {
  OsdsButton,
  OsdsModal,
  OsdsSpinner,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useGetAllRegistries,
  usePostRegistryCredentials,
} from '@/api/hooks/useRegistry';

export default function CredentialsPage() {
  const { t } = useTranslation();

  const navigate = useNavigate();
  const { projectId, registryId } = useParams();
  const [isConfirmed, setIsConfirmed] = useState(false);

  const { data: registries } = useGetAllRegistries(projectId);
  const registry = registries?.find((r) => r.id === registryId);

  const { data: credentials, isPending } = usePostRegistryCredentials(
    projectId,
    registryId,
    isConfirmed,
  );

  const onClose = () => navigate('..');
  const onConfirm = () => setIsConfirmed(true);

  const isFirstSectionDisplayed = !isConfirmed;
  const isSecondSectionDisplayed = isConfirmed && !isPending && credentials;

  return (
    <OsdsModal
      onOdsModalClose={onClose}
      headline={
        isConfirmed
          ? t('private_registry_generate_credentials_header')
          : t('private_registry_generate_credentials')
      }
    >
      {isFirstSectionDisplayed && (
        <OsdsText
          color={ODS_TEXT_COLOR_INTENT.text}
          level={ODS_TEXT_LEVEL.body}
          size={ODS_THEME_TYPOGRAPHY_SIZE._400}
          className="block mt-5"
        >
          {t('private_registry_generate_credentials_confirm', {
            registryName: registry?.name,
          })}
        </OsdsText>
      )}

      {isConfirmed && isPending && (
        <OsdsSpinner
          inline
          size={ODS_SPINNER_SIZE.md}
          className="block text-center mt-5"
        />
      )}

      {isSecondSectionDisplayed && (
        <div className="mt-5">
          <OsdsText
            color={ODS_TEXT_COLOR_INTENT.text}
            level={ODS_TEXT_LEVEL.body}
            size={ODS_THEME_TYPOGRAPHY_SIZE._400}
          >
            {t('private_registry_credentials_info')}
          </OsdsText>

          <OsdsText
            color={ODS_TEXT_COLOR_INTENT.text}
            level={ODS_TEXT_LEVEL.body}
            size={ODS_THEME_TYPOGRAPHY_SIZE._200}
            className="block mt-5 mb-2"
          >
            {t('private_registry_credentials_login')}
          </OsdsText>
          <Clipboard aria-label="clipboard" value={credentials.user} />

          <OsdsText
            color={ODS_TEXT_COLOR_INTENT.text}
            level={ODS_TEXT_LEVEL.body}
            size={ODS_THEME_TYPOGRAPHY_SIZE._200}
            className="block mt-5 mb-2"
          >
            {t('private_registry_credentials_password')}
          </OsdsText>
          <Clipboard aria-label="clipboard" value={credentials.password} />
        </div>
      )}

      <OsdsButton
        slot="actions"
        color={ODS_THEME_COLOR_INTENT.primary}
        variant={ODS_BUTTON_VARIANT.ghost}
        onClick={onClose}
      >
        {isConfirmed
          ? t('private_registry_common_close')
          : t('private_registry_common_cancel')}
      </OsdsButton>
      <OsdsButton
        slot="actions"
        color={ODS_THEME_COLOR_INTENT.primary}
        onClick={onConfirm}
        href={isConfirmed ? registry?.url : undefined}
        target={OdsHTMLAnchorElementTarget._blank}
      >
        {isConfirmed
          ? t('private_registry_goto_harbor')
          : t('private_registry_common_confirm')}
      </OsdsButton>
    </OsdsModal>
  );
}

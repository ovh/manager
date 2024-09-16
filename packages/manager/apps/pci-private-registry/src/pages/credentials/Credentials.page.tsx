import { PciModal } from '@ovh-ux/manager-pci-common';
import { Clipboard } from '@ovh-ux/manager-react-components';
import { ODS_THEME_TYPOGRAPHY_SIZE } from '@ovhcloud/ods-common-theming';
import {
  ODS_TEXT_COLOR_INTENT,
  ODS_TEXT_LEVEL,
} from '@ovhcloud/ods-components';
import { OsdsText } from '@ovhcloud/ods-components/react';
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

  const onConfirm = () => {
    if (!isConfirmed) {
      setIsConfirmed(true);
    } else {
      window.open(registry?.url, '_blank');
    }
  };

  const isFirstSectionDisplayed = !isConfirmed;
  const isSecondSectionDisplayed = isConfirmed && !isPending && credentials;
  const isModalPending = isPending && isConfirmed;

  return (
    <PciModal
      title={
        isConfirmed
          ? t('private_registry_generate_credentials_header')
          : t('private_registry_generate_credentials')
      }
      onClose={onClose}
      onCancel={onClose}
      onConfirm={onConfirm}
      isPending={isModalPending}
      cancelText={
        isConfirmed
          ? t('private_registry_common_close')
          : t('private_registry_common_cancel')
      }
      submitText={
        isConfirmed
          ? t('private_registry_goto_harbor')
          : t('private_registry_common_confirm')
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
    </PciModal>
  );
}

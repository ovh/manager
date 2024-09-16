import { Clipboard } from '@ovh-ux/manager-react-components';
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
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetAllRegistries } from '@/api/hooks/useRegistry';

export default function ApiUrlPage() {
  const { t } = useTranslation();

  const navigate = useNavigate();
  const onClose = () => navigate('..');

  const { projectId, registryId } = useParams();
  const { data: registries, isPending } = useGetAllRegistries(projectId);
  const registry = registries?.find((r) => r.id === registryId);

  return (
    <OsdsModal
      onOdsModalClose={onClose}
      headline={t('private_registry_harbor_api_title')}
    >
      <div className="mt-5">
        {isPending ? (
          <OsdsSpinner
            inline
            size={ODS_SPINNER_SIZE.md}
            className="block text-center mt-5"
          />
        ) : (
          <>
            <OsdsText
              color={ODS_TEXT_COLOR_INTENT.text}
              level={ODS_TEXT_LEVEL.body}
              size={ODS_THEME_TYPOGRAPHY_SIZE._400}
              className="block mb-2"
            >
              {t('private_registry_harbor_api_url')}
            </OsdsText>
            <Clipboard aria-label="clipboard" value={registry?.url} />
          </>
        )}
      </div>

      <OsdsButton
        slot="actions"
        color={ODS_THEME_COLOR_INTENT.primary}
        variant={ODS_BUTTON_VARIANT.ghost}
        onClick={onClose}
      >
        {t('private_registry_common_cancel')}
      </OsdsButton>
    </OsdsModal>
  );
}

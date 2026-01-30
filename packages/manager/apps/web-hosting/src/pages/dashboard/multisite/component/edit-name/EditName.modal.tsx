import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { TEXT_PRESET, Text } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ApiError } from '@ovh-ux/manager-core-api';
import { UpdateNameModal, useNotifications } from '@ovh-ux/muk';

import { putWebHostingWebsite } from '@/data/api/webHosting';
import { useGenerateUrl } from '@/hooks/generateUrl/useGenerateUrl';

interface EditNameState {
  siteName?: string;
  siteId?: number;
}
export default function EditNameModal() {
  const navigate = useNavigate();
  const onCloseUrl = useGenerateUrl('..', 'path');
  const onClose = () => navigate(onCloseUrl);
  const location = useLocation();
  const { serviceName } = useParams();
  const state = location.state as EditNameState;
  const siteName = state?.siteName;
  const siteId = state?.siteId;
  const { t } = useTranslation(['dashboard', 'common', NAMESPACES.ACTIONS, NAMESPACES.STATUS]);
  const { addSuccess, addError } = useNotifications();
  const { mutate: editName, isPending } = useMutation({
    mutationFn: (newName: string) =>
      putWebHostingWebsite(serviceName, siteId, {
        targetSpec: {
          name: newName,
        },
      }),
    onSuccess: () => {
      addSuccess(
        <Text preset={TEXT_PRESET.paragraph}>{t('hosting_dashboard_modal_update_success')}</Text>,
      );
    },
    onError: (error: ApiError) => {
      addError(
        <Text preset={TEXT_PRESET.paragraph}>
          {t(`${NAMESPACES.STATUS}:errorMessage`, {
            error: error.response?.data?.message,
          })}
        </Text>,
        true,
      );
    },
    onSettled: () => {
      onClose();
    },
  });

  const handleEditNameModal = (newName: string) => {
    editName(newName);
  };

  return (
    <UpdateNameModal
      isOpen={true}
      headline={t('hosting_dashboard_modal_update_headline')}
      description={t('hosting_dashboard_modal_update_description')}
      inputLabel={t('hosting_dashboard_modal_update_input_label')}
      onClose={() => onClose()}
      defaultValue={siteName}
      confirmButtonLabel={t(`${NAMESPACES.ACTIONS}:validate`)}
      cancelButtonLabel={t(`${NAMESPACES.ACTIONS}:cancel`)}
      onOpenChange={() => onClose()}
      updateDisplayName={handleEditNameModal}
      isLoading={isPending}
    />
  );
}

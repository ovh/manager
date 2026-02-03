import { useNavigate } from 'react-router-dom';

import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { ODS_MODAL_COLOR } from '@ovhcloud/ods-components';
import { OdsMessage, OdsText } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useFeatureAvailability } from '@ovh-ux/manager-module-common-api';
import { Modal, useNotifications } from '@ovh-ux/manager-react-components';

import { BACKUP_AGENT_NAMESPACES } from '@/BackupAgent.translations';
import { useDeleteVSPCTenant } from '@/data/hooks/tenants/useDeleteTenant';
import { useVSPCTenantsOptions } from '@/data/hooks/tenants/useVspcTenants';
import { useGetFeaturesAvailabilityNames } from '@/hooks/useGetFeatureAvailability';

export default function DeleteTenantPage() {
  const { t } = useTranslation([BACKUP_AGENT_NAMESPACES.SERVICE_LISTING, NAMESPACES.ACTIONS]);
  const navigate = useNavigate();
  const closeModal = () => navigate('..');
  const { addSuccess, addError } = useNotifications();
  const { DELETE_TENANT: deleteAgentFeatureName } = useGetFeaturesAvailabilityNames([
    'DELETE_TENANT',
  ]);
  const { data: featureAvailabilities } = useFeatureAvailability([deleteAgentFeatureName]);
  const isDeleteTenantFeatureAvailable = featureAvailabilities?.[deleteAgentFeatureName] ?? false;

  const { data: vspcName } = useQuery({
    ...useVSPCTenantsOptions(),
    select: ([vspcTenant]) => vspcTenant?.currentState.name,
  });

  const { mutate: deleteTenant, isPending } = useDeleteVSPCTenant({
    onSuccess: () => addSuccess(t('delete_tenant_banner_success', { vspcName })),
    onError: () => addError(t('delete_tenant_banner_error')),
    onSettled: () => closeModal(),
  });

  return (
    <Modal
      isOpen
      heading={t('delete_tenant_modal_title')}
      primaryLabel={t(`${NAMESPACES.ACTIONS}:confirm`)}
      onPrimaryButtonClick={() => deleteTenant()}
      isPrimaryButtonLoading={isPending}
      isPrimaryButtonDisabled={isPending || !isDeleteTenantFeatureAvailable}
      secondaryLabel={t(`${NAMESPACES.ACTIONS}:cancel`)}
      onSecondaryButtonClick={closeModal}
      onDismiss={closeModal}
      type={ODS_MODAL_COLOR.critical}
    >
      <div className="flex flex-col gap-5 whitespace-pre-line">
        {!isDeleteTenantFeatureAvailable && (
          <OdsMessage color="warning" isDismissible={false}>
            {t('delete_tenant_feature_unavailable')}
          </OdsMessage>
        )}
        <OdsText>{t('delete_tenant_modal_content', { tenantName: vspcName })}</OdsText>
      </div>
    </Modal>
  );
}

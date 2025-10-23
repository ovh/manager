import { useMemo } from 'react';

import { useNavigate, useSearchParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ODS_MODAL_COLOR } from '@ovhcloud/ods-components';
import { OdsText } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Modal, useNotifications } from '@ovh-ux/manager-react-components';

import { useDeleteVSPCTenant } from '@/data/hooks/tenants/useDeleteTenant';
import { useVSPCTenantsMocks } from '@/data/hooks/tenants/useVspcTenants';
import {BACKUP_AGENT_NAMESPACES} from "@/BackupAgent.translations";

export default function DeleteTenantPage() {
  const { t } = useTranslation([BACKUP_AGENT_NAMESPACES.SERVICE_LISTING, NAMESPACES.ACTIONS]);
  const navigate = useNavigate();
  const closeModal = () => navigate('..');
  const { addSuccess, addError } = useNotifications();
  const [searchParams] = useSearchParams();

  const { data: tenants } = useVSPCTenantsMocks();

  const tenantId = searchParams.get('tenantId');
  const tenantName = useMemo(
    () => tenants?.find(({ id }) => id === tenantId)?.currentState.companyName,
    [tenantId, tenants],
  );

  const { mutate: deleteTenant, isPending } = useDeleteVSPCTenant({
    onSuccess: () => addSuccess(t('delete_tenant_banner_success', { tenantName })),
    onError: () => addError(t('delete_tenant_banner_error')),
    onSettled: () => closeModal(),
  });

  return (
    <Modal
      isOpen
      heading={t('delete_tenant_modal_title')}
      primaryLabel={t(`${NAMESPACES.ACTIONS}:confirm`)}
      onPrimaryButtonClick={() => tenantId && deleteTenant(tenantId)}
      isPrimaryButtonLoading={isPending}
      isPrimaryButtonDisabled={isPending}
      secondaryLabel={t(`${NAMESPACES.ACTIONS}:cancel`)}
      onSecondaryButtonClick={closeModal}
      onDismiss={closeModal}
      type={ODS_MODAL_COLOR.critical}
    >
      <OdsText>{t('delete_tenant_modal_content', { tenantName })}</OdsText>
    </Modal>
  );
}

import { Suspense } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ODS_MODAL_COLOR } from '@ovhcloud/ods-components';
import { OdsMessage, OdsText } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useUpdateVcdNetworkAcl } from '@ovh-ux/manager-module-vcd-api';
import { Modal } from '@ovh-ux/manager-react-components';

import { useMessageContext } from '@/context/Message.context';

import { useNetworkAclContext } from '../NetworkAcl.context';

export default function AddEditNetworkAcl() {
  const { t } = useTranslation('networkAcl');
  const { t: tActions } = useTranslation(NAMESPACES.ACTIONS);
  const navigate = useNavigate();
  const { targetNetworks, organisationId: id, aclId } = useNetworkAclContext();
  const cancelDrawer = () => navigate('..');
  const { addSuccess } = useMessageContext();

  const { search } = useLocation();

  const searchParams = new URLSearchParams(search);

  const {
    mutate: updateNetworkAcl,
    error: updateError,
    isPending: isUpdatePending,
  } = useUpdateVcdNetworkAcl({
    id,
    aclId,
    onSuccess: () => {
      addSuccess({
        content: t('managed_vcd_network_acl_delete_success_message'),
        includedSubRoutes: [id],
        duration: 5000,
      });
      cancelDrawer();
    },
  });

  const onSubmit = () => {
    const payload = {
      networks: [...targetNetworks.filter((net) => net.network !== searchParams.get('network'))],
    };
    updateNetworkAcl(payload);
  };

  return (
    <Suspense>
      <Modal
        isOpen={true}
        heading={t('managed_vcd_network_acl_drawer_header_suppression_ip')}
        onDismiss={cancelDrawer}
        primaryLabel={tActions('delete')}
        onPrimaryButtonClick={onSubmit}
        secondaryLabel={tActions('cancel')}
        onSecondaryButtonClick={cancelDrawer}
        isPrimaryButtonLoading={isUpdatePending}
        isPrimaryButtonDisabled={isUpdatePending}
        type={ODS_MODAL_COLOR.critical}
      >
        <div className="flex flex-col gap-2">
          {updateError && (
            <OdsMessage color="critical" isDismissible={false}>
              {t('managed_vcd_network_acl_delete_error_message', {
                errorApi: updateError.message,
              })}
            </OdsMessage>
          )}
          <OdsText>{t('managed_vcd_network_acl_drawer_body_suppression_ip')}</OdsText>
          <OdsMessage color="warning" isDismissible={false}>
            {searchParams.get('network')}
          </OdsMessage>
        </div>
      </Modal>
    </Suspense>
  );
}

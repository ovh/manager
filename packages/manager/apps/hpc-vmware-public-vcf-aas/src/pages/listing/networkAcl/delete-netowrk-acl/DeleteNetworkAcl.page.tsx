import { useNavigate, useLocation } from 'react-router-dom';
import { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Drawer } from '@ovh-ux/manager-react-components';
import { OdsMessage, OdsText } from '@ovhcloud/ods-components/react';
import { useUpdateVcdNetworkAcl } from '@ovh-ux/manager-module-vcd-api';
import { useMessageContext } from '@/context/Message.context';
import { useNetworkAclContext } from '../NetworkAcl.context';

import { subRoutes } from '@/routes/routes.constant';

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
        // excludedSubRoutes: [subRoutes.virtualDatacenters],
      });
      cancelDrawer();
    },
  });

  const onSubmit = () => {
    const payload = {
      networks: [
        ...targetNetworks.filter(
          (net) => net.network !== searchParams.get('network'),
        ),
      ],
    };
    updateNetworkAcl(payload);
  };

  return (
    <Suspense>
      <Drawer
        heading={t('managed_vcd_network_acl_drawer_header_suppression_ip')}
        onDismiss={cancelDrawer}
        isOpen={true}
        primaryButtonLabel={tActions('confirm')}
        onPrimaryButtonClick={onSubmit}
        secondaryButtonLabel={tActions('cancel')}
        onSecondaryButtonClick={cancelDrawer}
        isPrimaryButtonLoading={isUpdatePending}
        isPrimaryButtonDisabled={isUpdatePending}
      >
        <div className="w-full max-w-md space-y-3">
          {updateError && (
            <OdsMessage color="critical" isDismissible={false}>
              {t('managed_vcd_network_acl_delete_error_message', {
                errorApi: updateError.message,
              })}
            </OdsMessage>
          )}
          {/* Network */}
          <div className="space-y-3">
            <OdsText>
              {t('managed_vcd_network_acl_drawer_body_suppression_ip')}
            </OdsText>
            <OdsText className="text-center block" preset="heading-3">
              {searchParams.get('network')}
            </OdsText>
          </div>
        </div>
      </Drawer>
    </Suspense>
  );
}

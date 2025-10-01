import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { Suspense, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Drawer } from '@ovh-ux/manager-react-components';
import {
  OdsInput,
  OdsFormField,
  OdsMessage,
} from '@ovhcloud/ods-components/react';
import { useUpdateVcdNetworkAcl } from '@ovh-ux/manager-module-vcd-api';
import {
  convertToCIDR,
  hasExistingIpOrCidrConflict,
} from '@/utils/Ipv4CIDRUtilities';
import { useMessageContext } from '@/context/Message.context';
import { NETWORK_ACL_SCHEMA } from '@/schemas/form.schema';
import { NetworkAclFormData } from '@/types/form.type';
import { useNetworkAclContext } from '../NetworkAcl.context';

import { subRoutes } from '@/routes/routes.constant';

export default function AddEditNetworkAcl() {
  const { t } = useTranslation('networkAcl');
  const { t: tZodError } = useTranslation('zodError');
  const { t: tActions } = useTranslation(NAMESPACES.ACTIONS);
  const { t: tDashboard } = useTranslation(NAMESPACES.DASHBOARD);

  const navigate = useNavigate();
  const {
    targetNetworks,
    currentNetworks,
    organisationId: id,
    aclId,
  } = useNetworkAclContext();
  const cancelDrawer = () => navigate('..');
  const { addSuccess } = useMessageContext();

  const { pathname, search } = useLocation();

  const searchParams = new URLSearchParams(search);
  const currentSubRoute = pathname
    .split('/')
    .filter(Boolean)
    .pop();

  const {
    mutate: updateNetworkAcl,
    error: updateError,
    isPending: isUpdatePending,
  } = useUpdateVcdNetworkAcl({
    id,
    aclId,
    onSuccess: () => {
      addSuccess({
        content: t('managed_vcd_network_acl_update_success_message'),
        includedSubRoutes: [id],
        excludedSubRoutes: [subRoutes.virtualDatacenters],
      });
      cancelDrawer();
    },
  });

  const schema = useMemo(
    () =>
      NETWORK_ACL_SCHEMA.refine(
        (data) => {
          return !hasExistingIpOrCidrConflict(
            data.network,
            currentNetworks
              .filter((net) => net.network !== searchParams.get('network'))
              .map((n) => n.network),
          );
        },
        {
          message: 'ZOD_ERROR_IPV4_OR_IPV4CIDR_OVERLAP',
          path: ['network'],
        },
      ),
    [currentNetworks],
  );

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<NetworkAclFormData>({
    resolver: zodResolver(schema),
    mode: 'onTouched',
    defaultValues: {
      network: searchParams.get('network') || '',
      description: searchParams.get('description') || '',
    },
  });

  const onSubmit = (data: NetworkAclFormData) => {
    const payload = {
      networks: [
        ...targetNetworks.filter(
          (net) => net.network !== searchParams.get('network'),
        ),
        { network: convertToCIDR(data.network), name: data.description },
      ],
    };
    updateNetworkAcl(payload);
  };

  return (
    <Suspense>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Drawer
          heading={
            subRoutes.addNetwokAcl === currentSubRoute
              ? t('managed_vcd_network_acl_drawer_header_add_ip')
              : t('managed_vcd_network_acl_drawer_header_edit_ip')
          }
          onDismiss={cancelDrawer}
          isOpen={true}
          primaryButtonLabel={tActions('confirm')}
          onPrimaryButtonClick={handleSubmit(onSubmit)}
          secondaryButtonLabel={tActions('cancel')}
          onSecondaryButtonClick={cancelDrawer}
          isPrimaryButtonLoading={isUpdatePending}
          isPrimaryButtonDisabled={isUpdatePending || !isValid}
        >
          <div className="w-full max-w-md space-y-3">
            {updateError && (
              <OdsMessage color="critical" isDismissible={false}>
                {subRoutes.addNetwokAcl === currentSubRoute
                  ? t('managed_vcd_network_acl_add_error_message', {
                      errorApi: updateError.message,
                    })
                  : t('managed_vcd_network_acl_update_error_message', {
                      errorApi: updateError.message,
                    })}
              </OdsMessage>
            )}
            {/* Network */}
            <OdsFormField
              error={
                errors?.network?.message && tZodError(errors?.network?.message)
              }
              className="block w-full"
            >
              <label slot="label" htmlFor="network">
                {t('managed_vcd_network_acl_form_network_label')}
              </label>
              <Controller
                name="network"
                control={control}
                render={({ field }) => (
                  <OdsInput
                    id="network"
                    name="network"
                    value={field.value ?? ''}
                    onOdsChange={(e) => field.onChange(e.detail.value)}
                    onOdsBlur={field.onBlur}
                    className="mt-1 w-full"
                  />
                )}
              />
            </OdsFormField>

            {/* Description */}
            <OdsFormField
              className="block w-full"
              error={tZodError(errors?.description?.message)}
            >
              <label slot="label" htmlFor="description">
                {tDashboard('description')}
              </label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <OdsInput
                    id="description"
                    name="description"
                    placeholder={'desription'}
                    value={field.value ?? ''}
                    onOdsChange={(e) => field.onChange(e.detail.value)}
                    onOdsBlur={field.onBlur}
                    className="mt-1 w-full"
                  />
                )}
              />
            </OdsFormField>
          </div>
        </Drawer>
      </form>
    </Suspense>
  );
}

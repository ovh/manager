import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { Suspense, useMemo, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Drawer } from '@ovh-ux/manager-react-components';

import {
  OdsInput,
  OdsFormField,
  OdsMessage,
  OdsButton,
} from '@ovhcloud/ods-components/react';
import { ODS_BUTTON_SIZE } from '@ovhcloud/ods-components';
import { useUpdateVcdNetworkAcl } from '@ovh-ux/manager-module-vcd-api';
import {
  normalizeToCIDR,
  hasExistingIpOrCidrConflict,
} from '@/utils/Ipv4CIDRUtilities';
import { useCurrentIp } from '@/hooks/currentIp/useCurrentIp';

import { useMessageContext } from '@/context/Message.context';
import { NETWORK_ACL_SCHEMA } from '@/schemas/form.schema';
import { NetworkAclFormData } from '@/types/form.type';
import { useNetworkAclContext } from '../NetworkAcl.context';

import { subRoutes } from '@/routes/routes.constant';
import { CIDR_ANYWHERE } from './updateNetworkAcl.constants';
import TEST_IDS from '@/utils/testIds.constants';

export default function AddEditNetworkAcl() {
  const { t } = useTranslation('networkAcl');
  const { t: tZodError } = useTranslation('zodError');
  const { t: tActions } = useTranslation(NAMESPACES.ACTIONS);
  const { t: tDashboard } = useTranslation(NAMESPACES.DASHBOARD);

  const [normalizedMessageInfo, setNormalizedMessageInfo] = useState<
    string | null
  >(null);

  const navigate = useNavigate();
  const {
    targetNetworks,
    currentNetworks,
    organisationId: id,
    aclId,
  } = useNetworkAclContext();
  const closeModal = () => navigate('..');
  const { addSuccess } = useMessageContext();

  const { pathname, search } = useLocation();

  const { retrieveCurrentIp, isLoading: isLoadingCurrentIp } = useCurrentIp();

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
        duration: 5000,
      });
      closeModal();
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
    [currentNetworks, searchParams],
  );

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
  } = useForm<NetworkAclFormData>({
    resolver: zodResolver(schema),
    mode: 'onTouched',
    defaultValues: {
      network: searchParams.get('network') || '',
      description: searchParams.get('description') || '',
    },
  });

  const networkValue = watch('network');

  const onSubmit = (data: NetworkAclFormData) => {
    const payload = {
      networks: [
        ...targetNetworks.filter(
          (net) => net.network !== searchParams.get('network'),
        ),
        { network: normalizeToCIDR(data.network), name: data.description },
      ],
    };
    updateNetworkAcl(payload);
  };

  const handleNetworkBlur = () => {
    if (!networkValue || errors.network) {
      setNormalizedMessageInfo(null);
      return;
    }

    try {
      const normalized = normalizeToCIDR(networkValue);
      if (normalized !== networkValue) {
        setNormalizedMessageInfo(
          t('managed_vcd_network_acl_normalized_info', {
            normalized,
          }),
        );
      } else {
        setNormalizedMessageInfo(null);
      }
    } catch {
      setNormalizedMessageInfo(null);
    }
  };

  const handleFillWithCurrentIp = async () => {
    const ip = await retrieveCurrentIp();
    if (ip) {
      setValue('network', ip, { shouldValidate: true });
    }
  };

  const handleFillWithFromAnywhere = () => {
    setValue('network', CIDR_ANYWHERE, { shouldValidate: true });
  };

  return (
    <Suspense>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Drawer
          heading={
            subRoutes.addNetworkAcl === currentSubRoute
              ? t('managed_vcd_network_acl_ip_cta_add_ip')
              : t('managed_vcd_network_acl_drawer_header_edit_ip')
          }
          onDismiss={closeModal}
          isOpen={true}
          primaryButtonLabel={tActions('confirm')}
          onPrimaryButtonClick={handleSubmit(onSubmit)}
          secondaryButtonLabel={tActions('cancel')}
          onSecondaryButtonClick={closeModal}
          isPrimaryButtonLoading={isUpdatePending}
          isPrimaryButtonDisabled={isUpdatePending || !isValid}
          isLoading={isLoadingCurrentIp}
        >
          <div className="w-full max-w-md space-y-3">
            {updateError && (
              <OdsMessage color="critical" isDismissible={false}>
                {subRoutes.addNetworkAcl === currentSubRoute
                  ? t('managed_vcd_network_acl_add_error_message', {
                      errorApi: updateError.message,
                    })
                  : t('managed_vcd_network_acl_update_error_message', {
                      errorApi: updateError.message,
                    })}
              </OdsMessage>
            )}

            <div className="flex justify-center gap-4 mt-4">
              <OdsButton
                size={ODS_BUTTON_SIZE.sm}
                variant="outline"
                label={t('managed_vcd_network_acl_add_current_ip')}
                onClick={handleFillWithCurrentIp}
                isDisabled={isLoadingCurrentIp}
                data-testid={TEST_IDS.networkAclAddCurrentIpAction}
              />

              <OdsButton
                size={ODS_BUTTON_SIZE.sm}
                label={t('managed_vcd_network_acl_allow_access_from_anywhere')}
                onClick={handleFillWithFromAnywhere}
                data-testid={TEST_IDS.networkAclfromAnywhereIpAction}
              />
            </div>
            {/* Network */}
            <OdsFormField
              error={
                errors?.network?.message && tZodError(errors?.network?.message)
              }
              className="block w-full"
            >
              <label slot="label" htmlFor="network">
                {t('managed_vcd_network_acl_ip_name')}
              </label>
              <Controller
                name="network"
                control={control}
                render={({ field }) => (
                  <OdsInput
                    id="network"
                    name="network"
                    value={field.value ?? ''}
                    onOdsChange={(e) => {
                      setNormalizedMessageInfo(null);
                      field.onChange(e.detail.value);
                    }}
                    onOdsBlur={() => {
                      field.onBlur();
                      handleNetworkBlur();
                    }}
                    className="mt-1 w-full"
                  />
                )}
              />
            </OdsFormField>
            {normalizedMessageInfo && (
              <OdsMessage color="information" isDismissible={false}>
                {normalizedMessageInfo}
              </OdsMessage>
            )}

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
                    placeholder={tDashboard('description')}
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

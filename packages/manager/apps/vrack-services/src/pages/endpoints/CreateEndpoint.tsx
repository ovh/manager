import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { OsdsSelect, OsdsSelectOption } from '@ovhcloud/ods-components/react';
import {
  ODS_SELECT_SIZE,
  OdsSelectValueChangeEvent,
} from '@ovhcloud/ods-components';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import {
  VrackServices,
  getVrackServicesResourceListQueryKey,
  getVrackServicesResourceQueryKey,
  updateVrackServices,
  updateVrackServicesQueryKey,
} from '@/api';
import { CreatePageLayout } from '@/components/layout-helpers';
import {
  subnetSelectName,
  serviceTypeSelectName,
  serviceNameSelectName,
  getEndpointCreationMutationKey,
} from './constants';
import { useServiceList, useVrackService } from '@/utils/vs-utils';
import { ErrorPage } from '@/components/Error';
import { FormField } from '@/components/FormField';
import { urls, pageTrackingLabels } from '@/router/constants';

const dataTrackingPath = pageTrackingLabels[urls.createEndpoint];

const EndpointCreationPage: React.FC = () => {
  const { t } = useTranslation('vrack-services/endpoints');
  const { id } = useParams();
  const [serviceType, setServiceType] = React.useState<string | undefined>(
    undefined,
  );
  const [cidr, setCidr] = React.useState<string | undefined>(undefined);
  const [managedServiceURN, setManagedServiceURN] = React.useState<
    string | undefined
  >(undefined);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const vrackServices = useVrackService();
  const dashboardUrl = urls.endpoints.replace(':id', id);
  const { trackPage } = useOvhTracking();

  const {
    iamResources,
    isIamResourcesLoading,
    iamResourcesError,
    serviceListResponse,
    isServiceListLoading,
    serviceListError,
  } = useServiceList(id);

  const { mutate: createEndpoint, isPending, isError, error } = useMutation<
    ApiResponse<VrackServices>,
    ApiError
  >({
    mutationKey: updateVrackServicesQueryKey(
      getEndpointCreationMutationKey(id),
    ),
    mutationFn: () =>
      updateVrackServices({
        vrackServicesId: id,
        checksum: vrackServices.data?.checksum,
        targetSpec: {
          displayName: vrackServices.data?.currentState.displayName,
          subnets: vrackServices.data?.currentState.subnets.map((subnet) =>
            subnet.cidr !== cidr
              ? subnet
              : {
                  ...subnet,
                  serviceEndpoints: (subnet.serviceEndpoints || []).concat({
                    managedServiceURN,
                  }),
                },
          ),
        },
      }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: getVrackServicesResourceListQueryKey,
        }),
        queryClient.invalidateQueries({
          queryKey: getVrackServicesResourceQueryKey(id),
        }),
        trackPage({ path: dataTrackingPath, value: '-success' }),
      ]);
      navigate(dashboardUrl);
    },
    onError: () => {
      trackPage({ path: dataTrackingPath, value: '-error' });
    },
  });

  React.useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: updateVrackServicesQueryKey(getEndpointCreationMutationKey(id)),
    });
  }, []);

  if (serviceListError || iamResourcesError) {
    return <ErrorPage error={serviceListError || iamResourcesError} />;
  }

  return (
    <CreatePageLayout
      overviewUrl={dashboardUrl}
      title={t('createPageTitle')}
      description={t('createPageDescription')}
      createButtonLabel={t('createEndpointButtonLabel')}
      dataTrackingPath={dataTrackingPath}
      createButtonDataTracking="::confirm"
      formErrorMessage={t('endpointCreationError', {
        error: error?.response.data.message,
      })}
      hasFormError={isError}
      onSubmit={() => createEndpoint()}
      isSubmitPending={isPending}
      isFormSubmittable={
        !vrackServices.isLoading && !!cidr && !!managedServiceURN && !isPending
      }
    >
      <FormField label={t('serviceTypeLabel')} isLoading={isServiceListLoading}>
        <OsdsSelect
          inline
          disabled={isPending || isServiceListLoading || undefined}
          id={serviceTypeSelectName}
          onOdsValueChange={(e: OdsSelectValueChangeEvent) =>
            setServiceType(e?.detail.value as string)
          }
          size={ODS_SELECT_SIZE.md}
        >
          <span slot="placeholder">{t('serviceTypePlaceholder')}</span>
          {serviceListResponse?.data?.map((service) => (
            <OsdsSelectOption
              key={service.managedServiceType}
              value={service.managedServiceType}
            >
              {service.managedServiceType}
            </OsdsSelectOption>
          ))}
        </OsdsSelect>
      </FormField>

      <FormField
        label={t('serviceNameLabel')}
        isLoading={isIamResourcesLoading}
      >
        <OsdsSelect
          inline
          disabled={
            isPending ||
            isServiceListLoading ||
            isIamResourcesLoading ||
            !serviceType ||
            undefined
          }
          id={serviceNameSelectName}
          onOdsValueChange={(e: OdsSelectValueChangeEvent) =>
            setManagedServiceURN(e?.detail.value as string)
          }
          size={ODS_SELECT_SIZE.md}
        >
          <span slot="placeholder">{t('serviceNamePlaceholder')}</span>
          {serviceListResponse?.data
            ?.find((service) => service.managedServiceType === serviceType)
            ?.managedServiceURNs.map((serviceURN) => {
              const resource = iamResources?.data?.find(
                ({ urn }) => urn === serviceURN,
              );
              const label =
                resource?.displayName || resource?.name || resource?.id;
              return (
                <OsdsSelectOption key={serviceURN} value={serviceURN}>
                  {label}
                </OsdsSelectOption>
              );
            })}
        </OsdsSelect>
      </FormField>

      <FormField label={t('subnetLabel')}>
        <OsdsSelect
          inline
          disabled={isPending || undefined}
          id={subnetSelectName}
          onOdsValueChange={(e: OdsSelectValueChangeEvent) =>
            setCidr(e?.detail.value as string)
          }
          size={ODS_SELECT_SIZE.md}
        >
          <span slot="placeholder">{t('subnetPlaceholder')}</span>
          {vrackServices?.data?.currentState.subnets.map((subnet) => (
            <OsdsSelectOption key={subnet.cidr} value={subnet.cidr}>
              {subnet.displayName || subnet.cidr}
            </OsdsSelectOption>
          ))}
        </OsdsSelect>
      </FormField>
    </CreatePageLayout>
  );
};

export default EndpointCreationPage;

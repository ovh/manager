import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import i18next from 'i18next';
import {
  OsdsSelect,
  OsdsSelectOption,
} from '@ovhcloud/ods-components/select/react';
import {
  ODS_SELECT_SIZE,
  OdsSelectValueChangeEvent,
} from '@ovhcloud/ods-components/select';
import {
  ResponseData,
  VrackServices,
  getListingIcebergQueryKey,
  getVrackServicesResourceQueryKey,
  updateVrackServices,
  updateVrackServicesQueryKey,
} from '@/api';
import { CreatePageLayout } from '@/components/layout-helpers';
import {
  subnetSelectName,
  serviceTypeSelectName,
  serviceNameSelectName,
} from './constants';
import { useServiceList, useVrackService } from '@/utils/vs-utils';
import { ErrorPage } from '@/components/Error';
import { FormField } from '@/components/FormField';

export const isValidVlanNumber = (vlan: number) => vlan >= 2 && vlan <= 4094;

export const getEndpointCreationMutationKey = (id: string) =>
  `create-endpoint-${id}`;

export function breadcrumb() {
  return i18next.t('vrack-services/endpoints:createPageTitle');
}

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
  const dashboardUrl = `/${id}/Endpoints`;

  const {
    iamResources,
    isIamResourcesLoading,
    iamResourcesError,
    serviceListResponse,
    isServiceListLoading,
    serviceListError,
  } = useServiceList(id);

  const { mutate: createEndpoint, isPending, isError, error } = useMutation<
    ResponseData<VrackServices>,
    ResponseData<Error>
  >({
    mutationKey: updateVrackServicesQueryKey(
      getEndpointCreationMutationKey(id),
    ),
    mutationFn: () =>
      updateVrackServices({
        vrackServicesId: id,
        checksum: vrackServices.data?.checksum,
        targetSpec: {
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
          displayName: vrackServices.data?.currentState.displayName,
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getListingIcebergQueryKey,
      });
      queryClient.invalidateQueries({
        queryKey: getVrackServicesResourceQueryKey(id),
      });
      navigate(dashboardUrl, { replace: true });
    },
  });

  React.useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: updateVrackServicesQueryKey(getEndpointCreationMutationKey(id)),
    });
  }, []);

  if (vrackServices.error || error || serviceListError || iamResourcesError) {
    return (
      <ErrorPage error={vrackServices.error || error || serviceListError} />
    );
  }

  return (
    <CreatePageLayout
      title={t('createPageTitle')}
      description={t('createPageDescription')}
      createButtonLabel={t('createEndpointButtonLabel')}
      formErrorMessage={t('endpointCreationError', {
        error: error?.response.data.message,
      })}
      hasFormError={isError}
      goBackLinkLabel={t('goBackLinkLabel')}
      goBackUrl={dashboardUrl}
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
          name={serviceTypeSelectName}
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
          name={serviceNameSelectName}
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
          name={subnetSelectName}
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

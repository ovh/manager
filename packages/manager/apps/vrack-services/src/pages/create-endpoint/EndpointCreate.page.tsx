import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import {
  OdsSelect,
  OdsFormField,
  OdsSpinner,
} from '@ovhcloud/ods-components/react';
import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { PageType, useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { ErrorBanner } from '@ovh-ux/manager-react-components';
import {
  getVrackServicesResourceQueryKey,
  useServiceList,
  useUpdateVrackServices,
  useVrackService,
} from '@ovh-ux/manager-network-common';
import { CreatePageLayout } from '@/components/layout-helpers';
import { urls } from '@/routes/routes.constants';
import { PageName } from '@/utils/tracking';
import { MessagesContext } from '@/components/feedback-messages/Messages.context';
import {
  getIamResourceQueryKey,
  getIamResource,
} from '@/data/api/get/iamResource';

export default function EndpointCreatePage() {
  const { t } = useTranslation('vrack-services/endpoints');
  const { id } = useParams();
  const { addSuccessMessage } = React.useContext(MessagesContext);
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
  } = useServiceList(id, {
    getIamResourceQueryKey,
    getIamResource,
  });

  const {
    createEndpoint,
    updateError,
    isError,
    isPending,
  } = useUpdateVrackServices({
    id,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getVrackServicesResourceQueryKey(id),
      });
      trackPage({
        pageName: PageName.successCreateEndpoint,
        pageType: PageType.bannerSuccess,
      });
      navigate(dashboardUrl);
      addSuccessMessage(t('endpointCreationSuccess', { id }), {
        vrackServicesId: id,
      });
    },
    onError: () => {
      trackPage({
        pageName: PageName.errorCreateEndpoint,
        pageType: PageType.bannerError,
      });
    },
  });

  React.useEffect(() => {
    setServiceType(serviceListResponse?.data?.[0]?.managedServiceType);
  }, [
    serviceListResponse?.data
      ?.map((service) => service.managedServiceType)
      ?.join(','),
  ]);

  if (serviceListError || iamResourcesError) {
    return <ErrorBanner error={serviceListError || iamResourcesError} />;
  }

  return (
    <CreatePageLayout
      overviewUrl={dashboardUrl}
      title={t('createEndpointPageTitle')}
      description={t('createEndpointPageDescription')}
      loadingText={t('endpointCreationPending')}
      createButtonLabel={t('createEndpointButtonLabel')}
      hasFormError={isError}
      formErrorMessage={t('endpointCreationError', {
        error: updateError?.response?.data?.message,
      })}
      confirmActionsTracking={['add_endpoints', 'confirm']}
      onSubmit={() =>
        createEndpoint({
          vs: vrackServices?.data,
          cidr,
          managedServiceURN,
        })
      }
      isSubmitPending={isPending}
      isFormSubmittable={
        !vrackServices?.isLoading && !!cidr && !!managedServiceURN && !isPending
      }
    >
      <OdsFormField className="block mb-4 max-w-md">
        <label htmlFor="service-type-select" slot="label">
          {t('serviceTypeLabel')}
        </label>
        {isServiceListLoading ? (
          <OdsSpinner size={ODS_SPINNER_SIZE.md} />
        ) : (
          <OdsSelect
            id="service-type-select"
            name="service-type-select"
            isDisabled={isPending}
            value={serviceType}
            onOdsChange={(e) => setServiceType(e?.detail.value as string)}
            placeholder={t('serviceTypePlaceholder')}
          >
            {serviceListResponse?.data?.map((service) => (
              <option
                key={service.managedServiceType}
                value={service.managedServiceType}
              >
                {t(service.managedServiceType)}
              </option>
            ))}
          </OdsSelect>
        )}
      </OdsFormField>

      <OdsFormField className="block mb-4 max-w-md">
        <label htmlFor="service-name" slot="label">
          {t('serviceNameLabel')}
        </label>
        {isServiceListLoading || isIamResourcesLoading ? (
          <OdsSpinner size={ODS_SPINNER_SIZE.md} />
        ) : (
          <OdsSelect
            id="service-name"
            name="service-name"
            isDisabled={isPending || !serviceType}
            onOdsChange={(e) => setManagedServiceURN(e?.detail.value as string)}
            placeholder={t('serviceNamePlaceholder')}
          >
            {serviceListResponse?.data
              ?.find((service) => service.managedServiceType === serviceType)
              ?.managedServiceURNs.map((serviceURN: string) => {
                const resource = iamResources?.data?.find(
                  ({ urn }) => urn === serviceURN,
                );
                const label =
                  resource?.displayName || resource?.name || resource?.id;
                return (
                  <option key={serviceURN} value={serviceURN}>
                    {label}
                  </option>
                );
              })}
          </OdsSelect>
        )}
      </OdsFormField>

      <OdsFormField className="block mb-4 max-w-md">
        <label htmlFor="subnet" slot="label">
          {t('subnetLabel')}
        </label>
        <OdsSelect
          id="subnet"
          name="subnet"
          isDisabled={isPending}
          onOdsChange={(e) => setCidr(e?.detail.value as string)}
          placeholder={t('subnetPlaceholder')}
        >
          {vrackServices?.data?.currentState.subnets.map((subnet) => (
            <option key={subnet.cidr} value={subnet.cidr}>
              {subnet.displayName
                ? `${subnet.displayName} - ${subnet.cidr}`
                : subnet.cidr}
            </option>
          ))}
        </OdsSelect>
      </OdsFormField>
    </CreatePageLayout>
  );
}

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import {
  SPINNER_SIZE,
  Select,
  FormField,
  Spinner,
  SelectControl,
  SelectContent,
} from '@ovhcloud/ods-react';
import { PageType, useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { Error } from '@ovh-ux/muk';
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
import { TRANSLATION_NAMESPACES } from '@/utils/constants';

export default function EndpointCreatePage() {
  const { t } = useTranslation(TRANSLATION_NAMESPACES.endpoints);
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
    return <Error error={serviceListError || iamResourcesError} />;
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
      <FormField className="block mb-4 max-w-md">
        <label htmlFor="service-type-select" slot="label">
          {t('serviceTypeLabel')}
        </label>
        {isServiceListLoading ? (
          <Spinner size={SPINNER_SIZE.md} />
        ) : (
          <Select
            id="service-type-select"
            name="service-type-select"
            disabled={isPending}
            value={[serviceType]}
            items={
              serviceListResponse?.data?.map((service) => ({
                label: t(service.managedServiceType),
                value: service.managedServiceType,
              })) ?? []
            }
            onValueChange={(e) => setServiceType(e?.value[0] as string)}
          >
            <SelectControl placeholder={t('serviceTypePlaceholder')} />
            <SelectContent />
          </Select>
        )}
      </FormField>

      <FormField className="block mb-4 max-w-md">
        <label htmlFor="service-name" slot="label">
          {t('serviceNameLabel')}
        </label>
        {isServiceListLoading || isIamResourcesLoading ? (
          <Spinner size={SPINNER_SIZE.md} />
        ) : (
          <Select
            id="service-name"
            data-testid="select-service-name"
            name="service-name"
            disabled={isPending || !serviceType}
            items={serviceListResponse?.data
              ?.find((service) => service.managedServiceType === serviceType)
              ?.managedServiceURNs.map((serviceURN: string) => {
                const resource = iamResources?.data?.find(
                  ({ urn }) => urn === serviceURN,
                );
                const label =
                  resource?.displayName || resource?.name || resource?.id;
                return { label, value: serviceURN };
              })}
            onValueChange={(e) => setManagedServiceURN(e?.value[0] as string)}
          >
            <SelectControl placeholder={t('serviceNamePlaceholder')} />
            <SelectContent />
          </Select>
        )}
      </FormField>

      <FormField className="block mb-4 max-w-md">
        <label htmlFor="subnet" slot="label">
          {t('subnetLabel')}
        </label>
        <Select
          id="subnet"
          data-testid="select-subnet"
          name="subnet"
          disabled={isPending}
          items={vrackServices?.data?.currentState.subnets.map((subnet) => ({
            label: subnet.displayName
              ? `${subnet.displayName} - ${subnet.cidr}`
              : subnet.cidr,
            value: subnet.cidr,
          }))}
          onValueChange={(e) => setCidr(e?.value[0] as string)}
        >
          <SelectControl placeholder={t('subnetPlaceholder')} />
          <SelectContent />
        </Select>
      </FormField>
    </CreatePageLayout>
  );
}

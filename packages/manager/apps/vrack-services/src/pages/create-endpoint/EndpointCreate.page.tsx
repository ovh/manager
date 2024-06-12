import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { OsdsSelect, OsdsSelectOption } from '@ovhcloud/ods-components/react';
import {
  ODS_SELECT_SIZE,
  OdsSelectValueChangeEvent,
} from '@ovhcloud/ods-components';
import { PageType, useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { FormField } from '@/components/FormField.component';
import {
  getVrackServicesResourceQueryKey,
  useServiceList,
  useUpdateVrackServices,
  useVrackService,
} from '@/data';
import { CreatePageLayout } from '@/components/layout-helpers';
import {
  subnetSelectName,
  serviceTypeSelectName,
  serviceNameSelectName,
} from './endpointCreate.constants';
import { ErrorPage } from '@/components/ErrorPage.component';
import { urls } from '@/routes/routes.constants';
import { PageName } from '@/utils/tracking';
import { MessagesContext } from '@/components/feedback-messages/Messages.context';

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
  } = useServiceList(id);

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
      addSuccessMessage(t('endpointCreationSuccess', { id }), id);
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
    return <ErrorPage error={serviceListError || iamResourcesError} />;
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
      <FormField label={t('serviceTypeLabel')} isLoading={isServiceListLoading}>
        <OsdsSelect
          inline
          disabled={isPending || isServiceListLoading || undefined}
          id={serviceTypeSelectName}
          value={serviceType}
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
              {t(service.managedServiceType)}
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
          {vrackServices?.data.currentState.subnets.map((subnet) => (
            <OsdsSelectOption key={subnet.cidr} value={subnet.cidr}>
              {subnet.displayName
                ? `${subnet.displayName} - ${subnet.cidr}`
                : subnet.cidr}
            </OsdsSelectOption>
          ))}
        </OsdsSelect>
      </FormField>
    </CreatePageLayout>
  );
}

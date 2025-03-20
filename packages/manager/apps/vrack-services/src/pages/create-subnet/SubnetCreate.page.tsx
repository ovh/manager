import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { ODS_INPUT_TYPE } from '@ovhcloud/ods-components';
import { OdsRadio, OdsText, OdsInput } from '@ovhcloud/ods-components/react';
import { useOvhTracking, PageType } from '@ovh-ux/manager-react-shell-client';
import {
  getVrackServicesResourceListQueryKey,
  getVrackServicesResourceQueryKey,
  useUpdateVrackServices,
  useVrackService,
} from '@ovh-ux/manager-network-common';
import { FormField } from '@/components/FormField.component';
import { CreatePageLayout } from '@/components/layout-helpers';
import {
  displayNameInputName,
  cidrInputName,
  serviceRangeSelectName,
  vlanInputName,
  vlanNumberInputName,
  noVlanOptionValue,
  vlanNumberOptionValue,
  defaultCidr,
  defaultServiceRange,
} from './subnetCreate.constants';
import { urls } from '@/routes/routes.constants';
import { PageName } from '@/utils/tracking';
import { isValidVlanNumber } from '@/utils/vrack-services';
import { isValidCidr } from '@/utils/cidr';

export default function SubnetCreate() {
  const { t } = useTranslation('vrack-services/subnets');
  const { id } = useParams();
  const [displayName, setDisplayName] = React.useState<string | undefined>(
    undefined,
  );
  const [cidr, setCidr] = React.useState<string | undefined>(undefined);
  const [serviceRange, setServiceRange] = React.useState<string | undefined>(
    undefined,
  );
  const [hasVlan, setHasVlan] = React.useState(false);
  const [vlan, setVlan] = React.useState<number | undefined>(undefined);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const vrackServices = useVrackService();
  const dashboardUrl = urls.subnets.replace(':id', id);
  const { trackPage } = useOvhTracking();

  const {
    createSubnet,
    updateError,
    isError,
    isPending,
  } = useUpdateVrackServices({
    id,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getVrackServicesResourceListQueryKey,
      });
      queryClient.invalidateQueries({
        queryKey: getVrackServicesResourceQueryKey(id),
      });
      trackPage({
        pageName: PageName.successCreateSubnet,
        pageType: PageType.bannerSuccess,
      });
      navigate(dashboardUrl);
    },
    onError: () => {
      trackPage({
        pageName: PageName.errorCreateSubnet,
        pageType: PageType.bannerError,
      });
    },
  });

  return (
    <CreatePageLayout
      overviewUrl={dashboardUrl}
      title={t('createSubnetPageTitle')}
      createButtonLabel={t('createSubnetButtonLabel')}
      loadingText={t('subnetCreationPending')}
      hasFormError={isError}
      formErrorMessage={t('subnetCreationError', {
        error: updateError?.response?.data?.message,
      })}
      confirmActionsTracking={['add_subnets', 'confirm']}
      onSubmit={() =>
        createSubnet({
          vs: vrackServices?.data,
          cidr: cidr || defaultCidr,
          serviceRange: serviceRange || defaultServiceRange,
          displayName,
          vlan,
        })
      }
      isSubmitPending={isPending}
      isFormSubmittable={
        !vrackServices?.isLoading &&
        !isPending &&
        (!hasVlan || isValidVlanNumber(vlan)) &&
        ((!!cidr && isValidCidr(cidr)) || (!cidr && !!defaultCidr))
      }
    >
      <FormField label={t('subnetNameLabel')}>
        <OdsInput
          isDisabled={isPending}
          name={displayNameInputName}
          type={ODS_INPUT_TYPE.text}
          placeholder={t('subnetNamePlaceholder')}
          onOdsChange={(e) => setDisplayName(e?.detail.value as string)}
        />
      </FormField>

      <FormField label={t('cidrLabel')}>
        <span slot="helper">
          <OdsText>{t('subnetRangeAdditionalText')}</OdsText>
        </span>
        <OdsInput
          isDisabled={isPending}
          name={cidrInputName}
          type={ODS_INPUT_TYPE.text}
          placeholder={defaultCidr}
          onOdsChange={(e) => setCidr(e?.detail.value as string)}
          hasError={!!cidr && !isValidCidr(cidr)}
        />
      </FormField>

      <FormField label={t('serviceRangeLabel')}>
        <span slot="helper">
          <OdsText>{t('serviceRangeAdditionalText')}</OdsText>
        </span>
        <OdsInput
          isDisabled={isPending}
          placeholder={defaultServiceRange}
          type={ODS_INPUT_TYPE.text}
          name={serviceRangeSelectName}
          onOdsChange={(e) => setServiceRange(e?.detail.value as string)}
        />
      </FormField>

      <FormField label={t('vlanLabel')}>
        <div slot="helper">
          <OdsText>{t('vlanAdditionalText')}</OdsText>
        </div>
        <OdsRadio
          inputId={noVlanOptionValue}
          value={noVlanOptionValue}
          name={vlanInputName}
          isDisabled={isPending}
          onOdsChange={(event) => {
            setHasVlan(event?.detail.value === vlanNumberOptionValue);
          }}
        />
        <label htmlFor={noVlanOptionValue}>{t('vlanNoVlanOptionLabel')}</label>
        <OdsRadio
          inputId="vlan"
          isChecked={hasVlan}
          name={vlanInputName}
          value={vlanNumberOptionValue}
        />
        <label htmlFor={vlanNumberOptionValue}>
          {t('vlanSelectVlanOptionLabel')}
        </label>
      </FormField>
      {hasVlan && (
        <FormField className="ml-8" label={t('vlanNumberLabel')}>
          <OdsInput
            isDisabled={isPending}
            name={vlanNumberInputName}
            type={ODS_INPUT_TYPE.number}
            onOdsChange={(e) => setVlan(Number(e?.detail.value))}
          />
        </FormField>
      )}
    </CreatePageLayout>
  );
}

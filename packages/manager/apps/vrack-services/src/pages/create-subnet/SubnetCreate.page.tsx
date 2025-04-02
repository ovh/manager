import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { ODS_INPUT_TYPE, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import {
  OdsRadio,
  OdsText,
  OdsInput,
  OdsFormField,
} from '@ovhcloud/ods-components/react';
import { useOvhTracking, PageType } from '@ovh-ux/manager-react-shell-client';
import {
  getVrackServicesResourceListQueryKey,
  getVrackServicesResourceQueryKey,
  useUpdateVrackServices,
  useVrackService,
} from '@ovh-ux/manager-network-common';
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
      <OdsFormField className="block mb-4 max-w-md">
        <label htmlFor={displayNameInputName} slot="label">
          {t('subnetNameLabel')}
        </label>
        <OdsInput
          id={displayNameInputName}
          name={displayNameInputName}
          isDisabled={isPending}
          type={ODS_INPUT_TYPE.text}
          placeholder={t('subnetNamePlaceholder')}
          onOdsChange={(e) => setDisplayName(e?.detail.value as string)}
        />
      </OdsFormField>

      <OdsFormField className="block mb-4 max-w-md">
        <label htmlFor={cidrInputName} slot="label">
          {t('cidrLabel')}
        </label>
        <span slot="helper">
          <OdsText slot="helper" preset={ODS_TEXT_PRESET.caption}>
            {t('subnetRangeAdditionalText')}
          </OdsText>
        </span>
        <OdsInput
          id={cidrInputName}
          name={cidrInputName}
          isDisabled={isPending}
          type={ODS_INPUT_TYPE.text}
          placeholder={defaultCidr}
          onOdsChange={(e) => setCidr(e?.detail.value as string)}
          hasError={!!cidr && !isValidCidr(cidr)}
        />
      </OdsFormField>

      <OdsFormField className="block mb-4 max-w-md">
        <label htmlFor={serviceRangeSelectName} slot="label">
          {t('serviceRangeLabel')}
        </label>
        <OdsText slot="helper" preset={ODS_TEXT_PRESET.caption}>
          {t('serviceRangeAdditionalText')}
        </OdsText>
        <OdsInput
          id={serviceRangeSelectName}
          name={serviceRangeSelectName}
          isDisabled={isPending}
          placeholder={defaultServiceRange}
          type={ODS_INPUT_TYPE.text}
          onOdsChange={(e) => setServiceRange(e?.detail.value as string)}
        />
      </OdsFormField>

      <OdsFormField className="grid mb-4 gap-2">
        <label slot="label">{t('vlanLabel')}</label>
        <OdsText slot="helper" preset={ODS_TEXT_PRESET.caption}>
          {t('vlanAdditionalText')}
        </OdsText>

        <div className="flex align-center gap-3">
          <OdsRadio
            name={vlanInputName}
            inputId={noVlanOptionValue}
            value={noVlanOptionValue}
            isDisabled={isPending}
            isChecked={!hasVlan}
            onOdsChange={(event) =>
              setHasVlan(event?.detail.value === vlanNumberOptionValue)
            }
          />
          <label
            htmlFor={noVlanOptionValue}
            slot="label"
            className="cursor-pointer"
          >
            <OdsText>{t('vlanNoVlanOptionLabel')}</OdsText>
          </label>
        </div>

        <div className="flex align-center gap-3">
          <OdsRadio
            name={vlanInputName}
            inputId="vlan"
            isChecked={hasVlan}
            value={vlanNumberOptionValue}
            onOdsChange={(event) =>
              setHasVlan(event?.detail.value === vlanNumberOptionValue)
            }
          />
          <label htmlFor="vlan" slot="label" className="cursor-pointer">
            <OdsText>{t('vlanSelectVlanOptionLabel')}</OdsText>
          </label>
        </div>
      </OdsFormField>

      {hasVlan && (
        <OdsFormField className="block mb-6 max-w-md">
          <label htmlFor={vlanNumberInputName} slot="label">
            {t('vlanNumberLabel')}
          </label>
          <OdsInput
            id={vlanNumberInputName}
            name={vlanNumberInputName}
            isDisabled={isPending}
            type={ODS_INPUT_TYPE.number}
            onOdsChange={(e) => setVlan(Number(e?.detail.value))}
          />
        </OdsFormField>
      )}
    </CreatePageLayout>
  );
}

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import {
  INPUT_TYPE,
  TEXT_PRESET,
  Radio,
  Text,
  Input,
  FormField,
  FormFieldLabel,
  FormFieldHelper,
  FormFieldError,
  RadioGroup,
  RadioControl,
  RadioLabel,
} from '@ovhcloud/ods-react';
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
import { TRANSLATION_NAMESPACES } from '@/utils/constants';

export default function SubnetCreate() {
  const { t } = useTranslation(TRANSLATION_NAMESPACES.subnets);
  const { id } = useParams();
  const [displayName, setDisplayName] = React.useState<string | undefined>(
    undefined,
  );
  const [cidr, setCidr] = React.useState<string | undefined>(undefined);
  const [serviceRange, setServiceRange] = React.useState<string | undefined>(
    undefined,
  );
  const [selectedVlanInput, setSelectedVlanInput] = React.useState(
    noVlanOptionValue,
  );
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
        (selectedVlanInput === noVlanOptionValue || isValidVlanNumber(vlan)) &&
        ((!!cidr && isValidCidr(cidr)) || (!cidr && !!defaultCidr))
      }
    >
      <FormField className="mb-4 max-w-md">
        <FormFieldLabel htmlFor={displayNameInputName}>
          {t('subnetNameLabel')}
        </FormFieldLabel>
        <Input
          id={displayNameInputName}
          name={displayNameInputName}
          disabled={isPending}
          type={INPUT_TYPE.text}
          placeholder={t('subnetNamePlaceholder')}
          onChange={(e) => setDisplayName(e?.target.value as string)}
        />
      </FormField>

      <FormField className="mb-4 max-w-md">
        <FormFieldLabel htmlFor={cidrInputName}>
          {t('cidrLabel')}
        </FormFieldLabel>
        {!!cidr && !isValidCidr(cidr) && <FormFieldError />}
        <Input
          id={cidrInputName}
          name={cidrInputName}
          disabled={isPending}
          type={INPUT_TYPE.text}
          placeholder={defaultCidr}
          onChange={(e) => setCidr(e?.target.value as string)}
        />
        <FormFieldHelper>
          <Text preset={TEXT_PRESET.caption}>
            {t('subnetRangeAdditionalText')}
          </Text>
        </FormFieldHelper>
      </FormField>

      <FormField className="mb-4 max-w-md">
        <FormFieldLabel htmlFor={serviceRangeSelectName}>
          {t('serviceRangeLabel')}
        </FormFieldLabel>
        <Input
          id={serviceRangeSelectName}
          name={serviceRangeSelectName}
          disabled={isPending}
          placeholder={defaultServiceRange}
          type={INPUT_TYPE.text}
          onChange={(e) => setServiceRange(e?.target.value as string)}
        />
        <FormFieldHelper>
          <Text preset={TEXT_PRESET.caption}>
            {t('serviceRangeAdditionalText')}
          </Text>
        </FormFieldHelper>
      </FormField>

      <FormField className="grid mb-4 gap-2">
        <FormFieldLabel>{t('vlanLabel')}</FormFieldLabel>
        <FormFieldHelper>
          <Text slot="helper" preset={TEXT_PRESET.caption}>
            {t('vlanAdditionalText')}
          </Text>
        </FormFieldHelper>
        <RadioGroup
          name={vlanInputName}
          value={selectedVlanInput}
          onValueChange={(event) => setSelectedVlanInput(event?.value)}
        >
          <Radio value={noVlanOptionValue} disabled={isPending}>
            <RadioControl />
            <RadioLabel>
              <Text>{t('vlanNoVlanOptionLabel')}</Text>
            </RadioLabel>
          </Radio>

          <Radio value={vlanNumberOptionValue} disabled={isPending}>
            <RadioControl />
            <RadioLabel>
              <Text>{t('vlanSelectVlanOptionLabel')}</Text>
            </RadioLabel>
          </Radio>
        </RadioGroup>
      </FormField>

      {selectedVlanInput === vlanNumberOptionValue && (
        <FormField className="block mb-6 max-w-md">
          <FormFieldLabel htmlFor={vlanNumberInputName}>
            {t('vlanNumberLabel')}
          </FormFieldLabel>
          <Input
            id={vlanNumberInputName}
            name={vlanNumberInputName}
            disabled={isPending}
            type={INPUT_TYPE.number}
            onChange={(e) => setVlan(Number(e?.target.value))}
          />
        </FormField>
      )}
    </CreatePageLayout>
  );
}

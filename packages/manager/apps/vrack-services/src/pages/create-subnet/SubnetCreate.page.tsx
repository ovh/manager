import React from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import {
  FormField,
  FormFieldError,
  FormFieldHelper,
  FormFieldLabel,
  INPUT_TYPE,
  Input,
  Radio,
  RadioControl,
  RadioGroup,
  RadioLabel,
  TEXT_PRESET,
  Text,
} from '@ovhcloud/ods-react';

import {
  getVrackServicesResourceListQueryKey,
  getVrackServicesResourceQueryKey,
  useUpdateVrackServices,
  useVrackService,
} from '@ovh-ux/manager-network-common';
import { PageType, useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import { CreatePageLayout } from '@/components/layout-helpers/CreatePageLayout.component';
import { urls } from '@/routes/RoutesAndUrl.constants';
import { isValidCidr } from '@/utils/cidr';
import { TRANSLATION_NAMESPACES } from '@/utils/constants';
import { PageName } from '@/utils/tracking';
import { isValidVlanNumber } from '@/utils/vrack-services';

import {
  cidrInputName,
  defaultCidr,
  defaultServiceRange,
  displayNameInputName,
  noVlanOptionValue,
  serviceRangeSelectName,
  vlanInputName,
  vlanNumberInputName,
  vlanNumberOptionValue,
} from './SubnetCreateForm.constants';

export default function SubnetCreate() {
  const { t } = useTranslation(TRANSLATION_NAMESPACES.subnets);
  const { id } = useParams();
  const [displayName, setDisplayName] = React.useState<string | undefined>(undefined);
  const [cidr, setCidr] = React.useState<string | undefined>(undefined);
  const [serviceRange, setServiceRange] = React.useState<string | undefined>(undefined);
  const [selectedVlanInput, setSelectedVlanInput] = React.useState(noVlanOptionValue);
  const [vlan, setVlan] = React.useState<number | undefined>(undefined);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const vrackServices = useVrackService();
  const dashboardUrl = urls.subnets.replace(':id', id || '');
  const { trackPage } = useOvhTracking();

  const { createSubnet, updateError, isError, isPending } = useUpdateVrackServices({
    id: id || '',
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: getVrackServicesResourceListQueryKey,
      });
      void queryClient.invalidateQueries({
        queryKey: getVrackServicesResourceQueryKey(id || ''),
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
      onSubmit={() => {
        if (!vrackServices?.data) {
          return;
        }
        createSubnet({
          vs: vrackServices.data,
          cidr: cidr || defaultCidr,
          serviceRange: serviceRange || defaultServiceRange,
          displayName,
          vlan,
        });
      }}
      isSubmitPending={isPending}
      isFormSubmittable={
        !vrackServices?.isLoading &&
        !isPending &&
        (selectedVlanInput === noVlanOptionValue ||
          (vlan !== undefined && isValidVlanNumber(vlan))) &&
        ((!!cidr && isValidCidr(cidr)) || (!cidr && !!defaultCidr))
      }
    >
      <FormField className="mb-4 max-w-md">
        <FormFieldLabel htmlFor={displayNameInputName}>{t('subnetNameLabel')}</FormFieldLabel>
        <Input
          id={displayNameInputName}
          name={displayNameInputName}
          disabled={isPending}
          type={INPUT_TYPE.text}
          placeholder={t('subnetNamePlaceholder')}
          onChange={(e) => setDisplayName(e?.target.value)}
        />
      </FormField>

      <FormField className="mb-4 max-w-md">
        <FormFieldLabel htmlFor={cidrInputName}>{t('cidrLabel')}</FormFieldLabel>
        {!!cidr && !isValidCidr(cidr) && <FormFieldError />}
        <Input
          id={cidrInputName}
          name={cidrInputName}
          disabled={isPending}
          type={INPUT_TYPE.text}
          placeholder={defaultCidr}
          onChange={(e) => setCidr(e?.target.value)}
        />
        <FormFieldHelper>
          <Text preset={TEXT_PRESET.caption}>{t('subnetRangeAdditionalText')}</Text>
        </FormFieldHelper>
      </FormField>

      <FormField className="mb-4 max-w-md">
        <FormFieldLabel htmlFor={serviceRangeSelectName}>{t('serviceRangeLabel')}</FormFieldLabel>
        <Input
          id={serviceRangeSelectName}
          name={serviceRangeSelectName}
          disabled={isPending}
          placeholder={defaultServiceRange}
          type={INPUT_TYPE.text}
          onChange={(e) => setServiceRange(e?.target.value)}
        />
        <FormFieldHelper>
          <Text preset={TEXT_PRESET.caption}>{t('serviceRangeAdditionalText')}</Text>
        </FormFieldHelper>
      </FormField>

      <FormField className="mb-4 grid gap-2">
        <FormFieldLabel>{t('vlanLabel')}</FormFieldLabel>
        <FormFieldHelper>
          <Text slot="helper" preset={TEXT_PRESET.caption}>
            {t('vlanAdditionalText')}
          </Text>
        </FormFieldHelper>
        <RadioGroup
          name={vlanInputName}
          value={selectedVlanInput}
          onValueChange={(event) => setSelectedVlanInput(event?.value || '')}
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
        <FormField className="mb-6 block max-w-md">
          <FormFieldLabel htmlFor={vlanNumberInputName}>{t('vlanNumberLabel')}</FormFieldLabel>
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

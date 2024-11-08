import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import {
  ODS_RADIO_BUTTON_SIZE,
  ODS_INPUT_SIZE,
  ODS_INPUT_TYPE,
  OdsInputValueChangeEvent,
} from '@ovhcloud/ods-components';
import {
  OsdsRadioButton,
  OsdsRadio,
  OsdsRadioGroup,
  OsdsText,
  OsdsInput,
} from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useOvhTracking, PageType } from '@ovh-ux/manager-react-shell-client';
import { FormField } from '@/components/FormField.component';
import {
  getDisplayName,
  getVrackServicesResourceListQueryKey,
  getVrackServicesResourceQueryKey,
  useUpdateVrackServices,
  useVrackService,
  isValidVlanNumber,
  isValidCidr,
} from '@/data';
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
import { MessagesContext } from '@/components/feedback-messages/Messages.context';

export default function SubnetCreate() {
  const { t } = useTranslation('vrack-services/subnets');
  const { id } = useParams();
  const { addSuccessMessage } = React.useContext(MessagesContext);
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
      addSuccessMessage(
        t('subnetCreationSuccess', { id: getDisplayName(vrackServices?.data) }),
        { vrackServicesId: id },
      );
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
        <OsdsInput
          inline
          disabled={isPending || undefined}
          name={displayNameInputName}
          size={ODS_INPUT_SIZE.md}
          type={ODS_INPUT_TYPE.text}
          placeholder={t('subnetNamePlaceholder')}
          onOdsValueChange={(e: OdsInputValueChangeEvent) =>
            setDisplayName(e?.detail.value)
          }
        />
      </FormField>

      <FormField label={t('cidrLabel')}>
        <span slot="helper">
          <OsdsText>{t('subnetRangeAdditionalText')}</OsdsText>
        </span>
        <OsdsInput
          inline
          disabled={isPending || undefined}
          name={cidrInputName}
          size={ODS_INPUT_SIZE.md}
          type={ODS_INPUT_TYPE.text}
          placeholder={defaultCidr}
          onOdsValueChange={(e: OdsInputValueChangeEvent) =>
            setCidr(e?.detail.value)
          }
          error={!!cidr && !isValidCidr(cidr)}
        />
      </FormField>

      <FormField label={t('serviceRangeLabel')}>
        <span slot="helper">
          <OsdsText>{t('serviceRangeAdditionalText')}</OsdsText>
        </span>
        <OsdsInput
          inline
          disabled={isPending || undefined}
          placeholder={defaultServiceRange}
          size={ODS_INPUT_SIZE.md}
          type={ODS_INPUT_TYPE.text}
          name={serviceRangeSelectName}
          onOdsValueChange={(e: OdsInputValueChangeEvent) =>
            setServiceRange(e?.detail.value)
          }
        />
      </FormField>

      <FormField label={t('vlanLabel')}>
        <div slot="helper">
          <OsdsText>{t('vlanAdditionalText')}</OsdsText>
        </div>
        <OsdsRadioGroup
          id={vlanInputName}
          name={vlanInputName}
          disabled={isPending || undefined}
          onOdsValueChange={(event) => {
            setHasVlan(event?.detail.newValue === vlanNumberOptionValue);
          }}
        >
          <OsdsRadio
            checked={!hasVlan}
            name={vlanInputName}
            value={noVlanOptionValue}
          >
            <OsdsRadioButton
              size={ODS_RADIO_BUTTON_SIZE.sm}
              color={ODS_THEME_COLOR_INTENT.primary}
            >
              <span slot="end">{t('vlanNoVlanOptionLabel')}</span>
            </OsdsRadioButton>
          </OsdsRadio>
          <OsdsRadio
            checked={hasVlan}
            name={vlanInputName}
            value={vlanNumberOptionValue}
          >
            <OsdsRadioButton
              size={ODS_RADIO_BUTTON_SIZE.sm}
              color={ODS_THEME_COLOR_INTENT.primary}
            >
              <span slot="end">{t('vlanSelectVlanOptionLabel')}</span>
            </OsdsRadioButton>
          </OsdsRadio>
        </OsdsRadioGroup>
      </FormField>

      {hasVlan && (
        <FormField className="ml-8" label={t('vlanNumberLabel')}>
          <OsdsInput
            inline
            disabled={isPending || undefined}
            name={vlanNumberInputName}
            size={ODS_INPUT_SIZE.md}
            type={ODS_INPUT_TYPE.number}
            onOdsValueChange={(e: OdsInputValueChangeEvent) =>
              setVlan(Number(e?.detail.value))
            }
          />
        </FormField>
      )}
    </CreatePageLayout>
  );
}

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import {
  ODS_INPUT_SIZE,
  ODS_INPUT_TYPE,
  OdsInputValueChangeEvent,
} from '@ovhcloud/ods-components/input';
import { OsdsInput } from '@ovhcloud/ods-components/input/react';
import { OsdsText } from '@ovhcloud/ods-components/text/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import i18next from 'i18next';
import {
  OsdsRadio,
  OsdsRadioGroup,
} from '@ovhcloud/ods-components/radio/react';
import { OdsRadioGroupValueChangeEvent } from '@ovhcloud/ods-components/radio';
import { OsdsRadioButton } from '@ovhcloud/ods-components/radio-button/react';
import { ODS_RADIO_BUTTON_SIZE } from '@ovhcloud/ods-components/radio-button';
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
  displayNameInputName,
  cidrInputName,
  serviceRangeSelectName,
  vlanInputName,
  vlanNumberInputName,
  noVlanOptionValue,
  vlanNumberOptionValue,
  defaultCidr,
  defaultServiceRange,
} from './constants';
import { useVrackService } from '@/utils/vs-utils';
import { ErrorPage } from '@/components/Error';
import { FormField } from '@/components/FormField';

export const isValidVlanNumber = (vlan: number) => vlan >= 2 && vlan <= 4094;

export const getSubnetCreationMutationKey = (id: string) => `create-${id}`;

export function breadcrumb() {
  return i18next.t('vrack-services/subnets:createPageTitle');
}

const SubnetCreationPage: React.FC = () => {
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

  const { mutate: createSubnet, isPending, isError, error } = useMutation<
    ResponseData<VrackServices>,
    ResponseData<Error>
  >({
    mutationKey: updateVrackServicesQueryKey(getSubnetCreationMutationKey(id)),
    mutationFn: () =>
      updateVrackServices({
        vrackServicesId: id,
        checksum: vrackServices.data?.checksum,
        targetSpec: {
          subnets: [
            ...(vrackServices.data?.currentState.subnets || []),
            {
              displayName,
              cidr: cidr || defaultCidr,
              serviceEndpoints: [],
              serviceRange: {
                cidr: serviceRange || defaultServiceRange,
              },
              vlan,
            },
          ],
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
      navigate(`/${id}/Subnets`, { replace: true });
    },
  });

  React.useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: updateVrackServicesQueryKey(getSubnetCreationMutationKey(id)),
    });
  }, []);

  if (vrackServices.error || error) {
    return <ErrorPage error={vrackServices.error || error} />;
  }

  return (
    <CreatePageLayout
      title={t('createPageTitle')}
      createButtonLabel={t('createSubnetButtonLabel')}
      formErrorMessage={t('subnetCreationError', {
        error: error?.response.data.message,
      })}
      hasFormError={isError}
      goBackLinkLabel={t('goBackLinkLabel')}
      goBackUrl={`/${id}/Subnets`}
      onSubmit={() => createSubnet()}
      isSubmitPending={isPending}
      isFormSubmittable={
        !vrackServices.isLoading && (!hasVlan || isValidVlanNumber(vlan))
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
        <OsdsInput
          inline
          disabled={isPending || undefined}
          name={cidrInputName}
          size={ODS_INPUT_SIZE.md}
          type={ODS_INPUT_TYPE.text}
          placeholder={t('cidrPlaceholder')}
          onOdsValueChange={(e: OdsInputValueChangeEvent) =>
            setCidr(e?.detail.value)
          }
        />
      </FormField>

      <FormField label={t('serviceRangeLabel')}>
        <span slot="helper">
          <OsdsText>{t('serviceRangeAdditionalText')}</OsdsText>
        </span>
        <OsdsInput
          inline
          disabled={isPending || undefined}
          placeholder={t('serviceRangePlaceholder')}
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
          onOdsValueChange={(event: OdsRadioGroupValueChangeEvent) => {
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
        <FormField className="ml-11" label={t('vlanNumberLabel')}>
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
};

export default SubnetCreationPage;

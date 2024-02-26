import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useQueryClient, useMutation } from '@tanstack/react-query';
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
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import {
  IamAuthorizationsRequest,
  VrackServices,
  getVrackServicesResourceListQueryKey,
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
  isValidVlanNumber,
  getSubnetCreationMutationKey,
} from './constants';
import { useVrackService } from '@/utils/vs-utils';
import { FormField } from '@/components/FormField';
import { urls } from '@/router/constants';
import { useIamAuthorizationCheckService } from '@/utils/iam-utils';
import { vrackServicesActions } from '@/api/iam/actions';
import checkPermsUtils from '@/utils/check-perms-utils';

const SubnetCreationPage: React.FC = () => {
  const [
    iamAuthorizationsRequest,
    setIamAuthorizationsRequest,
  ] = React.useState<IamAuthorizationsRequest>({
    resourceURNs: [],
    actionsPage: [vrackServicesActions.API_OVH.RESOURCE.EDIT],
  });
  const IAMAuthorizations = useIamAuthorizationCheckService(
    iamAuthorizationsRequest,
  );
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
  const {
    shell: { tracking },
  } = React.useContext(ShellContext);
  const defaultCidr = t('defaultCidr');
  const defaultServiceRange = t('defaultServiceRange');

  React.useEffect(() => {
    if (vrackServices.data) {
      iamAuthorizationsRequest.resourceURNs = [vrackServices.data.iam.urn];
      setIamAuthorizationsRequest(iamAuthorizationsRequest);
    } else {
      // navigate('/');
    }
  }, [vrackServices.data]);

  const { mutate: createSubnet, isPending, isError, error } = useMutation<
    ApiResponse<VrackServices>,
    ApiError
  >({
    mutationKey: updateVrackServicesQueryKey(getSubnetCreationMutationKey(id)),
    mutationFn: () =>
      updateVrackServices({
        vrackServicesId: id,
        checksum: vrackServices.data?.checksum,
        targetSpec: {
          displayName: vrackServices.data?.currentState.displayName,
          subnets: (vrackServices.data?.currentState.subnets || []).concat({
            displayName,
            cidr: cidr || defaultCidr,
            serviceEndpoints: [],
            serviceRange: {
              cidr: serviceRange || defaultServiceRange,
            },
            vlan,
          }),
        },
      }),
    onSuccess: async () => {
      await Promise.all([
        await queryClient.invalidateQueries({
          queryKey: getVrackServicesResourceListQueryKey,
        }),
        await queryClient.invalidateQueries({
          queryKey: getVrackServicesResourceQueryKey(id),
        }),
        await tracking.trackEvent({
          name: 'vrack-services::subnets::add-success',
          level2: '0',
        }),
      ]);
      navigate(dashboardUrl);
    },
    onError: async () => {
      await tracking.trackEvent({
        name: 'vrack-services::subnets::add-error',
        level2: '0',
      });
    },
  });

  React.useEffect(() => {
    tracking.trackPage({
      name: 'vrack-services::subnets::add',
      level2: '0',
    });
    queryClient.invalidateQueries({
      queryKey: updateVrackServicesQueryKey(getSubnetCreationMutationKey(id)),
    });
  }, []);

  return (
    <CreatePageLayout
      overviewUrl={dashboardUrl}
      title={t('createPageTitle')}
      createButtonLabel={t('createSubnetButtonLabel')}
      createButtonDataTracking="vrack-services::subnets::add::confirm"
      formErrorMessage={t('subnetCreationError', {
        error: error?.response.data.message,
        interpolation: { escapeValue: false },
      })}
      hasFormError={isError}
      onSubmit={() => createSubnet()}
      isSubmitPending={isPending}
      isFormSubmittable={
        !vrackServices.isLoading &&
        !isPending &&
        (!hasVlan || isValidVlanNumber(vlan)) &&
        !checkPermsUtils({
          iamAuthorizations: IAMAuthorizations.authorizations,
          urn: vrackServices?.data?.urn,
          action: vrackServicesActions.API_OVH.RESOURCE.EDIT,
        })
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

import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  OsdsButton,
  OsdsInput,
  OsdsMessage,
  OsdsModal,
  OsdsSpinner,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_TYPE,
  ODS_BUTTON_VARIANT,
  ODS_INPUT_TYPE,
  ODS_MESSAGE_TYPE,
  ODS_SPINNER_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
  OdsInputValueChangeEvent,
} from '@ovhcloud/ods-components';
import {
  ButtonType,
  PageLocation,
  PageType,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { handleClick } from '@ovh-ux/manager-react-components';
import {
  getDisplayName,
  useUpdateVrackServices,
  useVrackService,
  isValidVlanNumber,
  getSubnetFromCidr,
  isValidCidr,
} from '@/data';
import { MessagesContext } from '@/components/feedback-messages/Messages.context';
import { LoadingText } from '@/components/LoadingText.component';
import { PageName } from '@/utils/tracking';
import { FormField } from '@/components/FormField.component';
import {
  defaultCidr,
  defaultServiceRange,
} from '@/pages/create-subnet/subnetCreate.constants';

const sharedTrackingParams = {
  location: PageLocation.popup,
  buttonType: ButtonType.button,
};

export default function EditSubnetModal() {
  const { id, cidr } = useParams();
  const subnetCidr = cidr?.replace('_', '/');
  const { t } = useTranslation('vrack-services/subnets');
  const { addSuccessMessage } = React.useContext(MessagesContext);
  const { trackClick, trackPage } = useOvhTracking();
  const [newCidr, setNewCidr] = React.useState('');
  const [serviceRange, setServiceRange] = React.useState('');
  const [displayName, setDisplayName] = React.useState('');
  const [vlan, setVlan] = React.useState<number>(null);
  const navigate = useNavigate();
  const {
    data: vs,
    isPending: isVrackServicesLoading,
    isError,
    error,
  } = useVrackService();

  const {
    updateSubnet,
    isPending,
    updateError,
    isError: isUpdateError,
  } = useUpdateVrackServices({
    id,
    onSuccess: () => {
      trackPage({
        pageType: PageType.bannerSuccess,
        pageName: PageName.successUpdateSubnet,
      });
      navigate('..');
      addSuccessMessage(t('subnetUpdateSuccess', { id: getDisplayName(vs) }), {
        vrackServicesId: id,
      });
    },
    onError: () => {
      trackPage({
        pageType: PageType.bannerError,
        pageName: PageName.errorUpdateSubnet,
      });
    },
  });

  React.useEffect(() => {
    if (vs) {
      const subnet = getSubnetFromCidr(vs, subnetCidr);

      if (subnet) {
        setNewCidr(subnetCidr);
        setDisplayName(subnet.displayName);
        setServiceRange(subnet.serviceRange.cidr);
        setVlan(subnet.vlan || null);
      }
    }
  }, [vs?.checksum]);

  const onClose = () => {
    trackClick({
      ...sharedTrackingParams,
      actionType: 'exit',
      actions: ['edit_subnets', 'cancel'],
    });
    navigate('..');
  };

  const subnet = getSubnetFromCidr(vs, subnetCidr);

  const disabledInputs = isPending || isVrackServicesLoading || undefined;

  const hasDirtyInputs =
    subnet.displayName !== displayName ||
    subnet.cidr !== newCidr ||
    subnet.serviceRange.cidr !== serviceRange ||
    subnet.vlan !== vlan;

  return (
    <OsdsModal
      dismissible
      headline={t('modalSubnetUpdateHeadline')}
      onOdsModalClose={onClose}
    >
      {(isError || isUpdateError) && (
        <OsdsMessage className="mb-8" type={ODS_MESSAGE_TYPE.error}>
          <OsdsText
            level={ODS_TEXT_LEVEL.body}
            size={ODS_TEXT_SIZE._400}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {t('subnetUpdateError', {
              error: (error || updateError).response?.data?.message,
            })}
          </OsdsText>
        </OsdsMessage>
      )}

      <OsdsText
        color={ODS_THEME_COLOR_INTENT.text}
        level={ODS_TEXT_LEVEL.body}
        className="block mb-8"
      >
        {t('modalSubnetUpdateDescription')}
      </OsdsText>

      <FormField label={t('subnetUpdateDisplayNameInputLabel')} fullWidth>
        <OsdsInput
          disabled={disabledInputs}
          type={ODS_INPUT_TYPE.text}
          value={displayName}
          placeholder={t('subnetNamePlaceholder')}
          onOdsValueChange={(e: OdsInputValueChangeEvent) =>
            setDisplayName(e?.detail.value)
          }
        />
      </FormField>

      <FormField label={t('cidrLabel')} fullWidth>
        <span slot="helper">
          <OsdsText>{t('subnetRangeAdditionalText')}</OsdsText>
        </span>
        <OsdsInput
          disabled={disabledInputs}
          type={ODS_INPUT_TYPE.text}
          value={newCidr}
          placeholder={defaultCidr}
          onOdsValueChange={(e: OdsInputValueChangeEvent) =>
            setNewCidr(e?.detail.value)
          }
          error={!!newCidr && !isValidCidr(newCidr)}
        />
      </FormField>

      <FormField label={t('serviceRangeLabel')} fullWidth>
        <OsdsInput
          disabled={disabledInputs}
          type={ODS_INPUT_TYPE.text}
          value={serviceRange}
          placeholder={defaultServiceRange}
          onOdsValueChange={(e: OdsInputValueChangeEvent) =>
            setServiceRange(e?.detail.value)
          }
        />
      </FormField>

      <FormField label={t('vlanNumberLabel')} fullWidth>
        <OsdsInput
          disabled={disabledInputs}
          type={ODS_INPUT_TYPE.number}
          value={vlan}
          placeholder={t('vlanNoVlanOptionLabel')}
          onOdsValueChange={(e: OdsInputValueChangeEvent) =>
            setVlan(Number(e?.detail.value) || null)
          }
        />
      </FormField>
      {isVrackServicesLoading && <OsdsSpinner size={ODS_SPINNER_SIZE.sm} />}
      {isPending && <LoadingText title={t('subnetUpdatePending')} />}
      <OsdsButton
        disabled={isPending || undefined}
        slot="actions"
        type={ODS_BUTTON_TYPE.button}
        variant={ODS_BUTTON_VARIANT.ghost}
        color={ODS_THEME_COLOR_INTENT.info}
        {...handleClick(onClose)}
      >
        {t('modalSubnetUpdateCancelButton')}
      </OsdsButton>
      <OsdsButton
        disabled={
          (!!newCidr && !isValidCidr(newCidr)) ||
          (vlan && !isValidVlanNumber(vlan)) ||
          !hasDirtyInputs ||
          disabledInputs
        }
        slot="actions"
        type={ODS_BUTTON_TYPE.button}
        variant={ODS_BUTTON_VARIANT.flat}
        color={ODS_THEME_COLOR_INTENT.info}
        {...handleClick(() => {
          trackClick({
            ...sharedTrackingParams,
            actionType: 'action',
            actions: ['edit_subnets', 'confirm'],
          });
          updateSubnet({
            displayName,
            newCidr,
            serviceRange,
            vlan,
            cidr: subnetCidr,
            vs,
          });
        })}
      >
        {t('modalSubnetUpdateConfirmButton')}
      </OsdsButton>
    </OsdsModal>
  );
}

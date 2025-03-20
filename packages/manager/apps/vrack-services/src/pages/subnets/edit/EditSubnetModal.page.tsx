import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  OdsButton,
  OdsInput,
  OdsMessage,
  OdsModal,
  OdsSpinner,
  OdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_COLOR,
  ODS_BUTTON_VARIANT,
  ODS_INPUT_TYPE,
  ODS_MESSAGE_COLOR,
  ODS_SPINNER_SIZE,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import {
  ButtonType,
  PageLocation,
  PageType,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { handleClick } from '@ovh-ux/manager-react-components';
import {
  useUpdateVrackServices,
  useVrackService,
} from '@ovh-ux/manager-network-common';
import { MessagesContext } from '@/components/feedback-messages/Messages.context';
import { LoadingText } from '@/components/LoadingText.component';
import { PageName } from '@/utils/tracking';
import { FormField } from '@/components/FormField.component';
import {
  defaultCidr,
  defaultServiceRange,
} from '@/pages/create-subnet/subnetCreate.constants';
import { isValidCidr } from '@/utils/cidr';
import {
  getDisplayName,
  getSubnetFromCidr,
  isValidVlanNumber,
} from '@/utils/vrack-services';

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
    <OdsModal isOpen isDismissible onOdsClose={onClose}>
      <OdsText preset={ODS_TEXT_PRESET.heading4}>
        ={t('modalSubnetUpdateHeadline')}
      </OdsText>
      {(isError || isUpdateError) && (
        <OdsMessage className="mb-8" color={ODS_MESSAGE_COLOR.critical}>
          {t('subnetUpdateError', {
            error: (error || updateError).response?.data?.message,
          })}
        </OdsMessage>
      )}

      <OdsText className="block mb-8" preset={ODS_TEXT_PRESET.paragraph}>
        {t('modalSubnetUpdateDescription')}
      </OdsText>

      <FormField label={t('subnetUpdateDisplayNameInputLabel')} fullWidth>
        <OdsInput
          name="display-name-input"
          isDisabled={disabledInputs}
          type={ODS_INPUT_TYPE.text}
          value={displayName}
          placeholder={t('subnetNamePlaceholder')}
          onOdsChange={(e) => setDisplayName(e?.detail.value as string)}
        />
      </FormField>

      <FormField label={t('cidrLabel')} fullWidth>
        <span slot="helper">
          <OdsText>{t('subnetRangeAdditionalText')}</OdsText>
        </span>
        <OdsInput
          name="cidr-input"
          isDisabled={disabledInputs}
          type={ODS_INPUT_TYPE.text}
          value={newCidr}
          placeholder={defaultCidr}
          onOdsChange={(e) => setNewCidr(e?.detail.value as string)}
          hasError={!!newCidr && !isValidCidr(newCidr)}
        />
      </FormField>

      <FormField label={t('serviceRangeLabel')} fullWidth>
        <OdsInput
          name="service-range"
          isDisabled={disabledInputs}
          type={ODS_INPUT_TYPE.text}
          value={serviceRange}
          placeholder={defaultServiceRange}
          onOdsChange={(e) => setServiceRange(e?.detail.value as string)}
        />
      </FormField>

      <FormField label={t('vlanNumberLabel')} fullWidth>
        <OdsInput
          name="vlan-option"
          isDisabled={disabledInputs}
          type={ODS_INPUT_TYPE.number}
          value={vlan}
          placeholder={t('vlanNoVlanOptionLabel')}
          onOdsChange={(e) => setVlan(Number(e?.detail.value) || null)}
        />
      </FormField>
      {isVrackServicesLoading && <OdsSpinner size={ODS_SPINNER_SIZE.sm} />}
      {isPending && <LoadingText title={t('subnetUpdatePending')} />}
      <OdsButton
        isLoading={isPending}
        slot="actions"
        type="button"
        variant={ODS_BUTTON_VARIANT.ghost}
        color={ODS_BUTTON_COLOR.primary}
        {...handleClick(onClose)}
        label={t('modalSubnetUpdateCancelButton')}
      />
      <OdsButton
        isDisabled={
          (!!newCidr && !isValidCidr(newCidr)) ||
          (vlan && !isValidVlanNumber(vlan)) ||
          !hasDirtyInputs ||
          disabledInputs
        }
        slot="actions"
        type="button"
        color={ODS_BUTTON_COLOR.primary}
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
        label={t('modalSubnetUpdateConfirmButton')}
      />
    </OdsModal>
  );
}

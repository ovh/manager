import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  BUTTON_VARIANT,
  INPUT_TYPE,
  MESSAGE_COLOR,
  SPINNER_SIZE,
  TEXT_PRESET,
  Button,
  Input,
  Message,
  Modal,
  Spinner,
  Text,
  FormField,
  ModalContent,
  ModalBody,
  MessageBody,
  FormFieldLabel,
  FormFieldHelper,
  FormFieldError,
  MessageIcon,
} from '@ovhcloud/ods-react';
import {
  ButtonType,
  PageLocation,
  PageType,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import {
  useUpdateVrackServices,
  useVrackService,
} from '@ovh-ux/manager-network-common';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { MessagesContext } from '@/components/feedback-messages/Messages.context';
import { LoadingText } from '@/components/LoadingText.component';
import { PageName } from '@/utils/tracking';
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
import { TRANSLATION_NAMESPACES } from '@/utils/constants';

const sharedTrackingParams = {
  location: PageLocation.popup,
  buttonType: ButtonType.button,
};

export default function EditSubnetModal() {
  const { id, cidr } = useParams();
  const subnetCidr = cidr?.replace('_', '/');
  const { t } = useTranslation([
    TRANSLATION_NAMESPACES.subnets,
    NAMESPACES.ACTIONS,
  ]);
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
    subnet?.displayName !== displayName ||
    subnet?.cidr !== newCidr ||
    subnet?.serviceRange.cidr !== serviceRange ||
    subnet?.vlan !== vlan;

  return (
    <Modal
      open
      closeOnEscape={!isPending}
      closeOnInteractOutside={!isPending}
      onOpenChange={onClose}
    >
      <ModalContent dismissible>
        <ModalBody>
          <Text preset={TEXT_PRESET.heading4}>
            {t('modalSubnetUpdateHeadline')}
          </Text>
          {(isError || isUpdateError) && (
            <Message
              dismissible={false}
              className="mb-8"
              color={MESSAGE_COLOR.critical}
            >
              <MessageIcon name="hexagon-exclamation" />
              <MessageBody>
                {t('subnetUpdateError', {
                  error: (error || updateError).response?.data?.message,
                })}
              </MessageBody>
            </Message>
          )}
          <Text className="block mb-8" preset={TEXT_PRESET.paragraph}>
            {t('modalSubnetUpdateDescription')}
          </Text>

          <FormField className="flex mb-4">
            <FormFieldLabel htmlFor="display-name-input">
              {t('subnetUpdateDisplayNameInputLabel')}
            </FormFieldLabel>
            <Input
              id="display-name-input"
              data-testid="display-name-input"
              name="display-name-input"
              disabled={disabledInputs}
              type={INPUT_TYPE.text}
              value={displayName}
              placeholder={t('subnetNamePlaceholder')}
              onChange={(e) => setDisplayName(e?.target.value as string)}
            />
          </FormField>

          <FormField className="flex mb-4">
            <FormFieldLabel htmlFor="cidr-input">
              {t('cidrLabel')}
            </FormFieldLabel>
            <FormFieldHelper>
              <Text preset={TEXT_PRESET.caption}>
                {t('subnetRangeAdditionalText')}
              </Text>
            </FormFieldHelper>
            <Input
              id="cidr-input"
              data-testid="cidr-input"
              name="cidr-input"
              disabled={disabledInputs}
              type={INPUT_TYPE.text}
              value={newCidr}
              placeholder={defaultCidr}
              onChange={(e) => setNewCidr(e?.target.value as string)}
            />
            {!!newCidr && !isValidCidr(newCidr) && <FormFieldError />}
          </FormField>

          <FormField className="flex mb-4">
            <FormFieldLabel htmlFor="service-range">
              {t('serviceRangeLabel')}
            </FormFieldLabel>
            <Input
              id="service-range"
              data-testid="service-range"
              name="service-range"
              disabled={disabledInputs}
              type={INPUT_TYPE.text}
              value={serviceRange}
              placeholder={defaultServiceRange}
              onChange={(e) => setServiceRange(e?.target.value as string)}
            />
          </FormField>

          <FormField className="flex mb-4">
            <FormFieldLabel htmlFor="vlan-option">
              {t('vlanNumberLabel')}
            </FormFieldLabel>
            <Input
              id="vlan-option"
              data-testid="vlan-option"
              name="vlan-option"
              disabled={disabledInputs}
              type={INPUT_TYPE.number}
              value={vlan}
              placeholder={t('vlanNoVlanOptionLabel')}
              onChange={(e) => setVlan(Number(e?.target.value) || null)}
            />
          </FormField>

          {isVrackServicesLoading && <Spinner size={SPINNER_SIZE.sm} />}
          {isPending && <LoadingText title={t('subnetUpdatePending')} />}
          <div className="flex justify-end">
            <Button
              loading={isPending}
              type="button"
              variant={BUTTON_VARIANT.ghost}
              onClick={onClose}
            >
              {t('cancel', { ns: NAMESPACES.ACTIONS })}
            </Button>
            <Button
              data-testid="modify-button"
              disabled={
                (!!newCidr && !isValidCidr(newCidr)) ||
                (vlan && !isValidVlanNumber(vlan)) ||
                !hasDirtyInputs ||
                disabledInputs
              }
              type="button"
              onClick={() => {
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
              }}
            >
              {t('modify', { ns: NAMESPACES.ACTIONS })}
            </Button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

import React, { useEffect } from 'react';

import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import {
  OdsTextareaChangeEventDetail,
  OdsTextareaCustomEvent,
} from '@ovhcloud/ods-components';
import {
  OdsFormField,
  OdsText,
  OdsTextarea,
} from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Modal, useNotifications } from '@ovh-ux/manager-react-components';
import {
  ButtonType,
  PageLocation,
  PageType,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';

import { useGetIpdetails } from '@/data/hooks/ip';
import { useUpsertIpDescription } from '@/data/hooks/ip/useUpsertIpDescription';
import { TRANSLATION_NAMESPACES, fromIdToIp, ipFormatter } from '@/utils';

const MAX_CHARACTERS = 250;

export default function UpsertDescriptionModal() {
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const { trackClick, trackPage } = useOvhTracking();
  const { id, parentId } = useParams();
  const { ipAddress: ip } = ipFormatter(fromIdToIp(id));
  const { ipGroup } = ipFormatter(fromIdToIp(parentId));
  const { addSuccess } = useNotifications();
  const { t } = useTranslation([
    TRANSLATION_NAMESPACES.listing,
    NAMESPACES.ACTIONS,
    TRANSLATION_NAMESPACES.error,
  ]);
  const [characterCount, setCharacterCount] = React.useState(0);
  const [description, setDescription] = React.useState<string>('');

  const { ipDetails, isLoading } = useGetIpdetails({
    ip: ipGroup,
  });

  const closeModal = () => {
    trackClick({
      location: PageLocation.popup,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: ['edit_description', 'cancel'],
    });
    navigate(`..?${search.toString()}`);
  };

  const {
    mutate: upsertIpDescription,
    isPending: upsertIpDescriptionPending,
  } = useUpsertIpDescription({
    ip: ip ?? ipGroup,
    description,
    onSuccess: () => {
      addSuccess(t('listingUpsertDescriptionSuccessMessage', { value: ip }));
      trackPage({
        pageType: PageType.bannerSuccess,
        pageName: 'edit_description_success',
      });
      closeModal();
    },
  });

  useEffect(() => {
    setDescription(ipDetails?.description || '');
  }, [ipDetails?.description]);

  const handleDescriptionChange = (
    event: OdsTextareaCustomEvent<OdsTextareaChangeEventDetail>,
  ) => {
    const newValue = event.detail.value || '';
    setDescription(newValue);
    setCharacterCount(newValue.length);
  };

  return (
    <Modal
      isOpen
      isLoading={isLoading}
      onDismiss={closeModal}
      heading={
        ipDetails?.description
          ? t('listingActionEditDescription')
          : t('listingActionAddDescription')
      }
      isPrimaryButtonLoading={upsertIpDescriptionPending}
      primaryLabel={t('validate', { ns: NAMESPACES.ACTIONS })}
      onPrimaryButtonClick={() => {
        trackClick({
          location: PageLocation.popup,
          buttonType: ButtonType.button,
          actionType: 'action',
          actions: ['edit_description', 'confirm'],
        });
        upsertIpDescription();
      }}
      primaryButtonTestId="confirm-button"
      onSecondaryButtonClick={closeModal}
      secondaryButtonTestId="cancel-button"
      secondaryLabel={t('cancel', { ns: NAMESPACES.ACTIONS })}
    >
      <OdsFormField className="mb-4 block" id="textarea-form-field">
        <label slot="label">{t('listingUpsertDescription')}:</label>
        <OdsText slot="visual-hint" preset="caption">
          {characterCount}/{MAX_CHARACTERS}
        </OdsText>
        <OdsTextarea
          id="form-field-textarea"
          className="block pt-1"
          name="parent-ip"
          isResizable
          rows={4}
          maxlength={MAX_CHARACTERS}
          value={description}
          onOdsChange={handleDescriptionChange}
          data-testid="textarea-form-field"
          isReadonly={upsertIpDescriptionPending}
        />
      </OdsFormField>
    </Modal>
  );
}

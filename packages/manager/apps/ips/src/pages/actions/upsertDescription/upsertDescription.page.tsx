import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Modal, useNotifications } from '@ovh-ux/manager-react-components';
import {
  OdsFormField,
  OdsText,
  OdsTextarea,
} from '@ovhcloud/ods-components/react';
import { useUpsertIpDescription } from '@/data/hooks/ip/useUpsertIpDescription';
import { useGetIpdetails } from '@/data/hooks/ip';
import { fromIdToIp, ipFormatter } from '@/utils';

export default function UpsertDescriptionModal() {
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const { id, parentId } = useParams();
  const { ipAddress: ip } = id
    ? ipFormatter(fromIdToIp(id))
    : { ipAddress: undefined };
  const { ipGroup } = ipFormatter(fromIdToIp(parentId));
  const { ipDetails, isLoading } = useGetIpdetails({ ip: ipGroup });
  const { addSuccess } = useNotifications();
  const { t } = useTranslation(['listing', NAMESPACES.ACTIONS, 'error']);
  const MAX_CHARACTERS = 250;
  const [characterCount, setCharacterCount] = React.useState(0);
  const [description, setDescription] = React.useState(
    ipDetails?.description || '',
  );

  const closeModal = () => {
    navigate(`..?${search.toString()}`);
  };

  const {
    mutate: upsertIpDescription,
    isPending: upsertIpDescriptionPending,
  } = useUpsertIpDescription({
    ip: ip ?? ipGroup,
    description,
    onSuccess: () => {
      closeModal();
      addSuccess(t('listingUpsertDescriptionSuccessMessage', { value: ip }));
    },
  });

  useEffect(() => {
    setDescription(ipDetails?.description);
  }, [ipDetails?.description]);

  const handleDescriptionChange = (event: CustomEvent) => {
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
      onPrimaryButtonClick={upsertIpDescription}
      primaryButtonTestId="confirm-button"
      onSecondaryButtonClick={closeModal}
      secondaryButtonTestId="cancel-button"
      secondaryLabel={t('cancel', { ns: NAMESPACES.ACTIONS })}
    >
      <OdsFormField className="block mb-4" id="textarea-form-field">
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

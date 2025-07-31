import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useNotifications } from '@ovh-ux/manager-react-components';
import {
  OdsButton,
  OdsFormField,
  OdsModal,
  OdsText,
  OdsTextarea,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_VARIANT,
  ODS_SPINNER_SIZE,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import { useUpsertIpDescription } from '@/data/hooks/ip/useUpsertIpDescription';
import { useGetIpdetails } from '@/data/hooks/ip';
import { fromIdToIp, ipFormatter } from '@/utils';
import Loading from '../../listing/manageOrganisations/components/Loading/Loading';

export default function UpsertDescriptionModal() {
  const navigate = useNavigate();
  const { id, parentId } = useParams();
  const { ipAddress: ip } = id
    ? ipFormatter(fromIdToIp(id))
    : { ipAddress: undefined };
  const { ipGroup, isGroup } = ipFormatter(fromIdToIp(parentId));
  const { ipDetails, isLoading } = useGetIpdetails({ ip: ipGroup });
  const { addSuccess } = useNotifications();
  const { t } = useTranslation(['listing', NAMESPACES.ACTIONS, 'error']);
  const MAX_CHARACTERS = 250;
  const [characterCount, setCharacterCount] = React.useState(0);
  const [description, setDescription] = React.useState(
    ipDetails?.description || '',
  );

  const {
    mutate: upsertIpDescription,
    isPending: upsertIpDescriptionPending,
  } = useUpsertIpDescription({
    ip: ip ?? ipGroup,
    description,
    onSuccess: () => {
      navigate('..');
      addSuccess(t('listingUpsertDescriptionSuccessMessage', { value: ip }));
    },
  });

  const cancel = () => navigate('..');

  const confirm = () => upsertIpDescription();

  useEffect(() => {
    setDescription(ipDetails?.description);
  }, [ipDetails?.description]);

  const handleDescriptionChange = (event: CustomEvent) => {
    const newValue = event.detail.value || '';
    setDescription(newValue);
    setCharacterCount(newValue.length);
  };

  return (
    <OdsModal isOpen isDismissible onOdsClose={cancel}>
      {isLoading ? (
        <Loading className="flex justify-center" size={ODS_SPINNER_SIZE.sm} />
      ) : (
        <>
          <OdsText className="block mb-4" preset={ODS_TEXT_PRESET.heading4}>
            {ipDetails?.description
              ? t('listingActionEditDescription')
              : t('listingActionAddDescription')}
          </OdsText>
          {upsertIpDescriptionPending && (
            <Loading
              className="flex justify-center"
              size={ODS_SPINNER_SIZE.sm}
            />
          )}
          {!upsertIpDescriptionPending && (
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
              />
            </OdsFormField>
          )}
          <OdsButton
            slot="actions"
            type="button"
            variant={ODS_BUTTON_VARIANT.ghost}
            label={t('cancel', { ns: NAMESPACES.ACTIONS })}
            onClick={cancel}
            data-testid="cancel-button"
          />
          <OdsButton
            slot="actions"
            type="button"
            isDisabled={upsertIpDescriptionPending}
            label={t('confirm', { ns: NAMESPACES.ACTIONS })}
            onClick={confirm}
            data-testid="confirm-button"
          />
        </>
      )}
    </OdsModal>
  );
}

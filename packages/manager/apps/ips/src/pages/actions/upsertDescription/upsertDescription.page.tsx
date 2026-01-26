import React, { useEffect } from 'react';

import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import {
  FormFieldHelper,
  FormField,
  FormFieldLabel,
  Text,
  Textarea,
} from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Modal, useNotifications } from '@ovh-ux/muk';
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

  const { ipDetails, loading } = useGetIpdetails({
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
    setCharacterCount(ipDetails?.description?.length || 0);
  }, [ipDetails?.description]);

  return (
    <Modal
      loading={loading}
      onOpenChange={closeModal}
      heading={
        ipDetails?.description
          ? t('listingActionEditDescription')
          : t('listingActionAddDescription')
      }
      primaryButton={{
        label: t('validate', { ns: NAMESPACES.ACTIONS }),
        testId: 'confirm-button',
        loading: upsertIpDescriptionPending,
        onClick: () => {
          trackClick({
            location: PageLocation.popup,
            buttonType: ButtonType.button,
            actionType: 'action',
            actions: ['edit_description', 'confirm'],
          });
          upsertIpDescription();
        },
      }}
      secondaryButton={{
        label: t('cancel', { ns: NAMESPACES.ACTIONS }),
        testId: 'cancel-button',
        onClick: closeModal,
      }}
    >
      <FormField className="mb-4 block" id="textarea-form-field">
        <FormFieldLabel>{`${t('listingUpsertDescription')}:`}</FormFieldLabel>
        <Textarea
          className="w-full"
          rows={4}
          maxLength={MAX_CHARACTERS}
          value={description}
          onChange={(e) => {
            const newValue = e.target.value || '';
            setDescription(newValue);
            setCharacterCount(newValue.length);
          }}
          data-testid="textarea-form-field"
          readOnly={upsertIpDescriptionPending}
        />
        <FormFieldHelper>
          <Text preset="caption">
            {characterCount}/{MAX_CHARACTERS}
          </Text>
        </FormFieldHelper>
      </FormField>
    </Modal>
  );
}

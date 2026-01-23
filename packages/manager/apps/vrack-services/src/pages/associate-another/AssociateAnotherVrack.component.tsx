import React from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import {
  BUTTON_VARIANT,
  Button,
  FormField,
  MESSAGE_COLOR,
  Message,
  MessageBody,
  MessageIcon,
  Select,
  SelectContent,
  SelectControl,
  TEXT_PRESET,
  Text,
} from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  getVrackServicesResourceListQueryKey,
  useAssociateVrack,
  useDissociateVrack,
  useVrackService,
} from '@ovh-ux/manager-network-common';
import {
  ButtonType,
  PageLocation,
  PageType,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';

import { LoadingText } from '@/components/LoadingText.component';
import { MessagesContext } from '@/components/feedback-messages/Messages.context';
import { SuccessMessage } from '@/components/feedback-messages/SuccessMessage.component';
import { TRANSLATION_NAMESPACES } from '@/utils/constants';
import { PageName } from '@/utils/tracking';
import { getDisplayName } from '@/utils/vrack-services';

export type AssociateAnotherVrackProps = {
  vrackList: string[];
  closeModal: () => void;
};

export const AssociateAnotherVrack: React.FC<AssociateAnotherVrackProps> = ({
  vrackList,
  closeModal,
}) => {
  const { id, vrackId } = useParams();
  const { data: vs } = useVrackService();
  const queryClient = useQueryClient();
  const { addSuccessMessage } = React.useContext(MessagesContext);
  const { t } = useTranslation([
    TRANSLATION_NAMESPACES.associate,
    TRANSLATION_NAMESPACES.dissociate,
    NAMESPACES.ACTIONS,
  ]);
  const [selectedVrack, setSelectedVrack] = React.useState('');
  const { trackClick, trackPage } = useOvhTracking();
  const navigate = useNavigate();

  const {
    associateVs,
    error: associateError,
    isError: isAssociateError,
    isPending: isAssociatePending,
  } = useAssociateVrack({
    vrackServicesId: id || '',
    onSuccess: () => {
      trackPage({
        pageType: PageType.bannerSuccess,
        pageName: PageName.successAssociateVrack,
      });
      void queryClient.invalidateQueries({
        queryKey: getVrackServicesResourceListQueryKey,
      });
      navigate('..');
      addSuccessMessage(
        t('vrackServicesAssociateSuccess', {
          vs: getDisplayName(vs) || '',
          vrack: selectedVrack,
        }),
        { vrackServicesId: id },
      );
    },
    onError: () => {
      trackPage({
        pageType: PageType.bannerError,
        pageName: PageName.errorAssociateVrack,
      });
      void queryClient.invalidateQueries({
        queryKey: getVrackServicesResourceListQueryKey,
      });
    },
  });

  const {
    dissociateVs,
    error: dissociateError,
    isError: isDissociateError,
    isPending: isDissociatePending,
    isSuccess: isDissociateSuccess,
  } = useDissociateVrack({
    vrackServicesId: id || '',
    onSuccess: () => {
      associateVs({ vrackId: selectedVrack });
    },
    onError: () => {
      trackPage({
        pageType: PageType.bannerError,
        pageName: PageName.errorDissociateVrack,
      });
    },
  });

  return (
    <>
      <Text className="mb-4 block" preset={TEXT_PRESET.paragraph}>
        {t('modalAssociateAnotherVrackDescription')}
      </Text>
      {(isAssociateError || isDissociateError) && (
        <Message dismissible={false} className="mb-8" color={MESSAGE_COLOR.critical}>
          <MessageIcon name="hexagon-exclamation" />
          <MessageBody>
            {t('modalVrackAssociationError', {
              error: (associateError || dissociateError)?.response?.data.message,
            })}
          </MessageBody>
        </Message>
      )}
      {isDissociateSuccess && (
        <SuccessMessage
          message={t('vrackServicesDissociateSuccess', {
            ns: TRANSLATION_NAMESPACES.dissociate,
            vs: getDisplayName(vs) || '',
            vrack: vrackId || '',
          })}
        />
      )}
      {(isAssociatePending || isDissociatePending) && (
        <LoadingText
          title={t('modalAssociateAnotherVrackWaitMessage')}
          description={
            isAssociatePending
              ? t('addVrackServicesToVrack')
              : t('removeVrackServicesFromVrack', {
                  ns: TRANSLATION_NAMESPACES.dissociate,
                })
          }
        />
      )}
      {!isDissociateSuccess && (
        <>
          <FormField className="mb-4 block">
            <label htmlFor="vrack-id" slot="label">
              {t('modalAssociateAnotherVrackCurrentVrack')}
            </label>
            <Select
              name="vrack-id"
              items={[{ label: vrackId || '', value: vrackId || '' }]}
              defaultValue={vrackId || ''}
              disabled
            >
              <SelectControl />
              <SelectContent />
            </Select>
          </FormField>
          <FormField className="mb-6 block">
            <label htmlFor="select-another-vrack" slot="label">
              {t('modalAssociateAnotherVrackSelect')}
            </label>
            <Select
              id="select-another-vrack"
              name="select-another-vrack"
              disabled={isAssociatePending || isDissociatePending}
              items={vrackList
                .filter((vrack) => vrack !== vrackId)
                .map((vrack) => ({ label: vrack, value: vrack }))}
              onValueChange={(event) => setSelectedVrack(event.value[0] as string)}
            >
              <SelectControl placeholder={t('vrackSelectPlaceholder')} />
              <SelectContent />
            </Select>
          </FormField>
          <div className="flex justify-end gap-8">
            <Button
              slot="actions"
              type="button"
              disabled={isDissociatePending || isAssociatePending}
              variant={BUTTON_VARIANT.ghost}
              onClick={closeModal}
            >
              {t('cancel', { ns: NAMESPACES.ACTIONS })}
            </Button>
            <Button
              slot="actions"
              type="button"
              loading={isDissociatePending || isAssociatePending}
              disabled={!selectedVrack}
              onClick={() => {
                trackClick({
                  location: PageLocation.popup,
                  buttonType: ButtonType.button,
                  actions: ['associate-another-vrack', 'confirm'],
                });
                dissociateVs();
              }}
            >
              {t('modalConfirmVrackAssociationButtonLabel')}
            </Button>
          </div>
        </>
      )}
    </>
  );
};

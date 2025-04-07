import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ODS_BUTTON_VARIANT,
  ODS_MESSAGE_COLOR,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import {
  OdsText,
  OdsSelect,
  OdsMessage,
  OdsButton,
  OdsFormField,
} from '@ovhcloud/ods-components/react';
import {
  PageLocation,
  ButtonType,
  useOvhTracking,
  PageType,
} from '@ovh-ux/manager-react-shell-client';
import { useNavigate, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import {
  getVrackServicesResourceListQueryKey,
  useAssociateVrack,
  useDissociateVrack,
  useVrackService,
} from '@ovh-ux/manager-network-common';
import { PageName } from '@/utils/tracking';
import { LoadingText } from '@/components/LoadingText.component';
import { MessagesContext } from '@/components/feedback-messages/Messages.context';
import { SuccessMessage } from '@/components/feedback-messages/SuccessMessage.component';
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
  const { t } = useTranslation('vrack-services/associate');
  const { t: tDissociate } = useTranslation('vrack-services/dissociate');
  const [selectedVrack, setSelectedVrack] = React.useState('');
  const { trackClick, trackPage } = useOvhTracking();
  const navigate = useNavigate();

  const {
    associateVs,
    error: associateError,
    isError: isAssociateError,
    isPending: isAssociatePending,
  } = useAssociateVrack({
    vrackServicesId: id,
    onSuccess: () => {
      trackPage({
        pageType: PageType.bannerSuccess,
        pageName: PageName.successAssociateVrack,
      });
      queryClient.invalidateQueries({
        queryKey: getVrackServicesResourceListQueryKey,
      });
      navigate('..');
      addSuccessMessage(
        t('vrackServicesAssociateSuccess', {
          vs: getDisplayName(vs),
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
      queryClient.invalidateQueries({
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
    vrackServicesId: id,
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
      <OdsText className="block mb-4" preset={ODS_TEXT_PRESET.paragraph}>
        {t('modalAssociateAnotherVrackDescription')}
      </OdsText>
      {(isAssociateError || isDissociateError) && (
        <OdsMessage
          isDismissible={false}
          className="block mb-8"
          color={ODS_MESSAGE_COLOR.critical}
        >
          {t('modalVrackAssociationError', {
            error: (associateError || dissociateError)?.response?.data.message,
          })}
        </OdsMessage>
      )}
      {isDissociateSuccess && (
        <SuccessMessage
          message={tDissociate('vrackServicesDissociateSuccess', {
            vs: getDisplayName(vs),
            vrack: vrackId,
          })}
        />
      )}
      {(isAssociatePending || isDissociatePending) && (
        <LoadingText
          title={t('modalAssociateAnotherVrackWaitMessage')}
          description={
            isAssociatePending
              ? t('addVrackServicesToVrack')
              : tDissociate('removeVrackServicesFromVrack')
          }
        />
      )}
      {!isDissociateSuccess && (
        <>
          <OdsFormField className="block mb-4">
            <label htmlFor="vrack-id" slot="label">
              {t('modalAssociateAnotherVrackCurrentVrack')}
            </label>
            <OdsSelect name="vrack-id" defaultValue={vrackId} isDisabled>
              <option key={vrackId} value={vrackId}>
                {vrackId}
              </option>
            </OdsSelect>
          </OdsFormField>
          <OdsFormField className="block mb-6">
            <label htmlFor="select-another-vrack" slot="label">
              {t('modalAssociateAnotherVrackSelect')}
            </label>
            <OdsSelect
              id="select-another-vrack"
              name="select-another-vrack"
              isDisabled={isAssociatePending || isDissociatePending}
              placeholder={t('vrackSelectPlaceholder')}
              onOdsChange={(event) =>
                setSelectedVrack(event.detail.value as string)
              }
            >
              {vrackList
                .filter((vrack) => vrack !== vrackId)
                .map((vrack) => (
                  <option key={vrack} value={vrack}>
                    {vrack}
                  </option>
                ))}
            </OdsSelect>
          </OdsFormField>
          <OdsButton
            slot="actions"
            type="button"
            isDisabled={isDissociatePending || isAssociatePending}
            variant={ODS_BUTTON_VARIANT.ghost}
            label={t('modalAssociateCancelButton')}
            onClick={closeModal}
          />
          <OdsButton
            slot="actions"
            type="button"
            isLoading={isDissociatePending || isAssociatePending}
            isDisabled={!selectedVrack}
            label={t('modalConfirmVrackAssociationButtonLabel')}
            onClick={() => {
              trackClick({
                location: PageLocation.popup,
                buttonType: ButtonType.button,
                actions: ['associate-another-vrack', 'confirm'],
              });
              dissociateVs();
            }}
          />
        </>
      )}
    </>
  );
};

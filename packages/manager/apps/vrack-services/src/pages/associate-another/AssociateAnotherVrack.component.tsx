import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ODS_BUTTON_COLOR,
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
import { handleClick } from '@ovh-ux/manager-react-components';
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
      <OdsText className="block mb-6" preset={ODS_TEXT_PRESET.paragraph}>
        {t('modalAssociateAnotherVrackDescription')}
      </OdsText>
      {(isAssociateError || isDissociateError) && (
        <OdsMessage className="mb-8" color={ODS_MESSAGE_COLOR.critical}>
          <OdsText preset={ODS_TEXT_PRESET.paragraph}>
            {t('modalVrackAssociationError', {
              error: (associateError || dissociateError)?.response?.data
                .message,
            })}
          </OdsText>
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
      {!isAssociatePending && !isDissociatePending && !isDissociateSuccess && (
        <>
          <OdsFormField>
            <label htmlFor="vrack-id">
              <OdsText preset={ODS_TEXT_PRESET.span}>
                {t('modalAssociateAnotherVrackCurrentVrack')}
              </OdsText>
            </label>
            <OdsSelect
              name="vrack-id"
              defaultValue={vrackId}
              isDisabled
              className="block mb-6"
            >
              <option key={vrackId} value={vrackId}>
                {vrackId}
              </option>
            </OdsSelect>
          </OdsFormField>
          <OdsFormField>
            <label htmlFor="select-another-vrack">
              <OdsText preset={ODS_TEXT_PRESET.span}>
                {t('modalAssociateAnotherVrackSelect')}
              </OdsText>
            </label>
            <OdsSelect
              name="select-another-vrack"
              data-testid="select-another-vrack"
              isDisabled={isAssociatePending || isDissociatePending}
              onOdsChange={(event) =>
                setSelectedVrack(event.detail.value as string)
              }
              placeholder={t('vrackSelectPlaceholder')}
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
            variant={ODS_BUTTON_VARIANT.ghost}
            color={ODS_BUTTON_COLOR.primary}
            {...handleClick(closeModal)}
            label={t('modalAssociateCancelButton')}
          />
          <OdsButton
            slot="actions"
            type="button"
            color={ODS_BUTTON_COLOR.primary}
            isLoading={isDissociatePending || isAssociatePending}
            isDisabled={!selectedVrack}
            {...handleClick(() => {
              trackClick({
                location: PageLocation.popup,
                buttonType: ButtonType.button,
                actions: ['associate-another-vrack', 'confirm'],
              });
              dissociateVs();
            })}
            label={t('modalConfirmVrackAssociationButtonLabel')}
          />
        </>
      )}
    </>
  );
};

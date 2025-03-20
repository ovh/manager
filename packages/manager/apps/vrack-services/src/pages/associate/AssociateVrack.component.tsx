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
} from '@ovhcloud/ods-components/react';
import { useQueryClient } from '@tanstack/react-query';
import {
  PageLocation,
  ButtonType,
  useOvhTracking,
  PageType,
} from '@ovh-ux/manager-react-shell-client';
import { useNavigate, useParams } from 'react-router-dom';
import { handleClick } from '@ovh-ux/manager-react-components';
import {
  getVrackServicesResourceListQueryKey,
  useAssociateVrack,
  useVrackService,
} from '@ovh-ux/manager-network-common';
import { MessagesContext } from '@/components/feedback-messages/Messages.context';
import { LoadingText } from '@/components/LoadingText.component';
import { PageName } from '@/utils/tracking';
import { getDisplayName } from '@/utils/vrack-services';

export type AssociateVrackProps = {
  vrackList: string[];
  closeModal: () => void;
};

export const AssociateVrack: React.FC<AssociateVrackProps> = ({
  vrackList,
  closeModal,
}) => {
  const { id } = useParams();
  const { t } = useTranslation('vrack-services/associate');
  const { addSuccessMessage } = React.useContext(MessagesContext);
  const [selectedVrack, setSelectedVrack] = React.useState('');
  const { data: vs } = useVrackService();
  const queryClient = useQueryClient();
  const { trackClick, trackPage } = useOvhTracking();
  const navigate = useNavigate();

  const { associateVs, error, isError, isPending } = useAssociateVrack({
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

  return (
    <>
      <OdsText className="block mb-4" preset={ODS_TEXT_PRESET.paragraph}>
        {t('modalVrackAssociationDescription')}
      </OdsText>
      {isError && (
        <OdsMessage color={ODS_MESSAGE_COLOR.critical}>
          <OdsText preset={ODS_TEXT_PRESET.paragraph}>
            {t('modalVrackAssociationError', {
              error: error?.response?.data?.message,
            })}
          </OdsText>
        </OdsMessage>
      )}
      <OdsSelect
        name="select-vrack-input"
        data-testid="select-vrack-input"
        className="mb-4"
        isDisabled={isPending}
        onOdsChange={(event) => setSelectedVrack(event.detail.value as string)}
        placeholder={t('vrackSelectPlaceholder')}
      >
        {vrackList.map((vrack) => (
          <option key={vrack} value={vrack}>
            {vrack}
          </option>
        ))}
      </OdsSelect>
      {isPending && (
        <LoadingText
          title={t('modalAssociateVrackWaitMessage')}
          description={t('addVrackServicesToVrack')}
        />
      )}
      <OdsButton
        slot="actions"
        isLoading={isPending}
        type="button"
        variant={ODS_BUTTON_VARIANT.ghost}
        color={ODS_BUTTON_COLOR.primary}
        {...handleClick(closeModal)}
        label={t('modalAssociateCancelButton')}
      />
      <OdsButton
        slot="actions"
        type="button"
        variant={ODS_BUTTON_VARIANT.default}
        color={ODS_BUTTON_COLOR.primary}
        isLoading={isPending}
        isDisabled={!selectedVrack}
        {...handleClick(() => {
          trackClick({
            location: PageLocation.popup,
            buttonType: ButtonType.button,
            actions: ['associate-vrack', 'confirm'],
          });
          associateVs({ vrackId: selectedVrack });
        })}
        label={t('modalConfirmVrackAssociationButtonLabel')}
      />
    </>
  );
};

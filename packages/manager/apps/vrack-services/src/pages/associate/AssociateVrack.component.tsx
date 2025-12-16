import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  BUTTON_VARIANT,
  MESSAGE_COLOR,
  TEXT_PRESET,
  Text,
  Select,
  Message,
  MessageBody,
  MessageIcon,
  Button,
  SelectControl,
  SelectContent,
} from '@ovhcloud/ods-react';
import { useQueryClient } from '@tanstack/react-query';
import {
  PageLocation,
  ButtonType,
  useOvhTracking,
  PageType,
} from '@ovh-ux/manager-react-shell-client';
import { useNavigate, useParams } from 'react-router-dom';
import {
  getVrackServicesResourceListQueryKey,
  useAssociateVrack,
  useVrackService,
} from '@ovh-ux/manager-network-common';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { MessagesContext } from '@/components/feedback-messages/Messages.context';
import { LoadingText } from '@/components/LoadingText.component';
import { PageName } from '@/utils/tracking';
import { getDisplayName } from '@/utils/vrack-services';
import { TRANSLATION_NAMESPACES } from '@/utils/constants';

export type AssociateVrackProps = {
  vrackList: string[];
  closeModal: () => void;
};

export const AssociateVrack: React.FC<AssociateVrackProps> = ({
  vrackList,
  closeModal,
}) => {
  const { id } = useParams();
  const { t } = useTranslation([
    TRANSLATION_NAMESPACES.associate,
    NAMESPACES.ACTIONS,
  ]);
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
      <Text className="block mb-4" preset={TEXT_PRESET.paragraph}>
        {t('modalVrackAssociationDescription')}
      </Text>
      {isError && (
        <Message dismissible={false} color={MESSAGE_COLOR.critical}>
          <MessageIcon name="hexagon-exclamation" />
          <MessageBody>
            {t('modalVrackAssociationError', {
              error: error?.response?.data?.message,
            })}
          </MessageBody>
        </Message>
      )}
      <Select
        id="select-vrack-input"
        name="select-vrack-input"
        className="block mb-4"
        disabled={isPending}
        onValueChange={(event) => setSelectedVrack(event.value[0] as string)}
        items={vrackList.map((vrack) => ({ label: vrack, value: vrack }))}
      >
        <SelectControl placeholder={t('vrackSelectPlaceholder')} />
        <SelectContent />
      </Select>
      {isPending && (
        <LoadingText
          title={t('cancel', { ns: NAMESPACES.ACTIONS })}
          description={t('addVrackServicesToVrack')}
        />
      )}
      <div className="flex justify-end gap-8">
        <Button
          slot="actions"
          disabled={isPending}
          type="button"
          variant={BUTTON_VARIANT.ghost}
          onClick={closeModal}
        >
          {t('cancel', { ns: NAMESPACES.ACTIONS })}
        </Button>
        <Button
          slot="actions"
          type="button"
          loading={isPending}
          disabled={!selectedVrack}
          onClick={() => {
            trackClick({
              location: PageLocation.popup,
              buttonType: ButtonType.button,
              actions: ['associate-vrack', 'confirm'],
            });
            associateVs({ vrackId: selectedVrack });
          }}
        >
          {t('modalConfirmVrackAssociationButtonLabel')}
        </Button>
      </div>
    </>
  );
};

import React from 'react';
import { useTranslation } from 'react-i18next';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_TYPE,
  ODS_BUTTON_VARIANT,
  ODS_MESSAGE_TYPE,
  ODS_SELECT_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
  OdsSelectValueChangeEvent,
} from '@ovhcloud/ods-components';
import {
  OsdsText,
  OsdsSelect,
  OsdsSelectOption,
  OsdsMessage,
  OsdsButton,
} from '@ovhcloud/ods-components/react';
import { useQueryClient } from '@tanstack/react-query';
import {
  PageLocation,
  ButtonType,
  useOvhTracking,
  PageType,
} from '@ovh-ux/manager-react-shell-client';
import { useNavigate, useParams } from 'react-router-dom';
import { handleClick } from '@ovhcloud/manager-components';
import {
  getVrackServicesResourceListQueryKey,
  useVrackService,
  useAssociateVrack,
  getDisplayName,
} from '@/data';
import { MessagesContext } from '@/components/feedback-messages/Messages.context';
import { LoadingText } from '@/components/LoadingText.component';
import { PageName } from '@/utils/tracking';

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
        id,
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
      <OsdsText
        className="block mb-4"
        level={ODS_TEXT_LEVEL.body}
        size={ODS_TEXT_SIZE._400}
        color={ODS_THEME_COLOR_INTENT.text}
      >
        {t('modalVrackAssociationDescription')}
      </OsdsText>
      {isError && (
        <OsdsMessage type={ODS_MESSAGE_TYPE.error}>
          <OsdsText
            level={ODS_TEXT_LEVEL.body}
            size={ODS_TEXT_SIZE._400}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {t('modalVrackAssociationError', {
              error: error?.response?.data?.message,
            })}
          </OsdsText>
        </OsdsMessage>
      )}
      <OsdsSelect
        className="mb-4"
        size={ODS_SELECT_SIZE.md}
        disabled={isPending || undefined}
        onOdsValueChange={(event: OdsSelectValueChangeEvent) =>
          setSelectedVrack(event.detail.value as string)
        }
      >
        <span slot="placeholder">{t('vrackSelectPlaceholder')}</span>
        {vrackList.map((vrack) => (
          <OsdsSelectOption key={vrack} value={vrack}>
            {vrack}
          </OsdsSelectOption>
        ))}
      </OsdsSelect>
      {isPending && (
        <LoadingText
          title={t('modalAssociateVrackWaitMessage')}
          description={t('addVrackServicesToVrack')}
        />
      )}
      <OsdsButton
        slot="actions"
        disabled={isPending || undefined}
        type={ODS_BUTTON_TYPE.button}
        variant={ODS_BUTTON_VARIANT.ghost}
        color={ODS_THEME_COLOR_INTENT.primary}
        {...handleClick(closeModal)}
      >
        {t('modalAssociateCancelButton')}
      </OsdsButton>
      <OsdsButton
        slot="actions"
        type={ODS_BUTTON_TYPE.button}
        variant={ODS_BUTTON_VARIANT.flat}
        color={ODS_THEME_COLOR_INTENT.primary}
        disabled={isPending || !selectedVrack || undefined}
        {...handleClick(() => {
          trackClick({
            location: PageLocation.popup,
            buttonType: ButtonType.button,
            actions: ['associate-vrack', 'confirm'],
          });
          associateVs({ vrackId: selectedVrack });
        })}
      >
        {t('modalConfirmVrackAssociationButtonLabel')}
      </OsdsButton>
    </>
  );
};

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
  OsdsFormField,
} from '@ovhcloud/ods-components/react';
import {
  PageLocation,
  ButtonType,
  useOvhTracking,
  PageType,
} from '@ovh-ux/manager-react-shell-client';
import { useNavigate, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { handleClick } from '@ovhcloud/manager-components';
import { PageName } from '@/utils/tracking';
import { LoadingText } from '@/components/LoadingText';
import {
  getDisplayName,
  getVrackServicesResourceListQueryKey,
  useAssociateVrack,
  useDissociateVrack,
  useVrackService,
} from '@/api';
import { MessagesContext } from '@/components/Messages/Messages.context';
import { SuccessMessage } from '@/components/Messages/SuccessMessage';

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
      <OsdsText
        className="block mb-6"
        level={ODS_TEXT_LEVEL.body}
        size={ODS_TEXT_SIZE._400}
        color={ODS_THEME_COLOR_INTENT.text}
      >
        {t('modalAssociateAnotherVrackDescription')}
      </OsdsText>
      {(isAssociateError || isDissociateError) && (
        <OsdsMessage className="mb-8" type={ODS_MESSAGE_TYPE.error}>
          <OsdsText
            level={ODS_TEXT_LEVEL.body}
            size={ODS_TEXT_SIZE._400}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {t('modalVrackAssociationError', {
              error: (associateError || dissociateError)?.response?.data
                .message,
            })}
          </OsdsText>
        </OsdsMessage>
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
          <OsdsFormField>
            <span slot="label">
              <OsdsText
                level={ODS_TEXT_LEVEL.body}
                size={ODS_TEXT_SIZE._200}
                color={ODS_THEME_COLOR_INTENT.text}
              >
                {t('modalAssociateAnotherVrackCurrentVrack')}
              </OsdsText>
            </span>
            <OsdsSelect
              size={ODS_SELECT_SIZE.md}
              defaultValue={vrackId}
              disabled
              className="block mb-6"
            >
              <OsdsSelectOption key={vrackId} value={vrackId}>
                {vrackId}
              </OsdsSelectOption>
            </OsdsSelect>
          </OsdsFormField>
          <OsdsFormField>
            <span slot="label">
              <OsdsText
                level={ODS_TEXT_LEVEL.body}
                size={ODS_TEXT_SIZE._200}
                color={ODS_THEME_COLOR_INTENT.text}
              >
                {t('modalAssociateAnotherVrackSelect')}
              </OsdsText>
            </span>
            <OsdsSelect
              size={ODS_SELECT_SIZE.md}
              disabled={isAssociatePending || isDissociatePending || undefined}
              onOdsValueChange={(event: OdsSelectValueChangeEvent) =>
                setSelectedVrack(event.detail.value as string)
              }
            >
              <span slot="placeholder">{t('vrackSelectPlaceholder')}</span>
              {vrackList
                .filter((vrack) => vrack !== vrackId)
                .map((vrack) => (
                  <OsdsSelectOption key={vrack} value={vrack}>
                    {vrack}
                  </OsdsSelectOption>
                ))}
            </OsdsSelect>
          </OsdsFormField>
          <OsdsButton
            slot="actions"
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
            disabled={
              isAssociatePending ||
              isDissociatePending ||
              !selectedVrack ||
              undefined
            }
            {...handleClick(() => {
              trackClick({
                location: PageLocation.popup,
                buttonType: ButtonType.button,
                actions: ['associate-another-vrack', 'confirm'],
              });
              dissociateVs();
            })}
          >
            {t('modalConfirmVrackAssociationButtonLabel')}
          </OsdsButton>
        </>
      )}
    </>
  );
};

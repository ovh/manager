import React from 'react';
import { useTranslation } from 'react-i18next';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_TYPE,
  ODS_BUTTON_VARIANT,
  ODS_MESSAGE_TYPE,
  ODS_SELECT_SIZE,
  ODS_SPINNER_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
  OdsSelectValueChangeEvent,
} from '@ovhcloud/ods-components';
import {
  OsdsText,
  OsdsSelect,
  OsdsSpinner,
  OsdsSelectOption,
  OsdsMessage,
  OsdsButton,
  OsdsFormField,
} from '@ovhcloud/ods-components/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import {
  PageLocation,
  ButtonType,
  useOvhTracking,
  PageType,
} from '@ovh-ux/manager-react-shell-client';
import { useNavigate } from 'react-router-dom';
import {
  associateVrackServicesQueryKey,
  associateVrackServices,
  getVrackServicesResourceListQueryKey,
  Task,
} from '@/api';
import { handleClick } from '@/utils/ods-utils';
import { useAssociateAnotherVrack } from './AssociateAnotherVrack.hook';
import { PageName } from '@/utils/tracking';

export type AssociateAnotherVrackProps = {
  vrackServicesId: string;
  currentVrack: string;
  vrackList: string[];
  closeModal: () => void;
};

export const AssociateAnotherVrack: React.FC<AssociateAnotherVrackProps> = ({
  vrackServicesId,
  currentVrack,
  vrackList,
  closeModal,
}) => {
  const { t } = useTranslation('vrack-services/dashboard');
  const { t: listingTranslation } = useTranslation('vrack-services/listing');
  const [selectedVrack, setSelectedVrack] = React.useState('');
  const { trackClick, trackPage } = useOvhTracking();
  const navigate = useNavigate();

  const {
    startAssociateToAnotherVrack,
    isError,
    error,
    loadingState,
  } = useAssociateAnotherVrack({
    vrackServices: vrackServicesId,
    currentVrack,
    onSuccess: () => {
      trackPage({
        pageType: PageType.bannerSuccess,
        pageName: PageName.successAssociateAnotherVrack,
      });
      navigate('..');
    },
    onError: () => {
      trackPage({
        pageType: PageType.bannerError,
        pageName: PageName.errorAssociateAnotherVrack,
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
      {isError && (
        <OsdsMessage type={ODS_MESSAGE_TYPE.error}>
          <OsdsText
            level={ODS_TEXT_LEVEL.body}
            size={ODS_TEXT_SIZE._400}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {listingTranslation('updateError', {
              error: error?.response?.data.message,
            })}
          </OsdsText>
        </OsdsMessage>
      )}
      {loadingState?.isLoading && (
        <div className="flex items-center">
          <OsdsSpinner inline size={ODS_SPINNER_SIZE.md} />
          <div className="ml-5 mb-3 flex flex-col">
            <OsdsText
              level={ODS_TEXT_LEVEL.body}
              size={ODS_TEXT_SIZE._200}
              color={ODS_THEME_COLOR_INTENT.text}
            >
              {t('modalAssociateAnotherVrackWaitMessage')}
            </OsdsText>
            {loadingState.state && (
              <OsdsText
                className="block"
                level={ODS_TEXT_LEVEL.body}
                size={ODS_TEXT_SIZE._200}
                color={ODS_THEME_COLOR_INTENT.text}
              >
                {t(loadingState.state)}
              </OsdsText>
            )}
          </div>
        </div>
      )}
      {!loadingState?.isLoading && (
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
              defaultValue={currentVrack}
              disabled={true}
              className="block mb-6"
            >
              <OsdsSelectOption key={currentVrack} value={currentVrack}>
                {currentVrack}
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
              disabled={loadingState?.isLoading || undefined}
              onOdsValueChange={(event: OdsSelectValueChangeEvent) =>
                setSelectedVrack(event.detail.value as string)
              }
            >
              <span slot="placeholder">
                {listingTranslation('vrackSelectPlaceholder')}
              </span>
              {vrackList
                .filter((vrack) => vrack !== currentVrack)
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
            {listingTranslation('modalCancelVrackAssociationButtonLabel')}
          </OsdsButton>
          <OsdsButton
            slot="actions"
            type={ODS_BUTTON_TYPE.button}
            variant={ODS_BUTTON_VARIANT.flat}
            color={ODS_THEME_COLOR_INTENT.primary}
            disabled={loadingState?.isLoading || !selectedVrack || undefined}
            {...handleClick(() => {
              trackClick({
                location: PageLocation.popup,
                buttonType: ButtonType.button,
                actions: ['associate-another-vrack', 'confirm'],
              });
              startAssociateToAnotherVrack({ newVrack: selectedVrack });
            })}
          >
            {listingTranslation('modalConfirmVrackAssociationButtonLabel')}
          </OsdsButton>
        </>
      )}
    </>
  );
};

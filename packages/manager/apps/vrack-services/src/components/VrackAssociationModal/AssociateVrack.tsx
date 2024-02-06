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
} from '@ovhcloud/ods-components/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import {
  associateVrackServicesQueryKey,
  associateVrackServices,
  getVrackServicesResourceListQueryKey,
  Task,
} from '@/api';
import { handleClick } from '@/utils/ods-utils';

export type AssociateVrackProps = {
  vrackServicesId: string;
  vrackList: string[];
  closeModal: () => void;
};

export const AssociateVrack: React.FC<AssociateVrackProps> = ({
  vrackServicesId,
  vrackList,
  closeModal,
}) => {
  const { t } = useTranslation('vrack-services/listing');
  const [selectedVrack, setSelectedVrack] = React.useState('');
  const queryClient = useQueryClient();

  const { mutate: associateVs, isPending, isError, error } = useMutation<
    ApiResponse<Task>,
    ApiError
  >({
    mutationFn: () =>
      associateVrackServices({
        vrack: selectedVrack,
        vrackServices: vrackServicesId,
      }),
    mutationKey: associateVrackServicesQueryKey(vrackServicesId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getVrackServicesResourceListQueryKey,
      });
      closeModal();
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
          {t('updateError', {
            error: error?.response?.data.message,
            interpolation: { escapeValue: false },
          })}
        </OsdsMessage>
      )}
      <OsdsSelect
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
      {isPending && <OsdsSpinner inline size={ODS_SPINNER_SIZE.md} />}
      <OsdsButton
        slot="actions"
        type={ODS_BUTTON_TYPE.button}
        variant={ODS_BUTTON_VARIANT.ghost}
        color={ODS_THEME_COLOR_INTENT.primary}
        {...handleClick(closeModal)}
      >
        {t('modalCancelVrackAssociationButtonLabel')}
      </OsdsButton>
      <OsdsButton
        slot="actions"
        type={ODS_BUTTON_TYPE.button}
        variant={ODS_BUTTON_VARIANT.flat}
        color={ODS_THEME_COLOR_INTENT.primary}
        disabled={isPending || !selectedVrack || undefined}
        {...handleClick(() => associateVs())}
      >
        {t('modalConfirmVrackAssociationButtonLabel')}
      </OsdsButton>
    </>
  );
};

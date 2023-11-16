import React from 'react';
import { useTranslation } from 'react-i18next';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_TYPE,
  ODS_BUTTON_VARIANT,
} from '@ovhcloud/ods-components/button';
import { OsdsButton } from '@ovhcloud/ods-components/button/react';
import { ODS_MESSAGE_TYPE } from '@ovhcloud/ods-components/message';
import { OsdsMessage } from '@ovhcloud/ods-components/message/react';
import {
  OsdsSelect,
  OsdsSelectOption,
} from '@ovhcloud/ods-components/select/react';
import {
  ODS_SELECT_SIZE,
  OdsSelectValueChangeEvent,
} from '@ovhcloud/ods-components/select';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { OsdsSpinner } from '@ovhcloud/ods-components/spinner/react';
import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components/spinner';
import { OsdsText } from '@ovhcloud/ods-components/text/react';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components/text';
import {
  associateVrackServicesQueryKey,
  associateVrackServices,
  getListingIcebergQueryKey,
} from '@/api';

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

  const { mutate: associateVs, isLoading, isError } = useMutation({
    mutationFn: () =>
      associateVrackServices({
        vrack: selectedVrack,
        vrackServices: vrackServicesId,
      }),
    mutationKey: associateVrackServicesQueryKey(vrackServicesId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getListingIcebergQueryKey });
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
          {t('genericApiError')}
        </OsdsMessage>
      )}
      <OsdsSelect
        inline
        size={ODS_SELECT_SIZE.md}
        disabled={isLoading || undefined}
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
      {isLoading && <OsdsSpinner inline size={ODS_SPINNER_SIZE.md} />}
      <OsdsButton
        slot="actions"
        type={ODS_BUTTON_TYPE.button}
        variant={ODS_BUTTON_VARIANT.ghost}
        color={ODS_THEME_COLOR_INTENT.primary}
        onClick={closeModal}
        onKeyDown={(event: React.KeyboardEvent) => {
          if ([' ', 'Enter'].includes(event.key)) {
            closeModal();
          }
        }}
      >
        {t('modalCancelVrackAssociationButtonLabel')}
      </OsdsButton>
      <OsdsButton
        slot="actions"
        type={ODS_BUTTON_TYPE.button}
        variant={ODS_BUTTON_VARIANT.flat}
        color={ODS_THEME_COLOR_INTENT.primary}
        disabled={isLoading || !selectedVrack || undefined}
        onClick={associateVs}
        onKeyDown={(event: React.KeyboardEvent) => {
          if ([' ', 'Enter'].includes(event.key)) {
            associateVs();
          }
        }}
      >
        {t('modalConfirmVrackAssociationButtonLabel')}
      </OsdsButton>
    </>
  );
};

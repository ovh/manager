import React, { useState } from 'react';

import { AxiosResponse } from 'axios';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';

import {
  OdsButton,
  OdsFormField,
  OdsInput,
  OdsMessage,
  OdsModal,
  OdsText,
} from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ApiError } from '@ovh-ux/manager-core-api';

import TEST_IDS from '@/utils/testIds.constants';

import Loading from '../loading/Loading.component';

interface EditModalProps {
  detailValue: string;
  headline: string;
  inputLabel: string;
  errorHelper: string;
  validateDetail: (detail: string) => boolean;
  onCloseModal: () => void;
  onEdit: (detail: string) => Promise<AxiosResponse<unknown>>;
  error: ApiError | null;
  isLoading: boolean;
}

export const EditDetailModal = ({
  detailValue,
  headline,
  inputLabel,
  errorHelper,
  validateDetail,
  onCloseModal,
  onEdit,
  error,
  isLoading,
}: EditModalProps) => {
  const { t: tError } = useTranslation(NAMESPACES.ERROR);
  const { t: tActions } = useTranslation(NAMESPACES.ACTIONS);
  const [newDetail, setNewDetail] = useState<string>(detailValue || '');
  const [updateError, setUpdateError] = useState(error);
  const isValid = validateDetail(newDetail);
  const isButtonEnabled = isValid && newDetail !== detailValue && !isLoading;

  const handleSubmit = async () => {
    if (isValid) {
      try {
        await onEdit(newDetail);
      } catch (err) {
        setUpdateError(err as ApiError);
      }
    }
  };

  return (
    <OdsModal onOdsClose={onCloseModal} isOpen isDismissible>
      <div className="flex flex-col">
        <OdsText preset="heading-3">{headline}</OdsText>
        {!!updateError && (
          <OdsMessage color="danger" isDismissible onOdsRemove={() => setUpdateError(null)}>
            {tError('error_message', {
              message: updateError.response?.data?.message || updateError?.message,
            })}
          </OdsMessage>
        )}
      </div>
      <OdsFormField className="flex flex-col" error={isValid ? undefined : errorHelper}>
        <OdsText className="mt-6" slot="label">
          {inputLabel}
        </OdsText>
        <OdsInput
          name="edit-detail"
          type="text"
          value={newDetail}
          onOdsChange={(e) => setNewDetail(e.target.value as string)}
          hasError={!isValid}
          ariaLabel="edit-input"
        />
        <OdsText
          slot="helper"
          preset="caption"
          className={clsx(
            '[&::part(text)]:w-full [&::part(text)]:text-start',
            isValid ? 'block' : 'hidden',
          )}
        >
          {errorHelper}
        </OdsText>
      </OdsFormField>
      {isLoading && <Loading slot="actions" className="mr-4 w-9" />}
      <div className="ml-auto mt-6 flex w-fit gap-x-4 justify-self-center">
        <OdsButton label={tActions('cancel')} variant="ghost" onClick={onCloseModal} />
        <OdsButton
          label={tActions('modify')}
          onClick={handleSubmit}
          isDisabled={!isButtonEnabled || undefined}
          data-testid={TEST_IDS.modalSubmitCta}
          type="submit"
        />
      </div>
    </OdsModal>
  );
};

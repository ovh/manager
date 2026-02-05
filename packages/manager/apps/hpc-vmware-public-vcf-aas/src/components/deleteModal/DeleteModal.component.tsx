import { useState } from 'react';

import { Trans, useTranslation } from 'react-i18next';

import { ODS_MODAL_COLOR } from '@ovhcloud/ods-components';
import { OdsInput, OdsText } from '@ovhcloud/ods-components/react';

import { Modal } from '@ovh-ux/manager-react-components';

type DeleteModalProps = React.ComponentProps<typeof Modal> & {
  confirmationKeyword?: string;
};

export function DeleteModal({
  confirmationKeyword,
  isPrimaryButtonDisabled,
  children,
  ...modalProps
}: DeleteModalProps) {
  const [inputValue, setInputValue] = useState('');
  const { t } = useTranslation('terminate');

  const isConfirmationValid = confirmationKeyword ? inputValue === confirmationKeyword : true;

  return (
    <Modal
      {...modalProps}
      type={ODS_MODAL_COLOR.critical}
      isPrimaryButtonDisabled={isPrimaryButtonDisabled || !isConfirmationValid}
    >
      <div className="flex flex-col gap-4">
        {children}

        {!!confirmationKeyword && (
          <>
            <OdsText preset="caption">
              <Trans
                t={t}
                i18nKey="terminate_confirm_deletion_service"
                values={{ confirmationKeyword }}
                components={{
                  1: <strong />,
                }}
              />
            </OdsText>
            <OdsInput
              name="confirm-delete-by-keyword"
              value={inputValue}
              onOdsChange={(e) => setInputValue(e.detail.value as string)}
              placeholder={confirmationKeyword}
              isClearable
            />
          </>
        )}
      </div>
    </Modal>
  );
}

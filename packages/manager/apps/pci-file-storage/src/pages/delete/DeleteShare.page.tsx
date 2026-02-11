import React, { useCallback, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { Trans, useTranslation } from 'react-i18next';

import {
  Button,
  FormField,
  FormFieldError,
  FormFieldLabel,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Text,
} from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { useShare } from '@/data/hooks/shares/useShare';
import { useShareParams } from '@/hooks/useShareParams';
import { selectShareDetails } from '@/pages/dashboard/view-model/shareDetails.view-model';

const CONFIRM_VALUE = 'DELETE';

const DeleteSharePage: React.FC = () => {
  const { t } = useTranslation(['delete', NAMESPACES.ACTIONS]);
  const navigate = useNavigate();
  const { region, shareId } = useShareParams();
  const { data: shareDetails } = useShare(region, shareId, {
    select: selectShareDetails,
  });

  const [confirmInput, setConfirmInput] = useState('');

  const handleClose = useCallback(() => {
    navigate('..');
  }, [navigate]);

  const isEmpty = confirmInput.trim() === '';
  const isConfirmEnabled = confirmInput === CONFIRM_VALUE;
  const shareName = shareDetails?.name ?? shareId;

  return (
    <Modal open={true} onOpenChange={handleClose}>
      <ModalContent dismissible={false} aria-labelledby="delete-share-title">
        <ModalHeader className="bg-[--ods-color-warning-075] pb-5">
          <Text id="delete-share-title" preset="heading-4">
            {t('delete:title')}
          </Text>
        </ModalHeader>
        <ModalBody className="flex flex-col gap-6">
          <section className="flex flex-col gap-4">
            <Text preset="paragraph">
              <Trans i18nKey={'delete:description'} values={{ name: shareName }} />
            </Text>

            <FormField invalid={isEmpty}>
              <FormFieldLabel>{t('delete:confirmLabel')}</FormFieldLabel>
              <Input
                value={confirmInput}
                onChange={(e) => setConfirmInput(e.target.value)}
                aria-invalid={isEmpty}
                className="w-full"
              />
              <FormFieldError>{t('delete:confirmEmptyError')}</FormFieldError>
            </FormField>
          </section>

          <footer className="flex justify-end gap-4">
            <Button variant="ghost" color="primary" onClick={handleClose} type="button">
              {t(`${NAMESPACES.ACTIONS}:cancel`)}
            </Button>
            <Button variant="default" color="primary" disabled={!isConfirmEnabled} type="button">
              {t('delete:submitButton')}
            </Button>
          </footer>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default DeleteSharePage;

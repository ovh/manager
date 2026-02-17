import React, { ChangeEvent, useCallback, useState } from 'react';

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
  Skeleton,
  Text,
  toast,
} from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { useShare } from '@/data/hooks/shares/useShare';
import { useProjectId } from '@/hooks/useProjectId';
import { useShareParams } from '@/hooks/useShareParams';
import { useShareDeletion } from '@/pages/delete/hooks/useShareDeletion';
import { selectShareDeletionView } from '@/pages/delete/view-model/deleteShare.view-model';

const CONFIRM_VALUE = 'DELETE';

const DeleteSharePage: React.FC = () => {
  const { t } = useTranslation(['delete', NAMESPACES.ACTIONS]);
  const navigate = useNavigate();
  const projectId = useProjectId();
  const { region, shareId } = useShareParams();
  const { data: shareDeletionView, isLoading: isShareLoading } = useShare(region, shareId, {
    select: selectShareDeletionView,
  });

  const shareName = shareDeletionView?.shareName ?? shareId;

  const onError = useCallback(
    (errorMessage: string) => {
      toast(t('delete:message.error', { errorMessage }), {
        color: 'warning',
        duration: Infinity,
      });
      navigate('..');
    },
    [navigate, t],
  );

  const onSuccess = useCallback(() => {
    toast(t('delete:message.success', { shareName }), {
      color: 'success',
      duration: 5000,
    });
    navigate('..');
  }, [navigate, t, shareName]);

  const { deleteShare, isPending: isDeletionPending } = useShareDeletion(
    projectId,
    region,
    shareId,
    {
      onSuccess,
      onError,
    },
  );

  const [confirmInput, setConfirmInput] = useState('');
  const [hasBeenTouched, setHasBeenTouched] = useState(false);

  const handleClose = useCallback(() => {
    navigate('..');
  }, [navigate]);

  const handleDelete = useCallback(() => {
    deleteShare();
  }, [deleteShare]);

  const isErrorDisplayed = hasBeenTouched && confirmInput.trim() === '';
  const canBeDeleted = shareDeletionView?.canBeDeleted ?? false;
  const isConfirmEnabled =
    confirmInput === CONFIRM_VALUE && canBeDeleted && !isDeletionPending && !isShareLoading;

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setConfirmInput(e.currentTarget.value);
    setHasBeenTouched(true);
  };

  return (
    <Modal open={true} onOpenChange={handleClose}>
      <ModalContent dismissible={false} aria-labelledby="delete-share-title">
        <ModalHeader>
          <Text id="delete-share-title" preset="heading-4">
            {t('delete:title')}
          </Text>
        </ModalHeader>
        <ModalBody className="flex flex-col gap-6">
          {!isShareLoading && !canBeDeleted ? (
            <Text preset="paragraph" className="text-[--ods-color-critical-600]" aria-live="polite">
              {t('delete:cannotDelete')}
            </Text>
          ) : (
            <section className="flex flex-col gap-4">
              {isShareLoading ? (
                <Skeleton className="py-8" />
              ) : (
                <Text preset="paragraph">
                  <Trans i18nKey={'delete:description'} values={{ name: shareName }} />
                </Text>
              )}

              {isShareLoading ? (
                <Skeleton className="py-8" />
              ) : (
                <FormField invalid={isErrorDisplayed}>
                  <FormFieldLabel>{t('delete:input.label')}</FormFieldLabel>
                  <Input
                    value={confirmInput}
                    onChange={handleOnChange}
                    aria-invalid={isErrorDisplayed}
                    className="w-full"
                  />
                  <FormFieldError>{t('delete:input.error')}</FormFieldError>
                </FormField>
              )}
            </section>
          )}

          <footer className="flex justify-end gap-4">
            <Button
              variant="ghost"
              color="primary"
              onClick={handleClose}
              type="button"
              disabled={isDeletionPending}
            >
              {t(`${NAMESPACES.ACTIONS}:cancel`)}
            </Button>
            <Button
              variant="default"
              color="primary"
              disabled={!isConfirmEnabled}
              loading={isDeletionPending}
              onClick={handleDelete}
              type="button"
            >
              {t('delete:submitButton')}
            </Button>
          </footer>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default DeleteSharePage;

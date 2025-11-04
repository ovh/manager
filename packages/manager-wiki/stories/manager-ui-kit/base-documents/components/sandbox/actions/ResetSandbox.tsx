import {
  Button,
  BUTTON_COLOR,
  BUTTON_VARIANT,
  Icon,
  ICON_NAME,
  Modal,
  MODAL_COLOR,
  ModalBody,
  ModalContent,
} from '@ovhcloud/ods-react';
import React, { type JSX, useState } from 'react';
import styles from './resetSandbox.module.css';

interface Prop {
  onCancel?: () => void;
  onConfirm: () => void;
}

const ResetSandbox = ({ onCancel, onConfirm }: Prop): JSX.Element => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  function onCancelClick() {
    setIsModalOpen(false);
    onCancel?.();
  }

  function onConfirmClick() {
    setIsModalOpen(false);
    onConfirm();
  }

  function onResetClick() {
    setIsModalOpen(true);
  }

  return (
    <>
      <Button
        onClick={ onResetClick }
        variant={ BUTTON_VARIANT.ghost }>
        <Icon name={ ICON_NAME.refresh } /> Reset
      </Button>

      <Modal
        onOpenChange={ ({ open }) => setIsModalOpen(open) }
        open={ isModalOpen }>
        <ModalContent color={ MODAL_COLOR.critical }>
          <ModalBody>
            <p>
              Are you sure you want to reset the sandbox?
              <br />
              All your changes will be lost.
            </p>

            <div className={ styles['reset-sandbox__modal__actions'] }>
              <Button
                color={ BUTTON_COLOR.critical }
                onClick={ onConfirmClick }>
                Confirm
              </Button>

              <Button
                color={ BUTTON_COLOR.critical }
                onClick={ onCancelClick }
                variant={ BUTTON_VARIANT.outline }>
                Cancel
              </Button>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export {
  ResetSandbox,
};

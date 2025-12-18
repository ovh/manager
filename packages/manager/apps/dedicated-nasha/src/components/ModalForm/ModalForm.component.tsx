import React from 'react';
import {
  Button,
  BUTTON_COLOR,
  BUTTON_VARIANT,
  Modal,
  ModalBody,
  ModalContent,
  MODAL_COLOR,
  Spinner,
} from '@ovhcloud/ods-react';

interface ModalFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  heading: string;
  primaryLabel: string;
  secondaryLabel: string;
  type?: 'default' | 'warning' | 'critical';
  loading?: boolean;
  canSubmit?: boolean;
  children: React.ReactNode;
}

export const ModalForm: React.FC<ModalFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  heading,
  primaryLabel,
  secondaryLabel,
  type = 'default',
  loading = false,
  canSubmit = true,
  children,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (canSubmit && !loading) {
      onSubmit();
    }
  };

  const getModalColor = () => {
    switch (type) {
      case 'warning':
        return MODAL_COLOR.warning;
      case 'critical':
        return MODAL_COLOR.critical;
      default:
        return MODAL_COLOR.primary;
    }
  };

  const getButtonColor = () => {
    switch (type) {
      case 'warning':
        return BUTTON_COLOR.warning;
      case 'critical':
        return BUTTON_COLOR.critical;
      default:
        return BUTTON_COLOR.primary;
    }
  };

  if (!isOpen) return null;

  return (
    <Modal open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <ModalContent color={getModalColor()}>
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <h2 className="text-xl font-semibold mb-4">{heading}</h2>

            {loading ? (
              <div className="flex justify-center py-8">
                <Spinner />
              </div>
            ) : (
              <div className="mb-6">{children}</div>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <Button
                type="button"
                variant={BUTTON_VARIANT.outline}
                color={BUTTON_COLOR.neutral}
                onClick={onClose}
                disabled={loading}
              >
                {secondaryLabel}
              </Button>
              <Button
                type="submit"
                color={getButtonColor()}
                disabled={!canSubmit || loading}
              >
                {primaryLabel}
              </Button>
            </div>
          </ModalBody>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default ModalForm;


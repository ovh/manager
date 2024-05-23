import React from 'react';
import { OsdsButton, OsdsModal } from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { Subtitle } from '@ovhcloud/manager-components';
import ModalContent from './ModalContent';

export enum ModalType {
  info = 'info',
  error = 'error',
  warning = 'warning',
  success = 'success',
}

export interface ModalProps {
  subtitle?: string;
  content?: React.ReactElement;
  children?: React.ReactElement;
  type?: ModalType;
  buttonLabel?: string;
  disabled?: boolean;
  modalClick?: () => void;
  onclick?: () => void;
}

const getColorByType = (type: ModalType) => {
  switch (type) {
    case ModalType.info:
      return ODS_THEME_COLOR_INTENT.info;
    case ModalType.error:
      return ODS_THEME_COLOR_INTENT.error;
    case ModalType.warning:
      return ODS_THEME_COLOR_INTENT.warning;
    case ModalType.success:
      return ODS_THEME_COLOR_INTENT.success;
    default:
      return ODS_THEME_COLOR_INTENT.info;
  }
};

const Modal: React.FC<ModalProps> = ({
  subtitle,
  content,
  type,
  buttonLabel,
  disabled,
  modalClick,
  children,
}) => {
  const color = getColorByType(type);

  return (
    <OsdsModal color={color} dismissible>
      <div className="flex flex-col  text-left">
        {subtitle && <Subtitle>{subtitle}</Subtitle>}
        {content && <ModalContent>{content}</ModalContent>}
        {children}
      </div>
      {disabled ? (
        <OsdsButton slot="actions" inline disabled={disabled}>
          {buttonLabel}
        </OsdsButton>
      ) : (
        <OsdsButton slot="actions" inline color={color} onClick={modalClick}>
          {buttonLabel}
        </OsdsButton>
      )}
    </OsdsModal>
  );
};

export default Modal;

import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { OsdsModal } from '@ovhcloud/ods-components/react';
import React, { useRef } from 'react';

const Modal: React.FC<React.PropsWithChildren & {
  onClose: () => void;
  color: ODS_THEME_COLOR_INTENT;
}> = ({ color, onClose, children }) => {
  const modal = useRef<HTMLOsdsModalElement>(null);

  const onOdsModalClose = () => {
    onClose();
    modal.current?.close();
  };

  return (
    <OsdsModal
      color={color}
      dismissible
      onOdsModalClose={onOdsModalClose}
      ref={modal}
    >
      {children}
    </OsdsModal>
  );
};

export default Modal;

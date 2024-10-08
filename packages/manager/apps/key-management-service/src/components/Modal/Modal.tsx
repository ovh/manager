import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { OsdsModal } from '@ovhcloud/ods-components/react';
import React, { useRef } from 'react';

const Modal: React.FC<React.PropsWithChildren & {
  onClose: () => void;
  color: ODS_THEME_COLOR_INTENT;
  headline?: string;
}> = ({ color, headline, onClose, children }) => {
  const modal = useRef<HTMLOsdsModalElement>(null);

  const onOdsModalClose = () => {
    onClose();
  };

  return (
    <OsdsModal
      color={color}
      dismissible
      onOdsModalClose={onOdsModalClose}
      headline={headline}
      ref={modal}
    >
      {children}
    </OsdsModal>
  );
};

export default Modal;

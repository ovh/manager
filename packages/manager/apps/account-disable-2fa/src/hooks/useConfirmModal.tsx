import { ODS_BUTTON_SIZE, ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import {
  OsdsButton,
  OsdsModal,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import {
  ODS_THEME_COLOR_HUE,
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import React, { FunctionComponent, ReactNode, useState } from 'react';

type State = {
  resolve?: (value: boolean) => void;
};

type ConfirmationModalProps = {
  children: ReactNode;
  title: string;
  className?: string;
};

type GetConfirmationModal = () => Promise<boolean>;

const useConfirmModal = (): [
  GetConfirmationModal,
  FunctionComponent<ConfirmationModalProps>,
] => {
  const [show, setShow] = useState<boolean>(false);
  const [resolver, setResolver] = useState<State>({ resolve: null });
  const { t } = useTranslation('account-disable-2fa');

  const getConfirmationModal = async (): Promise<boolean> => {
    setShow(true);
    return new Promise((resolve) => {
      setResolver({ resolve });
    });
  };

  const handleShowModal = async (status: boolean) => {
    setShow(false);
    resolver.resolve?.(status);
  };

  const ConfirmationModal: FunctionComponent<ConfirmationModalProps> = ({
    className,
    title,
    children,
  }) =>
    show && (
      <OsdsModal
        className={className}
        dismissible
        onOdsModalClose={() => handleShowModal(false)}
      >
        <div className="my-4">
          <OsdsText
            level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
            size={ODS_THEME_TYPOGRAPHY_SIZE._500}
            color={ODS_THEME_COLOR_INTENT.text}
            hue={ODS_THEME_COLOR_HUE._800}
          >
            {title}
          </OsdsText>
        </div>
        {children}
        <OsdsButton
          slot="actions"
          size={ODS_BUTTON_SIZE.sm}
          variant={ODS_BUTTON_VARIANT.ghost}
          color={ODS_THEME_COLOR_INTENT.primary}
          onClick={() => {
            handleShowModal(false);
          }}
        >
          {t('account-disable-2fa-confirm-modal-no')}
        </OsdsButton>
        <OsdsButton
          slot="actions"
          onClick={() => {
            handleShowModal(true);
          }}
          data-navi-id="cookie-accept"
          size={ODS_BUTTON_SIZE.sm}
          variant={ODS_BUTTON_VARIANT.flat}
          color={ODS_THEME_COLOR_INTENT.primary}
        >
          {t('account-disable-2fa-confirm-modal-yes')}
        </OsdsButton>
      </OsdsModal>
    );

  return [getConfirmationModal, ConfirmationModal];
};

export default useConfirmModal;

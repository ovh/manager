import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { OdsButton, OdsModal, OdsText } from '@ovhcloud/ods-components/react';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { createPortal } from 'react-dom';
import {
  Button,
  BUTTON_COLOR,
  BUTTON_VARIANT,
  Icon,
  ICON_NAME,
} from '@ovh-ux/muk';
import { ViewType } from './types';
import { useDeleteViewPreference } from '@/hooks/manage-views/useDeleteViewPreference';

export type ManageViewDeleteProps = {
  views: ViewType[];
  view: ViewType;
  disabled: boolean;
  onOpenModal?: () => void;
};

export default function ExportCsv({
  views,
  view,
  disabled,
  onOpenModal,
}: ManageViewDeleteProps) {
  const { t } = useTranslation('manage-view');
  const { mutate: deleteView } = useDeleteViewPreference({});
  const [isOpen, setOpen] = useState(false);
  const [currentView, setCurrentView] = useState<ViewType>(null);

  useEffect(() => {
    setCurrentView(view);
  }, [isOpen, view, views]);

  const openModalHandler = () => {
    setOpen(true);
    if (onOpenModal) onOpenModal();
  };
  const cancelDeleteView = () => setOpen(false);

  const confirmDeleteView = () => {
    if (currentView) {
      deleteView({
        view: currentView,
      });
      setOpen(false);
    }
  };

  return (
    <>
      <Button
        role="menuitem"
        variant={BUTTON_VARIANT.ghost}
        color={BUTTON_COLOR.critical}
        disabled={disabled}
        onClick={openModalHandler}
      >
        <Icon name={ICON_NAME.trash} aria-hidden={true} />
        <span>{t('delete_current_view')}</span>
      </Button>
      {view &&
        createPortal(
          <OdsModal
            isOpen={isOpen}
            onOdsClose={cancelDeleteView}
            isDismissible
            class="modal-color"
            color="critical"
          >
            <OdsText preset={ODS_TEXT_PRESET.heading4} className="pb-2">
              {t('modal_delete_title', { name: currentView?.name })}
            </OdsText>
            <OdsText>{t('modal_delete_description')}</OdsText>
            <OdsButton
              label={t('modal_detete_cancel')}
              slot="actions"
              variant="ghost"
              onClick={cancelDeleteView}
            />
            <OdsButton
              label={t('modal_delete_confirm')}
              slot="actions"
              variant="default"
              onClick={confirmDeleteView}
            />
          </OdsModal>,
          document.body,
        )}
    </>
  );
}

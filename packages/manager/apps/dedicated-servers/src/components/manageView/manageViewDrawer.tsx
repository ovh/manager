import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  Button,
  BUTTON_VARIANT,
  ICON_NAME,
  Icon,
  TEXT_PRESET,
  Text,
  Drawer,
  Checkbox,
  CheckboxControl,
  CheckboxLabel,
} from '@ovh-ux/muk';
import { PREFERENCES_KEY, STANDARD_VIEW_ID } from './manageView.constants';
import { ViewType } from './types';
import { useSaveViewsPreference } from '@/hooks/manage-views/useSaveViewPreference';

export type ManageViewDrawerProps = {
  views: ViewType[];
  view?: ViewType;
  isOpen: boolean;
  handleDismiss: () => void;
  handleConfirm: () => void;
  handleCancel: () => void;
};
export const ManageViewDrawer = ({
  views,
  view,
  isOpen,
  handleDismiss,
  handleConfirm,
  handleCancel,
}: ManageViewDrawerProps) => {
  const { t } = useTranslation('manage-view');
  const { t: tCommon } = useTranslation(NAMESPACES.ACTIONS);
  const [editingView, setEditingView] = useState<ViewType>(null);
  const { isPending, mutate: createViews } = useSaveViewsPreference({
    key: PREFERENCES_KEY,
  });

  useEffect(() => {
    setEditingView({
      name: view?.name || t('new_view'),
      id: view?.id || `view-${views.length}`,
    });
  }, [view, views]);

  const saveViewChanges = () => {
    createViews({
      views: [
        ...views.filter((_view) => _view.id !== STANDARD_VIEW_ID),
        editingView,
      ],
    });
    handleConfirm();
  };

  return (
    <Drawer.Root isOpen={isOpen} onDismiss={handleDismiss}>
      <Drawer.Content>
        <div className="my-4">
          <div className="flex items-center gap-4">
            <Text preset={TEXT_PRESET.heading2} className="my-4">
              {editingView?.name}
            </Text>
            <Button
              role="button"
              variant={BUTTON_VARIANT.ghost}
              aria-label={t('edit_view_name')}
            >
              <Icon name={ICON_NAME.pen} aria-hidden={true} />
            </Button>
          </div>
          <Checkbox>
            <CheckboxControl />
            <CheckboxLabel>{t('set_as_default')}</CheckboxLabel>
          </Checkbox>
        </div>
        {/* Add view configuration here */}
      </Drawer.Content>
      <Drawer.Footer
        primaryButton={{
          label: tCommon('save'),
          onClick: saveViewChanges,
        }}
        secondaryButton={{
          label: tCommon('cancel'),
          onClick: handleCancel,
        }}
      />
    </Drawer.Root>
  );
};

export default ManageViewDrawer;

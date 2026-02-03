import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  Button,
  BUTTON_VARIANT,
  Icon,
  Checkbox,
  CheckboxControl,
  CheckboxLabel,
  Text,
  BUTTON_SIZE,
} from '@ovhcloud/ods-react';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import {
  DEFAULT_COLUMN_VISIBILITY,
  PREFERENCES_KEY,
} from './manageView.constants';
import { ViewType } from './types';
import { useSaveViewsPreference } from '@/hooks/manage-views/useSaveViewPreference';
import ManageViewDrawerTitle from './manageViewDrawerTitle';
import ManageViewConfig from './manageViewConfig';
import { ViewContext } from './viewContext';

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
  const { setColumnVisibility, currentView, setColumnsOrder } = useContext(
    ViewContext,
  );
  const { t } = useTranslation('manage-view');
  const { t: tCommon } = useTranslation(NAMESPACES.ACTIONS);
  const [editingView, setEditingView] = useState<ViewType>(null);
  const { isPending, mutate: saveViews } = useSaveViewsPreference({
    key: PREFERENCES_KEY,
  });

  useEffect(() => {
    setEditingView({
      name: view?.name || t('new_view'),
      id: view?.id || `view-${views.length}`,
      default: view?.default,
    });
  }, [isOpen, view, views]);

  const handleNameChange = (value: string) => {
    setEditingView({
      ...editingView,
      name: value,
    });
  };

  const handelSetDefault = () => {
    setEditingView({
      ...editingView,
      default: !editingView.default,
    });
  };

  const saveViewChanges = () => {
    saveViews({
      view: editingView,
    });
    handleConfirm();
  };

  const cancelChanges = () => {
    setColumnVisibility(
      currentView?.columnVisibility || DEFAULT_COLUMN_VISIBILITY,
    );
    setColumnsOrder(currentView.columnOrder);
    handleCancel();
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full w-96 z-50
        transition-all duration-300 ease-in-out bg-red-500
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
    >
      <aside className="h-full w-full bg-white shadow-lg relative flex flex-col">
        {isOpen && (
          <div className="absolute top-9 -left-12 h-12 w-12 z-50 bg-white rounded-l-md shadow-md flex items-center justify-center border-0 outline-none focus:outline-none">
            <Button
              role="button"
              variant={BUTTON_VARIANT.ghost}
              size={BUTTON_SIZE.xs}
              aria-label={tCommon('close')}
              onClick={cancelChanges}
            >
              <Icon name={ODS_ICON_NAME.chevronDoubleRight} />
            </Button>
            <span className="absolute -right-1 top-0 h-full w-2 bg-white pointer-events-none rounded-r-md"></span>
          </div>
        )}
        {/* Drawer Content */}
        <div className="p-4 flex-1 overflow-auto">
          <div className="flex items-center gap-4">
            <ManageViewDrawerTitle
              value={editingView?.name}
              onChange={handleNameChange}
            />
          </div>
          <Checkbox
            checked={editingView?.default}
            onCheckedChange={handelSetDefault}
          >
            <CheckboxControl />
            <CheckboxLabel>
              <Text>{t('set_as_default')}</Text>
            </CheckboxLabel>
          </Checkbox>

          <ManageViewConfig />
        </div>
        {/* Drawer footer */}
        <div className="p-4 border-t flex justify-start gap-2">
          <Button
            aria-label={tCommon('cancel')}
            variant={BUTTON_VARIANT.ghost}
            onClick={cancelChanges}
          >
            {tCommon('cancel')}
          </Button>
          <Button
            aria-label={tCommon('save')}
            variant={BUTTON_VARIANT.default}
            onClick={saveViewChanges}
          >
            {tCommon('save')}
          </Button>
        </div>
      </aside>
    </div>
  );
};

export default ManageViewDrawer;

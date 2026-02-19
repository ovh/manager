import React, { useContext, useEffect, useRef, useState } from 'react';
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
import { Categories, ViewType } from './types';
import { useSaveViewsPreference } from '@/hooks/manage-views/useSaveViewPreference';
import ManageViewDrawerTitle, { TitleEditorRef } from './manageViewDrawerTitle';
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
  handleConfirm,
  handleCancel,
}: ManageViewDrawerProps) => {
  const {
    setColumnVisibility,
    currentView,
    setColumnsOrder,
    groupBy: contextGroupBy,
    setGroupBy: setContextGroupBy,
  } = useContext(ViewContext);
  const { t } = useTranslation('manage-view');
  const { t: tCommon } = useTranslation(NAMESPACES.ACTIONS);
  const [editingView, setEditingView] = useState<ViewType>(null);
  const { mutate: saveViews } = useSaveViewsPreference({
    key: PREFERENCES_KEY,
  });
  // Initialize the draft state for the grouping logic
  const [draftGroupBy, setDraftGroupBy] = useState<Categories | undefined>(
    contextGroupBy,
  );
  const titleRef = useRef<TitleEditorRef>(null);

  useEffect(() => {
    let name = view?.name;
    let id = view?.id;

    // increment both name and id numbers for new views to avoid duplicates, based on existing views
    if (!name || !id) {
      const { maxViewNumber, maxIdNumber } = views.reduce(
        (acc, v) => {
          // Check new view name pattern
          if (!name) {
            const nameRegex = new RegExp(
              `${t('new_view')}\\s?(?:\\((?<number>\\d)\\))?`,
            );
            const nameMatch = v.name.match(nameRegex);
            if (nameMatch && Number(nameMatch?.groups?.number)) {
              const viewNumber = Number(nameMatch.groups.number);
              acc.maxViewNumber = Math.max(acc.maxViewNumber, viewNumber);
            } else if (nameMatch) {
              acc.maxViewNumber = Math.max(acc.maxViewNumber, 0);
            }
          }

          // Check view id pattern
          if (!id) {
            const idMatch = v.id.match(/^view-(\d+)$/);
            if (idMatch) {
              const idNumber = Number(idMatch[1]);
              acc.maxIdNumber = Math.max(acc.maxIdNumber, idNumber);
            }
          }

          return acc;
        },
        { maxViewNumber: -1, maxIdNumber: -1 },
      );

      if (!name) {
        name =
          maxViewNumber === -1
            ? t('new_view')
            : `${t('new_view')} (${maxViewNumber + 1})`;
      }

      if (!id) {
        id =
          maxIdNumber === -1
            ? `view-${views.length}`
            : `view-${maxIdNumber + 1}`;
      }
    }

    setEditingView({
      name,
      id,
      default: view?.default,
    });

    // Synchronize the draft with the global context when the drawer opens
    // or when the underlying view changes.
    setDraftGroupBy(contextGroupBy);
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

  const saveViewChanges = async () => {
    const newView = { ...editingView };
    if (draftGroupBy !== undefined) {
      setContextGroupBy(draftGroupBy);
      newView.groupBy = draftGroupBy;
    }

    if (titleRef.current?.isEditMode) {
      const newTitle = titleRef.current?.save();
      handleNameChange(newTitle);
      newView.name = newTitle;
    }

    saveViews({
      view: newView,
    });
    handleConfirm();
  };

  const cancelChanges = () => {
    setColumnVisibility(
      currentView?.columnVisibility || DEFAULT_COLUMN_VISIBILITY,
    );
    setColumnsOrder(currentView.columnOrder);
    setDraftGroupBy(contextGroupBy);
    handleCancel();
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full w-96 z-50
        transition-all duration-300 ease-in-out bg-red-500
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
    >
      <aside className="h-full w-full bg-white shadow-lg grid grid-cols-1 grid-rows-[min-content_1fr_min-content] relative">
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
        {/* Drawer Header */}
        <section className="p-4">
          <div className="flex items-center gap-4">
            <ManageViewDrawerTitle
              ref={titleRef}
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
        </section>
        {/* Drawer Content */}

        <div className="flex flex-col gap-4 p-4 overflow-auto">
          <ManageViewConfig
            drawerVisibility={isOpen}
            draftGroupBy={draftGroupBy}
            setDraftGroupBy={setDraftGroupBy}
          />
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

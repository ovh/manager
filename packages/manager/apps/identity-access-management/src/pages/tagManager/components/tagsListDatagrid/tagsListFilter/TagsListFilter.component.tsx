import React from 'react';
import {
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_POPOVER_POSITION,
} from '@ovhcloud/ods-components';
import {
  OdsButton,
  OdsCheckbox,
  OdsFormField,
  OdsPopover,
  OdsText,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { useTagManagerContext } from '../../../TagManagerContext';

export default function TagsListFilter() {
  const { t } = useTranslation('tag-manager');
  const {
    isShowSystemChecked,
    isShowUnassignedResourcesChecked,
    toggleSystemCheck,
    toggleUnassignedResources,
  } = useTagManagerContext();

  return (
    <>
      <div id="filter-trigger" className="w-min">
        <OdsButton
          className="whitespace-nowrap"
          data-testid="navigation-action-trigger-action"
          slot="menu-title"
          id="filter-trigger-button"
          variant={ODS_BUTTON_VARIANT.outline}
          label={t('quickFilters')}
          icon={ODS_ICON_NAME.filter}
        />
      </div>
      <OdsPopover
        className="py-[8px] px-0 w-max"
        data-testid="navigation-action-trigger-action-popover"
        triggerId="filter-trigger-button"
        with-arrow
        position={ODS_POPOVER_POSITION.bottom}
      >
        <div className="flex flex-col mx-4">
          <OdsFormField className="flex flex-row items-center mb-4">
            <OdsCheckbox
              name="show-system"
              inputId="show-system"
              className="mr-4"
              onOdsChange={() => toggleSystemCheck()}
              isChecked={isShowSystemChecked}
            />
            <label htmlFor="show-system">
              <OdsText>{t('showSystemTag')}</OdsText>
            </label>
          </OdsFormField>
          <OdsFormField className="flex flex-row items-center">
            <OdsCheckbox
              name="show-unassigned"
              inputId="show-unassigned"
              className="mr-4"
              onOdsChange={() => toggleUnassignedResources()}
              isChecked={isShowUnassignedResourcesChecked}
            />
            <label htmlFor="show-unassigned">
              <OdsText>{t('showUnassignedTag')}</OdsText>
            </label>
          </OdsFormField>
        </div>
      </OdsPopover>
    </>
  );
}

import React from 'react';
import { OdsButton } from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_BUTTON_ICON_ALIGNMENT,
  ODS_ICON_NAME,
  OdsIconName,
} from '@ovhcloud/ods-components';
import { ObsTimeControls } from '../obsTimeControls';
import { useActionClick } from '../../hooks';

export type ObsToolbarAction = {
  id: string;
  label: string;
  link: string;
  isExternal?: boolean;
  variant?: ODS_BUTTON_VARIANT;
  isDisabled?: boolean;
  icon?: OdsIconName;
};
export interface ObsToolbarActionsProps {
  items: ObsToolbarAction[];
}

export const ObsToolbarActions = ({
  items,
}: Readonly<ObsToolbarActionsProps>): JSX.Element => {
  const onActionClick = useActionClick();

  return (
    <div className="w-full flex flex-col justify-end items-end gap-6">
      <div className="flex justify-center items-center gap-4">
        {items.map(
          ({
            id,
            label,
            link,
            variant = ODS_BUTTON_VARIANT.default,
            isDisabled = false,
            isExternal = false,
            icon = isExternal ? ODS_ICON_NAME.externalLink : undefined,
          }) => (
            <OdsButton
              key={`obs-toolbar-action-${id}`}
              className="[&::part(button)]:w-full sm:w-auto"
              size={ODS_BUTTON_SIZE.md}
              variant={variant}
              label={label}
              onClick={() => {
                onActionClick(link, isExternal);
              }}
              iconAlignment={ODS_BUTTON_ICON_ALIGNMENT.right}
              icon={icon}
              isDisabled={isDisabled}
            />
          ),
        )}
      </div>
      <div className="flex justify-end items-center gap-4">
        <ObsTimeControls />
      </div>
    </div>
  );
};

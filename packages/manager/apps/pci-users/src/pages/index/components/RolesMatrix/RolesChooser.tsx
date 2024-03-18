import {
  OsdsButton,
  OsdsIcon,
  OsdsPopover,
  OsdsPopoverContent,
  OsdsSelect,
  OsdsSelectOption,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_TEXT_ALIGN,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { Role } from '@/interface';
import RolesSelector from '@/pages/add/components/RolesSelector';

interface IProps {
  allRoles: Role[];
  preselectedRoles: Role[];
  isFullSize: boolean;
  onInput: (value: Role | Role[]) => void;
}
export default function RolesChooser({
  allRoles,
  preselectedRoles,
  isFullSize,
  onInput,
}: IProps) {
  return (
    <div className="mt-2">
      {isFullSize ? (
        <div className="text-right">
          <OsdsPopover>
            <OsdsButton
              slot="popover-trigger"
              size={ODS_BUTTON_SIZE.sm}
              variant={ODS_BUTTON_VARIANT.stroked}
              color={ODS_THEME_COLOR_INTENT.primary}
              textAlign={ODS_BUTTON_TEXT_ALIGN.center}
            >
              <OsdsIcon
                name={ODS_ICON_NAME.SETTINGS}
                color={ODS_THEME_COLOR_INTENT.primary}
                size={ODS_ICON_SIZE.xs}
              />
            </OsdsButton>
            <OsdsPopoverContent>
              <RolesSelector
                allRoles={allRoles}
                preSelectedRoles={preselectedRoles}
                onInput={(newRoles) => onInput(newRoles)}
              />
            </OsdsPopoverContent>
          </OsdsPopover>
        </div>
      ) : (
        <OsdsSelect
          onOdsValueChange={(event) => {
            const found = allRoles.find(
              (role) => role.id === event.detail.value,
            );
            if (found) {
              onInput(found);
            } else {
              onInput(null);
            }
          }}
        >
          {allRoles?.map((role) => (
            <OsdsSelectOption key={role.id} value={role.id}>
              {role.description}
            </OsdsSelectOption>
          ))}
        </OsdsSelect>
      )}
    </div>
  );
}

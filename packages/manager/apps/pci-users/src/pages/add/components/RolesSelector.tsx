import { useEffect, useState } from 'react';
import {
  OsdsCheckbox,
  OsdsCheckboxButton,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_CHECKBOX_BUTTON_SIZE,
  OdsCheckboxCheckedChangeEventDetail,
  OsdsCheckboxCustomEvent,
} from '@ovhcloud/ods-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { Role } from '@/interface';

type Props = {
  allRoles: Role[];
  preSelectedRoles: Role[];
  onInput: (selectedRoles: Role[]) => void;
};
export default function RolesSelector({
  allRoles,
  preSelectedRoles = [],
  onInput,
}: Props) {
  const [selectedRoles, setSelectedRoles] = useState<Role[]>(preSelectedRoles);

  useEffect(() => {
    setSelectedRoles(preSelectedRoles);
  }, [preSelectedRoles]);

  useEffect(() => {
    onInput(selectedRoles);
  }, [selectedRoles]);

  return (
    <>
      {allRoles.map((role) => (
        <OsdsCheckbox
          key={role.id}
          value={role.id}
          checked={selectedRoles.some(
            (selectedRole) => selectedRole.id === role.id,
          )}
          onOdsCheckedChange={(
            event: OsdsCheckboxCustomEvent<OdsCheckboxCheckedChangeEventDetail>,
          ) => {
            if (event.detail.checked) {
              setSelectedRoles([...selectedRoles, role]);
            } else {
              setSelectedRoles(
                selectedRoles.filter(
                  (selectedRole) => selectedRole.id !== role.id,
                ),
              );
            }
          }}
        >
          <OsdsCheckboxButton
            color={ODS_THEME_COLOR_INTENT.primary}
            size={ODS_CHECKBOX_BUTTON_SIZE.sm}
            interactive={true}
            hasFocus={true}
          >
            <OsdsText
              color={ODS_THEME_COLOR_INTENT.text}
              slot={'end'}
              level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
              size={
                selectedRoles.some(
                  (selectedRole) => selectedRole.id === role.id,
                )
                  ? ODS_THEME_TYPOGRAPHY_SIZE._500
                  : ODS_THEME_TYPOGRAPHY_SIZE._400
              }
            >
              {role.description}
            </OsdsText>
          </OsdsCheckboxButton>
        </OsdsCheckbox>
      ))}
    </>
  );
}

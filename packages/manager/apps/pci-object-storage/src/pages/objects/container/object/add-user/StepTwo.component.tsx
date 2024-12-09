import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import {
  OsdsRadio,
  OsdsRadioButton,
  OsdsRadioGroup,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import {
  ODS_RADIO_BUTTON_SIZE,
  ODS_TEXT_SIZE,
  OdsRadioGroupValueChangeEventDetail,
  OsdsRadioGroupCustomEvent,
} from '@ovhcloud/ods-components';
import { OBJECT_CONTAINER_USER_ROLES } from '@/constants';

export type StepTwoComponentProps = {
  onSelectRole: (role: string) => void;
  selectedRole: string;
  objectName: string;
};

export default function StepTwoComponent({
  onSelectRole,
  selectedRole,
  objectName,
}: Readonly<StepTwoComponentProps>) {
  const { t } = useTranslation('pci-storages-containers-object-add-user');
  return (
    <>
      <OsdsText
        level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
        size={ODS_THEME_TYPOGRAPHY_SIZE._400}
        color={ODS_THEME_COLOR_INTENT.text}
      >
        {t(
          'pci_projects_project_storages_containers_container_addUser_description_object_step_1',
          { value: objectName },
        )}
      </OsdsText>
      <OsdsRadioGroup
        value={selectedRole}
        onOdsValueChange={(
          event: OsdsRadioGroupCustomEvent<OdsRadioGroupValueChangeEventDetail>,
        ) => {
          onSelectRole(event.detail.newValue);
        }}
      >
        {OBJECT_CONTAINER_USER_ROLES.map((role) => (
          <OsdsRadio key={role} className="mt-4" value={role}>
            <OsdsRadioButton
              color={ODS_THEME_COLOR_INTENT.primary}
              size={ODS_RADIO_BUTTON_SIZE.xs}
            >
              <div slot="end" className="align-bottom inline-block">
                <OsdsText
                  color={ODS_THEME_COLOR_INTENT.text}
                  size={ODS_TEXT_SIZE._600}
                >
                  {t(
                    `pci_projects_project_storages_containers_container_addUser_right_${role}`,
                  )}
                </OsdsText>
              </div>
            </OsdsRadioButton>
          </OsdsRadio>
        ))}
      </OsdsRadioGroup>
    </>
  );
}

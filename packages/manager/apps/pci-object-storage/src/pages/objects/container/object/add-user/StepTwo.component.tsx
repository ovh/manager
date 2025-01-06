import { useTranslation } from 'react-i18next';
import { OdsRadio, OdsText } from '@ovhcloud/ods-components/react';
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
      <OdsText>
        {t(
          'pci_projects_project_storages_containers_container_addUser_description_object_step_1',
          { value: objectName },
        )}
      </OdsText>
      {OBJECT_CONTAINER_USER_ROLES.map((role) => (
        <OdsRadio
          key={role}
          name={role}
          className="mt-4"
          value={role}
          isChecked={role === selectedRole}
          onChange={(event) => onSelectRole(event.detail.newValue)}
        >
          <label htmlFor={role}>
            {t(
              `pci_projects_project_storages_containers_container_addUser_right_${role}`,
            )}
          </label>
        </OdsRadio>
      ))}
    </>
  );
}

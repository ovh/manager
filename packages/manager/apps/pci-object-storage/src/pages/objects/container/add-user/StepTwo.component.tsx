import { useTranslation } from 'react-i18next';
import { OdsRadio, OdsText } from '@ovhcloud/ods-components/react';
import { OBJECT_CONTAINER_USER_ROLES } from '@/constants';

export type StepTwoComponentProps = {
  onSelectRole: (role: string) => void;
  selectedRole: string;
  containerId: string;
};

export default function StepTwoComponent({
  onSelectRole,
  selectedRole,
  containerId,
}: Readonly<StepTwoComponentProps>) {
  const { t } = useTranslation('containers/add-user');

  return (
    <>
      <OdsText preset="paragraph">
        {t(
          'pci_projects_project_storages_containers_container_addUser_description_container_step_1',
          { value: containerId },
        )}
      </OdsText>

      <div className="flex flex-col gap-4 my-6">
        {OBJECT_CONTAINER_USER_ROLES.map((role) => (
          <div key={role} className="flex items-center gap-4">
            <OdsRadio
              inputId={role}
              name={role}
              value={role}
              isChecked={role === selectedRole}
              onOdsChange={(event) => {
                onSelectRole(event.detail.value);
              }}
            />
            <label htmlFor={role}>
              <OdsText preset="span">
                {t(
                  `pci_projects_project_storages_containers_container_addUser_right_${role}`,
                )}
              </OdsText>
            </label>
          </div>
        ))}
      </div>
    </>
  );
}

import { NEW_PROJECT_ITEM_ID, SEE_ALL_PROJECTS_ITEM_ID } from './ProjectSelector.constants';
import { OsdsSelect, OsdsSelectOption, OsdsIcon } from '@ovhcloud/ods-components/react';
import { ODS_ICON_NAME, ODS_ICON_SIZE } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import React, { useMemo } from 'react';

export type PciProject = {
  access: string;
  creationDate: Date;
  description: string;
  expiration: Date;
  manualQuota: boolean;
  orderId: unknown;
  planCode: string;
  projectName: string;
  project_id: string;
  status: string;
  unleash: boolean;
};

type Props = {
  isLoading: boolean;
  projects: PciProject[];
  selectedProject: PciProject;
  onProjectChange: CallableFunction;
  onProjectCreate: CallableFunction;
  onSeeAllProjects: CallableFunction;
  createLabel: string;
  seeAllButton: boolean;
  seeAllLabel: string;
};

const ProjectSelector: React.FC<ComponentProps<Props>> = ({
  isLoading,
  projects,
  selectedProject,
  onProjectChange,
  onProjectCreate,
  onSeeAllProjects,
  createLabel,
  seeAllButton,
  seeAllLabel,
}: Props): JSX.Element => {

  const options = useMemo<{ id: string, label: string }[]>(() => {
    const result = [];

    if (seeAllButton) {
      result.push({ id: SEE_ALL_PROJECTS_ITEM_ID, label: seeAllLabel });
    }

    if (createLabel) {
      result.push({ id: NEW_PROJECT_ITEM_ID, label: createLabel });
    }
    if (projects) {
      result.push(...projects.map(project => ({
        id: project.project_id,
        label: project.description || project.project_id
      })));
    }

    return result;
  }, [seeAllButton, seeAllLabel, createLabel, projects,]);

  const handleSelectChange = (event: any) => {
    const projectId = event.detail.value;
    if (projectId === NEW_PROJECT_ITEM_ID) {
      onProjectCreate();
    } else if (projectId === SEE_ALL_PROJECTS_ITEM_ID) {
      onSeeAllProjects();
    } else {
      onProjectChange(
        projects.find(({ project_id }) => project_id === projectId),
      );
    }
  }

  return (
    <>
      <OsdsSelect
        value={selectedProject?.project_id}
        onOdsValueChange={handleSelectChange}
      >
        {isLoading && <span slot="placeholder">....</span>}
        {options.map(option => (
          <OsdsSelectOption
            key={option.id}
            value={option.id}>
            <div className='flex items-center gap-2 flex-wrap'>
              {option.id === NEW_PROJECT_ITEM_ID && <OsdsIcon name={ODS_ICON_NAME.ADD} size={ODS_ICON_SIZE.xxs} color={ODS_THEME_COLOR_INTENT.primary} />}
              <span>{option.label}</span>
              {option.id === SEE_ALL_PROJECTS_ITEM_ID && <OsdsIcon name={ODS_ICON_NAME.ARROW_RIGHT} size={ODS_ICON_SIZE.xxs} color={ODS_THEME_COLOR_INTENT.primary} />}
            </div>
          </OsdsSelectOption>
        ))}
      </OsdsSelect>
    </>
  );
};

export default ProjectSelector;

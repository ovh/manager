import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { PciProject } from './PciProject';

const getProjectOption = (option: Record<string, any>): JSX.Element => {
  return (
    <div style={{ alignItems: 'center', display: 'flex' }}>
      {option.new && (
        <>
          <span
            className="oui-icon oui-icon-plus mr-2"
            aria-hidden="true"
          ></span>
          <span>{option.label}</span>
        </>
      )}
      {option.seeAll && (
        <>
          <span>{option.label}</span>
          <span
            className="oui-icon oui-icon-arrow-right ml-2"
            aria-hidden="true"
          ></span>
        </>
      )}
      {option.id && <span>{option.label}</span>}
    </div>
  );
};

export type Props = {
  isLoading: boolean;
  projects: PciProject[];
  selectedProject: PciProject;
  onProjectChange: CallableFunction;
  onProjectCreate: CallableFunction;
  onSeeAllProjects: CallableFunction;
  onMenuOpen?: CallableFunction;
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
  onMenuOpen,
  createLabel,
  seeAllButton,
  seeAllLabel,
}: Props): JSX.Element => {
  // Important note :
  // The any types in this bloc are there because the react select
  // should expose its own types, it's not for us to define
  // This should be updated once the lib is updated to expose the necessary typings
  // Also, i don't want to disable the option "noImplicitAny"
  // Because this is done under unique circumstances and should not impact the rest of the codebase
  const selectStyles = {
    option: (provided: any, { isFocused }: { isFocused: boolean }) => ({
      ...provided,
      backgroundColor: isFocused
        ? 'var(--ods-color-primary-075)'
        : 'var(--ods-color-default-000)',
      color: isFocused
        ? 'var(--ods-color-primary-700)'
        : 'var(--ods-color-primary-800)',
      cursor: 'pointer',
      ':active': {
        ...provided[':active'],
        backgroundColor: 'var(--ods-color-primary-100)',
        color: 'var(--ods-color-primary-700',
      },
    }),
    control: (provided: any, { isFocused }: { isFocused: boolean }) => ({
      ...provided,
      cursor: 'pointer',
      backgroundColor: isFocused
        ? 'var(--ods-color-primary-075)'
        : 'var(--ods-color-default-000)',
      color: isFocused
        ? 'var(--ods-color-primary-700)'
        : 'var(--ods-color-primary-800)',
    }),
  };
  const [options, setOptions] = useState([]);
  const [value, setValue] = useState(null);
  const [createProjectOption, setCreateProjectOption] = useState(null);
  const [seeAllProjectsOption, setSeeAllProjectsOption] = useState(null);

  useEffect(() => {
    setCreateProjectOption({
      new: true,
      label: createLabel,
    });
  }, [createLabel]);

  useEffect(() => {
    setSeeAllProjectsOption(
      seeAllButton
        ? {
            seeAll: true,
            label: seeAllLabel,
          }
        : null,
    );
  }, [seeAllButton, seeAllLabel]);

  useEffect(() => {
    setOptions([
      ...(seeAllProjectsOption ? [seeAllProjectsOption] : []),
      ...(createProjectOption ? [createProjectOption] : []),
      ...(projects
        ? projects.map(({ project_id: projectId, description }) => ({
            id: projectId,
            label: description || projectId,
          }))
        : [])
    ]);
  }, [projects, createProjectOption]);

  useEffect(() => {
    if (selectedProject) {
      setValue({
        id: selectedProject.project_id,
        label: selectedProject.description || selectedProject.project_id,
      });
    } else if (createProjectOption) {
      setValue(createProjectOption);
    }
  }, [selectedProject, options, createProjectOption]);

  return (
    <>
      <Select
        styles={selectStyles}
        isLoading={isLoading}
        isSearchable={false}
        formatOptionLabel={getProjectOption}
        options={options}
        menuPosition={'absolute'}
        onMenuOpen={() => onMenuOpen && onMenuOpen()}
        value={value}
        data-testid="project-selector"
        onChange={(option) => {
          if (option.new) {
            onProjectCreate();
          } else if (option.seeAll) {
            onSeeAllProjects();
          } else {
            onProjectChange(
              projects.find(
                ({ project_id: projectId }) => projectId === option.id,
              ),
            );
          }
        }}
      />
    </>
  );
};

export default ProjectSelector;

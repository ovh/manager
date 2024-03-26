import React, { useEffect, useState } from 'react';
import Select from 'react-select';

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

type Props = {
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
    option: (provided: any) => ({
      ...provided,
      backgroundColor: '#FFFFFF',
      color: '#1A53CF',
      ':hover': {
        backgroundColor: '#C8F0FD',
        color: '#4E568E',
      },
      cursor: 'pointer',
    }),
    control: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isFocused ? '#98D7F9' : '#FFF',
      color: state.isFocused ? '#1C55D0' : '#1A53CF',
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
    setOptions(() => {
      const options = [];
      if (projects) {
        projects.forEach((project) => {
          options.push({
            id: project.project_id,
            label: project.description || project.project_id,
          });
        });
      }
      options.push(createProjectOption ?? []);
      options.push(seeAllProjectsOption ?? []);
      return options;
    });
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

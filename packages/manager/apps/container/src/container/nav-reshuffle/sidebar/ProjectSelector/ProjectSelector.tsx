import React, { useEffect, useState } from 'react';
import Select from 'react-select';

const getProjectOption = (option): JSX.Element => {
  return (
    <div style={{ alignItems: 'center', display: 'flex' }}>
      {option.new && (
        <>
          <span className={'oui-icon oui-icon-plus'}></span>&nbsp;
          <span>{option.label}</span>
        </>
      )}
      {!option.new && <span>{option.label}</span>}
    </div>
  );
};

type Props = {
  isLoading: boolean;
  projects: [];
  selectedProject: unknown;
  onProjectChange: CallableFunction;
  onProjectCreate: CallableFunction;
  createLabel: string;
};
const ProjectSelector = ({
  isLoading,
  projects,
  selectedProject,
  onProjectChange,
  onProjectCreate,
  createLabel,
}: Props): JSX.Element => {
  const selectStyles = {
    option: (provided) => ({
      ...provided,
      backgroundColor: '#FFFFFF',
      color: '#1A53CF',
      ':hover': {
        backgroundColor: '#C8F0FD',
        color: '#4E568E',
      },
      cursor: 'pointer',
    }),
    control: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? '#98D7F9' : '#FFF',
      color: state.isFocused ? '#1C55D0' : '#1A53CF',
    }),
  };
  const [options, setOptions] = useState([]);
  const [value, setValue] = useState(null);
  const [createProjectOption, setCreateProjectOption] = useState(null);

  useEffect(() => {
    setCreateProjectOption({
      new: true,
      label: createLabel,
    });
  }, [createLabel]);

  useEffect(() => {
    setOptions([
      ...projects.map(({ project_id: projectId, description }) => ({
        id: projectId,
        label: description || projectId,
      })),
      ...(createProjectOption ? [createProjectOption] : []),
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
        value={value}
        onChange={(option) => {
          if (option.new) {
            onProjectCreate();
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

import { vi, it, describe, expect } from 'vitest';
import { render } from '@testing-library/react';
import ProjectSelector, { Props } from './ProjectSelector';
import { PciProject } from './PciProject';

const pciProjects : Array<Partial<PciProject>> = [
  {
    project_id: "12345",
    description: 'foofoo'
  },
  {
    project_id: "54321",
    description: 'foobar'
  }
];

const onProjectChange = vi.fn();
const onProjectCreate = vi.fn();
const onSeeAllProjects = vi.fn();
const onMenuOpen = vi.fn();

const props: Props = {
  isLoading: false,
  projects: pciProjects as Array<PciProject>,
  selectedProject: pciProjects[0] as PciProject,
  onProjectChange: onProjectChange,
  onProjectCreate: onProjectCreate,
  onSeeAllProjects: onSeeAllProjects,
  onMenuOpen: onMenuOpen,
  createLabel: "Créer un projet",
  seeAllButton: true,
  seeAllLabel: "Tous mes projets Public Cloud",
}

const renderProjectSelector = (props: Props) => {
  return render(<ProjectSelector
    isLoading={false}
    projects={props.projects}
    selectedProject={props.projects[0]}
    onProjectChange={props.onProjectChange}
    onProjectCreate={props.onProjectCreate}
    onSeeAllProjects={props.onSeeAllProjects}
    createLabel={props.createLabel}
    seeAllButton={props.seeAllButton}
    seeAllLabel={props.seeAllLabel}
  />);
}

describe("ProjectSelector.component", () => {
  it("should render", () => {
    const { queryByText } = renderProjectSelector(props);
    expect(queryByText(props.projects[0].description)).not.toBeNull();
  })
})
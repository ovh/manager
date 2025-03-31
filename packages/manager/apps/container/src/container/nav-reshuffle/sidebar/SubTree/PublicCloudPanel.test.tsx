import React from 'react';
import { vi, it, describe, expect } from 'vitest';
import { render, act, fireEvent } from '@testing-library/react';
import { Node } from '../navigation-tree/node';
import { PublicCloudPanel, PublicCloudPanelProps } from './PublicCloudPanel';
import { mockShell, mockPlugins } from '../mocks/sidebarMocks';
import { PciProject } from '../ProjectSelector/PciProject';
import { Props as ProjectSelectorProps } from '../ProjectSelector/ProjectSelector';
import { pciNode } from '../navigation-tree/services/publicCloud';

const node: Node = {
  id: 'pci-rancher',
  idAttr: 'pci-rancher-link',
  universe: 'pci',
  translation: 'sidebar_pci_rancher',
  serviceType: 'CLOUD_PROJECT_KUBE',
  routing: {
    application: 'public-cloud',
    hash: '#/pci/projects/{projectId}/rancher',
  },
  features: ['pci-rancher'],
  forceVisibility: true,
};

const handleOnSubMenuClick = vi.fn();

const props: PublicCloudPanelProps = {
  rootNode: pciNode,
  selectedNode: node,
  handleOnSubMenuClick,
};

const renderPublicCloudPanelComponent = (props: PublicCloudPanelProps) => {
  return render(
    <PublicCloudPanel
      rootNode={props.rootNode}
      selectedNode={props.selectedNode}
      handleOnSubMenuClick={props.handleOnSubMenuClick}
    />,
  );
};

const pciProjects: Array<Partial<PciProject>> = [
  {
    project_id: '12345',
  },
  {
    project_id: '54321',
  },
];

vi.mock('@/context', () => ({
  useShell: () => mockShell.shell,
}));

vi.mock('@tanstack/react-query', () => ({
  useQuery: () => {
    return {
      data: pciProjects,
      isError: false,
      isSuccess: true,
      refetch: () => {},
    };
  },
}));

vi.mock(
  '@/container/nav-reshuffle/data/hooks/defaultPublicCloudProject/useDefaultPublicCloudProject',
  () => ({
    useDefaultPublicCloudProject: () => ({
      data: pciProjects[1],
      status: 'success',
    }),
  }),
);

const location = {
  pathname: '/public-cloud/pci/projects',
  search: '',
};

vi.mock('react-router-dom', () => ({
  useLocation: () => location,
}));

vi.mock('../ProjectSelector/ProjectSelector', () => ({
  default: ({ selectedProject }: ProjectSelectorProps) => {
    return (
      <div data-testid="public-cloud-panel-project-selector">
        {selectedProject?.project_id}
      </div>
    );
  },
}));

describe('PublicCloudPanel.component', () => {
  it('should render', () => {
    const { queryByTestId } = renderPublicCloudPanelComponent(props);
    expect(queryByTestId('public-cloud-panel')).not.toBeNull();
  });

  it('should display default project id in project selector when url does not contain an id', () => {
    const { queryByTestId } = renderPublicCloudPanelComponent(props);
    const projectSelector = queryByTestId(
      'public-cloud-panel-project-selector',
    );
    expect(projectSelector).not.toBeNull();
    expect(projectSelector.innerHTML).toBe('54321');
  });

  it('should display project id in project selector when url contains an id', () => {
    location.pathname = '/public-cloud/pci/projects/12345/rancher';
    const { queryByTestId } = renderPublicCloudPanelComponent(props);
    const projectSelector = queryByTestId(
      'public-cloud-panel-project-selector',
    );
    expect(projectSelector).not.toBeNull();
    expect(projectSelector.innerHTML).toBe('12345');
  });

  it('should navigate to project creation when the button is clicked', async () => {
    const { queryByTestId } = renderPublicCloudPanelComponent(props);
    const createButton = queryByTestId('pci-create-project');
    await act(() => fireEvent.click(createButton));

    expect(mockPlugins.navigation.navigateTo).toHaveBeenCalled();
  });
});

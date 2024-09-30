import { vi, it, describe, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Node } from '../navigation-tree/node';
import { PublicCloudPanel, PublicCloudPanelProps } from './PublicCloudPanel';
import { mockShell } from '../mocks/sidebarMocks';
import { PciProject } from '../ProjectSelector/PciProject';
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
  handleOnSubMenuClick: handleOnSubMenuClick,
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
  useQuery: ({ queryKey }: { queryKey: Array<string> }) => {
    return queryKey.includes('pci-projects')
      ? {
          data: () => pciProjects,
          isError: () => false,
          isSuccess: () => true,
          refetch: () => {},
        }
      : {
          data: () => pciProjects[0],
          status: () => 'success',
        };
  },
}));

const location = {
  pathname: '/pci/projects/12345/rancher',
  search: '',
};

vi.mock('react-router-dom', () => ({
  useLocation: () => location,
}));

vi.mock('../ProjectSelector/ProjectSelector', () => ({
  default: () => <div data-testid="public-cloud-panel-project-selector" />,
}));

describe('PublicCloudPanel.component', () => {
  it('should render', () => {
    const { queryByTestId } = renderPublicCloudPanelComponent(props);
    expect(queryByTestId('public-cloud-panel')).not.toBeNull();
  });
});

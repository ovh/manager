import { vi, it, describe, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Node } from '../navigation-tree/node';
import {
  PublicCloudPanel,
  PublicCloudPanelProps,
  parseContainerURL,
} from './PublicCloudPanel';
import { mockShell } from '../mocks/sidebarMocks';
import { PciProject } from '../ProjectSelector/ProjectSelector';

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
  rootNode: node,
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
];

vi.mock('@/context', () => ({
  useShell: mockShell.shell,
}));

vi.mock('@tanstack/react-query', () => ({
  useQuery: () => ({
    data: () => pciProjects,
    isError: () => false,
    isSuccess: () => true,
    refetch: vi.fn(),
  }),
}));

const publicCloud = vi.hoisted(() => ({
  pciNode: {
    id: 'pci',
    idAttr: 'pci-link',
    translation: 'sidebar_pci',
    shortTranslation: 'sidebar_pci_short',
    universe: 'pci',
    features: ['public-cloud'],
    forceVisibility: true,
    routing: {
      application: 'public-cloud',
      hash: '#/pci/projects/{projectId}',
    },
    children: [
      {
        id: 'pci-compute',
        idAttr: 'pci-compute-link',
        universe: 'pci',
        translation: 'sidebar_pci_compute',
        features: ['instance'],
        forceVisibility: true,
        children: [
          {
            id: 'pci-instances',
            idAttr: 'pci-instances-link',
            universe: 'pci',
            translation: 'sidebar_pci_instances',
            serviceType: 'CLOUD_PROJECT_INSTANCE',
            routing: {
              application: 'public-cloud',
              hash: '#/pci/projects/{projectId}/instances',
            },
            features: ['instance'],
            forceVisibility: true,
          },
        ],
      },
    ],
  },
}));

vi.mock(
  '../navigation-tree/services/publicCloud',
  () => ({
    pciNode: publicCloud.pciNode
  }),
);

describe('PublicCloudPanel.component', () => {
  it('should render', () => {
    const { queryByTestId } = renderPublicCloudPanelComponent(props);
    expect(queryByTestId('public-cloud-panel')).not.toBeNull();
  });
});

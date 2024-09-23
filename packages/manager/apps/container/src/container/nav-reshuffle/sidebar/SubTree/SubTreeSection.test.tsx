import { vi, it, describe, expect } from 'vitest';
import { render } from '@testing-library/react';
import SubTreeSection, { SubTreeSectionProps } from './SubTreeSection';
import { Node } from '../navigation-tree/node';
import { mockShell } from '../mocks/sidebarMocks';

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

const handleOnSubMenuClick = vi.fn()

const props: SubTreeSectionProps = {
  node: node,
  selectedPciProject: '12345',
  selectedNode: node,
  handleOnSubMenuClick: handleOnSubMenuClick
}

const renderSubTreeSectionComponent = (props: SubTreeSectionProps) => {
  return render(
    <SubTreeSection
      node={props.node}
      selectedPciProject={props.selectedPciProject}
      selectedNode={props.selectedNode}
      handleOnSubMenuClick={props.handleOnSubMenuClick}
    />
  );
}

vi.mock('@/context', () => ({
  useShell: () => {
    return mockShell.shell;
  },
}));

vi.mock('@/container/nav-reshuffle/sidebar/SidebarLink', () => ({
  default: () => (<div data-testid="subtree-section-sidebar-link" />)
}));

describe('SubtreeSection.component', () => {
  it('should render', () => {
    const { queryByTestId } = renderSubTreeSectionComponent(props);
    expect(queryByTestId(`subtree-section-link-${props.node.id}`)).not.toBeNull();
  });

  it('should render list', () => {
    props.node.children = [node, node];
    const { queryByTestId, queryAllByTestId } = renderSubTreeSectionComponent(props);
    expect(queryByTestId(`subtree-section-ul-${props.node.id}`)).not.toBeNull();
    expect(queryAllByTestId('subtree-section-sidebar-link').length).toBe(2);
  });
})
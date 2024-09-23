import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import SidebarLinkTag from './SidebarLinkTag';
import { Node, NodeTag } from './navigation-tree/node';
import { mockShell } from './mocks/sidebarMocks';

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
  tag: NodeTag.BETA,
};

const nodeWithoutTag: Node = {
  id: 'help',
  translation: 'sidebar_assistance_help_center',
  url: 'help',
  count: false,
  isExternal: true,
};

vi.mock('@/context', () => ({
  useShell: () => {
    return mockShell.shell;
  },
}));

const renderSidebarLinkTagComponent = (node: Node) => {
  return render(<SidebarLinkTag node={node} />);
};

describe('SidebarLinkTag.component', () => {
  it('should render', async () => {
    renderSidebarLinkTagComponent(node);

    expect(screen.queryByTestId(`static-link-tag-${node.id}`)).not.toBeNull();
  });

  it('should not render', async () => {
    renderSidebarLinkTagComponent(nodeWithoutTag);

    expect(screen.queryByTestId(`static-link-tag-${node.id}`)).toBeNull();
  })
});

import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import StaticLinkTag from './SidebarLinkTag';
import { Node, NodeTag } from './navigation-tree/node';

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

const renderStaticLinkTagComponent = (node: Node) => {
  return render(<StaticLinkTag node={node} />);
};

describe('StaticLinkTag.component', () => {
  it('should render', async () => {
    renderStaticLinkTagComponent(node);

    expect(screen.queryByTestId(`static-link-tag-${node.id}`)).not.toBeNull();
  });

  it('should not render', async () => {
    renderStaticLinkTagComponent(nodeWithoutTag);

    expect(screen.queryByTestId(`static-link-tag-${node.id}`)).toBeNull();
  })
});

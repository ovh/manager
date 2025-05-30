import { describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import OvhProductName from '@ovh-ux/ovh-product-icons/utils/OvhProductNameEnum';
import SidebarLink, { SidebarLinkProps } from './SidebarLink';
import { Node } from './navigation-tree/node';

const handleOnClick = vi.fn();
const handleOnEnter = vi.fn();

const node: Node = {
  id: 'pci-rancher',
  idAttr: 'pci-rancher-link',
  hasService: false,
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

const externalNode: Node = {
  id: 'help',
  idAttr: 'help-link',
  translation: 'sidebar_assistance_help_center',
  url: 'help',
  hasService: false,
  isExternal: true,
  svgIcon: OvhProductName.HELPECENTER,
};

const props: SidebarLinkProps = {
  hasService: false,
  node,
  linkParams: null,
  handleOnClick,
  handleOnEnter,
  id: node.idAttr,
  isShortText: false,
};

vi.mock('@/container/nav-reshuffle/sidebar/StaticLink', () => ({
  StaticLink: () => <div data-testid={`static-link-mocked`} />,
  default: () => <div data-testid={`static-link-mocked`} />,
}));

const renderSidebarLinkComponent = (props: SidebarLinkProps) => {
  return render(
    <SidebarLink
      hasService={props.hasService}
      node={props.node}
      linkParams={props.linkParams}
      handleOnClick={props.handleOnClick}
      handleOnEnter={props.handleOnEnter}
      id={props.id}
      isShortText={props.isShortText}
    />,
  );
};

describe('SidebarLink.component', () => {
  it('SidebarLink should render a static link', () => {
    const { queryByTestId } = renderSidebarLinkComponent(props);
    expect(queryByTestId('static-link-mocked')).not.toBeNull();
  });

  it('SidebarLink with child should render a button as div', () => {
    props.node.children = [externalNode];
    const { queryByTestId } = renderSidebarLinkComponent(props);
    expect(queryByTestId(props.id)).not.toBeNull();
  });
});

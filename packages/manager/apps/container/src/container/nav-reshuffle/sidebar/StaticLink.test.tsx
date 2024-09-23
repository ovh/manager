import { describe, expect, it, vi } from 'vitest';
import { render, fireEvent, act } from '@testing-library/react';
import StaticLink from './StaticLink';
import { Node, NodeTag } from './navigation-tree/node';
import { StaticLinkProps } from './StaticLink';
import OvhProductName from '@ovh-ux/ovh-product-icons/utils/OvhProductNameEnum';
import { mockShell } from './mocks/sidebarMocks';

const node: Node = {
  id: 'pci-rancher',
  idAttr: 'pci-rancher-link',
  count: 0,
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
  count: false,
  isExternal: true,
  svgIcon: OvhProductName.HELPECENTER,
};

const handleClick: (e: React.MouseEvent) => void = vi.fn((e) => {e.preventDefault()});
const handleOnEnter: (node: Node, e: React.KeyboardEvent) => void = vi.fn((_, e) => {e.preventDefault()});

const linkParams = { projectId: '123456789' };

const props: StaticLinkProps = {
  node: node,
  linkParams: linkParams,
  handleClick: handleClick,
  handleOnEnter: handleOnEnter,
  isShortText: false,
};

vi.mock('@/context', () => ({
  useShell: () => {
    return mockShell.shell;
  },
}));

const renderStaticLinkComponent = (props: StaticLinkProps) => {
  return render(
    <StaticLink
      node={props.node}
      count={props.count}
      linkParams={props.linkParams}
      handleClick={props.handleClick}
      handleOnEnter={props.handleOnEnter}
      id={props.node.idAttr}
      isShortText={props.isShortText}
    />,
  );
};

describe('StaticLink.component', () => {
  it('Should render', () => {
    const { queryByTestId, getByText } = renderStaticLinkComponent(props);

    expect(queryByTestId(props.node.idAttr)).not.toBeNull();
    expect(getByText(props.node.translation)).toBeInTheDocument();
  });

  it('Static link should call callback when clicked', async () => {
    const { queryByTestId } = renderStaticLinkComponent(props);
    const staticLink = queryByTestId(props.node.idAttr);

    await act(() => fireEvent.click(staticLink));

    expect(handleClick).toHaveBeenCalled();
  });

  it('Static link should call callback when Enter is pressed', () => {
    const { queryByTestId } = renderStaticLinkComponent(props);
    const staticLink = queryByTestId(props.node.idAttr);

    fireEvent.keyUp(staticLink, {key: 'Enter', code: 'Enter', keyCode: 13, charCode: 13});

    expect(handleOnEnter).toHaveBeenCalled();
  })

  it('Url should be formatted with link params', () => {
    const { queryByTestId } = renderStaticLinkComponent(props);
    expect(queryByTestId(props.node.idAttr)).toHaveAttribute(
      'href',
      'https://www.ovh.com/manager/#/public-cloud/pci/projects/123456789/rancher',
    );
  });

  it('Static link with count should render icon', () => {
    props.count = 1;
    const { queryByTestId } = renderStaticLinkComponent(props);
    expect(queryByTestId(`static-link-count-${node.id}`)).not.toBeNull();
  })

  it('External static link should have correct data', () => {
    props.node = externalNode;
    const { queryByTestId } = renderStaticLinkComponent(props);

    expect(queryByTestId(props.node.idAttr)).toHaveAttribute(
      'target',
      '_blank',
    );
    expect(queryByTestId(props.node.idAttr)).toHaveAttribute(
      'rel',
      'noopener noreferrer',
    );
    expect(
      queryByTestId(props.node.idAttr).getElementsByClassName(
        'oui-icon-external-link',
      ).length,
    ).toBe(1);
  });

  it('Static link with a node with tag should display a SidebarLinkTag', () => {
    props.node.tag = NodeTag.BETA;
    const { queryByTestId } = renderStaticLinkComponent(props);
    expect(queryByTestId(`static-link-tag-${props.node.id}`)).not.toBeNull();
  });

  it('Static link in reduced mode should not display count or tag', () => {
    props.isShortText = true;
    const { queryByTestId } = renderStaticLinkComponent(props);
    expect(queryByTestId(`static-link-tag-${props.node.id}`)).toBeNull();
    expect(queryByTestId(`static-link-count-${props.node.id}`)).toBeNull();
  });
});

import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import StaticLink from './StaticLink';
import { Node } from './navigation-tree/node';
import { StaticLinkProps } from './StaticLink';
import OvhProductName from '@ovh-ux/ovh-product-icons/utils/OvhProductNameEnum';

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
  svgIcon: OvhProductName.HELPECENTER
};

const handleClick = vi.fn();
const handleOnEnter = vi.fn();

const linkParams = { projectId: '123456789' };

const props: StaticLinkProps = {
  node: node,
  linkParams: linkParams,
  handleClick: handleClick,
  handleOnEnter: handleOnEnter,
  isShortText: false,
};

const mockPlugins = vi.hoisted(() => ({
  environment: {
    getEnvironment: () => {
      return {
        getRegion: vi.fn(() => 'EU'),
        getUser: vi.fn(() => ({ ovhSubsidiary: 'FR' })),
      };
    },
  },
  navigation: {
    getURL: vi.fn(
      (app, hash) => `https://www.ovh.com/manager/#/${hash.replace('#', app)}`,
    ),
  },
}));

const mockShell = vi.hoisted(() => ({
  shell: {
    getPlugin: (plugin: string) => {
      return plugin === 'navigation'
        ? mockPlugins.navigation
        : mockPlugins.environment;
    },
  },
}));

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
    const {queryByTestId} = renderStaticLinkComponent(props);

    expect(queryByTestId(props.node.idAttr)).not.toBeNull();
  });

  it('Url should be formatted with link params', () => {
    const {queryByTestId} = renderStaticLinkComponent(props);
    expect(queryByTestId(props.node.idAttr)).toHaveAttribute(
      'href',
      'https://www.ovh.com/manager/#/public-cloud/pci/projects/123456789/rancher',
    );
  });

  it('Static link should have its text properly translated', () => {
    const {getByText} = renderStaticLinkComponent(props);
    expect(getByText(props.node.translation)).toBeInTheDocument();
  })

  it('External static link should have correct data', () => {
    props.node = externalNode;
    const { queryByTestId } = renderStaticLinkComponent(props);

    expect(queryByTestId(props.node.idAttr)).toHaveAttribute('target', '_blank');
    expect(queryByTestId(props.node.idAttr)).toHaveAttribute('rel', 'noopener noreferrer');
    expect(queryByTestId(props.node.idAttr).getElementsByClassName('oui-icon-external-link').length).toBe(1);
  });
});

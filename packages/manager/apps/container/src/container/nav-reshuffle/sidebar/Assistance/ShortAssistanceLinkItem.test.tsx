import { vi, it, describe } from 'vitest';
import OvhProductName from '@ovh-ux/ovh-product-icons/utils/OvhProductNameEnum';
import { render } from '@testing-library/react';
import { ShortAssistanceLinkItem, Props } from './ShortAssistanceLinkItem';
import { Node } from '../navigation-tree/node';
import { mockShell } from '../mocks/sidebarMocks';

const node: Node = {
  id: 'carbon_calculator',
  features: ['carbon-calculator'],
  translation: 'sidebar_assistance_carbon_calculator',
  hasService: false,
  routing: {
    application: 'carbon-calculator',
    hash: '#',
  },
  svgIcon: OvhProductName.LEAF,
};

vi.mock('@/context', () => ({
  useShell: () => {
    return mockShell.shell;
  },
}));

vi.mock('../style.module.scss', () => ({
  default: new Proxy(
    {},
    {
      get(_, style) {
        return style;
      },
    },
  ),
}));

vi.mock('@ovh-ux/ovh-product-icons/utils/SvgIconWrapper', () => ({
  SvgIconWrapper: () => <div>icon</div>,
}));

vi.mock('@ovhcloud/ods-components/react', () => ({
  OsdsLink: (props: { 'data-testid': string; children: React.ReactNode }) => (
    <a data-testid={props['data-testid']}>{props.children}</a>
  ),
  OsdsIcon: () => <div data-testid="osds-icon" />,
}));

const renderShortAssistanceLinkItem = (props: Props) => {
  return render(<ShortAssistanceLinkItem node={props.node} />);
};

const props: Props = {
  node,
};

describe('ShortAssistanceLinkItem.component', () => {
  it('should render', () => {
    const { queryByTestId } = renderShortAssistanceLinkItem(props);
    expect(
      queryByTestId(`short-assistance-link-item-${props.node.id}`),
    ).not.toBeNull();
    expect(
      queryByTestId(`short-assistance-link-item-${props.node.id}`),
    ).not.toHaveClass('sidebar_menu_items_selected');
  });
});

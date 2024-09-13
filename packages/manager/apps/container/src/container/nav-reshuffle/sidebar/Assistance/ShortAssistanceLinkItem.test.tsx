import { vi, it, describe } from 'vitest';
import { ShortAssistanceLinkItem, Props } from './ShortAssistanceLinkItem';
import { Node } from '../navigation-tree/node';
import OvhProductName from '@ovh-ux/ovh-product-icons/utils/OvhProductNameEnum';
import { mockShell } from '../mocks/sidebarMocks';
import { render } from '@testing-library/react';

const externalNode: Node = {
  id: 'help',
  idAttr: 'help-link',
  translation: 'sidebar_assistance_help_center',
  url: 'help',
  count: false,
  isExternal: true,
  svgIcon: OvhProductName.HELPECENTER,
};

const node: Node = {
  id: 'carbon_calculator',
  features: ['carbon-calculator'],
  translation: 'sidebar_assistance_carbon_calculator',
  count: false,
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
  default: new Proxy(new Object(), {
    get(_, style) {
      return style;
    },
  }),
}));

vi.mock('@ovh-ux/ovh-product-icons/utils/SvgIconWrapper', () => ({
  SvgIconWrapper: () => <div>icon</div>,
}));

const renderShortAssistanceLinkItem = (props: Props) => {
  return render(
    <ShortAssistanceLinkItem node={props.node} isSelected={props.isSelected} />,
  );
};

const props: Props = {
  node: node,
  isSelected: false,
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

  it('should have proper class if selected', () => {
    props.isSelected = true;
    const { queryByTestId } = renderShortAssistanceLinkItem(props);
    expect(
      queryByTestId(`short-assistance-link-item-${props.node.id}`),
    ).toHaveClass('sidebar_menu_items_selected');
  });

  it('should have external properties if external', () => {
    props.node = externalNode;
    const { queryByTestId } = renderShortAssistanceLinkItem(props);
    expect(
      queryByTestId(`short-assistance-link-item-${props.node.id}`).firstChild,
    ).toHaveAttribute('target', '_blank');
    expect(
      queryByTestId(`short-assistance-link-item-${props.node.id}`).firstChild,
    ).toHaveAttribute('rel', 'noopener noreferrer');
  });
});

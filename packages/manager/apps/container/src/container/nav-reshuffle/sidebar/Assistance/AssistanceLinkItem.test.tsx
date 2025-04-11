import { it, vi, describe } from 'vitest';
import { render } from '@testing-library/react';
import { AssistanceLinkItem, Props } from './AssistanceLinkItem';
import OvhProductName from '@ovh-ux/ovh-product-icons/utils/OvhProductNameEnum';
import { Node } from '../navigation-tree/node';

const externalNode: Node = {
  id: 'help',
  idAttr: 'help-link',
  translation: 'sidebar_assistance_help_center',
  url: 'help',
  hasService: false,
  isExternal: true,
  svgIcon: OvhProductName.HELPECENTER,
};

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

const props: Props = {
  node: node,
  isSelected: false,
  isLoading: false
};

const id: string = "assistance-link-item";

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

vi.mock('../SidebarLink', () => ({
  default: () => <div data-testid="sidebar-link-mocked" />,
}));

const renderAssistanceLinkItem = (props: Props) => {
  return render(
    <AssistanceLinkItem node={props.node} isSelected={props.isSelected} isLoading={props.isLoading} />,
  );
};

describe('AssistanceLinkItem.component', () => {
  it('should render', () => {
    const { queryByTestId } = renderAssistanceLinkItem(props);
    expect(queryByTestId(id)).not.toBeNull();
  });

  it('should have correct css class if selected', () => {
    props.isSelected = true;
    const { queryByTestId } = renderAssistanceLinkItem(props);
    expect(queryByTestId(id)).toHaveClass('sidebar_menu_items_selected');
  })
});

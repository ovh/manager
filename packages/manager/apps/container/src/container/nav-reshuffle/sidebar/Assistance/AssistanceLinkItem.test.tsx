import React from 'react';
import { it, vi, describe } from 'vitest';
import { render } from '@testing-library/react';
import OvhProductName from '@ovh-ux/ovh-product-icons/utils/OvhProductNameEnum';
import { AssistanceLinkItem, Props } from './AssistanceLinkItem';
import { Node } from '../navigation-tree/node';

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
  node,
  isSelected: false,
  isLoading: false,
};

const id = 'assistance-link-item';

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

vi.mock('../SidebarLink', () => ({
  default: () => <div data-testid="sidebar-link-mocked" />,
}));

const renderAssistanceLinkItem = (props: Props) => {
  return render(
    <AssistanceLinkItem
      node={props.node}
      isSelected={props.isSelected}
      isLoading={props.isLoading}
    />,
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
  });
});

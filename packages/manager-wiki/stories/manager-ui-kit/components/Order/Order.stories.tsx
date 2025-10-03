import React, { ComponentType } from 'react';

import { OdsText } from '@ovhcloud/ods-components/react';
import { Meta, StoryObj } from '@storybook/react';
import { Order } from '@ovh-ux/manager-ui-kit';

function renderComponent(args) {
  return (
    <Order>
      <Order.Configuration
        onCancel={args.onCancel}
        onConfirm={args.onConfirm}
        isValid={args.isValid}
      >
        <p>
          <OdsText preset="code" className="italic">
            ...|order configuration steps| ...
          </OdsText>
        </p>
      </Order.Configuration>
      <Order.Summary
        onFinish={args.onFinish}
        orderLink={args.orderLink}
        onClickLink={args.onClickLink}
        productName={args.productName}
      ></Order.Summary>
    </Order>
  );
}

type Story = StoryObj<typeof Order> &
  StoryObj<typeof Order.Configuration> &
  StoryObj<typeof Order.Summary>;

export const DemoOrder: Story = {
  args: {
    isValid: true,
    orderLink: 'https://www.ovh.com',
    productName: '',
    onCancel: () => {},
    onConfirm: () => {},
    onFinish: () => {},
    onClickLink: () => {},
  },
  render: renderComponent,
};

const meta: Meta = {
  title: 'Manager UI Kit/Components/Order',
  component: Order,
  subcomponents: {
    'Order.Summary': Order.Summary as ComponentType<unknown>,
    'Order.Configuration': Order.Configuration as ComponentType<unknown>,
  },
};

export default meta;

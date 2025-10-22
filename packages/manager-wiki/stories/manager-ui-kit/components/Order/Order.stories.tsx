import React, { ComponentType } from 'react';

import { Meta, StoryObj } from '@storybook/react';
import { Order, Text } from '@ovh-ux/muk';

function renderComponent(args) {
  return (
    <Order>
      <Order.Configuration
        onCancel={args.onCancel}
        onConfirm={args.onConfirm}
        isValid={args.isValid}
      >
        <p>
          <Text preset="code" className="italic">
            ...|order configuration steps| ...
          </Text>
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
  parameters: {
    docs: {
      source: {
        code: `<Order>
  <Order.Configuration
    onCancel={handleCancel}
    onConfirm={handleConfirm}
    isValid={isValid}
  >
    <p>Your order configuration steps here</p>
  </Order.Configuration>
  <Order.Summary
    onFinish={handleFinish}
    orderLink="https://www.ovh.com"
    onClickLink={handleClickLink}
    productName="Product Name"
  />
</Order>`,
      },
    },
  },
};

const meta: Meta = {
  title: 'Manager UI Kit/Components/Order',
  component: Order,
  tags: ['autodocs'],
  subcomponents: {
    'Order.Summary': Order.Summary as ComponentType<unknown>,
    'Order.Configuration': Order.Configuration as ComponentType<unknown>,
  },
};

export default meta;

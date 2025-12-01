import { Canvas as StorybookCanvas, useOf } from '@storybook/blocks';
import React, { type ComponentProps, type JSX } from 'react';

const Canvas = ({ of, ...prop }: ComponentProps<typeof StorybookCanvas>): JSX.Element => {
  return (
    <StorybookCanvas
      of={ of }
      { ...prop } />
  );
}

export {
  Canvas,
};

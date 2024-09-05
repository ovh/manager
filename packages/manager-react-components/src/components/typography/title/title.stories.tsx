import React from 'react';
import { Meta } from '@storybook/react';
import { Title, Subtitle } from './title.component';

export const title = () => <Title>Title</Title>;

export const subtitle = () => <Subtitle>Subtitle</Subtitle>;

const meta: Meta = {
  title: 'Typography/Texts',
  decorators: [(story) => <div>{story()}</div>],
  argTypes: {},
};

export default meta;

import React from 'react';
import { Meta } from '@storybook/react';
import { Title, Subtitle } from '@ovh-ux/manager-react-components';

export const title = () => <Title>Title</Title>;

export const subtitle = () => <Subtitle>Subtitle</Subtitle>;

const meta: Meta = {
  title: 'Manager React Components/Typography/Texts',
  decorators: [(story) => <div>{story()}</div>],
  argTypes: {},
};

export default meta;

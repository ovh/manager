import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { Card, CardProps } from '@ovh-ux/manager-react-components';

export const defaultProps: CardProps = {
  img: {
    alt: 'offer',
    src:
      'https://www.ovhcloud.com/sites/default/files/styles/offer_range_card/public/2021-06/1886_AI_Notebook1_Hero_600x400.png',
  },
  texts: {
    title: 'Title of the Card',
    description:
      "Here you can put the description of the card. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    category: 'NAS',
  },
  href: 'https://ovh.com',
};

const meta: Meta<typeof Card> = {
  title: 'Manager React Components/Navigation/Card',
  decorators: [
    // eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle
    (Story) => (
      <div className="columns-3">
        <Story />
      </div>
    ),
  ],
  component: Card,
  argTypes: {
    texts: {
      title: { control: 'text', description: 'Title of the Card' },
      category: {
        description: 'Category of the Card',
        control: 'text',
      },
      Description: {
        description: 'description of the Card',
        control: 'text',
      },
    },
    href: { control: 'text', description: 'URL of the Card and link' },
    isExternalHref: {
      control: 'boolean',
      description:
        'Change the icon of the link to indicate if the link is internal or external',
      table: {
        defaultValue: { summary: '' },
      },
    },
    img: {
      imgSrc: {
        control: 'text',
        description: 'URL of the image to display in the header of the Card',
      },
      imgAlt: {
        control: 'text',
        description: 'Alternative label of the image',
      },
    },
    badges: {
      description:
        'Display examples of badges in the story (in the actual code there is a badge slot)',
    },
  },
  args: defaultProps,
};
export default meta;

const Template: StoryFn<typeof Card> = (args: CardProps) => <Card {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  ...defaultProps,
};

export const WithBadges = Template.bind({});
WithBadges.args = {
  ...defaultProps,
  badges: [
    {
      text: 'Cloud computing',
    },
    {
      text: 'Beta',
    },
  ],
};

import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { LinkCard, LinkCardProps } from '@ovh-ux/muk';

export const defaultProps: LinkCardProps = {
  texts: {
    title: 'Title of the Card',
    category: 'Tutorial',
  },
  href: 'https://ovh.com',
};

const badges = [
  {
    text: 'Cloud computing',
  },
  {
    text: 'Beta',
  },
];

const img = {
  alt: 'offer',
  src:
    'https://www.ovhcloud.com/sites/default/files/styles/offer_range_card/public/2021-06/1886_AI_Notebook1_Hero_600x400.png',
};

const textsWithDescription = {
  ...defaultProps.texts,
  description:
    "Here you can put the description of the card. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
};

const meta: Meta<typeof LinkCard> = {
  title: 'Manager UI Kit/Components/Link Card',
  decorators: [
    // eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle
    (Story) => (
      <div className="columns-3">
        <Story />
      </div>
    ),
  ],
  component: LinkCard,
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
    externalHref: {
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

const Template: StoryFn<typeof LinkCard> = (args: LinkCardProps) => (
  <LinkCard {...args} />
);

export const WithDescription = Template.bind({});
WithDescription.args = {
  ...defaultProps,
  texts: textsWithDescription,
};

export const WithImage = Template.bind({});
WithImage.args = {
  ...defaultProps,
  img,
};

export const WithBadges = Template.bind({});
WithBadges.args = {
  ...defaultProps,
  badges,
};

export const WithCustomHrefLabel = Template.bind({});
WithCustomHrefLabel.args = {
  ...defaultProps,
  hrefLabel: 'Custom Label',
};

export const WithExternalLink = Template.bind({});
WithExternalLink.args = {
  ...defaultProps,
  externalHref: true,
};

export const CompleteExample = Template.bind({});
CompleteExample.args = {
  ...defaultProps,
  texts: textsWithDescription,
  img,
  badges,
};

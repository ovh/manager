import React from 'react';
import { Meta } from '@storybook/react';

import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { Links, LinksProps, LinkType } from './links.component';

const backLink: LinksProps = {
  label: 'Back to the list',
  href: 'https://www.ovhcloud.com',
  target: OdsHTMLAnchorElementTarget._blank,
  type: LinkType.back,
};

const nextLink: LinksProps = {
  href: 'https://www.ovhcloud.com/',
  target: OdsHTMLAnchorElementTarget._blank,
  label: 'Next Page',
  type: LinkType.next,
};

const externalLink: LinksProps = {
  href: 'https://www.ovhcloud.com/',
  target: OdsHTMLAnchorElementTarget._blank,
  label: 'External Page',
  type: LinkType.external,
};

const meta: Meta<LinksProps> = {
  title: 'Typography/Links',
  decorators: [(story) => <div>{story()}</div>],
  argTypes: {},
  args: backLink,
};

export default meta;

export const BackLink = () => <Links {...backLink} />;

export const NextLink = () => <Links {...nextLink} />;

export const ExternalLink = () => <Links {...externalLink} />;

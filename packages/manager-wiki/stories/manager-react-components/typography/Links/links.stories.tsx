import React from 'react';
import { Meta } from '@storybook/react';
import { OdsTooltip } from "@ovhcloud/ods-components/react"

import { Links, LinksProps, LinkType } from '@ovh-ux/manager-react-components';

const backLink: LinksProps = {
  label: 'Back to the list',
  href: 'https://www.ovhcloud.com',
  target: '_blank',
  type: LinkType.back,
};

const nextLink: LinksProps = {
  href: 'https://www.ovhcloud.com/',
  target: '_blank',
  label: 'Next Page',
  type: LinkType.next,
};

const externalLink: LinksProps = {
  href: 'https://www.ovhcloud.com/',
  target: '_blank',
  label: 'External Page',
  type: LinkType.external,
};

const linkWithTooltip: LinksProps = {
  href: 'https://www.ovhcloud.com/',
  target: '_blank',
  label: 'With tootltip helper',
  id: "linkWithTooltip"
};

const meta: Meta<LinksProps> = {
  title: 'Manager React Components/Typography/Links',
  decorators: [(story) => <div>{story()}</div>],
  argTypes: {},
  args: backLink,
};

export default meta;

export const BackLink = () => <Links {...backLink} />;

export const NextLink = () => <Links {...nextLink} />;

export const ExternalLink = () => <Links {...externalLink} />;

export const LinkWithTooltip = () => <>
<Links {...linkWithTooltip} />
<OdsTooltip triggerId={linkWithTooltip.id as string} withArrow>
    Custom tooltip
</OdsTooltip>
</>;

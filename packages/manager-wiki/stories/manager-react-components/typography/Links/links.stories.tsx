import React from 'react';
import { Meta } from '@storybook/react';
import { Links, LinksProps, LinkType } from '@ovh-ux/manager-react-components';
import { IAM_ACTIONS, IAM_URNS } from '../../../../utils/iam.constants';

const backLink: LinksProps = {
  children: 'Back to the list',
  href: 'https://www.ovhcloud.com',
  target: '_blank',
  type: LinkType.back,
};

const nextLink: LinksProps = {
  href: 'https://www.ovhcloud.com/',
  target: '_blank',
  children: 'Next Page',
  type: LinkType.next,
};

const externalLink: LinksProps = {
  href: 'https://www.ovhcloud.com/',
  target: '_blank',
  children: 'External Page',
  type: LinkType.external,
};

const iamLinkWithAuth: LinksProps = {
  href: 'https://www.ovhcloud.com/',
  target: '_blank',
  children: 'Resiliate Link',
  urn: IAM_URNS.WITH_AUTH,
  iamActions: IAM_ACTIONS,
  displayTooltip: true,
};

const iamLinkWithoutAuth: LinksProps = {
  href: 'https://www.ovhcloud.com/',
  target: '_blank',
  children: 'Resiliate Link',
  urn: IAM_URNS.WITHOUT_AUTH,
  iamActions: IAM_ACTIONS,
  displayTooltip: true,
};

const iamLinkWithoutAuthAndTooltip: LinksProps = {
  href: 'https://www.ovhcloud.com/',
  target: '_blank',
  children: 'Resiliate Link',
  urn: IAM_URNS.WITHOUT_AUTH,
  iamActions: IAM_ACTIONS,
  displayTooltip: false,
};

const meta: Meta<LinksProps> = {
  title: 'Manager React Components/Components/Links',
  decorators: [(story) => <div>{story()}</div>],
  argTypes: {},
  args: backLink,
};

export default meta;

export const BackLink = () => <Links {...backLink} />;

export const NextLink = () => <Links {...nextLink} />;

export const ExternalLink = () => <Links {...externalLink} />;

export const IamLinkWithAuth = () => <Links {...iamLinkWithAuth} />;

export const IamLinkWithoutAuth = () => <Links {...iamLinkWithoutAuth} />;

export const IamLinkWithoutAuthAndTooltip = () => (
  <Links {...iamLinkWithoutAuthAndTooltip} />
);

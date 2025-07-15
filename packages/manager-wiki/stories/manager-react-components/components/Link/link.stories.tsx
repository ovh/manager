import React from 'react';
import { Meta } from '@storybook/react';
import { Link, LinkProps, LINK_TYPE } from '@ovh-ux/manager-react-components';
import { IAM_ACTIONS, IAM_URNS } from '../../../../utils/iam.constants';

const backLink: LinkProps = {
  children: 'Back to the list',
  href: 'https://www.ovhcloud.com',
  target: '_blank',
  type: LINK_TYPE.back,
};

const nextLink: LinkProps = {
  href: 'https://www.ovhcloud.com/',
  target: '_blank',
  children: 'Next Page',
  type: LINK_TYPE.next,
};

const externalLink: LinkProps = {
  href: 'https://www.ovhcloud.com/',
  target: '_blank',
  children: 'External Page',
  type: LINK_TYPE.external,
};

const iamLinkWithAuthorization: LinkProps = {
  href: 'https://www.ovhcloud.com/',
  target: '_blank',
  children: 'Resiliate Link',
  urn: IAM_URNS.WITH_AUTH,
  iamActions: IAM_ACTIONS,
  displayTooltip: true,
};

const iamLinkWithoutAuthorization: LinkProps = {
  href: 'https://www.ovhcloud.com/',
  target: '_blank',
  children: 'Resiliate Link',
  urn: IAM_URNS.WITHOUT_AUTH,
  iamActions: IAM_ACTIONS,
  displayTooltip: true,
};

const iamLinkWithoutAuthAndTooltip: LinkProps = {
  href: 'https://www.ovhcloud.com/',
  target: '_blank',
  children: 'Resiliate Link',
  urn: IAM_URNS.WITHOUT_AUTH,
  iamActions: IAM_ACTIONS,
  displayTooltip: false,
};

const meta: Meta<LinkProps> = {
  title: 'Manager React Components/Components/Link',
  decorators: [(story) => <div>{story()}</div>],
  argTypes: {},
  args: backLink,
};

export default meta;

export const BackLink = () => <Link {...backLink} />;

export const NextLink = () => <Link {...nextLink} />;

export const ExternalLink = () => <Link {...externalLink} />;

export const IamLinkWithAuthorization = () => (
  <Link {...iamLinkWithAuthorization} />
);

export const IamLinkWithoutAuthorization = () => (
  <Link {...iamLinkWithoutAuthorization} />
);

export const IamLinkWithoutAuthAndTooltip = () => (
  <Link {...iamLinkWithoutAuthAndTooltip} />
);

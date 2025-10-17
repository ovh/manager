import React from 'react';
import { Meta } from '@storybook/react';
import { Link, LinkProps, LinkType } from '@ovh-ux/muk';
import { IAM_ACTIONS, IAM_URNS } from '../../../../utils/iam.constants';

const backLink: LinkProps = {
  children: 'Back to the list',
  href: 'https://www.ovhcloud.com',
  target: '_blank',
  type: LinkType.back,
};

const nextLink: LinkProps = {
  href: 'https://www.ovhcloud.com/',
  target: '_blank',
  children: 'Next Page',
  type: LinkType.next,
};

const externalLink: LinkProps = {
  href: 'https://www.ovhcloud.com/',
  target: '_blank',
  children: 'External Page',
  type: LinkType.external,
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
  title: 'Manager UI Kit/Components/Link',
  decorators: [(story) => <div>{story()}</div>],
  component: Link,
  tags: ['autodocs'],
  argTypes: {},
  args: backLink,
};

export default meta;

export const BackLink = () => <Link {...backLink} />;
BackLink.parameters = {
  docs: {
    source: {
      code: `<Link 
  type={LinkType.back}
  href="https://www.ovhcloud.com"
  target="_blank"
>
  Back to the list
</Link>`,
    },
  },
};

export const NextLink = () => <Link {...nextLink} />;
NextLink.parameters = {
  docs: {
    source: {
      code: `<Link 
  type={LinkType.next}
  href="https://www.ovhcloud.com"
  target="_blank"
>
  Next Page
</Link>`,
    },
  },
};

export const ExternalLink = () => <Link {...externalLink} />;
ExternalLink.parameters = {
  docs: {
    source: {
      code: `<Link 
  type={LinkType.external}
  href="https://www.ovhcloud.com"
  target="_blank"
>
  External Page
</Link>`,
    },
  },
};

export const IamLinkWithAuthorization = () => (
  <Link {...iamLinkWithAuthorization} />
);
IamLinkWithAuthorization.parameters = {
  docs: {
    source: {
      code: `<Link 
  href="https://www.ovhcloud.com"
  target="_blank"
  urn="urn:v9:eu:resource:vrackServices:vrs-xxx-xxx"
  iamActions={['vrackServices:apiovh:iam/resource/tag/remove']}
  displayTooltip={true}
>
  Resiliate Link
</Link>`,
    },
  },
};

export const IamLinkWithoutAuthorization = () => (
  <Link {...iamLinkWithoutAuthorization} />
);
IamLinkWithoutAuthorization.parameters = {
  docs: {
    source: {
      code: `<Link 
  href="https://www.ovhcloud.com"
  target="_blank"
  urn="urn:v9:eu:resource:vrackServices:vrs-xxx-xxx"
  iamActions={['vrackServices:apiovh:iam/resource/tag/remove']}
  displayTooltip={true}
>
  Resiliate Link
</Link>`,
    },
  },
};

export const IamLinkWithoutAuthAndTooltip = () => (
  <Link {...iamLinkWithoutAuthAndTooltip} />
);
IamLinkWithoutAuthAndTooltip.parameters = {
  docs: {
    source: {
      code: `<Link 
  href="https://www.ovhcloud.com"
  target="_blank"
  urn="urn:v9:eu:resource:vrackServices:vrs-xxx-xxx"
  iamActions={['vrackServices:apiovh:iam/resource/tag/remove']}
  displayTooltip={false}
>
  Resiliate Link
</Link>`,
    },
  },
};

import { ButtonType, PageLocation, TrackingClickParams } from '@ovh-ux/manager-react-shell-client';

interface ChangelogLinks {
  url: string;
  label_key: string;
  tracking: TrackingClickParams | any;
}

export const ROADMAP_CHANGELOG_PAGES = 10;
export const ROADMAP_CHANGELOG_DATAGRID_COLLAPSED_LENGTH = 80;

export const EXTERNAL_LINKS: Record<string, ChangelogLinks> = {
  CLOUD_CHANGELOG: {
    url: 'https://github.com/orgs/ovh/projects/16/views/6',
    label_key: 'changelog_cloud_label',
    tracking: {
      location: PageLocation.page,
      buttonType: ButtonType.externalLink,
      actions: [`go-to-changelog-cloud-products`],
      actionType: 'action',
    },
  },
  WEB_CHANGELOG: {
    url: 'https://github.com/orgs/ovh/projects/18/views/2',
    label_key: 'changelog_web_label',
    tracking: {
      location: PageLocation.page,
      buttonType: ButtonType.externalLink,
      actions: [`go-to-changelog-web-hosting-telecom-collaboration-products`],
      actionType: 'action',
    },
  },
  WEB_ROADMAP: {
    url: 'https://github.com/orgs/ovh/projects/18/views/1?pane=info ',
    label_key: 'changelog_roadmap_web_label',
    tracking: {
      location: PageLocation.page,
      buttonType: ButtonType.externalLink,
      actions: [`go-to-roadmap-web-hosting-telecom-collaboration`],
      actionType: 'action',
    },
  },
  DOMAIN_ROADMAP: {
    url: 'https://github.com/ovh/hosting-domain-names-roadmap/issues/new ',
    label_key: 'changelog_roadmap_domain_label',
    tracking: {
      location: PageLocation.page,
      buttonType: ButtonType.externalLink,
      actions: [`go-to-request-new-feature-web-hosting-domain-names`],
      actionType: 'action',
    },
  },
  COLLAB_ROADMAP: {
    url: 'https://github.com/ovh/collaborative-tools-roadmap/issues/new',
    label_key: 'changelog_roadmap_collab_label',
    tracking: {
      location: PageLocation.page,
      buttonType: ButtonType.externalLink,
      actions: [`go-to-request-new-feature-collaborative-solutions`],
      actionType: 'action',
    },
  },
  CLOUD_ROADMAP: {
    url: 'https://github.com/orgs/ovh/projects/16/views/6?pane=info',
    label_key: 'changelog_roadmap_cloud_label',
    tracking: {
      location: PageLocation.page,
      buttonType: ButtonType.externalLink,
      actions: [`go-to-roadmap-cloud`],
      actionType: 'action',
    },
  },
  PUBLIC_CLOUD_ROADMAP: {
    url: 'https://github.com/ovh/public-cloud-roadmap/issues/new',
    label_key: 'changelog_roadmap_public_cloud_label',
    tracking: {
      location: PageLocation.page,
      buttonType: ButtonType.externalLink,
      actions: [`go-to-request-new-feature-public-cloud-solutions`],
      actionType: 'action',
    },
  },
  INFRA_ROADMAP: {
    url: 'https://github.com/ovh/infrastructure-roadmap/issues/new',
    label_key: 'changelog_roadmap_infra_label',
    tracking: {
      location: PageLocation.page,
      buttonType: ButtonType.externalLink,
      actions: [
        `go-to-request-new-feature-infrastructure-solutions-dedicated-servers-network-features-nas-ha-efs`,
      ],
      actionType: 'action',
    },
  },
  PRIVATE_CLOUD_ROADMAP: {
    url: 'https://github.com/ovh/private-cloud-roadmap/issues/new',
    label_key: 'changelog_roadmap_private_cloud_label',
    tracking: {
      location: PageLocation.page,
      buttonType: ButtonType.externalLink,
      actions: [
        `go-to-request-new-feature-hosted-private-cloud-solutions-vmware-nutanix-sap-zerto-veeam-hycu`,
      ],
      actionType: 'action',
    },
  },
  SECURITY_ROADMAP: {
    url: 'https://github.com/ovh/management-security-operations-roadmap/issues/new',
    label_key: 'changelog_roadmap_security_label',
    tracking: {
      location: PageLocation.page,
      buttonType: ButtonType.externalLink,
      actions: [`go-to-request-new-feature-security-identity-operations-solutions`],
      actionType: 'action',
    },
  },
  HELPCENTER: {
    url: 'https://help.ovhcloud.com',
    label_key: 'changelog_helpcenter_label',
    tracking: {
      location: PageLocation.page,
      buttonType: ButtonType.externalLink,
      actions: [`go-to-ovhcloud-help-center`],
      actionType: 'action',
    },
  },
  HELPCENTER_US: {
    url: 'https://support.us.ovhcloud.com/hc/en-us',
    label_key: 'changelog_helpcenter_label',
    tracking: {
      location: PageLocation.page,
      buttonType: ButtonType.externalLink,
      actions: [`go-to-ovhcloud-help-center`],
      actionType: 'action',
    },
  },
  BUG_BOUNTY: {
    url: 'https://yeswehack.com/programs/ovh#rules',
    label_key: 'changelog_bugbounty_label',
    tracking: {
      location: PageLocation.page,
      buttonType: ButtonType.externalLink,
      actions: [`go-to-ovhcloud-bug-bounty-program`],
      actionType: 'action',
    },
  },
};

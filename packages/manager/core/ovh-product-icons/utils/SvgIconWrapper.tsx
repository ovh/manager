import React, { FunctionComponent } from 'react';

import {
  containerIcons,
  dedicatedIcons,
  telecomIcons,
  webIcons,
} from '@ovh-ux/ovh-product-icons/index';

import OvhProductName from './OvhProductNameEnum';

interface SvgIconProps {
  name: string;
  className?: string;
  width?: number;
  height?: number;
}

interface IconComponents {
  [key: string]: FunctionComponent<React.SVGProps<SVGSVGElement> & { title?: string }>;
}

const isValidIconComponent = (
  icon: unknown,
): icon is FunctionComponent<React.SVGProps<SVGSVGElement> & { title?: string }> =>
  typeof icon === 'function';

const iconComponents: IconComponents = Object.entries({
  ...dedicatedIcons,
  ...webIcons,
  ...telecomIcons,
  ...containerIcons,
}).reduce((acc, [key, component]) => {
  if (isValidIconComponent(component)) {
    acc[key] = component;
  }
  return acc;
}, {} as IconComponents);

const DEFAULT_SIZE = 32;

const SvgIconWrapper: React.FC<SvgIconProps> = ({
  name,
  className,
  width = DEFAULT_SIZE,
  height = DEFAULT_SIZE,
}) => {
  const IconComponent = iconComponents[name];

  if (!IconComponent) {
    return null;
  }

  return <IconComponent className={className} width={width} height={height} />;
};

const HOSTING_SVG = SvgIconWrapper({ name: OvhProductName.HOSTING });
const OFFICE365_SVG = SvgIconWrapper({ name: OvhProductName.OFFICE365 });
const WORDPRESS_SVG = SvgIconWrapper({ name: OvhProductName.WORDPRESS });
const PROJECTCLOUD_SVG = SvgIconWrapper({ name: OvhProductName.PROJECTCLOUD });
const EXCHANGE_SVG = SvgIconWrapper({ name: OvhProductName.EXCHANGE });
const ZIMBRA_SVG = SvgIconWrapper({
  name: OvhProductName.ZIMBRA,
  width: 40,
  height: 40,
});
const TELECOMETHERNET_SVG = SvgIconWrapper({
  name: OvhProductName.TELECOMETHERNET,
});
const HEADSET_SVG = SvgIconWrapper({
  name: OvhProductName.HEADSET,
});

const TELEPHONY_SVG = SvgIconWrapper({ name: OvhProductName.TELEPHONY });
const SERVER_SVG = SvgIconWrapper({ name: OvhProductName.SERVER });
const IP_SVG = SvgIconWrapper({ name: OvhProductName.IP });
const VPS_SVG = SvgIconWrapper({ name: OvhProductName.VPS });
const NUTANIX_SVG = SvgIconWrapper({ name: OvhProductName.NUTANIX });
const MANAGEDBM_SVG = SvgIconWrapper({ name: OvhProductName.MANAGEDBM });
const VMWARE_SVG = SvgIconWrapper({ name: OvhProductName.VMWARE });
const NAS_SVG = SvgIconWrapper({ name: OvhProductName.NAS });
const VEEAM_SVG = SvgIconWrapper({ name: OvhProductName.VEEAM });
const VRACK_SVG = SvgIconWrapper({ name: OvhProductName.VRACK });
const LINECOMMUNICATING_SVG = SvgIconWrapper({
  name: OvhProductName.LINECOMMUNICATING,
});

export {
  HOSTING_SVG,
  OFFICE365_SVG,
  WORDPRESS_SVG,
  PROJECTCLOUD_SVG,
  TELECOMETHERNET_SVG,
  HEADSET_SVG,
  TELEPHONY_SVG,
  EXCHANGE_SVG,
  ZIMBRA_SVG,
  IP_SVG,
  VPS_SVG,
  NUTANIX_SVG,
  MANAGEDBM_SVG,
  VMWARE_SVG,
  NAS_SVG,
  VEEAM_SVG,
  VRACK_SVG,
  LINECOMMUNICATING_SVG,
  SERVER_SVG,
  SvgIconWrapper,
};

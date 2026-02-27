import React from 'react';

import { Icon, ICON_NAME, Link } from '@ovhcloud/ods-react';

import { ShellContext } from '@ovh-ux/manager-react-shell-client';

type LinkToOtherAppProps = {
  className?: string;
  children?: string;
  appName: string;
  path: string;
  params?: Record<string, string>;
  icon?: ICON_NAME;
  forcedHref?: string;
};

export const LinkToOtherApp: React.FC<LinkToOtherAppProps> = ({
  className,
  children,
  appName,
  path,
  params = {},
  icon,
  forcedHref,
}) => {
  const { shell } = React.useContext(ShellContext);
  const [href, setHref] = React.useState('#');

  React.useEffect(() => {
    shell.navigation.getURL(appName, path, params).then((response) => {
      setHref(response as string);
    });
  }, []);

  return (
    <Link
      className={className}
      href={forcedHref ?? href}
      referrer-policy="strict-origin-when-cross-origin"
      target="_blank"
    >
      <Icon name={icon} />
      {children}
    </Link>
  );
};

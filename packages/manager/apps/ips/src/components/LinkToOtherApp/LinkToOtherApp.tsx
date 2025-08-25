import React from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { OdsLink } from '@ovhcloud/ods-components/react';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';

type LinkToOtherAppProps = {
  className?: string;
  children?: string;
  appName: string;
  path: string;
  params?: Record<string, string>;
  icon?: ODS_ICON_NAME;
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
    const fetchUrl = async () => {
      try {
        const response = await shell.navigation.getURL(appName, path, params);
        setHref(response as string);
      } catch (error) {
        setHref('#');
      }
    };
    fetchUrl();
  }, []);

  return (
    <OdsLink
      className={className}
      href={forcedHref ?? href}
      referrerpolicy="strict-origin-when-cross-origin"
      target="_blank"
      icon={icon}
      label={children}
    />
  );
};

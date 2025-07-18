import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { OsdsIcon, OsdsLink } from '@ovhcloud/ods-components/react';
import { ODS_ICON_NAME, ODS_ICON_SIZE } from '@ovhcloud/ods-components';
import { PropsWithChildren, useCallback } from 'react';
import { ButtonType, useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { GuideName } from '@/contexts/GuideContext/GuideContext';
import { useGuide } from '@/hooks/useGuide';
import { kebabToSnake } from '@/shared-lib/string';

export const GuideLink = ({
  guideName,
  children,
}: PropsWithChildren<{ guideName: GuideName }>) => {
  const guideHref = useGuide(guideName);
  const { trackClick } = useOvhTracking();

  const onClick = useCallback(() => {
    trackClick({
      buttonType: ButtonType.externalLink,
      actions: [`go-to-${kebabToSnake(guideName)}`],
    });
  }, [guideName, trackClick]);

  return (
    <OsdsLink
      href={guideHref}
      onClick={onClick}
      color={ODS_THEME_COLOR_INTENT.primary}
      target={OdsHTMLAnchorElementTarget._blank}
    >
      {children}
      <span slot="end">
        <OsdsIcon
          aria-hidden="true"
          className="ml-4"
          name={ODS_ICON_NAME.EXTERNAL_LINK}
          hoverable
          size={ODS_ICON_SIZE.xxs}
          color={ODS_THEME_COLOR_INTENT.primary}
        />
      </span>
    </OsdsLink>
  );
};

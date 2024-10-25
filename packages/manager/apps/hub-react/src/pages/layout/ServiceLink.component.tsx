import { OsdsIcon, OsdsLink } from '@ovhcloud/ods-components/react';
import {
  ShellContext,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { useContext } from 'react';
import { ODS_ICON_NAME, ODS_ICON_SIZE } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';

type Props = {
  application: string;
  hash: string;
  type: string;
};

export default function ServiceLink({ application, hash, type }: Props) {
  const { t } = useTranslation();
  const {
    shell: { navigation },
  } = useContext(ShellContext);
  const { data: link, isLoading } = useQuery({
    queryKey: ['shell', 'getUrl', application, hash],
    queryFn: () => navigation.getURL(application, hash, {}) as Promise<string>,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
  const { trackClick } = useOvhTracking();
  const trackProductNavigation = () => {
    trackClick({
      actionType: 'action',
      actions: ['product', type, 'show-all'],
    });
  };
  return (
    !isLoading && (
      <OsdsLink
        slot="actions"
        href={link}
        color={ODS_THEME_COLOR_INTENT.primary}
        onClick={trackProductNavigation}
        target={OdsHTMLAnchorElementTarget._top}
        className="text-right"
        data-testid="product_link"
      >
        {t('hub_support_see_more')}
        <span slot="end">
          <OsdsIcon
            name={ODS_ICON_NAME.ARROW_RIGHT}
            size={ODS_ICON_SIZE.xs}
            color={ODS_THEME_COLOR_INTENT.text}
            className="self-center ml-4"
          />
        </span>
      </OsdsLink>
    )
  );
}

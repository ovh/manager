import { useContext } from 'react';

import { useTranslation } from 'react-i18next';

import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { ODS_MESSAGE_TYPE } from '@ovhcloud/ods-components';
import { OsdsMessage, OsdsText } from '@ovhcloud/ods-components/react';

import { LinkType, Links } from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

import { LOAD_BALANCER_DOC } from '@/constants';

export function LoadBalancerWarning() {
  const { t } = useTranslation('network-add');
  const context = useContext(ShellContext);
  const { ovhSubsidiary } = context.environment.getUser();
  const loadBalancerDocumentationLink =
    LOAD_BALANCER_DOC[ovhSubsidiary] ?? LOAD_BALANCER_DOC.DEFAULT;

  return (
    <OsdsMessage
      type={ODS_MESSAGE_TYPE.warning}
      color={ODS_THEME_COLOR_INTENT.warning}
      className="my-6"
    >
      <div>
        <OsdsText
          level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
          size={ODS_THEME_TYPOGRAPHY_SIZE._400}
          color={ODS_THEME_COLOR_INTENT.text}
          className="block"
        >
          {t('kubernetes_network_form_subnet_error_no_gateway_ip_p1')}
        </OsdsText>
        <OsdsText
          level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
          size={ODS_THEME_TYPOGRAPHY_SIZE._400}
          color={ODS_THEME_COLOR_INTENT.text}
          className="block"
        >
          {t('kubernetes_network_form_subnet_error_no_gateway_ip_p2')}{' '}
          <Links
            href={loadBalancerDocumentationLink}
            target={OdsHTMLAnchorElementTarget._blank}
            type={LinkType.external}
            label={t('kubernetes_network_form_subnet_error_no_gateway_ip_link')}
          />
        </OsdsText>
      </div>
    </OsdsMessage>
  );
}

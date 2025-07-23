import React, { useContext, useMemo } from 'react';

import { useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ODS_LINK_COLOR, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsMessage, OdsText } from '@ovhcloud/ods-components/react';

import { getExpressOrderURL } from '@ovh-ux/manager-module-order';
import {
  IconLinkAlignmentType,
  LinkType,
  Links,
  OvhSubsidiary,
} from '@ovh-ux/manager-react-components';
import {
  ButtonType,
  PageLocation,
  ShellContext,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';

import { ZimbraPlanCodes, generateOrderURL } from '@/data/api';
import { ORDER_ZIMBRA_PRO_BETA_EMAIL_ACCOUNT } from '@/tracking.constants';

export const ProBetaBanner = () => {
  const { platformId } = useParams();
  const { t } = useTranslation('common');
  const { trackClick } = useOvhTracking();

  const context = useContext(ShellContext);
  const ovhSubsidiary = context.environment.getUser().ovhSubsidiary as OvhSubsidiary;
  const region = context.environment.getRegion();

  const expressOrderURL = useMemo(() => {
    return generateOrderURL({
      baseURL: getExpressOrderURL(region, ovhSubsidiary),
      products: [
        {
          planCode: ZimbraPlanCodes.ZIMBRA_PRO,
          quantity: 1,
          platformId,
        },
      ],
    });
  }, [platformId, region, ovhSubsidiary]);

  const onLinkClick = () => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [ORDER_ZIMBRA_PRO_BETA_EMAIL_ACCOUNT],
    });
  };

  return (
    <OdsMessage className="w-full" isDismissible={false}>
      <div className="flex flex-col gap-4 mt-1">
        <OdsText preset={ODS_TEXT_PRESET.heading6}>{t('zimbra_pro_beta_title')}</OdsText>
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>{t('zimbra_pro_beta_description')}</OdsText>
        <Links
          onClickReturn={onLinkClick}
          iconAlignment={IconLinkAlignmentType.right}
          color={ODS_LINK_COLOR.primary}
          href={expressOrderURL}
          type={LinkType.external}
          label={t('order_an_account_type', { type: 'Zimbra Pro' })}
          target="_blank"
        />
      </div>
    </OdsMessage>
  );
};

export default ProBetaBanner;

import { Links, LinkType } from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import { OsdsText } from '@ovhcloud/ods-components/react';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useComputeDate } from './useComputeDate.hook';

type HistoryResumeProps = {
  totalPrice: number;
  isPostPaidUsageBilling: boolean;
};

export default function HistoryResume({
  totalPrice,
  isPostPaidUsageBilling,
}: Readonly<HistoryResumeProps>) {
  const { t } = useTranslation('history');

  const [billingUrl, setBillingUrl] = useState('');

  const {
    shell: { navigation },
    environment,
  } = useContext(ShellContext);

  const { translationValues } = useComputeDate();

  useEffect(() => {
    navigation
      .getURL('dedicated', '#/billing/history', {})
      .then((data) => setBillingUrl(data as string));
  }, [navigation]);

  return (
    <div className="my-4 p-4 bg-[--ods-color-default-050] border border-solid border-[--ods-color-default-200]">
      <OsdsText
        size={ODS_TEXT_SIZE._400}
        level={ODS_TEXT_LEVEL.heading}
        color={ODS_THEME_COLOR_INTENT.text}
        className="block"
      >
        {t('cpbhd_monthly_bill_header', { ...translationValues })}
      </OsdsText>

      {isPostPaidUsageBilling && (
        <OsdsText
          size={ODS_TEXT_SIZE._400}
          level={ODS_TEXT_LEVEL.body}
          color={ODS_THEME_COLOR_INTENT.text}
          className="mb-5"
        >
          {t('cpbhd_monthly_bill_description', {
            ...translationValues,
          })}
        </OsdsText>
      )}

      <OsdsText
        size={ODS_TEXT_SIZE._700}
        level={ODS_TEXT_LEVEL.heading}
        color={ODS_THEME_COLOR_INTENT.text}
        className="block my-4"
      >
        {`${totalPrice?.toFixed(2)} ${environment?.getUser()?.currency.symbol}`}
      </OsdsText>

      <Links
        type={LinkType.next}
        href={billingUrl}
        label={t('cpbhd_bill_link')}
        target={OdsHTMLAnchorElementTarget._top}
      />
    </div>
  );
}

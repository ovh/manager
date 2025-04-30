import React, { useEffect } from 'react';
import {
  OdsBadge,
  OdsDivider,
  OdsIcon,
  OdsLink,
  OdsText,
  OdsTooltip,
} from '@ovhcloud/ods-components/react';
import {
  ODS_DIVIDER_COLOR,
  ODS_DIVIDER_SPACING,
  ODS_ICON_NAME,
} from '@ovhcloud/ods-components';
import { useNavigationGetUrl } from '@ovh-ux/manager-react-shell-client';
import { useTranslation } from 'react-i18next';
import { useFormatDate } from '@ovh-ux/manager-react-components';
import { useGetDomainDetail } from '@/alldoms/hooks/data/query';
import Loading from '../../Loading/Loading';
import { DomainTransferLockStatusEnum } from '@/alldoms/enum/service.enum';

interface ServiceDetailDomainItemProps {
  readonly domain: string;
}

export default function ServiceDetailDomainItem({
  domain,
}: ServiceDetailDomainItemProps) {
  const { t } = useTranslation('allDom');
  const formatDate = useFormatDate();
  const { data: domainDetail, isLoading } = useGetDomainDetail(domain);
  const { data: managerUrl } = useNavigationGetUrl(['web', '', {}]);
  const expirationDate = formatDate({
    date: domainDetail?.expirationDate,
    format: 'P',
  });

  useEffect(() => {
    console.log(domainDetail);
  }, [domainDetail]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>
      <OdsDivider
        color={ODS_DIVIDER_COLOR.light}
        spacing={ODS_DIVIDER_SPACING._24}
      />

      <div className="flex flex-col gap-y-4">
        <OdsLink
          href={`${managerUrl}/domain/${domain}/information`}
          label={domain}
          target="_blank"
        />

        {!domainDetail ? (
          <div>
            <OdsBadge label={domainDetail.state} />

            <OdsText className="mb-4">{`${t(
              'allDom_table_header_expirationDate',
            )} : ${expirationDate}`}</OdsText>

            <div className="flex items-center gap-x-6">
              <OdsText>{t('allDom_detail_page_technical_flags')}</OdsText>
              <div className="flex items-center gap-x-4">
                <div>
                  <OdsIcon
                    id={`${domain}-1`}
                    name={ODS_ICON_NAME.circleCheck}
                    className={`text-2xl ${
                      domainDetail ? 'text-green-700' : 'text-gray-300'
                    }`}
                  />
                  <OdsTooltip triggerId={`${domain}-1`}>
                    <OdsText>
                      {t('allDom_page_detail_domain_transfert_protected')}
                    </OdsText>
                  </OdsTooltip>
                </div>
                <div>
                  <OdsIcon
                    id={`${domain}-2`}
                    name={ODS_ICON_NAME.lockClose}
                    className={`text-2xl ${
                      domainDetail.transferLockStatus ===
                      DomainTransferLockStatusEnum.Locked
                        ? 'text-green-700'
                        : 'text-gray-300'
                    }`}
                  />
                  <OdsTooltip triggerId={`${domain}-2`}>
                    <OdsText>
                      {t('allDom_page_detail_domain_transfert_protected')}
                    </OdsText>
                  </OdsTooltip>
                </div>
                <div>
                  <OdsIcon
                    id={`${domain}-3`}
                    name={ODS_ICON_NAME.shieldXmark}
                    className={`text-2xl ${
                      domainDetail.dnssecSupported
                        ? 'text-green-700'
                        : 'text-gray-300'
                    }`}
                  />
                  <OdsTooltip triggerId={`${domain}-3`}>
                    <OdsText>
                      {t('allDom_page_detail_domain_dnssec_enable')}
                    </OdsText>
                  </OdsTooltip>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <OdsText>{t('allDom_detail_page_domain_unavailable')}</OdsText>
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { ipFormatter } from '@/utils/ipFormatter';
import { useGetIpdetails, useGetIpMitigation } from '@/data/hooks/ip';
import { SkeletonCell } from '../SkeletonCell/SkeletonCell';
import { ListingContext } from '@/pages/listing/listingContext';
import { IconCell } from '../IconCell/IconCell';
import { datagridCellStyle } from '../datagridCellStyles';
import { IpMitigationStateEnum } from '@/data/api';

export type IpAntiDdosProps = {
  ip: string;
};

/**
 * Component to display the cell content for Anti DDOS.
 * If ip is not /32 (isGroup = true) or not ipv4, we display nothing.
 * If ip mitigation is Permanent we display permanent
 * If ip mitigation is Auto, we display In Action
 * If ip mitigation has no mitigation, we display automatic
 * If mitigation state is not "ok", we display pending
 * @param ip the ip with mask
 * @returns React component
 */
export const IpAntiDdos = ({ ip }: IpAntiDdosProps) => {
  const id = `antiddos-${ip.replace(/\/|\./g, '-')}`;
  const { expiredIps } = useContext(ListingContext);
  const { t } = useTranslation('listing');

  // Check if ip is not a group
  const { isGroup } = ipFormatter(ip);

  // Get ip details
  const { ipDetails, isLoading: isDetailsLoading } = useGetIpdetails({
    ip,
    enabled: !isGroup,
  });

  // get ip mitigation only if ip is ipv4
  const enabled =
    expiredIps.indexOf(ip) === -1 &&
    !isDetailsLoading &&
    ipDetails?.version === 4;

  const { ipMitigation, isLoading, error } = useGetIpMitigation({
    ip,
    enabled,
  });

  return (
    <SkeletonCell
      isLoading={isLoading || isDetailsLoading}
      enabled={!isGroup}
      error={error}
    >
      {enabled && !ipMitigation?.length && (
        <IconCell
          icon={ODS_ICON_NAME.shield}
          text={t('listingColumnsIpAntiDDosAutomatic')}
          tooltip={t('listingColumnsIpAntiDDosAutomaticTooltip')}
          trigger={id}
        />
      )}
      {enabled &&
        ipMitigation?.map((mitigation) => {
          return (
            <div key={mitigation.ipOnMitigation}>
              {mitigation.state === IpMitigationStateEnum.OK &&
                mitigation.permanent && (
                  <IconCell
                    icon={ODS_ICON_NAME.shieldExclamation}
                    text={t('listingColumnsIpAntiDDosPermanent')}
                    style={datagridCellStyle.iconWarning}
                    tooltip={t('listingColumnsIpAntiDDosPermanentTooltip')}
                    trigger={id}
                  />
                )}
              {mitigation.state === IpMitigationStateEnum.OK &&
                mitigation.auto && (
                  <IconCell
                    icon={ODS_ICON_NAME.shieldCheck}
                    text={t('listingColumnsIpAntiDDosInAction')}
                    style={datagridCellStyle.iconSuccess}
                    tooltip={t('listingColumnsIpAntiDDosInActionTooltip')}
                    trigger={id}
                  />
                )}
              {!!mitigation &&
                mitigation.state !== IpMitigationStateEnum.OK && (
                  <IconCell
                    icon={ODS_ICON_NAME.shieldMinus}
                    text={t('listingColumnsIpAntiDDosPending')}
                    style={datagridCellStyle.iconWarning}
                    tooltip={t('listingColumnsIpAntiDDosPendingTooltip')}
                    trigger={id}
                  />
                )}
            </div>
          );
        })}
    </SkeletonCell>
  );
};

import React from 'react';
import { useTranslation } from 'react-i18next';
import { ODS_BADGE_COLOR } from '@ovhcloud/ods-components';
import { IpMitigationStateEnum, IpMitigationType } from '@/data/api';
import { BadgeCell } from '../BadgeCell/BadgeCell';

export type IpAntiDdosDisplayProps = {
  ipMitigation: IpMitigationType;
  enabled: boolean;
  ip: string;
};

/**
 * Component to display the cell content for Anti DDOS.
 * If anti ddos not enabled display nothing
 * If ip mitigation is Permanent we display permanent
 * If ip mitigation is Auto, we display In Action
 * If ip mitigation has no mitigation, we display automatic
 * If mitigation state is not "ok", we display pending
 * @param ip the original ip used for ipMitigation request
 * @param ipMitigation the mitigation object for given ip (can be null)
 * @param enabled boolean used to display datas or not
 * @returns React component
 */
export const IpAntiDdosDisplay = ({
  ipMitigation,
  enabled,
  ip,
}: IpAntiDdosDisplayProps) => {
  const id = `antiddos-${ip.replace(/\/|\./g, '-')}`;
  const { t } = useTranslation('listing');

  return (
    <>
      {enabled && !ipMitigation && (
        <BadgeCell
          badgeColor={ODS_BADGE_COLOR.neutral}
          text={t('listingColumnsIpAntiDDosAutomatic')}
          tooltip={t('listingColumnsIpAntiDDosAutomaticTooltip')}
          trigger={id}
        />
      )}
      {enabled && !!ipMitigation && (
        <div key={ipMitigation.ipOnMitigation}>
          {ipMitigation.state === IpMitigationStateEnum.OK &&
            ipMitigation.permanent && (
              <BadgeCell
                badgeColor={ODS_BADGE_COLOR.warning}
                text={t('listingColumnsIpAntiDDosPermanent')}
                tooltip={t('listingColumnsIpAntiDDosPermanentTooltip')}
                trigger={id}
              />
            )}
          {ipMitigation.state === IpMitigationStateEnum.OK &&
            ipMitigation.auto && (
              <BadgeCell
                badgeColor={ODS_BADGE_COLOR.success}
                text={t('listingColumnsIpAntiDDosInAction')}
                tooltip={t('listingColumnsIpAntiDDosInActionTooltip')}
                trigger={id}
              />
            )}
          {!!ipMitigation &&
            ipMitigation.state !== IpMitigationStateEnum.OK && (
              <BadgeCell
                badgeColor={ODS_BADGE_COLOR.warning}
                text={t('listingColumnsIpAntiDDosPending')}
                tooltip={t('listingColumnsIpAntiDDosPendingTooltip')}
                trigger={id}
              />
            )}
        </div>
      )}
    </>
  );
};

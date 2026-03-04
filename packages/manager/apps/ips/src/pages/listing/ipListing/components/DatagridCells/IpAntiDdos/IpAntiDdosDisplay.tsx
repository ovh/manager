import { useTranslation } from 'react-i18next';

import { BADGE_COLOR } from '@ovhcloud/ods-react';

import { IpMitigationStateEnum, IpMitigationType } from '@/data/api';

import { BadgeCell } from '../BadgeCell/BadgeCell';
import { TRANSLATION_NAMESPACES } from '@/utils';

export type IpAntiDdosDisplayProps = {
  ipMitigation: IpMitigationType;
  enabled: boolean;
};

/**
 * Component to display the cell content for Anti DDOS.
 * If anti ddos not enabled display nothing
 * If ip mitigation is Permanent we display permanent
 * If ip mitigation is Auto, we display In Action
 * If ip mitigation has no mitigation, we display automatic
 * If mitigation state is not "ok", we display pending
 * @param ipMitigation the mitigation object for given ip (can be null)
 * @param enabled boolean used to display datas or not
 * @returns React component
 */
export const IpAntiDdosDisplay = ({
  ipMitigation,
  enabled,
}: IpAntiDdosDisplayProps) => {
  const { t } = useTranslation(TRANSLATION_NAMESPACES.listing);

  return (
    <>
      {enabled && Object.keys(ipMitigation).length === 0 && (
        <BadgeCell
          badgeColor={BADGE_COLOR.neutral}
          text={t('listingColumnsIpAntiDDosAutomatic')}
          tooltip={t('listingColumnsIpAntiDDosAutomaticTooltip')}
        />
      )}
      {enabled && Object.keys(ipMitigation).length > 0 && (
        <div key={ipMitigation.ipOnMitigation}>
          {ipMitigation.state === IpMitigationStateEnum.OK &&
            ipMitigation.permanent && (
              <BadgeCell
                badgeColor={BADGE_COLOR.warning}
                text={t('listingColumnsIpAntiDDosPermanent')}
                tooltip={t('listingColumnsIpAntiDDosPermanentTooltip')}
              />
            )}
          {ipMitigation.state === IpMitigationStateEnum.OK &&
            ipMitigation.auto && (
              <BadgeCell
                badgeColor={BADGE_COLOR.success}
                text={t('listingColumnsIpAntiDDosInAction')}
                tooltip={t('listingColumnsIpAntiDDosInActionTooltip')}
              />
            )}
          {Object.keys(ipMitigation).length > 0 &&
            ipMitigation.state !== IpMitigationStateEnum.OK && (
              <BadgeCell
                badgeColor={BADGE_COLOR.warning}
                text={t('listingColumnsIpAntiDDosPending')}
                tooltip={t('listingColumnsIpAntiDDosPendingTooltip')}
              />
            )}
        </div>
      )}
    </>
  );
};

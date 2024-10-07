import React from 'react';
import { OsdsTile, OsdsDivider } from '@ovhcloud/ods-components/react';
import { ManagerText, Subtitle } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { AccountStatistics } from '@/api/api.type';
import { TileBlock } from '@/components/TileBlock';
import { BadgeStatus } from '@/components/BadgeStatus';
import { useOrganization, usePlatform } from '@/hooks';
// import { OngoingTasks } from './OngoingTasks';
import { Guide, GUIDES_LIST } from '@/guides.constants';
import { IAM_ACTIONS } from '@/utils/iamAction.constants';
import GuideLink from '@/components/GuideLink';

interface GuideLinks {
  [key: string]: Guide;
}

function GeneralInformation() {
  const { t } = useTranslation('dashboard');
  const { data: platform, platformUrn } = usePlatform();
  const { data: organisation } = useOrganization();

  const guideLinks = (links: GuideLinks) => {
    return Object.entries(links).map(([key, value]) => {
      return (
        <div key={key} className="block">
          <OsdsDivider separator />
          <GuideLink label={t(key)} guide={value} />
        </div>
      );
    });
  };

  const accountsStatistics: AccountStatistics[] = organisation
    ? organisation.currentState.accountsStatistics
    : platform?.currentState?.accountsStatistics;

  return (
    <div className="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 py-6 mt-8">
      <div className="p-3">
        <OsdsTile>
          <div className="flex flex-col w-full">
            <Subtitle>{t('zimbra_dashboard_tile_status_title')}</Subtitle>
            {organisation && (
              <TileBlock
                testid="tileblock-orga"
                label={t('zimbra_dashboard_tile_status_serviceStatus')}
              >
                <BadgeStatus itemStatus={organisation?.resourceStatus} />
              </TileBlock>
            )}
            {/* To uncomment to have task
             */}
            <TileBlock
              label={t(
                'Coming Soon',
              )} /* label={t('zimbra_dashboard_tile_status_ongoingTask')}> */
            >
              {/* {platformUrn && (
                <ManagerText
                  urn={platformUrn}
                  iamActions={[IAM_ACTIONS.platform.get, IAM_ACTIONS.task.get]}
                >

                   <OngoingTasks />
                </ManagerText>
              )} */}
              <ManagerText
                urn={platformUrn}
                iamActions={[IAM_ACTIONS.platform.get]}
              >
                Coming Soon
              </ManagerText>
            </TileBlock>
          </div>
        </OsdsTile>
      </div>
      <div className="p-3">
        <OsdsTile>
          <div className="flex flex-col w-full">
            <Subtitle>
              {t('zimbra_dashboard_tile_serviceConsumption_title')}
            </Subtitle>
            <TileBlock
              label={t('zimbra_dashboard_tile_serviceConsumption_accountOffer')}
            >
              {platformUrn && (
                <ManagerText
                  data-testid="platform-accounts"
                  urn={platformUrn}
                  iamActions={[IAM_ACTIONS.account.get]}
                >
                  {accountsStatistics?.length > 0
                    ? accountsStatistics?.map((stats) => (
                        <span key={stats.offer}>{`${
                          stats.configuredAccountsCount
                        } / ${stats.configuredAccountsCount +
                          stats.availableAccountsCount} ${stats.offer}`}</span>
                      ))
                    : t(
                        'zimbra_dashboard_tile_serviceConsumption_noAccountOffer',
                      )}
                </ManagerText>
              )}
            </TileBlock>
          </div>
        </OsdsTile>
      </div>
      <div className="p-3">
        <OsdsTile className="w-full flex-col">
          <div className="flex flex-col w-full">
            <Subtitle>{t('zimbra_dashboard_tile_usefulLinks_title')}</Subtitle>
            {guideLinks({
              zimbra_dashboard_webmail: GUIDES_LIST.webmail,
              zimbra_dashboard_administrator_guide:
                GUIDES_LIST.administrator_guide,
              zimbra_dashboard_user_guides: GUIDES_LIST.user_guide,
            })}
          </div>
        </OsdsTile>
      </div>
    </div>
  );
}

export default GeneralInformation;

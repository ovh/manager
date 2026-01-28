import React from 'react';

import { useNavigate, useSearchParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { Text } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { BaseLayout, Error, GuideMenu, Notifications } from '@ovh-ux/muk';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';

import { Breadcrumb, BreadcrumbItem } from '@/components/Breadcrumb/Breadcrumb';
import { useHeader } from '@/components/Header/Header';
import { urls } from '@/routes/routes.constant';
import { TRANSLATION_NAMESPACES, useGuideUtils } from '@/utils';

import { GameFirewallContext } from '../gamefirewall.context';
import { DeleteRuleModal } from './DeleteRuleModal.component';
import { RuleDatagrid } from './RuleDatagrid.component';
import { StrategyModal } from './StrategyModal.component';

export default function GameFirewallPage() {
  const {
    ip,
    ipOnGame,
    isError,
    isRulesError,
    rulesError,
    error,
  } = React.useContext(GameFirewallContext);
  const { t } = useTranslation([
    TRANSLATION_NAMESPACES.gameFirewall,
    NAMESPACES.ACTIONS,
    TRANSLATION_NAMESPACES.listing,
    TRANSLATION_NAMESPACES.error,
  ]);
  const header = useHeader(t('title'));
  const [search] = useSearchParams();
  const navigate = useNavigate();
  const { links } = useGuideUtils();
  const { trackClick } = useOvhTracking();

  const breadcrumbMapper = (_: BreadcrumbItem, index: number) => {
    if (index === 0) {
      return {
        label: ip,
        href: `${urls.listing}?ip=${ip}`,
      };
    }
    return index === 1
      ? {
          label: ipOnGame,
          href: `${urls.listing}?ip=${ipOnGame}`,
        }
      : { label: t('title') };
  };

  if (isError || isRulesError) {
    return (
      <Error
        error={{
          ...(error || rulesError),
          data: error || rulesError,
        }}
      />
    );
  }

  return (
    <>
      <BaseLayout
        backLink={{
          label: t('back_to', {
            ns: NAMESPACES.ACTIONS,
            value: `“${t('title', { ns: TRANSLATION_NAMESPACES.listing })}”`,
          }),
          onClick: () => {
            navigate(`${urls.listing}?${search.toString()}`);
          },
        }}
        breadcrumb={<Breadcrumb mapper={breadcrumbMapper} />}
        header={{
          ...header,
          guideMenu: (
            <GuideMenu
              items={[
                {
                  id: 0,
                  href: links.configureGameFirewall?.link,
                  target: '_blank',
                  children: t('title'),
                  onClick: () => {
                    trackClick({
                      actionType: 'action',
                      buttonType: ButtonType.link,
                      location: PageLocation.page,
                      actions: [
                        `go-to_${links.configureGameFirewall?.trackingLabel}`,
                      ],
                    });
                  },
                },
              ]}
            />
          ),
        }}
        message={<Notifications />}
      >
        <Text className="mb-3 block">{t('description')}</Text>
        <Text className="mb-6 block">{t('subDescription')}</Text>
        <RuleDatagrid />
      </BaseLayout>
      <StrategyModal />
      <DeleteRuleModal />
    </>
  );
}

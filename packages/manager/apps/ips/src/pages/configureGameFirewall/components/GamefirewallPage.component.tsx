import React from 'react';

import { useNavigate, useSearchParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { OdsText } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  BaseLayout,
  ErrorBanner,
  GuideButton,
  Notifications,
} from '@ovh-ux/manager-react-components';
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
import { TopBar } from './TopBar.component';

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
        onClick: () => navigate(`${urls.listing}?ip=${ip}`),
      };
    }
    return index === 1
      ? {
          label: ipOnGame,
          onClick: () => navigate(`${urls.listing}?ip=${ipOnGame}`),
        }
      : { label: t('title') };
  };

  if (isError || isRulesError) {
    return (
      <ErrorBanner
        error={{
          ...(error || rulesError)?.response,
          data: error || rulesError,
        }}
      />
    );
  }

  return (
    <>
      <BaseLayout
        backLinkLabel={t('back_to', {
          ns: NAMESPACES.ACTIONS,
          value: `“${t('title', { ns: TRANSLATION_NAMESPACES.listing })}”`,
        })}
        onClickReturn={() => {
          navigate(`${urls.listing}?${search.toString()}`);
        }}
        breadcrumb={<Breadcrumb mapper={breadcrumbMapper} />}
        header={{
          ...header,
          headerButton: (
            <GuideButton
              items={[
                {
                  id: 0,
                  href: links.configureGameFirewall?.link,
                  target: '_blank',
                  label: t('title'),
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
        <OdsText className="mb-3 block">{t('description')}</OdsText>
        <OdsText className="mb-3 block">{t('subDescription')}</OdsText>
        <TopBar />
        <RuleDatagrid />
      </BaseLayout>
      <StrategyModal />
      <DeleteRuleModal />
    </>
  );
}

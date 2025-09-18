import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BaseLayout,
  ErrorBanner,
  Notifications,
} from '@ovh-ux/manager-react-components';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { OdsText } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { Breadcrumb, BreadcrumbItem } from '@/components/Breadcrumb/Breadcrumb';
import { useHeader } from '@/components/Header/Header';
import { urls } from '@/routes/routes.constant';
import { TRANSLATION_NAMESPACES } from '@/utils';
import { RuleDatagrid } from './RuleDatagrid.component';
import { StrategyModal } from './StrategyModal.component';
import { GameFirewallContext } from '../gamefirewall.context';
import { TopBar } from './TopBar.component';
import { DeleteRuleModal } from './DeleteRuleModal.component';

export default function GameFirewallPage() {
  const {
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
  const navigate = useNavigate();

  const breadcrumbMapper = (_: BreadcrumbItem, index: number) =>
    index === 0
      ? {
          label: ipOnGame,
          onClick: () => navigate(`${urls.listing}?ip=${ipOnGame}`),
        }
      : { label: t('title') };

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
        onClickReturn={() => navigate(urls.listing)}
        breadcrumb={<Breadcrumb mapper={breadcrumbMapper} />}
        header={{ ...header, changelogButton: null }}
        message={<Notifications />}
      >
        <OdsText className="block mb-3">{t('description')}</OdsText>
        <OdsText className="block mb-3">{t('subDescription')}</OdsText>
        <TopBar />
        <RuleDatagrid />
      </BaseLayout>
      <StrategyModal />
      <DeleteRuleModal />
    </>
  );
}

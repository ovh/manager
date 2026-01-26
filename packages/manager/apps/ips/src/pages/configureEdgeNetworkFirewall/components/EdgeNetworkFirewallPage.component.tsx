import React from 'react';

import { useNavigate, useSearchParams } from 'react-router-dom';

import { Trans, useTranslation } from 'react-i18next';

import { ODS_MESSAGE_COLOR } from '@ovhcloud/ods-components';
import { OdsLink, OdsMessage, OdsText } from '@ovhcloud/ods-components/react';

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
import { IpEdgeFirewallProtocol } from '@/data/api';
import { urls } from '@/routes/routes.constant';
import { TRANSLATION_NAMESPACES, useGuideUtils } from '@/utils';

import { EdgeNetworkFirewallContext } from '../edgeNetworkFirewall.context';
import { DeleteRuleModal } from './DeleteRuleModal.component';
import { EnableEdgeNetworkFirewallModal } from './EnableEdgeNetworkFirewallModal.component';
import { RuleDatagrid } from './RuleDatagrid.component';
import { validSequenceNumbers } from './SequenceColumn.component';
import { TopBar } from './TopBar.component';

export default function EdgeNetworkFirewallPage() {
  const {
    ip,
    ipOnFirewall,
    isError,
    rules,
    ruleSequenceList,
    isRulesError,
    rulesError,
    error,
    setNewProtocol,
    setNewSequence,
    setNewMode,
    showNewRuleRow,
    maxRulesReached,
  } = React.useContext(EdgeNetworkFirewallContext);
  const { t } = useTranslation([
    TRANSLATION_NAMESPACES.edgeNetworkFirewall,
    NAMESPACES.ACTIONS,
    TRANSLATION_NAMESPACES.listing,
    TRANSLATION_NAMESPACES.error,
  ]);
  const [search] = useSearchParams();
  const { links } = useGuideUtils();
  const header = useHeader(t('title'));
  const navigate = useNavigate();
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
          label: ipOnFirewall,
          onClick: () => navigate(`${urls.listing}?ip=${ip}`),
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
          changelogButton: <></>,
          headerButton: (
            <GuideButton
              items={[
                {
                  id: 0,
                  href: links.configureEdgeNetworkFirewall?.link,
                  target: '_blank',
                  label: t('title'),
                  onClick: () => {
                    trackClick({
                      actionType: 'action',
                      buttonType: ButtonType.link,
                      location: PageLocation.page,
                      actions: [
                        `go-to_${links.configureEdgeNetworkFirewall?.trackingLabel}`,
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
        <OdsText className="mb-3 block">{t('tcpNoteDescription')}</OdsText>
        {rules.length > 0 && rules.every((rule) => rule?.action === 'permit') && (
          <OdsMessage
            className="my-3"
            color={ODS_MESSAGE_COLOR.warning}
            isDismissible={false}
          >
            <div className="block">
              <Trans
                t={t}
                i18nKey="only_permit_rules_warning"
                components={{
                  Link: (
                    <OdsLink
                      href="!#"
                      label={t('only_permit_rule_link_label')}
                      isDisabled={maxRulesReached}
                      onClick={(e) => {
                        e.preventDefault();
                        setNewProtocol(IpEdgeFirewallProtocol.IPv4);
                        const latestValidSequence = validSequenceNumbers
                          .map((num) => num)
                          .reverse()
                          .find(
                            (sequence) => !ruleSequenceList.includes(sequence),
                          );
                        setNewSequence(latestValidSequence);
                        setNewMode('deny');
                        showNewRuleRow();
                      }}
                    />
                  ),
                }}
              />
            </div>
          </OdsMessage>
        )}
        <TopBar />
        <RuleDatagrid />
      </BaseLayout>
      <EnableEdgeNetworkFirewallModal />
      <DeleteRuleModal />
    </>
  );
}

import React from 'react';

import { useNavigate, useSearchParams } from 'react-router-dom';

import { Trans, useTranslation } from 'react-i18next';

import {
  MESSAGE_COLOR,
  MessageBody,
  Link,
  Message,
  Text,
} from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { BaseLayout, Error, Notifications, GuideMenu } from '@ovh-ux/muk';
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
        href: `${urls.listing}?ip=${ip}`,
      };
    }
    return index === 1
      ? {
          label: ipOnFirewall,
          href: `${urls.listing}?ip=${ip}`,
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
          changelogButton: <></>,
          guideMenu: (
            <GuideMenu
              items={[
                {
                  id: 0,
                  href: links.configureEdgeNetworkFirewall?.link,
                  target: '_blank',
                  children: t('title'),
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
        <Text className="mb-3 block">{t('description')}</Text>
        <Text className="mb-3 block">{t('subDescription')}</Text>
        <Text className="mb-6 block">{t('tcpNoteDescription')}</Text>
        {rules.length > 0 && rules.every((rule) => rule?.action === 'permit') && (
          <Message
            className="my-3"
            color={MESSAGE_COLOR.warning}
            dismissible={false}
          >
            <MessageBody className="block">
              <Trans
                t={t}
                i18nKey="only_permit_rules_warning"
                components={{
                  Link: (
                    <Link
                      href="!#"
                      disabled={maxRulesReached}
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
                    >
                      {t('only_permit_rule_link_label')}
                    </Link>
                  ),
                }}
              />
            </MessageBody>
          </Message>
        )}
        <RuleDatagrid />
      </BaseLayout>
      <EnableEdgeNetworkFirewallModal />
      <DeleteRuleModal />
    </>
  );
}

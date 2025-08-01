import {
  ShellContext,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import {
  OsdsButton,
  OsdsIcon,
  OsdsLink,
  OsdsMessage,
  OsdsModal,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_MESSAGE_TYPE,
  ODS_TEXT_LEVEL,
} from '@ovhcloud/ods-components';
import { PRIVATE_NETWORK_HELP } from './constant';

export default function NoPrivateNetworkPage() {
  const { t } = useTranslation(['onboarding', 'pci-common']);
  const { projectId } = useParams();
  const navigate = useNavigate();
  const onClose = () => navigate('..');
  const { trackClick } = useOvhTracking();
  const { environment, shell } = useContext(ShellContext);
  const { ovhSubsidiary } = environment.getUser();
  const helpLink =
    PRIVATE_NETWORK_HELP[ovhSubsidiary] || PRIVATE_NETWORK_HELP.DEFAULT;
  const creationUrlPromise = shell.navigation.getURL(
    'public-cloud',
    `#/pci/projects/${projectId}/private-networks/new`,
    {},
  );

  return (
    <OsdsModal
      onOdsModalClose={onClose}
      headline={t(
        'octavia_load_balancer_onboarding_private_network_modal_title',
      )}
    >
      <slot name="content">
        <OsdsText
          color={ODS_THEME_COLOR_INTENT.text}
          level={ODS_TEXT_LEVEL.body}
          size={ODS_THEME_TYPOGRAPHY_SIZE._400}
          className="mt-6 block"
        >
          {t(
            'octavia_load_balancer_onboarding_private_network_modal_description',
          )}
        </OsdsText>
        <OsdsLink
          color={ODS_THEME_COLOR_INTENT.primary}
          href={helpLink}
          onClick={() => {
            trackClick({
              actions: ['onboarding', 'create-private-network', 'know-more'],
              actionType: 'navigation',
            });
          }}
          target={OdsHTMLAnchorElementTarget._blank}
        >
          {t(
            'octavia_load_balancer_onboarding_private_network_modal_more_link',
          )}
          <span slot="end">
            <OsdsIcon
              aria-hidden="true"
              className="ml-2"
              name={ODS_ICON_NAME.EXTERNAL_LINK}
              hoverable
              size={ODS_ICON_SIZE.xxs}
              color={ODS_THEME_COLOR_INTENT.primary}
            />
          </span>
        </OsdsLink>
        <OsdsMessage type={ODS_MESSAGE_TYPE.warning} className="mt-6">
          {t('octavia_load_balancer_onboarding_private_network_modal_message')}
        </OsdsMessage>
      </slot>
      <OsdsButton
        slot="actions"
        color={ODS_THEME_COLOR_INTENT.primary}
        variant={ODS_BUTTON_VARIANT.ghost}
        onClick={onClose}
      >
        {t('pci-common:common_cancel')}
      </OsdsButton>
      <OsdsButton
        slot="actions"
        color={ODS_THEME_COLOR_INTENT.primary}
        onClick={() => {
          trackClick({
            actions: [
              'onboarding',
              'create-private-network',
              'add-private-network',
            ],
            actionType: 'navigation',
          });
          creationUrlPromise.then((url: string) => window.open(url, '_self'));
        }}
      >
        {t('octavia_load_balancer_onboarding_private_network_modal_title')}
      </OsdsButton>
    </OsdsModal>
  );
}

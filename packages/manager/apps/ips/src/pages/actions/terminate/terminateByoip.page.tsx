import React, { useContext } from 'react';

import { useNavigate, useSearchParams } from 'react-router-dom';

import { Trans, useTranslation } from 'react-i18next';

import { ODS_ICON_NAME, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsButton, OdsMessage, OdsModal, OdsText } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  ButtonType,
  PageLocation,
  ShellContext,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';

import { LinkToOtherApp } from '@/components/LinkToOtherApp/LinkToOtherApp';

import { US_API_CONSOLE_LINK } from '../actions.constants';

export default function TerminateByoip() {
  const { t } = useTranslation(['listing', NAMESPACES.ACTIONS]);
  const { trackClick } = useOvhTracking();
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const { environment } = useContext(ShellContext);
  const region = environment.getRegion();

  const closeHandler = () => {
    trackClick({
      location: PageLocation.popup,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: ['terminate_bring-your-own-ip', 'cancel'],
    });
    navigate(`..?${search.toString()}`);
  };

  return (
    <OdsModal isOpen isDismissible onOdsClose={closeHandler}>
      <OdsText className="mb-4 block" preset={ODS_TEXT_PRESET.heading4}>
        {t('listingTerminateByoip_title')}
      </OdsText>
      <OdsText preset={ODS_TEXT_PRESET.paragraph}>
        <OdsMessage color="warning" className="mb-4 block" isDismissible={false}>
          <OdsText>
            <Trans
              t={t}
              i18nKey={
                region !== 'US' ? 'listingTerminateByoip_info1' : 'listingTerminateByoip_info2'
              }
              components={{
                Link: (
                  <LinkToOtherApp
                    appName="billing"
                    path="#/autorenew/services"
                    params={{ searchText: 'byoip' }}
                    icon={ODS_ICON_NAME.externalLink}
                    forcedHref={region === 'US' ? US_API_CONSOLE_LINK : undefined}
                  />
                ),
              }}
            />
          </OdsText>
        </OdsMessage>
      </OdsText>
      <OdsButton
        slot="actions"
        label={t('close', { ns: NAMESPACES.ACTIONS })}
        onClick={closeHandler}
      />
    </OdsModal>
  );
}

import React, { useContext } from 'react';

import { useNavigate, useSearchParams } from 'react-router-dom';

import { Trans, useTranslation } from 'react-i18next';

import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { OdsMessage, OdsText } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Region } from '@ovh-ux/manager-config';
import { Modal } from '@ovh-ux/manager-react-components';
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
    <Modal
      heading={t('listingTerminateByoip_title')}
      isOpen
      primaryLabel={t('close', { ns: NAMESPACES.ACTIONS })}
      onPrimaryButtonClick={closeHandler}
      onDismiss={closeHandler}
    >
      <OdsMessage color="warning" className="mb-4 block" isDismissible={false}>
        <OdsText>
          <Trans
            t={t}
            i18nKey={
              region !== Region.US
                ? 'listingTerminateByoip_info1'
                : 'listingTerminateByoip_info2'
            }
            components={{
              Link: (
                <LinkToOtherApp
                  appName="billing"
                  path="#/autorenew/services"
                  params={{ searchText: 'byoip' }}
                  icon={ODS_ICON_NAME.externalLink}
                  forcedHref={
                    region === Region.US ? US_API_CONSOLE_LINK : undefined
                  }
                />
              ),
            }}
          />
        </OdsText>
      </OdsMessage>
    </Modal>
  );
}

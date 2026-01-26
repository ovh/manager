import { useContext } from 'react';

import { useNavigate, useSearchParams } from 'react-router-dom';

import { Trans, useTranslation } from 'react-i18next';

import { Message, Text, ICON_NAME, MessageBody } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Region } from '@ovh-ux/manager-config';
import { Modal } from '@ovh-ux/muk';
import {
  ButtonType,
  PageLocation,
  ShellContext,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';

import { LinkToOtherApp } from '@/components/LinkToOtherApp/LinkToOtherApp';

import { US_API_CONSOLE_LINK } from './terminate.constants';

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
      primaryButton={{
        label: t('close', { ns: NAMESPACES.ACTIONS }),
        onClick: closeHandler,
      }}
      onOpenChange={closeHandler}
    >
      <Message color="warning" className="mb-4 block" dismissible={false}>
        <MessageBody>
          <Text>
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
                    icon={ICON_NAME.externalLink}
                    forcedHref={
                      region === Region.US ? US_API_CONSOLE_LINK : undefined
                    }
                  />
                ),
              }}
            />
          </Text>
        </MessageBody>
      </Message>
    </Modal>
  );
}

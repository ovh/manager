import { type FC } from 'react';

import { useTranslation } from 'react-i18next';

import { Icon, Link, Message, MessageBody, MessageIcon, Text } from '@ovhcloud/ods-react';

import { HelpDrawer } from '@/components/helpDrawer/HelpDrawer.component';
import { HelpDrawerDivider } from '@/components/helpDrawer/HelpDrawerDivider.component';

import { DeploymentModeSelect } from './location/DeploymentModeSelect.component';

/* 
  TODO : 
    - Default value 3AZ (1AZ for US)
    - Hide mode selector for US
    - Badges 1-AZ/3-AZ en haut des cards si Sam veut les garder
*/

export const ClusterLocationSection: FC = () => {
  const { t } = useTranslation('add');

  return (
    <>
      <Text preset="heading-3" className="mb-6">
        {t('kubernetes_add_location')}
      </Text>
      <Text preset="heading-4" className="mb-6 flex items-center">
        {t('kubernetes_add_location_subtitle')}
        <HelpDrawerDivider />
        <HelpDrawer></HelpDrawer>
      </Text>
      <Message dismissible={false}>
        <MessageIcon name="circle-info" />
        <MessageBody className="flex flex-col gap-4">
          TODO : Reprendre le contenu après la MEP du plan standard
          <Link href="https://ovhcloud.com" target="_blank">
            Todo : Récupérer liens et clés de trad <Icon name="external-link"></Icon>
          </Link>
        </MessageBody>
      </Message>
      <DeploymentModeSelect />
    </>
  );
};

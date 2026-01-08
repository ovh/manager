import { type FC } from 'react';

import { useTranslation } from 'react-i18next';

import { Icon, Link, Message, MessageBody, MessageIcon, Text } from '@ovhcloud/ods-react';

import { HelpDrawer } from '@/components/helpDrawer/HelpDrawer.component';
import { HelpDrawerDivider } from '@/components/helpDrawer/HelpDrawerDivider.component';

import { ContinentSelect } from './location/ContinentSelect.component';
import { DeploymentModeSelect } from './location/DeploymentModeSelect.component';
import { PlanSelect } from './location/PlanSelect.component';

type TClusterLocationSectionProps = {
  is3azAvailable: boolean;
};

export const ClusterLocationSection: FC<TClusterLocationSectionProps> = ({ is3azAvailable }) => {
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
      {is3azAvailable && (
        <>
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
          <div className="my-6 grid items-end gap-6 sm:grid-cols-2 lg:w-max">
            <ContinentSelect />
            <PlanSelect />
          </div>
        </>
      )}
    </>
  );
};

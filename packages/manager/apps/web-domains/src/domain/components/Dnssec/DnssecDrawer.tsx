import { Drawer } from '@ovh-ux/manager-react-components';
import { Dispatch, SetStateAction } from 'react';
import {
  ICON_NAME,
  Message,
  MessageBody,
  MessageIcon,
} from '@ovhcloud/ods-react';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useTranslation } from 'react-i18next';
import DnssecForm from './DnssecForm';

interface DnssecDrawerProps {
  readonly drawer: { isOpen?: boolean };
  readonly setDrawer: Dispatch<SetStateAction<{ isOpen?: boolean }>>;
}

export default function DnssecDrawer({ drawer, setDrawer }: DnssecDrawerProps) {
  const { t } = useTranslation('domain');
  return (
    <Drawer
      heading={'Ajouter une nouvelle entrée'}
      isOpen={drawer.isOpen}
      onDismiss={() =>
        setDrawer({
          isOpen: false,
        })
      }
      primaryButtonLabel={t(`${NAMESPACES.ACTIONS}:validate`)}
      secondaryButtonLabel={t(`${NAMESPACES.ACTIONS}:cancel`)}
      onSecondaryButtonClick={() => {
        setDrawer({
          isOpen: false,
        });
      }}
    >
      <DnssecForm />

      <Message dismissible={false}>
        <MessageIcon name={ICON_NAME.circleInfo} />
        <MessageBody>
          L’application des changements peut prendre du temps et rend toute
          autre modification sur ce domaine impossible tant que la tâche de
          modification n’est pas terminée.
          <br />
          <br />
          Êtes-vous sûr de vouloir appliquer ces changement maintenant ?
        </MessageBody>
      </Message>
    </Drawer>
  );
}

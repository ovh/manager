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
import { DrawerActionEnum } from '@/domain/enum/drawerAction.enum';

interface DnssecDrawerProps {
  readonly drawer: { isOpen?: boolean; action: DrawerActionEnum };
  readonly setDrawer: Dispatch<
    SetStateAction<{ isOpen?: boolean; action: DrawerActionEnum }>
  >;
  readonly formData: {
    keyTag: string;
    flag: string;
    algorithm: string;
    publicKey: string;
  };
  readonly setFormData: Dispatch<
    SetStateAction<{
      keyTag: string;
      flag: string;
      algorithm: string;
      publicKey: string;
    }>
  >;
}

export default function DnssecDrawer({ drawer, setDrawer }: DnssecDrawerProps) {
  const { t } = useTranslation('domain');
  return (
    <Drawer
      heading={
        drawer.action === DrawerActionEnum.ADD
          ? 'Ajouter une nouvelle entrée'
          : t(`domain_DNSSEC_drawer_heading_modify`)
      }
      isOpen={drawer.isOpen}
      onDismiss={() =>
        setDrawer({
          isOpen: false,
          action: null,
        })
      }
      primaryButtonLabel={t(`${NAMESPACES.ACTIONS}:validate`)}
      secondaryButtonLabel={t(`${NAMESPACES.ACTIONS}:cancel`)}
      onSecondaryButtonClick={() => {
        setDrawer({
          isOpen: false,
          action: null,
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

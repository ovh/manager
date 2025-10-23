import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useTranslation } from 'react-i18next';
import { Datagrid } from '@ovh-ux/manager-react-components';
import { Button, BUTTON_SIZE } from '@ovhcloud/ods-react';
import { useState } from 'react';
import { useDomainDnssecDatagridColumns } from '@/domain/hooks/domainTabs/useDomainDnssecDatagridColumns';
import DnssecDrawer from '@/domain/components/Dnssec/DnssecDrawer';
import { DrawerActionEnum } from '@/domain/enum/drawerAction.enum';

export default function DnssecListing() {
  const { t } = useTranslation(['domain', NAMESPACES.ACTIONS, NAMESPACES.FORM]);
  const [drawer, setDrawer] = useState<{
    isOpen: boolean;
    action: DrawerActionEnum;
  }>({
    isOpen: false,
    action: null,
  });

  const [formData, setFormData] = useState<{
    keyTag: string;
    flag: string;
    algorithm: string;
    publicKey: string;
  }>({
    keyTag: '',
    flag: '',
    algorithm: '',
    publicKey: '',
  });
  const columns = useDomainDnssecDatagridColumns({ setDrawer, setFormData });

  return (
    <section>
      <Datagrid
        columns={columns}
        items={[{}]}
        totalItems={1}
        topbar={
          <Button
            className="mb-4"
            size={BUTTON_SIZE.sm}
            onClick={() =>
              setDrawer({
                isOpen: true,
                action: DrawerActionEnum.ADD,
              })
            }
          >
            {t(`${NAMESPACES.ACTIONS}:add`)}
          </Button>
        }
      />
      <DnssecDrawer
        drawer={drawer}
        formData={formData}
        setFormData={setFormData}
        setDrawer={setDrawer}
      />
    </section>
  );
}

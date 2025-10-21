import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useTranslation } from 'react-i18next';
import { Datagrid } from '@ovh-ux/manager-react-components';
import { Button, BUTTON_SIZE } from '@ovhcloud/ods-react';
import { useState } from 'react';
import { useDomainDnssecDatagridColumns } from '@/domain/hooks/domainTabs/useDomainDnssecDatagridColumns';
import DnssecDrawer from '@/domain/components/Dnssec/DnssecDrawer';

export default function DnssecListing() {
  const { t } = useTranslation(['domain', NAMESPACES.ACTIONS, NAMESPACES.FORM]);
  const columns = useDomainDnssecDatagridColumns();
  const [drawer, setDrawer] = useState<{
    isOpen: boolean;
  }>({
    isOpen: false,
  });

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
              })
            }
          >
            {t(`${NAMESPACES.ACTIONS}:add`)}
          </Button>
        }
      />
      <DnssecDrawer drawer={drawer} setDrawer={setDrawer} />
    </section>
  );
}

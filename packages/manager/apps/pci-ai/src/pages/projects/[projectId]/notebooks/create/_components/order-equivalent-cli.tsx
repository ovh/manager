import { Button } from '@/components/ui/button';
import { useRequiredParams } from '@/hooks/useRequiredParams';
import { Flavor } from '@/models/order-funnel';
import { ai } from '@/models/types';
import { useState } from 'react';
import EquivalentOrderNbModal from './equivalentOrderModal';

interface OrderEquivalentCli {
  order: {
    name: string;
    labels: {
      name: string;
      value: string;
    };
    price: string;
    tax: string;
    unsecureHttp: boolean;
    framework: ai.notebook.Framework;
    version: string | undefined;
    editor: ai.notebook.Editor;
    region: string;
    flavor: {
      flavor: Flavor | undefined;
      number: number;
    };
  };
}
const OrderCommandCli = (order: OrderEquivalentCli) => {
  const { projectId } = useRequiredParams<{ projectId: string }>();
  const [isOpenModal, setOpenModal] = useState(false);

  const handleCloseEquivalentCLIModal = () => {
    setOpenModal(false);
  };

  return (
    <>
      <Button
        onClick={() => setOpenModal(true)}
        type="button"
        variant="link"
        size="sm"
        className="w-1/2 font-bold py-2 px-2"
      >
        Equivalent CLI
      </Button>
      <EquivalentOrderNbModal
        notebook={{
          env: {
            editorId: order.order.editor.id,
            frameworkId: order.order.framework.id,
            frameworkVersion: order.order.version || '',
          },
          name: order.order.name || 'test',
          region: order.order.region,
          unsecureHttp: order.order.unsecureHttp,
          resources: {
            flavor: order.order.flavor.flavor?.id || '',
            cpu: order.order.flavor.number,
          },
        }}
        projectId={projectId}
        open={isOpenModal}
        onClose={handleCloseEquivalentCLIModal}
      />
    </>
  );
};

export default OrderCommandCli;

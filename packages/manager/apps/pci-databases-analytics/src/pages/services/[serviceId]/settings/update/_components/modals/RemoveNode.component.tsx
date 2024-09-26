import { useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import Price from '@/components/price/Price.component';
import PriceUnitSwitch from '@/components/price-unit-switch/PriceUnitSwitch.component';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { ModalController } from '@/hooks/useModale';
import { Pricing } from '@/lib/pricingHelper';
import { order } from '@/types/catalog';
import { useServiceData } from '@/pages/services/[serviceId]/Service.context';
import { useDeleteNode } from '@/hooks/api/database/node/useDeleteNode.hook';
import { getCdbApiErrorMessage } from '@/lib/apiHelper';

interface DeleteNodeProps {
  controller: ModalController;
  catalog: order.publicOrder.Catalog;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

const DeleteNode = ({
  controller,
  catalog,
  onSuccess,
  onError,
}: DeleteNodeProps) => {
  const { service, projectId } = useServiceData();
  const [showMonthly, setShowMonthly] = useState(false);

  const toast = useToast();
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/settings/update',
  );
  const { deleteNode, isPending } = useDeleteNode({
    onError: (err) => {
      toast.toast({
        title: t('deleteNodeToastErrorTitle'),
        variant: 'destructive',
        description: getCdbApiErrorMessage(err),
      });
      if (onError) {
        onError(err);
      }
    },
    onSuccess: () => {
      toast.toast({
        title: t('deleteNodeToastSuccessTitle'),
        description: t('deleteNodeToastSuccessDescription'),
      });
      if (onSuccess) {
        onSuccess();
      }
    },
  });

  const price: Pricing = useMemo(() => {
    const prefix = `databases.${service.engine.toLowerCase()}-${service.plan}-${
      service.flavor
    }`;
    return {
      hourly: catalog.addons.find(
        (a) => a.planCode === `${prefix}.hour.consumption`,
      ).pricings[0],
      monthly: catalog.addons.find(
        (a) => a.planCode === `${prefix}.month.consumption`,
      ).pricings[0],
    };
  }, []);

  const handleSumbit = () => {
    deleteNode({
      projectId,
      engine: service.engine,
      serviceId: service.id,
      nodeId: service.nodes[service.nodes.length - 1].id,
    });
  };

  return (
    <Dialog {...controller}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle data-testid="delete-node-modal">
            {t('deleteNodeTitle')}
          </DialogTitle>
        </DialogHeader>
        <Label>{t('priceUnitSwitchLabel')}</Label>
        <PriceUnitSwitch showMonthly={showMonthly} onChange={setShowMonthly} />
        <p>
          <Trans
            t={t}
            i18nKey={'deleteNodeDescription'}
            values={{
              nbNodes: service.nodes.length,
              unit: showMonthly
                ? t('deleteNodeDescriptionUnitMonth')
                : t('deleteNodeDescriptionUnitHour'),
            }}
            components={{
              price: (
                <Price
                  priceInUcents={
                    price[showMonthly ? 'monthly' : 'hourly'].price
                  }
                  taxInUcents={price[showMonthly ? 'monthly' : 'hourly'].tax}
                  decimals={showMonthly ? 2 : 3}
                />
              ),
            }}
          ></Trans>
        </p>
        <DialogFooter className="flex justify-end">
          <DialogClose asChild>
            <Button
              data-testid="delete-node-cancel-button"
              type="button"
              variant="outline"
            >
              {t('deleteNodeCancelButton')}
            </Button>
          </DialogClose>
          <Button
            data-testid="delete-node-submit-button"
            type="button"
            onClick={handleSumbit}
            disabled={isPending}
          >
            {t('deleteNodeSubmitButton')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteNode;

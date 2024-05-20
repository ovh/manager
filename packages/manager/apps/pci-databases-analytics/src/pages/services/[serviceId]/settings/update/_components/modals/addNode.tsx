import { useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import Price from '@/components/price';
import PriceUnitSwitch from '@/components/price-unit-switch';
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
import { useAddNode } from '@/hooks/api/nodes.api.hooks';
import { ModalController } from '@/hooks/useModale';
import { ServicePricing } from '@/lib/pricingHelper';
import { order } from '@/models/catalog';
import { database } from '@/models/database';
import { useServiceData } from '@/pages/services/[serviceId]/layout';

interface AddNodeProps {
  controller: ModalController;
  catalog: order.publicOrder.Catalog;
  onSuccess?: (node: database.service.Node) => void;
  onError?: (error: Error) => void;
}

const AddNode = ({ controller, catalog, onSuccess, onError }: AddNodeProps) => {
  const { service, projectId } = useServiceData();
  const [showMonthly, setShowMonthly] = useState(false);

  const toast = useToast();
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/settings/update',
  );
  const { addNode, isPending } = useAddNode({
    onError: (err) => {
      toast.toast({
        title: t('addNodeToastErrorTitle'),
        variant: 'destructive',
        description: err.response.data.message,
      });
      if (onError) {
        onError(err);
      }
    },
    onSuccess: (node) => {
      toast.toast({
        title: t('addNodeToastSuccessTitle'),
        description: t('addNodeToastSuccessDescription'),
      });
      if (onSuccess) {
        onSuccess(node);
      }
    },
  });

  const price: ServicePricing = useMemo(() => {
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
    addNode({
      projectId,
      engine: service.engine,
      serviceId: service.id,
      node: {
        flavor: service.flavor,
        region: service.nodes[0].region,
      },
    });
  };

  return (
    <Dialog {...controller}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('addNodeTitle')}</DialogTitle>
        </DialogHeader>
        <Label>{t('priceUnitSwitchLabel')}</Label>
        <PriceUnitSwitch showMonthly={showMonthly} onChange={setShowMonthly} />
        <p>
          <Trans
            t={t}
            i18nKey={'addNodeDescription'}
            values={{
              nbNodes: service.nodes.length,
              unit: showMonthly
                ? t('addNodeDescriptionUnitMonth')
                : t('addNodeDescriptionUnitHour'),
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
            <Button type="button" variant="outline">
              {t('addNodeCancelButton')}
            </Button>
          </DialogClose>
          <Button type="button" onClick={handleSumbit} disabled={isPending}>
            {t('addNodeSubmitButton')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddNode;

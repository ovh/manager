import { useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Label,
  useToast,
} from '@datatr-ux/uxlib';
import PriceUnitSwitch from '@/components/price-unit-switch/PriceUnitSwitch.component';
import Price from '@/components/price/Price.component';
import { Pricing } from '@/lib/pricingHelper';
import { useServiceData } from '@/pages/services/[serviceId]/Service.context';
import { useDeleteNode } from '@/hooks/api/database/node/useDeleteNode.hook';
import { getCdbApiErrorMessage } from '@/lib/apiHelper';
import { useGetCatalog } from '@/hooks/api/catalog/useGetCatalog.hook';
import RouteModal from '@/components/route-modal/RouteModal';

const DeleteNode = () => {
  const { service, projectId } = useServiceData();
  const [showMonthly, setShowMonthly] = useState(false);
  const catalogQuery = useGetCatalog();
  const navigate = useNavigate();

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
    },
    onSuccess: () => {
      toast.toast({
        title: t('deleteNodeToastSuccessTitle'),
        description: t('deleteNodeToastSuccessDescription'),
      });
      navigate('../');
    },
  });

  const price: Pricing = useMemo(() => {
    if (!catalogQuery.data) return null;
    const prefix = `databases.${service.engine.toLowerCase()}-${service.plan}-${
      service.flavor
    }`;
    return {
      hourly: catalogQuery.data?.addons.find(
        (a) => a.planCode === `${prefix}.hour.consumption`,
      ).pricings[0],
      monthly: catalogQuery.data?.addons.find(
        (a) => a.planCode === `${prefix}.month.consumption`,
      ).pricings[0],
    };
  }, [catalogQuery.data]);

  const handleSumbit = () => {
    deleteNode({
      projectId,
      engine: service.engine,
      serviceId: service.id,
      nodeId: service.nodes[service.nodes.length - 1].id,
    });
  };

  return (
    <RouteModal isLoading={!price}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle data-testid="delete-node-modal">
            {t('deleteNodeTitle')}
          </DialogTitle>
        </DialogHeader>
        <Label>{t('priceUnitSwitchLabel')}</Label>
        <PriceUnitSwitch showMonthly={showMonthly} onChange={setShowMonthly} />
        <p>
          {price && (
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
          )}
        </p>
        <DialogFooter className="flex justify-end">
          <DialogClose asChild>
            <Button
              data-testid="delete-node-cancel-button"
              type="button"
              mode="outline"
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
    </RouteModal>
  );
};

export default DeleteNode;

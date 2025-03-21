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
import { useAddNode } from '@/hooks/api/database/node/useAddNode.hook';
import { Pricing } from '@/lib/pricingHelper';
import { useServiceData } from '@/pages/services/[serviceId]/Service.context';
import { getCdbApiErrorMessage } from '@/lib/apiHelper';
import { useGetCatalog } from '@/hooks/api/catalog/useGetCatalog.hook';
import RouteModal from '@/components/route-modal/RouteModal';

const AddNode = () => {
  const { service, projectId } = useServiceData();
  const [showMonthly, setShowMonthly] = useState(false);
  const catalogQuery = useGetCatalog();
  const navigate = useNavigate();

  const toast = useToast();
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/settings/update',
  );
  const { addNode, isPending } = useAddNode({
    onError: (err) => {
      toast.toast({
        title: t('addNodeToastErrorTitle'),
        variant: 'destructive',
        description: getCdbApiErrorMessage(err),
      });
    },
    onSuccess: () => {
      toast.toast({
        title: t('addNodeToastSuccessTitle'),
        description: t('addNodeToastSuccessDescription'),
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
    <RouteModal isLoading={!price}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle data-testid="add-node-modal">
            {t('addNodeTitle')}
          </DialogTitle>
        </DialogHeader>
        <Label>{t('priceUnitSwitchLabel')}</Label>
        <PriceUnitSwitch showMonthly={showMonthly} onChange={setShowMonthly} />
        <p>
          {price && (
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
          )}
        </p>
        <DialogFooter className="flex justify-end">
          <DialogClose asChild>
            <Button
              data-testid="add-node-cancel-button"
              type="button"
              mode="outline"
            >
              {t('addNodeCancelButton')}
            </Button>
          </DialogClose>
          <Button
            data-testid="add-node-submit-button"
            type="button"
            onClick={handleSumbit}
            disabled={isPending}
          >
            {t('addNodeSubmitButton')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </RouteModal>
  );
};

export default AddNode;

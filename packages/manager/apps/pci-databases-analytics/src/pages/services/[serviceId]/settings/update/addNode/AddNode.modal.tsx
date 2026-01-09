import { useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  useToast,
} from '@datatr-ux/uxlib';
import Price from '@/components/price/Price.component';
import { useAddNode } from '@/hooks/api/database/node/useAddNode.hook';
import { Pricing } from '@/lib/pricingHelper';
import { useServiceData } from '@/pages/services/[serviceId]/Service.context';
import { getCdbApiErrorMessage } from '@/lib/apiHelper';
import { useGetCatalog } from '@/hooks/api/catalog/useGetCatalog.hook';
import RouteModal from '@/components/route-modal/RouteModal';

const AddNode = () => {
  const { service, projectId } = useServiceData();
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
        variant: 'critical',
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
    const pricingCatalog = catalogQuery.data?.addons?.find(
      (a) => a.planCode === `${prefix}.hour.consumption`,
    )?.pricings[0];
    return {
      price: pricingCatalog?.price,
      tax: pricingCatalog?.tax,
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
      <DialogContent variant="information">
        <DialogHeader>
          <DialogTitle data-testid="add-node-modal">
            {t('addNodeTitle')}
          </DialogTitle>
        </DialogHeader>
        <DialogBody>
          {price && (
            <p>
              <Trans
                t={t}
                i18nKey={'addNodeDescription'}
                values={{
                  nbNodes: service.nodes.length,
                  unit: t('addNodeDescriptionUnitHour'),
                }}
                components={{
                  price: (
                    <Price
                      className="inline"
                      priceInUcents={price.price}
                      taxInUcents={price.tax}
                      decimals={3}
                    />
                  ),
                }}
              ></Trans>
            </p>
          )}
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              data-testid="add-node-cancel-button"
              type="button"
              mode="ghost"
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

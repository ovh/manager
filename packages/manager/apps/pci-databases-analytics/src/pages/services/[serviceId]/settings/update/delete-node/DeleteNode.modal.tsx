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
import { Pricing } from '@/lib/pricingHelper';
import { useServiceData } from '@/pages/services/[serviceId]/Service.context';
import { useDeleteNode } from '@/data/hooks/database/node/useDeleteNode.hook';
import { getCdbApiErrorMessage } from '@/lib/apiHelper';
import { useGetCatalog } from '@/data/hooks/catalog/useGetCatalog.hook';
import RouteModal from '@/components/route-modal/RouteModal.component';
import Price from '@/components/price/Price.component';

const DeleteNode = () => {
  const { service, projectId } = useServiceData();
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
        variant: 'critical',
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
    const pricingCatalog = catalogQuery.data?.addons?.find(
      (a) => a.planCode === `${prefix}.hour.consumption`,
    )?.pricings[0];
    return {
      price: pricingCatalog?.price,
      tax: pricingCatalog?.tax,
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
      <DialogContent variant="information">
        <DialogHeader>
          <DialogTitle data-testid="delete-node-modal">
            {t('deleteNodeTitle')}
          </DialogTitle>
        </DialogHeader>
        <DialogBody>
          {price && (
            <p>
              <Trans
                t={t}
                i18nKey={'deleteNodeDescription'}
                values={{
                  nbNodes: service.nodes.length,
                  unit: t('deleteNodeDescriptionUnitHour'),
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
              data-testid="delete-node-cancel-button"
              type="button"
              mode="ghost"
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

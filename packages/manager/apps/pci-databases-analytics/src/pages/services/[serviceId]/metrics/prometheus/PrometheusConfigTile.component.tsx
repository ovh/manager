import { useTranslation } from 'react-i18next';
import { BarChart4 } from 'lucide-react';
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Badge,
  useToast,
} from '@datatr-ux/uxlib';
import { useServiceData } from '../../Service.context';
import { cn } from '@/lib/utils';
import { useEditService } from '@/hooks/api/database/service/useEditService.hook';
import { getCdbApiErrorMessage } from '@/lib/apiHelper';
import { useGetPrometheusData } from '@/hooks/api/database/prometheus/useGetPrometheus.hook';
import queryClient from '@/query.client';
import PrometheusDisabled from './PrometheusDisabled.component';
import PrometheusEnabled from './PrometheusEnabled.component';
import PrometheusDisableConfirmDialog from './PrometheusDisableConfirmDialog.component';

const PrometheusConfigTile = () => {
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/metrics/prometheus',
  );
  const { service, projectId } = useServiceData();
  const toast = useToast();
  const [accordionValue, setAccordionValue] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const prometheusDataQuery = useGetPrometheusData(
    projectId,
    service.engine,
    service.id,
    {
      enabled: !!service.enablePrometheus,
    },
  );
  const { editService, isPending } = useEditService({
    onError: (err) => {
      toast.toast({
        title: t('errorToastTitle'),
        variant: 'destructive',
        description: getCdbApiErrorMessage(err),
      });
    },
    onEditSuccess: (newData) => {
      // Immediately set the data to the store to avoid desync between frontend and api
      queryClient.setQueryData(
        [projectId, 'database/service', service.id],
        () => ({
          ...service,
          ...newData,
        }),
      );
      if (newData.enablePrometheus) {
        toast.toast({
          title: t('enableSuccessToastTitle'),
          description: t('enableSuccessToastDescription'),
        });
      } else {
        toast.toast({
          title: t('disableSuccessToastTitle'),
          description: t('disableSuccessToastDescription'),
        });
        setAccordionValue('');
      }
      setShowConfirm(false);
    },
  });
  const setPrometheusEnabled = (newValue: boolean) => {
    editService({
      engine: service.engine,
      projectId,
      serviceId: service.id,
      data: { enablePrometheus: newValue },
    });
  };

  return (
    <>
      <Card className="max-w-xl">
        <Accordion
          type="single"
          collapsible
          value={accordionValue}
          onValueChange={setAccordionValue}
        >
          <AccordionItem value="prometheus" className="border-none">
            <CardHeader>
              <AccordionTrigger
                className="group hover:no-underline py-0"
                data-testid="prometheus-accordion-trigger"
              >
                <div className="flex gap-2 items-center w-full justify-between mr-2">
                  <div className="flex gap-2 items-center">
                    <div className="rounded-full bg-gradient-to-tr from-[#ff5a2d] to-[#ff8873] text-white p-2">
                      <BarChart4 className="size-3" />
                    </div>
                    <h5
                      className="group-hover:underline"
                      data-testid="prometheus-tile"
                    >
                      {t('title')}
                    </h5>
                  </div>
                  <Badge
                    className={cn(
                      'px-2 py-0.5 text-xs',
                      !service.enablePrometheus && 'border border-gray-200',
                    )}
                    variant={service.enablePrometheus ? 'success' : 'outline'}
                  >
                    {t(
                      service.enablePrometheus
                        ? 'enabledBadgeLabel'
                        : 'disabledBadgeLabel',
                    )}
                  </Badge>
                </div>
              </AccordionTrigger>
            </CardHeader>
            <CardContent className="p-0">
              <AccordionContent className="p-6 pt-0">
                {service.enablePrometheus ? (
                  <PrometheusEnabled
                    prometheusData={prometheusDataQuery.data}
                    isPending={isPending}
                    onDisablePrometheusClicked={() => setShowConfirm(true)}
                  />
                ) : (
                  <PrometheusDisabled
                    isPending={isPending}
                    onEnablePrometheusClicked={() => setPrometheusEnabled(true)}
                  />
                )}
              </AccordionContent>
            </CardContent>
          </AccordionItem>
        </Accordion>
      </Card>
      {showConfirm && (
        <PrometheusDisableConfirmDialog
          onCancel={() => setShowConfirm(false)}
          onConfirm={() => {
            setPrometheusEnabled(false);
          }}
        />
      )}
    </>
  );
};

export default PrometheusConfigTile;

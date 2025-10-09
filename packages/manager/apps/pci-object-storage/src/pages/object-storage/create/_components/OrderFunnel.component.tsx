import { Trans, useTranslation } from 'react-i18next';
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Separator,
  useToast,
} from '@datatr-ux/uxlib';
import { Region, RegionTypeEnum } from '@datatr-ux/ovhcloud-types/cloud/index';
import { Catalog } from '@datatr-ux/ovhcloud-types/order/catalog/public/Catalog';
import { useNavigate, useParams } from 'react-router-dom';
import OrderSection from './Section.component';
import OfferStep from './steps/OfferStep.component';
import OrderSummary from './OrderSummary.component';
import RegionsStep from './steps/RegionStep.component';
import OffsiteReplicationStep from './steps/OffsiteReplicationStep.component';
import VersionningStep from './steps/VersionningStep.component';
import ContainerTypeStep from './steps/ContainerTypeStep.component';
import UserStep from './steps/UserStep.component';
import EncryptStep from './steps/EncryptStep.component';
import NameInput from './steps/NameStep.component';
import { isS3Order, isSwiftOrder, useOrderFunnel } from './useOrderFunnel.hook';
import { ProductAvailability } from '@/types/Availability';
import { useCreateSwift } from '@/data/hooks/swift-storage/useCreateSwift.hook';
import { useCreateS3 } from '@/data/hooks/s3-storage/useCreateS3.hook';
import {
  ObjectContainerOffers,
  STORAGE_ASYNC_REPLICATION_LINK,
  STORAGE_PRICES_LINK,
  useLink,
} from './orderFunnel.const';
import usePciProject from '@/data/hooks/project/usePciProject.hook';
import { PlanCode } from '@/configuration/project';
import DiscoveryBanner from '@/components/discovery-banner/DiscoveryBanner';
import OrderPricing from './OrderPricing.component';
import A from '@/components/links/A.component';
import user from '@/types/User';

interface OrderFunnelProps {
  regions: Region[];
  users: user.User[];
  availabilities: ProductAvailability;
  catalog: Catalog;
}

const OrderFunnel = ({
  regions,
  users,
  availabilities,
  catalog,
}: OrderFunnelProps) => {
  const { projectId } = useParams();
  const projectData = usePciProject();
  const { t } = useTranslation('pci-object-storage/order-funnel');
  const toast = useToast();
  const navigate = useNavigate();
  const storagePricesLink = useLink(STORAGE_PRICES_LINK);
  const replicationLink = useLink(STORAGE_ASYNC_REPLICATION_LINK);

  const { form, availableRegions, model, pricings, result } = useOrderFunnel({
    regions,
    users,
    availabilities,
    catalog,
  });
  const { createSwift, isPending: isCreateSwiftPending } = useCreateSwift({
    onError: (err) => {
      toast.toast({
        title: t('createContainerErrorTitle'),
        variant: 'destructive',
        description: err,
      });
    },
    onSuccess: (container) => {
      navigate(`../swift/${container.id}`);
      toast.toast({
        title: t('createContainerSuccessTitle', { name: container.name }),
      });
    },
  });
  const { createS3, isPending: isCreateS3Pending } = useCreateS3({
    onError: (err) => {
      toast.toast({
        title: t('createContainerErrorTitle'),
        variant: 'destructive',
        description: err,
      });
    },
    onSuccess: (container) => {
      navigate(`../s3/${container.region}/${container.name}`);
      toast.toast({
        title: t('createContainerSuccessTitle', { name: container.name }),
      });
    },
  });
  const isProjectDiscoveryMode =
    projectData.data?.planCode === PlanCode.DISCOVERY;
  const isPending = isCreateSwiftPending || isCreateS3Pending;

  const onSubmit = form.handleSubmit(() => {
    if (isSwiftOrder(result)) {
      createSwift({
        projectId,
        container: result,
        containerType: form.getValues('containerType'),
      });
    } else if (isS3Order(result)) {
      const { region, ...s3config } = result;
      createS3({
        projectId,
        region,
        data: s3config,
      });
    }
  });
  return (
    <div>
      <DiscoveryBanner>{t('discoveryModeActivate')}</DiscoveryBanner>
      <Form {...form}>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div
            data-testid="order-funnel-container"
            className="col-span-1 lg:col-span-3 flex flex-col gap-4"
          >
            <OrderSection id="name" title={t('labelContainerName')}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <NameInput {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </OrderSection>

            <OrderSection id="offer" title={t('labelOffer')}>
              <FormField
                control={form.control}
                name="offer"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <OfferStep {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </OrderSection>

            <OrderSection id="region" title={t('labelLocation')}>
              <FormField
                control={form.control}
                name="region"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RegionsStep regions={availableRegions} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </OrderSection>

            {model.offer === ObjectContainerOffers.swift && (
              <>
                <OrderSection
                  id="containerType"
                  title={t('labelContainerType')}
                >
                  <FormField
                    control={form.control}
                    name="containerType"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <ContainerTypeStep {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </OrderSection>
              </>
            )}

            {model.offer === ObjectContainerOffers['s3-standard'] && (
              <>
                {model.currentRegion?.type ===
                  RegionTypeEnum['region-3-az'] && (
                  <OrderSection
                    id="replication"
                    title={t('labelOffsiteReplication')}
                    description={
                      <Trans
                        i18nKey={`descriptionOffsiteReplication`}
                        ns={'pci-object-storage/order-funnel'}
                        components={[
                          <A href={replicationLink} target="_blank" />,
                        ]}
                      />
                    }
                  >
                    <FormField
                      control={form.control}
                      name="replication"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <OffsiteReplicationStep
                              regions={availableRegions.filter(
                                (r) => r.type !== RegionTypeEnum['region-3-az'],
                              )}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </OrderSection>
                )}

                <OrderSection
                  id="versions"
                  title={t('labelVersioning')}
                  description={t('descriptionVersioning')}
                >
                  <FormField
                    control={form.control}
                    name="versioning"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <VersionningStep
                            {...field}
                            isOffsiteReplicationActivated={
                              model.replication?.enabled
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </OrderSection>

                <OrderSection
                  id="user"
                  title={t('labelUser')}
                  description={t('descriptionUser')}
                >
                  <FormField
                    control={form.control}
                    name="user"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <UserStep users={users} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </OrderSection>

                <OrderSection
                  id="encryption"
                  title={t('labelEncryption')}
                  description={t('descriptionEncryption')}
                >
                  <FormField
                    control={form.control}
                    name="encryption"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <EncryptStep {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </OrderSection>
              </>
            )}
          </div>
          <Card className="sticky top-4 h-fit shadow-lg">
            <CardHeader>
              <CardTitle>{t('summaryTitle')}</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-2">
              <OrderSummary
                order={result}
                regions={availableRegions}
                users={users}
              />
              <Separator className="my-2" />

              <OrderPricing pricings={pricings} />
              <div className="text-xs mt-2 italic">
                <Trans
                  i18nKey={`pricingDisclaimer`}
                  ns={'pci-object-storage/order-funnel'}
                  components={[<A href={storagePricesLink} target="_blank" />]}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2 justify-between">
              <Button
                data-testid="order-submit-button"
                className="w-full"
                disabled={isPending || isProjectDiscoveryMode}
                onClick={onSubmit}
              >
                {t('orderButton')}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </Form>
    </div>
  );
};

export default OrderFunnel;

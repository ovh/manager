// import DiscoveryBanner from "@/components/discovery-banner/DiscoveryBanner";
import { useTranslation } from "react-i18next";
import OrderSection from "./Section.component";
import OfferStep from "./steps/OfferStep.component";
import { Button, Card, CardContent, CardFooter, CardHeader, CardTitle, Form, FormControl, FormField, FormItem, FormMessage, Separator, Table, TableBody, TableCell, TableRow, useToast } from "@datatr-ux/uxlib";
import OrderSummary from "./OrderSummary.component";
import RegionsStep from "./steps/RegionStep.component";
import OffsiteReplicationStep from "./steps/OffsiteReplicationStep.component";
import VersionsStep from "./steps/VersionsStep.component";
import ContainerTypeStep from "./steps/ContainerTypeStep.component";
import UserStep from "./steps/UserStep.component";
import EncryptStep from "./steps/EncryptStep.component";
import { ProjectStorageCreation, Region, RegionTypeEnum, StorageContainerCreation } from "@datatr-ux/ovhcloud-types/cloud/index";
import user from '@/types/User';
import NameInput from "./steps/NameStep.component";
import { Catalog } from "@datatr-ux/ovhcloud-types/order/catalog/public/Catalog";
import { useOrderFunnel } from "./useOrderFunnel.hook";
import { Plan } from "@datatr-ux/ovhcloud-types/order/catalog/public/Plan";

import * as storages from '@datatr-ux/ovhcloud-types/cloud/storage/index';
import { ProductAvailability } from "@/types/Availability";
import Price from "@/components/price/Price.component";
import { UserWithS3Credentials } from "@/data/hooks/user/useGetUsersWithS3Credentials.hook";
import { useCreateSwift } from "@/data/hooks/swift-storage/useCreateSwift.hook";
import { useNavigate, useParams } from "react-router-dom";
import { useCreateS3 } from "@/data/hooks/s3-storage/useCreateS3.hook";
import { ObjectContainerOffers } from "./orderFunnel.const";
import usePciProject from "@/data/hooks/project/usePciProject.hook";
import { PlanCode } from "@/configuration/project";


interface OrderFunnelProps {
  regions: Region[];
  users: UserWithS3Credentials[];
  availabilities: ProductAvailability;
  catalog: Catalog;
}
   const HOUR_IN_MONTH = 730;
      const MEGA_BYTES = 1024;
const OrderFunnel = ({
  regions,
  users,
  availabilities,
  catalog,
}: OrderFunnelProps) => {
  const { form, availableRegions,
    model, pricings,  } = useOrderFunnel({
    regions,
    users,
    availabilities,
    catalog,
  })
  const { projectId } = useParams();
  const projectData = usePciProject();
  const { t } = useTranslation('pci-databases-analytics/services/new');
  const navigate = useNavigate();
  const { createSwift, isPending: isCreateSwiftPending } = useCreateSwift({
    onError: (err) => {
          toast.toast({
            title: t('addUserToastErrorTitle'),
            variant: 'destructive',
            description: err,
          });
        },
        onSuccess: (container) => {
          navigate(`../swift/${container.id}`);
          toast.toast({
            title: t('addUserToastSuccessTitle'),
            description: container.name,
          });
        },
  });
  const { createS3, isPending: isCreateS3Pending } = useCreateS3({
    onError: (err) => {
          toast.toast({
            title: t('addUserToastErrorTitle'),
            variant: 'destructive',
            description: err,
          });
        },
        onSuccess: (container) => {
          navigate(`../s3/${container.region}/${container.name}`);
          toast.toast({
            title: t('addUserToastSuccessTitle'),
            description: container.name,
          });
        },
  });
   const isProjectDiscoveryMode =
    projectData.data?.planCode === PlanCode.DISCOVERY ;
  const isPending = isCreateSwiftPending || isCreateS3Pending;

  const toast = useToast();

  const PricingOrder = () => {
    const toHourlyTo = (price: number) => price * HOUR_IN_MONTH * MEGA_BYTES;

    const total = {
      price:
    (pricings.offer.pricings?.[0]?.price ?? 0) +
    (pricings.replication?.pricings?.[0]?.price ?? 0),
  tax:
    (pricings.offer.pricings?.[0]?.tax ?? 0) +
    (pricings.replication?.pricings?.[0]?.tax ?? 0),
    }
    return (
    <div data-testid="table-price-container">
      <Table>
        <TableBody>
          <TableRow className="text-xs">
            <TableCell className="px-0 align-top">
              {t('pricing_offer_label')}
            </TableCell>
            <TableCell className="text-right px-0">
              <Price
                className="flex flex-row justify-end items-center flex-wrap gap-2"
                decimals={3}
                priceInUcents={toHourlyTo(pricings.offer.pricings[0].price)}
                taxInUcents={toHourlyTo(pricings.offer.pricings[0].tax)}
              />
            </TableCell>
          </TableRow>
          {pricings.replication && (
            <TableRow className="text-xs">
              <TableCell className="px-0 align-top">
                {t('pricing_option_replication_label')}
              </TableCell>
              <TableCell className="text-right px-0">
                <Price
                  className="flex flex-row justify-end items-center flex-wrap gap-2"
                  decimals={3}
                  priceInUcents={toHourlyTo(pricings.replication.pricings[0].price)}
                  taxInUcents={toHourlyTo(pricings.replication.pricings[0].tax)}
                />
              </TableCell>
            </TableRow>
          )}
          <TableRow>
            <TableCell className="font-semibold text-text px-0 align-top min-w-[110px]">
              {t('total_monthly_label')}
            </TableCell>
            <TableCell className="text-right px-0">
              <Price
                className="flex flex-row justify-end items-center flex-wrap gap-2"
                decimals={3}
                priceInUcents={toHourlyTo(total.price)}
                taxInUcents={toHourlyTo(total.tax)}
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )};

  let s3: StorageContainerCreation & { region: string} = {
    name: form.getValues('name'),
    ownerId: form.getValues('user'),
    encryption:{
      sseAlgorithm: form.getValues('encryption')  === 'enabled' ? storages.EncryptionAlgorithmEnum.AES256 : storages.EncryptionAlgorithmEnum.plaintext,
    },
    versioning: {
      status: (form.getValues('versioning') === 'enabled') ? storages.VersioningStatusEnum.enabled : storages.VersioningStatusEnum.disabled
    },
    region: form.getValues('region'),
  }
  if (model.replication?.enabled) {
    const rule: storages.ReplicationRuleIn = {
      id: '',
      deleteMarkerReplication: storages.ReplicationRuleDeleteMarkerReplicationStatusEnum.enabled,
      status: storages.ReplicationRuleStatusEnum.enabled,
      priority: 1,
    }
    if (model.replication?.automaticRegionSelection === false) {
      rule.destination = {
        name: '', // not in the prod value sent, error ?
        region: model.replication?.region,
      }
    }
    s3.replication = {
      rules: [rule]
    };
  }

  const swift: ProjectStorageCreation = {
    containerName: form.getValues('name'),
    region: form.getValues('region'),
    archive: false,
  }
  const result = model.offer === ObjectContainerOffers["s3-standard"] ? s3 : swift;
  
  const onSubmit = form.handleSubmit(
    () => { 
      if (model.offer === ObjectContainerOffers.swift) {
        createSwift({
          projectId,
          container: swift,
          containerType: form.getValues('containerType'),
        })
      } else {
        const { region, ...s3config} = s3
        createS3({
          projectId,
          region: region,
          data: s3config,
        });
      }
    },
    (err) => { 
      toast.toast({
        title: t('submit'),
        variant: 'destructive',
        description: JSON.stringify(err), 
      });
    }
  );
  return (
    <>
      {/* <DiscoveryBanner>{t('discoveryModeActivate')}</DiscoveryBanner> */}
      <Form {...form}>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div
            data-testid="order-funnel-container"
            className="col-span-1 lg:col-span-3 flex flex-col gap-4"
          >
            <OrderSection
              id="name"
              title={t('Nom du conteneur')}
            >

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
            </OrderSection >

            <OrderSection
              id="offer"
              title={t('Offre')}
            >
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

            <OrderSection
              id="region"
              title={t('Localisation')}
            >
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
                  title={t('Type de conteneur')}
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

            {model.offer === ObjectContainerOffers["s3-standard"] && (
              <>
                {model.currentRegion?.type === RegionTypeEnum['region-3-az'] && (
                  <OrderSection
                    id="replication"
                    title={t('Offsite Replication')}
                    description={'Répliquez automatiquement vos données sur un site distant dans une classe de stockage Infrequent Access. En savoir plus'}
                  >
                    <FormField
                      control={form.control}
                      name="replication"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <OffsiteReplicationStep 
                            regions={availableRegions.filter(r => r.type !== RegionTypeEnum['region-3-az'])} 
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
                  title={t('Gestion des versions')}
                  description={'Automatise la création de versions d’un objet pour pallier la suppression accidentelle de ce dernier, ou simplement quand un nouvel objet est uploadé.'}
                >
                  <FormField
                    control={form.control}
                    name="versioning"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <VersionsStep {...field} isOffsiteReplicationActivated={model.replication?.enabled}/>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </OrderSection >

                <OrderSection
                  id="user"
                  title={t('Utilisateur')}
                  description={'Vous pouvez donner accès au conteneur à un de vos utilisateurs OpenStack préconfigurés avec un rôle "Administrateur" ou "Opérateur Object Storage" ou bien créer un nouvel utilisateur.'}
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
                </OrderSection >

                <OrderSection
                  id="encryption"
                  title={t('Chiffrement vos données')}
                  description={'Les données déversées dans ce conteneur sont chiffrées à la volée par OVHcloud.'}
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
                </OrderSection >
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
              // onSectionClicked={(section) => scrollToDiv(section)}
              />
              <Separator className="my-2" />
              
               <PricingOrder />
               <div className="text-xs mt-2 italic">
                  ** Le prix affiché est une estimation pour 1 To d'Object Storage Standard pour 730 heures. Pour plus d'informations,
                  voir la page des prix.
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
    </>
  );
}

export default OrderFunnel;
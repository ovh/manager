import { Trans, useTranslation } from 'react-i18next';
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  FieldDescription,
  Separator,
  useToast,
} from '@datatr-ux/uxlib';
import { Region, RegionTypeEnum } from '@datatr-ux/ovhcloud-types/cloud';
import { Catalog } from '@datatr-ux/ovhcloud-types/order/catalog/public';
import { useNavigate, useParams } from 'react-router-dom';
import { useMemo, useState } from 'react';
import OrderSection from './Section.component';
import OfferStep from './steps/OfferStep.component';
import OrderSummary from './OrderSummary.component';
import RegionsStep from './steps/RegionStep.component';
import OffsiteReplicationStep from './steps/OffsiteReplicationStep.component';
import VersionningStep from './steps/VersionningStep.component';
import ObjectLockStep from './steps/ObjectLockStep.component';
import ContainerTypeStep from './steps/ContainerTypeStep.component';
import UserStep from './steps/UserStep.component';
import EncryptStep from './steps/EncryptStep.component';
import { FormField } from '@/components/form-field/FormField.component';
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
} from './orderFunnel.constants';
import usePciProject from '@/data/hooks/project/usePciProject.hook';
import { PlanCode } from '@/configuration/project';
import A from '@/components/links/A.component';
import user from '@/types/User';
import { getObjectStoreApiErrorMessage } from '@/lib/apiHelper';
import DiscoveryBanner from '@/components/discovery-banner/DiscoveryBanner.component';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useTranslation('pci-object-storage/order-funnel');
  const toast = useToast();
  const navigate = useNavigate();
  const storagePricesLink = useLink(STORAGE_PRICES_LINK);
  const replicationLink = useLink(STORAGE_ASYNC_REPLICATION_LINK);

  const { form, availableRegions, model, versioning, result } = useOrderFunnel({
    regions,
    users,
    availabilities,
    catalog,
  });
  const { createSwift } = useCreateSwift({
    onError: (err) => {
      toast.toast({
        title: t('createContainerErrorTitle'),
        variant: 'critical',
        description: getObjectStoreApiErrorMessage(err),
      });
      setIsSubmitting(false);
    },
    onSuccess: (container) => {
      navigate(`../swift/${container.id}`);
      toast.toast({
        title: t('createContainerSuccessTitle', { name: container.name }),
      });
    },
  });
  const { createS3 } = useCreateS3({
    onError: (err) => {
      toast.toast({
        title: t('createContainerErrorTitle'),
        variant: 'critical',
        description: getObjectStoreApiErrorMessage(err),
      });
      setIsSubmitting(false);
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

  const onSubmit = form.handleSubmit(() => {
    setIsSubmitting(true);
    if (isSwiftOrder(result)) {
      createSwift({
        projectId,
        container: {
          archive: result.archive,
          containerName: result.containerName,
          region: result.region,
        },
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

  const isS3Offer = model.offer === ObjectContainerOffers['s3-standard'];
  const is3AZ = model.currentRegion?.type === RegionTypeEnum['region-3-az'];
  const isLZ = model.currentRegion?.type === RegionTypeEnum.localzone;

  // replication only allows 1az regions
  const replicationRegions = useMemo(
    () =>
      availableRegions.filter((r) => r.type === RegionTypeEnum.region) || [],
    [availableRegions],
  );
  return (
    <div>
      <DiscoveryBanner>{t('discoveryModeActivate')}</DiscoveryBanner>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <form
          onSubmit={onSubmit}
          id="os-order-funnel"
          data-testid="order-funnel-container"
          className="col-span-1 lg:col-span-3 flex flex-col gap-4"
        >
          {/* ──────────────── Common steps ──────────────── */}
          <OrderSection id="name" title={t('labelContainerName')}>
            <FormField name="name" form={form}>
              {(field) => <NameInput {...field} />}
            </FormField>
            <FieldDescription>{t('nameInputInfo')}</FieldDescription>
          </OrderSection>

          <OrderSection id="offer" title={t('labelOffer')}>
            <FormField name="offer" form={form}>
              {(field) => <OfferStep {...field} />}
            </FormField>
          </OrderSection>

          <OrderSection id="region" title={t('labelLocation')}>
            <FormField name="region" form={form}>
              {(field) => <RegionsStep regions={availableRegions} {...field} />}
            </FormField>
          </OrderSection>

          {/* ──────────────── Swift-only step ──────────────── */}
          {!isS3Offer && (
            <OrderSection id="containerType" title={t('labelContainerType')}>
              <FormField name="containerType" form={form}>
                {(field) => <ContainerTypeStep {...field} />}
              </FormField>
            </OrderSection>
          )}

          {/* ──────────────── S3-only steps ──────────────── */}
          {isS3Offer && (
            <>
              {is3AZ && (
                <OrderSection
                  id="replication"
                  title={t('labelOffsiteReplication')}
                  description={
                    <Trans
                      i18nKey="descriptionOffsiteReplication"
                      ns="pci-object-storage/order-funnel"
                      components={[
                        <A href={replicationLink} target="_blank" />,
                      ]}
                    />
                  }
                >
                  <FormField name="replication" form={form}>
                    {(field) => (
                      <OffsiteReplicationStep
                        regions={replicationRegions}
                        {...field}
                      />
                    )}
                  </FormField>
                </OrderSection>
              )}

              {!isLZ && (
                <>
                  {/* Versioning */}
                  <OrderSection
                    id="versions"
                    title={t('labelVersioning')}
                    description={t('descriptionVersioning')}
                  >
                    <FormField name="versioning" form={form}>
                      {(field) => (
                        <VersionningStep
                          isOffsiteReplicationActivated={
                            model.replication?.enabled
                          }
                          {...field}
                        />
                      )}
                    </FormField>
                  </OrderSection>

                  {/* Object Lock */}
                  <OrderSection
                    id="object-lock"
                    title={t('labelObjectLock')}
                    description={
                      <Trans
                        i18nKey="descriptionObjectLock"
                        ns="pci-object-storage/order-funnel"
                        components={[
                          <A href={replicationLink} target="_blank" />,
                        ]}
                      />
                    }
                  >
                    <FormField name="objectLock" form={form}>
                      {(field) => (
                        <ObjectLockStep
                          versioning={versioning}
                          {...field}
                          acknowledgement={form.watch(
                            'objectLockAcknowledgement',
                          )}
                          onAcknowledgementChange={(checked) =>
                            form.setValue('objectLockAcknowledgement', checked)
                          }
                          acknowledgementError={
                            form.formState.errors.objectLockAcknowledgement
                              ?.message
                          }
                        />
                      )}
                    </FormField>
                  </OrderSection>

                  {/* User */}
                  <OrderSection
                    id="user"
                    title={t('labelUser')}
                    description={t('descriptionUser')}
                  >
                    <FormField name="user" form={form} data-testid="user-field">
                      {(field) => <UserStep users={users} {...field} />}
                    </FormField>
                  </OrderSection>

                  {/* Encryption */}
                  <OrderSection
                    id="encryption"
                    title={t('labelEncryption')}
                    description={t('descriptionEncryption')}
                  >
                    <FormField name="encryption" form={form}>
                      {(field) => <EncryptStep {...field} />}
                    </FormField>
                  </OrderSection>
                </>
              )}
            </>
          )}
        </form>
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
              type="submit"
              form="os-order-funnel"
              data-testid="order-submit-button"
              className="w-full"
              disabled={isSubmitting || isProjectDiscoveryMode}
            >
              {t('orderButton')}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default OrderFunnel;

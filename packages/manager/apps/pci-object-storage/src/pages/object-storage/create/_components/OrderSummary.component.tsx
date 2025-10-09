import {
  ProjectStorageCreation,
  StorageContainerCreation,
} from '@datatr-ux/ovhcloud-types/cloud/index';
import { Button, Separator, Skeleton } from '@datatr-ux/uxlib';
import {
  Copy,
  Globe,
  History,
  KeyRound,
  Link,
  Puzzle,
  Tag,
  User,
} from 'lucide-react';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import Flag from '@/components/flag/Flag.component';
import { useTranslatedMicroRegions } from '@/hooks/useTranslatedMicroRegions';
import cloud from '@/types/Cloud';
import storages from '@/types/Storages';
import { isS3Order, isSwiftOrder } from './useOrderFunnel.hook';
import * as Tuser from '@/types/User';

const AnchorLabel = ({
  label,
  onClick,
}: {
  label: string;
  onClick: (id: string) => void;
}) => (
  <Button
    className="h-auto p-0 bg-transparent hover:bg-transparent font-bold text-primary underline-offset-4 hover:underline text-sm"
    type="button"
    onClick={() => onClick('options')}
  >
    {label}
    <Link className="ml-1 size-3" />
  </Button>
);

const SummarySection = ({
  label,
  onAnchorClicked,
  children,
  hideSeparator = false,
}: {
  label: string;
  onAnchorClicked: (id: string) => void;
  children: ReactNode;
  hideSeparator?: boolean;
}) => (
  <div>
    <AnchorLabel label={label} onClick={onAnchorClicked} />
    {children}

    {!hideSeparator && <Separator className="bg-[#ebebeb] h-[2px] mt-2" />}
  </div>
);

const SummaryItem = ({ children }: { children: ReactNode }) => (
  <div className="flex items-center gap-2">{children}</div>
);

const OrderSummary = ({
  order,
  regions,
  users,
}: {
  order:
    | (StorageContainerCreation & { region: string })
    | (ProjectStorageCreation & { containerType: storages.TypeEnum });
  regions: cloud.Region[];
  users: Tuser.default.User[];
}) => {
  const { t } = useTranslation('pci-object-storage/order-funnel');

  const scrollToDiv = (target: string) => {
    const div = document.getElementById(target);
    if (div) {
      div.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const regionInfo = regions.find((r) => r.name === order.region);

  const UserInfo = ({ userId }: { userId?: number }) => {
    const user = users.find((u) => u.id === userId);
    return user ? user.description : '-';
  };
  const RegionInfo = ({ region }: { region?: string }) => {
    const { translateMicroRegion } = useTranslatedMicroRegions();
    const rInfo = regions.find((r) => r.name === region);
    return regionInfo ? (
      <div className="flex gap-2 items-center">
        <Flag className="w-[1rem] h-[0.8rem]" flagName={rInfo.countryCode} />
        <span>{translateMicroRegion(rInfo.name)}</span>
      </div>
    ) : (
      <span>-</span>
    );
  };
  if (!order) return <Skeleton className="w-full h-[40vh]" />;
  return (
    <div className="grid grid-cols-1 gap-2 bg-neutral-50 border border-neutral-200 px-3 py-2 rounded-sm text-heading font-semibold text-sm max-h-[40vh] overflow-auto">
      {isS3Order(order) && (
        <>
          <SummarySection
            label={t('summaryContainerSection')}
            onAnchorClicked={() => scrollToDiv('name')}
          >
            <SummaryItem>
              <Tag className="size-4" />
              <span>{order.name}</span>
            </SummaryItem>
            <SummaryItem>
              <Puzzle className="size-4" />
              <span>{t('summaryOfferS3')}</span>
            </SummaryItem>
          </SummarySection>

          <SummarySection
            label={t('summaryLocationSection')}
            onAnchorClicked={() => scrollToDiv('region')}
          >
            <SummaryItem>
              <RegionInfo region={order.region} />
            </SummaryItem>
          </SummarySection>

          {regionInfo.type === cloud.RegionTypeEnum['region-3-az'] && (
            <SummarySection
              label={t('summaryOffsiteReplicationSection')}
              onAnchorClicked={() => scrollToDiv('replication')}
            >
              <SummaryItem>
                <Copy className="size-4" />
                <span>
                  {order.replication?.rules?.length
                    ? t('summaryOffsiteReplicationEnabled')
                    : t('summaryOffsiteReplicationDisabled')}
                </span>
              </SummaryItem>
              {order.replication?.rules?.length && (
                <SummaryItem>
                  <Globe className="size-4" />
                  <div className="flex gap-2 flex-wrap">
                    {t('summaryOffsiteReplicationRegion')}
                    {order.replication?.rules?.[0].destination ? (
                      <RegionInfo
                        region={
                          order.replication?.rules?.[0].destination.region
                        }
                      />
                    ) : (
                      <span>
                        {t('summaryOffsiteReplicationRegionAutomatic')}
                      </span>
                    )}
                  </div>
                </SummaryItem>
              )}
            </SummarySection>
          )}

          <SummarySection
            label={t('summaryVersionningSection')}
            onAnchorClicked={() => scrollToDiv('replication')}
          >
            <SummaryItem>
              <History className="size-4" />
              <span>
                {order.versioning.status ===
                storages.VersioningStatusEnum.enabled
                  ? t('summaryVersionningEnabled')
                  : t('summaryVersionningDisabled')}
              </span>
            </SummaryItem>
          </SummarySection>

          <SummarySection
            label={t('summaryUserSection')}
            onAnchorClicked={() => scrollToDiv('user')}
          >
            <SummaryItem>
              <User className="size-4" />
              <span>
                <UserInfo userId={order.ownerId} />
              </span>
            </SummaryItem>
          </SummarySection>

          <SummarySection
            label={t('summaryEncryptionSection')}
            onAnchorClicked={() => scrollToDiv('encryption')}
          >
            <SummaryItem>
              <KeyRound className="size-4" />
              <span className="capitalize">
                {order.encryption.sseAlgorithm}
              </span>
            </SummaryItem>
          </SummarySection>
        </>
      )}

      {isSwiftOrder(order) && (
        <>
          <SummarySection
            label={t('summaryContainerSection')}
            onAnchorClicked={() => scrollToDiv('name')}
          >
            <SummaryItem>
              <Tag className="size-4" />
              <span>{order.containerName}</span>
            </SummaryItem>
            <SummaryItem>
              <Puzzle className="size-4" />
              <span>{t('summaryOfferSwift')}</span>
            </SummaryItem>
          </SummarySection>

          <SummarySection
            label={t('summaryLocationSection')}
            onAnchorClicked={() => scrollToDiv('region')}
          >
            <SummaryItem>
              <RegionInfo region={order.region} />
            </SummaryItem>
          </SummarySection>

          <SummarySection
            label={t('summaryContainerTypeSection')}
            onAnchorClicked={() => scrollToDiv('containerType')}
          >
            <SummaryItem>
              <Globe className="size-4" />
              <span>{t(`containerTypeLabel-${order.containerType}`)}</span>
            </SummaryItem>
          </SummarySection>
        </>
      )}
    </div>
  );
};

export default OrderSummary;

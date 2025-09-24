import Flag from "@/components/flag/Flag.component";
import { UserWithS3Credentials } from "@/data/hooks/user/useGetUsersWithS3Credentials.hook";
import { useTranslatedMicroRegions } from "@/hooks/useTranslatedMicroRegions";
import cloud from "@/types/Cloud";
import storages from "@/types/Storages";
import { ProjectStorageCreation, StorageContainerCreation } from "@datatr-ux/ovhcloud-types/cloud/index";
import { Button, Separator, Skeleton } from "@datatr-ux/uxlib";
import { Copy, Globe, History, KeyRound, Link, Puzzle, Tag, User } from "lucide-react";
import { ReactNode } from "react";

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
  order: StorageContainerCreation & { region: string } | ProjectStorageCreation;
  regions: cloud.Region[];
  users: UserWithS3Credentials[];
}) => {


  const scrollToDiv = (target: string) => {
    const div = document.getElementById(target);
    if (div) {
      div.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isContainerOrder = (o: StorageContainerCreation | ProjectStorageCreation): o is StorageContainerCreation =>
    "name" in o; // adapt this field to a property unique to StorageContainerCreation

  const isProjectOrder = (o: StorageContainerCreation | ProjectStorageCreation): o is ProjectStorageCreation =>
    "containerName" in o; // adapt this field to a property unique to ProjectStorageCreation

  const UserInfo = ({ userId }: { userId?: number }) => {
    const user = users.find(u => u.id === userId);
    return user ? user.description : '-'
  }
  const RegionInfo = ({ region }: { region?: string }) => {
    const {
      translateMicroRegion
    } = useTranslatedMicroRegions();
    const regionInfo = regions.find(r => r.name === region);
    return regionInfo ? (
      <div className="flex gap-2 items-center">
        <Flag flagName={regionInfo.countryCode} />
        <span>{translateMicroRegion(regionInfo.name)}</span>
      </div>
    ) : '-'
  }
  if (!order) return <Skeleton className="w-full h-[40vh]" />
  return (
    <div className="grid grid-cols-1 gap-2 bg-neutral-50 border border-neutral-200 px-3 py-2 rounded-sm text-heading font-semibold text-sm max-h-[40vh] overflow-auto">
      {isContainerOrder(order) && (
        <>
          <SummarySection label="Container" onAnchorClicked={() => scrollToDiv("name")}>
            <SummaryItem>
              <Tag className="size-4" />
              <span>{order.name}</span>
            </SummaryItem>
            <SummaryItem>
              <Puzzle className="size-4" />
              <span>API compatible S3</span>
            </SummaryItem>
          </SummarySection>

          <SummarySection label="Region" onAnchorClicked={() => scrollToDiv("region")}>
            <SummaryItem>
              <RegionInfo region={order.region} />
            </SummaryItem>
          </SummarySection>

          {/* TODO: Only if 3az */}
          <SummarySection label="Replication" onAnchorClicked={() => scrollToDiv("replication")}>
            <SummaryItem>
              <Copy className="size-4" />
              <span>Réplication {order.replication?.rules?.length ? 'activée' : 'desactivée'}</span>
            </SummaryItem>
            {order.replication?.rules?.length && (
              <SummaryItem>
                {!order.replication?.rules?.[0].destination && (
                  <Globe className="size-4" />
                )}
                <span className="flex gap-2 flex-wrap">Region: {order.replication?.rules?.[0].destination ?
                  <RegionInfo region={order.replication?.rules?.[0].destination.region} /> : 'automatique'}</span>
              </SummaryItem>
            )}
          </SummarySection>

          <SummarySection label="Versionning" onAnchorClicked={() => scrollToDiv("replication")}>
            <SummaryItem>
              <History className="size-4" />
              <span>Gestion des versions {order.versioning.status === storages.VersioningStatusEnum.enabled ? 'activée' : 'desactivée'}</span>
            </SummaryItem>
          </SummarySection>

          <SummarySection label="Utilisateur" onAnchorClicked={() => scrollToDiv("user")}>
            <SummaryItem>
              <User className="size-4" />
              <span><UserInfo userId={order.ownerId} /></span>
            </SummaryItem>
          </SummarySection>

          <SummarySection label="Chiffrement" onAnchorClicked={() => scrollToDiv("encryption")}>
            <SummaryItem>
              <KeyRound className="size-4" />
              <span>{order.encryption.sseAlgorithm}</span>
            </SummaryItem>
          </SummarySection>
        </>
      )}

      {isProjectOrder(order) && (
        <>
          <SummarySection label="Container" onAnchorClicked={() => scrollToDiv("name")}>
            <SummaryItem>
              <Tag className="size-4" />
              <span>{order.containerName}</span>
            </SummaryItem>
            <SummaryItem>
              <Puzzle className="size-4" />
              <span>Swift API</span>
            </SummaryItem>
          </SummarySection>

          <SummarySection label="Region" onAnchorClicked={() => scrollToDiv("region")}>
            <SummaryItem>
              <Globe className="size-4" />
              <RegionInfo region={order.region} />
            </SummaryItem>
          </SummarySection>


        </>
      )}
    </div>
  );
}

export default OrderSummary;
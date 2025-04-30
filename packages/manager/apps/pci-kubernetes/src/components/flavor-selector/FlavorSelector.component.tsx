import { useState } from 'react';
import { TabsComponent } from '@ovh-ux/manager-react-components';
import { OsdsSpinner, OsdsText } from '@ovhcloud/ods-components/react';
import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';

import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import clsx from 'clsx';
import {
  useMergedKubeFlavors,
  KUBE_FLAVOR_CATEGORIES,
} from '@/hooks/useFlavors';
import { FlavorTile } from './FlavorTile.component';

export type KubeFlavor = ReturnType<
  typeof useMergedKubeFlavors
>['mergedFlavors'][0];

interface FlavorSelectorProps {
  projectId: string;
  region: string;
  onSelect?: (flavor: KubeFlavor) => void;
}

export function FlavorSelector({
  projectId,
  region,
  onSelect,
}: Readonly<FlavorSelectorProps>) {
  const { mergedFlavors, isPending } = useMergedKubeFlavors(projectId, region);
  const [selectedFlavor, setSelectedFlavor] = useState(null);

  if (isPending) {
    return <OsdsSpinner inline size={ODS_SPINNER_SIZE.md} />;
  }

  return (
    <TabsComponent
      items={KUBE_FLAVOR_CATEGORIES}
      itemKey={({ category }) => category}
      titleElement={(category, isSelected) => (
        <OsdsText
          breakSpaces={false}
          size={ODS_THEME_TYPOGRAPHY_SIZE._600}
          color={
            isSelected
              ? ODS_THEME_COLOR_INTENT.text
              : ODS_THEME_COLOR_INTENT.primary
          }
        >
          <span
            className={clsx(
              isSelected && 'font-bold',
              'whitespace-nowrap text-lg',
            )}
          >
            {category.title}
          </span>
        </OsdsText>
      )}
      contentElement={(category) => (
        <div className="grid gap-6 p-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
          {mergedFlavors
            .filter((flavor) => flavor.flavorCategory === category.category)
            .map((flavor) => (
              <div key={flavor.id}>
                <FlavorTile
                  flavorName={flavor.name.toUpperCase()}
                  flavorSpecs={{
                    ram: flavor.ram,
                    vcores: flavor.vCPUs,
                    frequency: flavor.blobs.technical.cpu.frequency,
                    disk: flavor.blobs.technical.storage?.disks,
                    nvme: flavor.blobs.technical.nvme?.disks,
                    bandwidth: flavor.blobs.technical.bandwidth?.level,
                    gpuNumber: flavor.blobs.technical.gpu?.number,
                    gpuModel: flavor.blobs.technical.gpu?.model,
                  }}
                  flavorCompatibility={{
                    ...flavor.compatibility,
                    localzone: false,
                  }}
                  flavorPrice={{
                    hourly: flavor.pricingsHourly?.price,
                    monthly: flavor.pricingsMonthly?.price,
                  }}
                  isNewFlavor={flavor.isNew}
                  isSelected={flavor === selectedFlavor}
                  hasEnoughQuota={flavor.hasEnoughQuota}
                  onClick={() => {
                    setSelectedFlavor(flavor);
                    onSelect(flavor);
                  }}
                />
              </div>
            ))}
        </div>
      )}
    />
  );
}

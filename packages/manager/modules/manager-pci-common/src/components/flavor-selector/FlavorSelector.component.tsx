import { useState } from 'react';
import clsx from 'clsx';
import { TabsComponent } from '@ovh-ux/manager-react-components';
import { OdsSpinner, OdsText } from '@ovhcloud/ods-components/react';
import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import {
  KUBE_FLAVOR_CATEGORIES,
  useMergedKubeFlavors,
} from '../../api/hook/useFlavors';
import { FlavorTile } from './FlavorTile.component';

import '../../translations/flavor-selector';

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
    return <OdsSpinner size={ODS_SPINNER_SIZE.md} />;
  }

  return (
    <TabsComponent
      items={KUBE_FLAVOR_CATEGORIES}
      itemKey={({ category }) => category}
      titleElement={(category, isSelected) => (
        <OdsText
          preset="span"
          className={clsx(
            'text-[--ods-color-primary-500] text-[18px]',
            isSelected && 'text-[--ods-color-heading]',
          )}
        >
          <span
            className={clsx(
              isSelected && 'font-bold',
              'whitespace-nowrap text-lg',
            )}
          >
            {category.title}
          </span>
        </OdsText>
      )}
      contentElement={(category) => (
        <div className="grid gap-6 p-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
          {mergedFlavors
            .filter((flavor) => flavor.flavorCategory === category.category)
            .map((flavor) => (
              <div key={flavor.id}>
                <FlavorTile
                  id={flavor.id}
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
                  flavorCompatibility={flavor.compatibility}
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

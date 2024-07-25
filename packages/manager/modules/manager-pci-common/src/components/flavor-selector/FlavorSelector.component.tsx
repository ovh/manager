import { useState } from 'react';
import clsx from 'clsx';
import { OsdsSpinner, OsdsText } from '@ovhcloud/ods-components/react';
import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { TabsComponent } from '@ovhcloud/manager-components';
import {
  KUBE_FLAVOR_CATEGORIES,
  useMergedKubeFlavors,
} from '../../api/hook/useFlavors';
import { FlavorTile } from './FlavorTile.component';
import './translations';

interface FlavorSelectorProps {
  projectId: string;
  region: string;
}

export function FlavorSelector({
  projectId,
  region,
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
                  }}
                  flavorCompatibility={flavor.compatibility}
                  flavorPrice={{
                    hourly: flavor.pricingsHourly?.price,
                    monthly: flavor.pricingsMonthly?.price,
                  }}
                  isNewFlavor={flavor.isNew}
                  isSelected={flavor === selectedFlavor}
                  onClick={() => setSelectedFlavor(flavor)}
                />
              </div>
            ))}
        </div>
      )}
    />
  );
}

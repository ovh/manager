import {
  Badge,
  SelectContent,
  SelectCustomOptionRendererArg,
  Text,
} from '@ovhcloud/ods-react';
import { t } from 'i18next';
import { TCustomData } from '../../view-models/imagesViewModel';
type TDistributionImageOptionProps = {
  badgeKey: string;
};

export const DistributionImageOption = ({
  badgeKey,
}: TDistributionImageOptionProps) => (
  <SelectContent
    className="[&>div>span:first-child]:w-full"
    customOptionRenderer={({
      label,
      customData,
    }: SelectCustomOptionRendererArg) => (
      <div className="flex w-full items-center justify-between py-4">
        <Text>{label}</Text>
        {!(customData as TCustomData).available && (
          <Badge
            className="bg-[--ods-color-neutral-500] text-xs text-[--ods-color-element-text-selected]"
            color="neutral"
          >
            {t(badgeKey)}
          </Badge>
        )}
      </div>
    )}
  />
);

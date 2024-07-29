import { OsdsIcon } from '@ovhcloud/ods-components/react';
import { ODS_ICON_NAME, ODS_ICON_SIZE } from '@ovhcloud/ods-components';

interface ProductAdvantagesProps {
  iconeName: ODS_ICON_NAME;
  title: string;
  description: string;
}

export default function ProductAdvantages({
  iconeName,
  title,
  description,
}: ProductAdvantagesProps) {
  return (
    <>
      <div className="flex flex-row gap-6">
        <div className="rounded-full h-16 w-16 flex items-center justify-center overflow-hidden">
          <OsdsIcon
            aria-hidden="true"
            name={iconeName}
            className="object-cover"
            size={ODS_ICON_SIZE.lg}
          />
        </div>
        <div className="flex flex-col gap-2">
          <h4>{title}</h4>
          <p className="max-w-xs md:max-w-md text-justify">{description}</p>
        </div>
      </div>
    </>
  );
}

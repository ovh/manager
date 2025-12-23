import { OdsText } from '@ovhcloud/ods-components/react';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';

type Props = {
  description: string;
  list?: string[];
};

export default function AccountSettingsPopoverContent({
  description,
  list,
}: Props) {
  return (
    <div className="flex flex-col leading-none text-sm md:leading-normal">
      <OdsText preset={ODS_TEXT_PRESET.caption}>{description}</OdsText>
      {list?.length && (
        <ol className="list-none space-y-2 pl-0">
          {list.map((item: string, index: number) => (
            <li key={index}>
              <OdsText preset={ODS_TEXT_PRESET.caption}>{item}</OdsText>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

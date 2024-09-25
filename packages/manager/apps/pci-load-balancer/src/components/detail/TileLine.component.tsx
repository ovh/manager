import { Clipboard } from '@ovh-ux/manager-react-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_SKELETON_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import {
  OsdsDivider,
  OsdsSkeleton,
  OsdsText,
} from '@ovhcloud/ods-components/react';

type TileLineProps = {
  title: string;
  value: string | number | JSX.Element;
  type?: 'text' | 'clipboard' | 'other';
};

export default function TileLine({
  title,
  value,
  type = 'text',
}: Readonly<TileLineProps>) {
  const renderContent = () => {
    if (!value) {
      return <OsdsSkeleton size={ODS_SKELETON_SIZE.lg} />;
    }

    switch (type) {
      case 'clipboard':
        return <Clipboard aria-label="clipboard" value={value as string} />;
      case 'text':
        return (
          <OsdsText
            className="mb-4"
            size={ODS_TEXT_SIZE._400}
            level={ODS_TEXT_LEVEL.body}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {value}
          </OsdsText>
        );
      default:
        return value;
    }
  };

  return (
    <>
      <OsdsText
        className="mb-4 block"
        size={ODS_TEXT_SIZE._200}
        level={ODS_TEXT_LEVEL.heading}
        color={ODS_THEME_COLOR_INTENT.text}
      >
        {title}
      </OsdsText>
      {renderContent()}
      <OsdsDivider separator />
    </>
  );
}

import { ReactElement } from 'react';

import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import { OsdsDivider, OsdsText } from '@ovhcloud/ods-components/react';

type TileLineProps = {
  title: string | ReactElement;
  value: ReactElement;
};
export default function TileLine({ title, value }: Readonly<TileLineProps>) {
  return (
    <>
      <OsdsText
        data-testid={`tile-line-${typeof title === 'string' ? title : 'node'}`}
        className="mb-4 block"
        size={ODS_TEXT_SIZE._200}
        level={ODS_TEXT_LEVEL.heading}
        color={ODS_THEME_COLOR_INTENT.text}
      >
        {title}
      </OsdsText>
      {value}
      <OsdsDivider separator />
    </>
  );
}

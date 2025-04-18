import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { OsdsText } from '@ovhcloud/ods-components/react';
import { FC, PropsWithChildren } from 'react';
import { DeepReadonly } from '@/types/utils.type';

export type TTabContentWrapperProps = DeepReadonly<{
  description?: string;
}>;

export const TabContentWrapper: FC<PropsWithChildren<
  TTabContentWrapperProps
>> = ({ description, children }) => (
  <div className="p-6 pt-8" data-testid="tab-content-wrapper">
    {description && (
      <OsdsText
        color={ODS_THEME_COLOR_INTENT.text}
        level={ODS_TEXT_LEVEL.body}
        size={ODS_TEXT_SIZE._400}
      >
        {description}
      </OsdsText>
    )}
    {children}
  </div>
);

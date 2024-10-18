import {
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
  ODS_THEME_COLOR_INTENT,
} from '@ovhcloud/ods-common-theming';
import { OsdsText } from '@ovhcloud/ods-components/react';
import { FC, PropsWithChildren } from 'react';
import { LoadingCell } from './LoadingCell.component';

export const BaseTextCell: FC<PropsWithChildren> = ({ children }) => (
  <OsdsText
    data-testid="base-text-cell"
    level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
    size={ODS_THEME_TYPOGRAPHY_SIZE._400}
    color={ODS_THEME_COLOR_INTENT.text}
    className={'block'}
  >
    {children}
  </OsdsText>
);

type TTextCellProps = {
  isLoading: boolean;
  label: string;
};

export const TextCell: FC<TTextCellProps> = ({ isLoading, label }) => (
  <LoadingCell isLoading={isLoading}>
    <BaseTextCell> {label}</BaseTextCell>
  </LoadingCell>
);

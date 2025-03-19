import { OsdsText, OsdsSkeleton } from '@ovhcloud/ods-components/react';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { ODS_SKELETON_SIZE } from '@ovhcloud/ods-components';
import { FC } from 'react';

type PriceProps = {
  isLoading: boolean;
  value: string;
};

const PriceLabel: FC<Readonly<PriceProps>> = ({ isLoading, value }) =>
  isLoading ? (
    <OsdsSkeleton size={ODS_SKELETON_SIZE.sm} />
  ) : (
    <OsdsText
      level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
      size={ODS_THEME_TYPOGRAPHY_SIZE._200}
      color={ODS_THEME_COLOR_INTENT.text}
    >
      <strong>{value}</strong>
    </OsdsText>
  );

export default PriceLabel;

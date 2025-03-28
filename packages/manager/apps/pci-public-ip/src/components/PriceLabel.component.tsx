import { OsdsText, OsdsSkeleton } from '@ovhcloud/ods-components/react';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { ODS_SKELETON_SIZE } from '@ovhcloud/ods-components';
import { FC } from 'react';
import { clsx } from 'clsx';

type PriceProps = {
  value: string;
  isLoading?: boolean;
  size?: ODS_THEME_TYPOGRAPHY_SIZE;
  color?: ODS_THEME_COLOR_INTENT;
  className?: string;
};

const PriceLabel: FC<Readonly<PriceProps>> = ({
  isLoading,
  value,
  size,
  color,
  className,
}) =>
  isLoading ? (
    <OsdsSkeleton size={ODS_SKELETON_SIZE.sm} />
  ) : (
    <OsdsText
      level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
      size={size ?? ODS_THEME_TYPOGRAPHY_SIZE._200}
      color={color ?? ODS_THEME_COLOR_INTENT.text}
      className={clsx(className)}
    >
      {value}
    </OsdsText>
  );

export default PriceLabel;

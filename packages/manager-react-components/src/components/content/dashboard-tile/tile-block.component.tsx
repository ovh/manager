/**
 * @deprecated use ManagerTile instead
 * TileBlock is a deprecated component, It will be removed in MRC V3
 */
import { PropsWithChildren } from 'react';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsText } from '@ovhcloud/ods-components/react';
import { HelpIconWithTooltip } from '../ManagerTile/help-icon-with-tooltip';

/**
 * TileBlock
 * @deprecated component, use ManagerTile instead.
 */
export type TileBlockOptions = {
  label?: string;
  labelTooltip?: string;
};

/**
 * TileBlock
 * @deprecated component, use ManagerTile instead.
 */
export type TileBlockProps = PropsWithChildren<TileBlockOptions>;

/**
 * TileBlock
 * @deprecated component, use ManagerTile instead.
 */
export const TileBlock = ({
  label,
  labelTooltip,
  children,
}: TileBlockProps) => (
  <dl className="flex flex-col gap-1 m-0">
    <dt>
      {label && (
        <div className="flex items-center gap-2">
          <OdsText preset={ODS_TEXT_PRESET.heading6}>{label}</OdsText>
          {labelTooltip && <HelpIconWithTooltip label={labelTooltip} />}
        </div>
      )}
    </dt>
    <dd className="m-0">{children}</dd>
  </dl>
);

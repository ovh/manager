import { PropsWithChildren } from 'react';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsText } from '@ovhcloud/ods-components/react';
import { HelpIconWithTooltip } from '../ManagerTile/help-icon-with-tooltip';

export type TileBlockOptions = {
  label?: string;
  labelTooltip?: string;
};

export type TileBlockProps = PropsWithChildren<TileBlockOptions>;

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

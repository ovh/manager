import {
  RadioGroup,
  Table,
  TableProp,
  TABLE_SIZE,
  TABLE_VARIANT,
  Text,
  Radio,
  RadioControl,
  BADGE_SIZE,
  Badge,
  BADGE_COLOR,
  Icon,
} from '@ovhcloud/ods-react';
import clsx from 'clsx';
import { FlavorsTableTr } from '@/components/flavorsTable/FlavorsTableTr.component';
import { ComponentType, MouseEventHandler } from 'react';
import { DeploymentModeBadge } from '../deploymentModeBadge/DeploymentModeBadge.component';
import { handleClick } from '@ovh-ux/manager-react-components';
import { TDeploymentMode } from '@/types/instance/common.type';

export type TableRow = {
  name: string;
  memory: string;
  vcore: string;
  storage: string;
  priceHour: string;
  priceMonth: string;
  unavailable: boolean;
  mode: TDeploymentMode;
};

type TTrProps<T> = {
  row: T;
  className?: string;
  contentClassName?: string;
  onClick?: () => void;
};

export const FlavorTr = ({
  className,
  contentClassName,
  row,
  onClick,
}: TTrProps<TableRow>) => (
  <tr {...(className && { className })} onClick={onClick}>
    <th {...(contentClassName && { className: contentClassName })}>
      <Radio disabled={row.unavailable} value={row.name} className={'w-full'}>
        <RadioControl />
      </Radio>
    </th>
    <td {...(contentClassName && { className: contentClassName })}>
      <div className="flex flex-row gap-4 w-full h-full flex-wrap items-center content-start">
        <Text className={'font-normal'}>{row.name}</Text>
        <Badge
          size={BADGE_SIZE.sm}
          color={BADGE_COLOR.warning}
          className="h-fit text-wrap font-normal"
        >
          Quota indisponible
          <Icon aria-label="Info" name="circle-info" role="img" />
        </Badge>
      </div>
    </td>
    <td {...(contentClassName && { className: contentClassName })}>
      {row.memory}
    </td>
    <td {...(contentClassName && { className: contentClassName })}>
      {row.vcore}
    </td>
    <td {...(contentClassName && { className: contentClassName })}>
      {row.storage}
    </td>
    <td {...(contentClassName && { className: contentClassName })}>
      <DeploymentModeBadge mode={row.mode} size={BADGE_SIZE.sm} />
    </td>
    <td {...(contentClassName && { className: contentClassName })}>
      {row.priceHour}
    </td>
    <td {...(contentClassName && { className: contentClassName })}>
      {row.priceMonth}
    </td>
  </tr>
);

export type TableColumn = {
  key: string;
  label?: React.ReactNode;
};

type TData = { name: string; unavailable: boolean };

export type TFlavorsTableProps<T extends TData> = TableProp &
  React.HTMLAttributes<HTMLTableElement> & {
    caption: string;
    columns: TableColumn[];
    rows: T[];
    selectable?: boolean;
    TrChildren: ComponentType<TTrProps<T>>;
    onClick?: MouseEventHandler<HTMLTableRowElement>;
  };

// eslint-disable-next-line react/no-multi-comp
export const FlavorsTable = <T extends TData>({
  caption,
  columns,
  rows,
  className,
  selectable = false,
  size = TABLE_SIZE.md,
  variant = TABLE_VARIANT.default,
  TrChildren,
}: TFlavorsTableProps<T>) => {
  const baseClasses = clsx(
    'min-w-full border-separate border-spacing-0',

    '[&>tbody>tr:last-child>td]:border-b [&>tbody>tr:last-child>th]:border-b',

    '[&>thead>tr>th:first-child]:sticky [&>thead>tr>th:first-child]:left-0 [&>thead>tr>th:first-child]:z-30 [&>thead>tr>th:first-child]:w-[32px]',
    '[&>tbody>tr>td:first-child]:sticky [&>tbody>tr>td:first-child]:left-0 [&>tbody>tr>td:first-child]:z-20 [&>thead>tr>th:first-child]:w-[32px]',

    selectable && [
      '[&>thead>tr>th:first-child]:w-[32px] [&>tbody>tr>td:first-child]:w-[32px]',
      '[&>thead>tr>th:nth-child(2)]:sticky [&>tbody>tr>th[scope=row]]:sticky',
      '[&>thead>tr>th:nth-child(2)]:left-[32px] [&>tbody>tr>th[scope=row]]:left-[32px]',
      '[&>thead>tr>th:nth-child(2)]:z-20 [&>tbody>tr>th[scope=row]]:z-10',
    ],
    className,
  );

  const colHeaderClasses =
    'text-left border-l-0 first:border-l first:border-r-0 [&_*]:text-[--ods-color-heading] *:font-semibold';

  const rowClasses = clsx({
    'group cursor-pointer': selectable,
  });

  const cellClasses = clsx({
    'bg-white group-hover:border-[--ods-color-primary-600] text-left': selectable,
  });

  return (
    <div className="overflow-x-auto max-w-full">
      <RadioGroup onValueChange={(v) => console.log('v', v)}>
        <Table size={size} variant={variant} className={baseClasses}>
          <caption className={'sr-only'}>{caption}</caption>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key} scope="col" className={colHeaderClasses}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <TrChildren
                key={row.name}
                row={row}
                className={clsx({
                  'group cursor-pointer': selectable,
                  'hover:cursor-not-allowed [&_*]:bg-[--ods-color-neutral-100] [&_*]:text-neutral-500 [&_[class^=_badge]]:bg-[--ods-color-neutral-500]':
                    row.unavailable,
                })}
                contentClassName={cellClasses}
              />
            ))}
          </tbody>
        </Table>
      </RadioGroup>
    </div>
  );
};

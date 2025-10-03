import {MouseEventHandler, PropsWithChildren} from 'react';

type TFlavorsTableTrProps = React.HTMLAttributes<HTMLTableRowElement> & PropsWithChildren<{
  className?: string;
  onClick?: MouseEventHandler<HTMLTableRowElement>;
}>;

export const FlavorsTableTr = ({ children, className, onClick }: TFlavorsTableTrProps) => (
  <tr className={className} onClick={onClick}>{children}</tr>
);

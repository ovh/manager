import { OdsIconName } from 'ods-18';
import './style.scss';
import { ComponentProps } from 'react';
import clsx from 'clsx';

type Props = ComponentProps<'span'> & { name: OdsIconName };

export const Icon = ({ name, className, ...spanProps }: Props) => (
  <span className={clsx(`icon icon--${name}`, className)} {...spanProps} />
);

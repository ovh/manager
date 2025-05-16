import React, { ReactNode } from 'react';
import { HeaderMdx } from '@storybook/blocks';
import stylesHeading from './sb-heading.module.css';

type Props = {
  children?: ReactNode;
  label: string;
  level: number;
};

const StorybookHeading = ({ children, label, level }: Props) => {
  const tagID = label.toLowerCase().replace(/[^a-z0-9]/gi, '-');

  return (
    <HeaderMdx
      className={stylesHeading[`heading-${level}`]}
      as={`h${level}`}
      id={tagID}
    >
      {label} {children}
    </HeaderMdx>
  );
};

export default StorybookHeading;

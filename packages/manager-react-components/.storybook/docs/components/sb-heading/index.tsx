import React, { type ReactNode } from 'react';
import { ODS_DIVIDER_SPACING } from '@ovhcloud/ods-components';
import { OdsDivider } from '@ovhcloud/ods-components/react';
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
    <>
      {/* @ts-ignore to fix when extra time */}
      <HeaderMdx
        className={stylesHeading[`heading-${level}`]}
        as={`h${level}`}
        id={tagID}
      >
        {label} {children}
      </HeaderMdx>

      {/* {level < 3 && (
        <OdsDivider
          spacing={
            level === 1 ? ODS_DIVIDER_SPACING._32 : ODS_DIVIDER_SPACING._16
          }
        />
      )} */}
    </>
  );
};

export default StorybookHeading;

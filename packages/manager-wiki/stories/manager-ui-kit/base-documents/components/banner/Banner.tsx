import { useOf } from '@storybook/blocks';
import { type ModuleExports } from '@storybook/types';
import React from 'react';
import styles from './banner.module.css';

const Banner = ({
  of,
  label,
  section,
}: {
  of?: ModuleExports;
  label?: string;
  section?: string;
}) => {
  let title = label;
  let subtitle = section;

  if (of) {
    const resolvedOf = useOf(of || 'story', ['meta']);
    const metaTitle = resolvedOf.preparedMeta.title;
    const metaTitles = metaTitle.split('/');

    title = label || metaTitles[metaTitles.length - 1];
    subtitle = section || metaTitles.slice(0, -1).join(' / ');
  }

  return (
    <div className={styles.banner}>
      <span>{subtitle}</span>

      <h1>{title}</h1>
    </div>
  );
};

export {
  Banner,
};

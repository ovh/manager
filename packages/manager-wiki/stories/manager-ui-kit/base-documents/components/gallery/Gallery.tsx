import { Card, CARD_COLOR } from '@ovhcloud/ods-react';
import { Canvas } from '@storybook/blocks';
import { type ModuleExport } from '@storybook/types';
import React from 'react';
import { STORY } from '../../constants/meta';
import { StorybookLink } from '../storybookLink/StorybookLink';
import styles from './gallery.module.css';

type Props = {
  components: {
    kind: string;
    name: string;
    story: ModuleExport;
  }[];
};

const Gallery = ({ components }: Props) => {
  return (
    <div className={ styles.gallery }>
      {
        components.map((component, idx) => (
          <Card
            className={ styles['gallery__item'] }
            color={ CARD_COLOR.neutral }
            key={ idx }>
            <Canvas
              className={ styles['gallery__item__preview'] }
              of={ component.story }
              sourceState="none" />

            <StorybookLink
              className={ styles['gallery__item__title'] }
              kind={ component.kind }
              story={ STORY.documentation }>
              { component.name }
            </StorybookLink>
          </Card>
        ))
      }
    </div>
  );
};

export {
  Gallery,
};

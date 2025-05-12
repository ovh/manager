import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { OdsLink } from '@ovhcloud/ods-components/react';
import { Table } from '@storybook/components';
import React, { Fragment, ReactNode } from 'react';
import { StorybookLink } from '../storybook-link';
import styles from './sb-identity-card.module.css';

type Prop = {
  aliases?: string[];
  children?: ReactNode;
  githubUrl: string;
  name: string;
  relatedComponents: { name: string; subtitle?: string; href?: string }[];
};

const StorybookIdentityCard = ({
  aliases = [],
  children,
  githubUrl,
  name,
  relatedComponents,
}: Prop) => {
  return (
    <div className={styles['identity-card']}>
      <div>{children || ''}</div>
      <Table className={styles['identity-card__table']}>
        <tbody>
          <tr>
            <th scope="row">Name</th>
            <td>{name}</td>
          </tr>
          {aliases?.length > 0 && (
            <tr>
              <th scope="row">Also known as</th>
              <td>{aliases.length > 0 ? aliases.join(', ') : '-'}</td>
            </tr>
          )}
          <tr>
            <th scope="row">Related component(s)</th>
            <td>
              {relatedComponents.length > 0
                ? relatedComponents.map((relatedComponent, idx) => (
                    <Fragment key={idx}>
                      <StorybookLink
                        label={relatedComponent.name}
                        story="test"
                        href={relatedComponent.href}
                      />

                      {idx < relatedComponents.length - 1 && <span>, </span>}
                    </Fragment>
                  ))
                : '-'}
            </td>
          </tr>
          <tr>
            <th scope="row">Links</th>
            <td>
              <OdsLink
                className={styles['identity-card__app-link']}
                href={githubUrl}
                icon={ODS_ICON_NAME.externalLink}
                label="Github"
                target="_blank"
              />
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

export default StorybookIdentityCard;

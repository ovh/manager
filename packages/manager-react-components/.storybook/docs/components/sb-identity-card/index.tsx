import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { OdsLink } from '@ovhcloud/ods-components/react';
import { Table } from '@storybook/components';
import React, { Fragment, type ReactNode } from 'react';
// import { ATOMIC_TYPE } from '../../constants/atomicDesign';
// import { SECTION, STORY } from '../../constants/meta';
import { StorybookLink } from '../storybook-link';
import styles from './sb-identity-card.module.css';

// function getAtomicTypeDocUrl(type: ATOMIC_TYPE): string {
//   switch (type) {
//     case ATOMIC_TYPE.atom:
//       return 'https://atomicdesign.bradfrost.com/chapter-2/#atoms';
//     case ATOMIC_TYPE.molecule:
//       return 'https://atomicdesign.bradfrost.com/chapter-2/#molecules';
//     case ATOMIC_TYPE.organism:
//       return 'https://atomicdesign.bradfrost.com/chapter-2/#organisms';
//     case ATOMIC_TYPE.quark:
//       return 'https://bradfrost.com/blog/post/extending-atomic-design';
//     default:
//       return '';
//   }
// }

type Prop = {
  aliases: string[];
  //   atomicType: ATOMIC_TYPE;
  atomicType: any;
  children?: ReactNode;
  figmaLink: string;
  githubUrl: string;
  name: string;
  relatedComponents: { name: string; subtitle?: string }[];
};

const StorybookIdentityCard = ({
  aliases,
  atomicType,
  children,
  figmaLink,
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
          <tr>
            <th scope="row">Also known as</th>
            <td>{aliases.length > 0 ? aliases.join(', ') : '-'}</td>
          </tr>
          <tr>
            <th scope="row">Atomic type</th>
            <td>
              <OdsLink
                className={styles['identity-card__atomic-link']}
                // href={getAtomicTypeDocUrl(atomicType)}
                href="fuark"
                icon={ODS_ICON_NAME.externalLink}
                label={atomicType}
                target="_blank"
              />
            </td>
          </tr>
          <tr>
            <th scope="row">Related component(s)</th>
            <td>
              {relatedComponents.length > 0
                ? relatedComponents.map((relatedComponent, idx) => (
                    <Fragment key={idx}>
                      <StorybookLink
                        // kind={`${SECTION.odsComponents}/${
                        //   !!relatedComponent.subtitle
                        //     ? `${relatedComponent.subtitle}/`
                        //     : ''
                        // }${relatedComponent.name}`}
                        label={relatedComponent.name}
                        // story={STORY.documentation}
                        story="coucou"
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
                href={figmaLink}
                icon={ODS_ICON_NAME.externalLink}
                label="Design"
                target="_blank"
              />
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

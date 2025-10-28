import { Table } from '@storybook/components';
import React, { type ReactNode, useMemo } from 'react';
import { ExternalLink } from '../externalLink/ExternalLink';
import styles from './identityCard.module.css';

const LAST_NON_REACT_VERSION = 18;
const PREVIOUS_MAJOR_FULL_VERSION = '19';
const PREVIOUS_MAJOR = parseInt(PREVIOUS_MAJOR_FULL_VERSION, 10);
const DOC_PATH_PREFIX = PREVIOUS_MAJOR > LAST_NON_REACT_VERSION ? 'react' : 'ods';
const PREVIOUS_MAJOR_DOC_URL = `https://ovh.github.io/design-system/v${PREVIOUS_MAJOR_FULL_VERSION}`;
const PREVIOUS_FORM_ELEMENTS = ['checkbox', 'clipboard', 'combobox', 'datepicker', 'file-upload', 'form-field', 'input', 'password', 'phone-number', 'quantity', 'radio', 'range', 'select', 'switch', 'textarea', 'timepicker', 'toggle'];

type Prop = {
  aliases: string[],
  children?: ReactNode,
  figmaLink: string,
  githubUrl: string,
  name: string,
  startingVersion?: number,
}

const IdentityCard = ({ aliases, children, figmaLink, githubUrl, name, startingVersion }: Prop) => {
  const previousVersionUrl = useMemo(() => {
    if (startingVersion && startingVersion >= PREVIOUS_MAJOR) {
      return '';
    }

    const uriName = name.toLowerCase().replace(' ', '-');
    const suffix = PREVIOUS_FORM_ELEMENTS.indexOf(uriName) > -1 && (!startingVersion || startingVersion <= LAST_NON_REACT_VERSION) ? '-form-elements' : '';
    return `${PREVIOUS_MAJOR_DOC_URL}/?path=/docs/${DOC_PATH_PREFIX}-components${suffix}-${uriName}--documentation`;
  }, [name]);

  return (
    <div className={ styles['identity-card'] }>
      <div>
        { children || '' }
      </div>

      <Table className={ styles['identity-card__table'] }>
        <tbody>
        <tr>
          <th scope="row">
            Name
          </th>

          <td>
            { name }
          </td>
        </tr>

        <tr>
          <th scope="row">
            Also known as
          </th>

          <td>
            { aliases.length > 0 ? aliases.join(', ') : '-' }
          </td>
        </tr>

        <tr>
          <th scope="row">
            Links
          </th>

          <td>
            <ExternalLink className={ styles['identity-card__app-link'] }
                     href={ figmaLink }>
              Design
            </ExternalLink>

            <ExternalLink className={ styles['identity-card__app-link'] }
                     href={ githubUrl }>
              Github
            </ExternalLink>

            {
              previousVersionUrl &&
              <ExternalLink className={ styles['identity-card__app-link'] }
                            href={ previousVersionUrl }>
                Previous major version
              </ExternalLink>
            }
          </td>
        </tr>
        </tbody>
      </Table>
    </div>
  );
};

export { IdentityCard };

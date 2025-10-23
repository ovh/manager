import { Icon, ICON_NAME } from '@ovhcloud/ods-react';
import { CodeOrSourceMdx } from '@storybook/blocks';
import { Table } from '@storybook/components';
import React, { type JSX, useMemo } from 'react';
import { ExternalLink } from '../externalLink/ExternalLink';
import { Heading } from '../heading/Heading';
import { type Component, removeTags } from '../../helpers/docgen';
import styles from './classModule.module.css';

type ClassModuleProp = {
  component: Component;
  extraInfo?: Record<
    string,
    {
      extendAttribute: {
        name: string;
        url: string;
      };
    }
  >;
};

const COLUMNS = ['Property', 'Type', 'Required', 'Default value', 'Description'];

const ClassModule = ({ component, extraInfo }: ClassModuleProp): JSX.Element => {
  const extraAttributeInfo = useMemo(() => {
    if (extraInfo) {
      const componentInfo = Object.entries(extraInfo)
        .filter(([key]) => key === component.name)
        .map(([_, value]) => value);

      return componentInfo?.length ? componentInfo[0].extendAttribute : undefined;
    }
  }, [component, extraInfo]);

  const props = useMemo(() => {
    return (component.props || []).sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
  }, [component]);

  return (
    <>
      <Heading label={ component.name } level={ 2 } />

      {
        (props.length <= 0 && !extraAttributeInfo) ?
          <p>
            This component has no specific properties.
          </p> :
          <Table>
            <thead className={ styles['class-module__properties__header'] }>
              <tr>
                {
                  COLUMNS.map((column) => (
                    <td key={ column }>
                      { column }
                    </td>
                  ))
                }
              </tr>
            </thead>

            <tbody className={ styles['class-module__properties__body'] }>
              {
                extraAttributeInfo &&
                <tr>
                  <td
                    className={ styles['class-module__properties__body__extend'] }
                    colSpan={ COLUMNS.length }>
                    This component extends all the native <ExternalLink href={ extraAttributeInfo.url }>{ extraAttributeInfo.name } attributes</ExternalLink>.
                  </td>
                </tr>
              }

              {
                props.map((prop, idx) => (
                  <tr key={ idx }>
                    <td>
                      { prop.name }
                    </td>

                    <td>
                      <CodeOrSourceMdx>
                        { prop.type }
                      </CodeOrSourceMdx>
                    </td>

                    <td className={ styles['class-module__properties__body__is-required'] }>
                      {
                        prop.isOptional ? '-' :
                          <Icon aria-label="Required"
                                className={ styles['class-module__properties__body__is-required--required'] }
                                name={ ICON_NAME.check }
                                role="img" />
                      }
                    </td>

                    <td>
                      <CodeOrSourceMdx>
                        {
                          prop.defaultValue === undefined ?
                            <div className={ styles['class-module__properties__body__default-value'] }>undefined</div> :
                            prop.defaultValue
                        }
                      </CodeOrSourceMdx>
                    </td>

                    <td>
                      { removeTags(prop.description) || '-' }
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </Table>
      }
    </>
  );
};

export {
  ClassModule,
  type ClassModuleProp,
};

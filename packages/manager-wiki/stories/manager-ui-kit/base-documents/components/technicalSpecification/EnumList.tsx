import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@ovhcloud/ods-react';
import { CodeOrSourceMdx } from '@storybook/blocks';
import React, { type JSX } from 'react';
import { type TypedocEnumMember } from '../../helpers/typedoc';
import styles from './enumList.module.css';

type Props = {
  className?: string;
  enums: TypedocEnumMember[];
};

const MAX_VISIBLE_ITEMS = 10;

function renderList(enums: TypedocEnumMember[], className?: string): JSX.Element {
  return (
    <ul className={ className }>
      {
        enums.map((member, i) => (
          <li key={ i }>
            <span className={ styles['enum-list__name'] }>
              { member.name } =
            </span>

            <CodeOrSourceMdx>
              { typeof member.value === 'number' ? member.value : `"${member.value}"` }
            </CodeOrSourceMdx>
          </li>
        ))
      }
    </ul>
  );
}

const EnumList = ({ className, enums }: Props): JSX.Element => {
  if (enums.length > MAX_VISIBLE_ITEMS) {
    return (
      <Accordion>
        <AccordionItem value="1">
          <AccordionTrigger>
            See all values
          </AccordionTrigger>
          <AccordionContent>
            { renderList(enums, className) }
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );
  }

  return renderList(enums, className);
}

export {
  EnumList,
};


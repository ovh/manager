import { Table } from '@storybook/components';
import React from 'react';
import styles from './tokensTable.module.css';

interface TokenTableProps {
  category: string;
  tokens: Array<{
    name: string;
    preview: React.ReactNode;
    value: string;
  }>;
}

const TokensTable: React.FC<TokenTableProps> = ({ tokens }) => {
  return (
    <Table className={ styles['tokens-table'] }>
      <thead>
        <tr className={ styles['tokens-table__header__row'] }>
          <th className={ styles['tokens-table__header__row__header-cell'] }>
            Token
          </th>

          <th className={ styles['tokens-table__header__row__header-cell'] }>
            Value
          </th>

          <th className={ `${styles['tokens-table__header__row__header-cell']} ${styles['tokens-table__header__row__header-cell--centered']}` }>
            Preview
          </th>
        </tr>
      </thead>

      <tbody className={ styles['tokens-table__body'] }>
        {
          tokens.map((token) => (
            <tr
              className={ styles['tokens-table__body__row'] }
              key={ token.name }>
              <td className={ styles['tokens-table__body__row__cell'] }>
                <span className={ styles['tokens-table__body__row__cell__name'] }>
                  { token.name }
                </span>
              </td>

              <td className={ styles['tokens-table__body__row__cell'] }>
                <span className={ styles['tokens-table__body__row__cell__value'] }>
                  { token.value }
                </span>
              </td>

              <td className={ styles['tokens-table__body__row__preview'] }>
                { token.preview }
              </td>
            </tr>
          ))
        }
      </tbody>
    </Table>
  );
};

export {
  TokensTable,
};

import { Table } from '@storybook/components';
import React, { ReactNode } from 'react';
import styles from './sb-best-practices.module.css';

type Props = {
  donts: ReactNode[];
  dos: ReactNode[];
};

const StorybookBestPractices = ({ donts, dos }: Props) => {
  return (
    <div>
      {dos && dos.length > 0 && (
        <Table className={styles['best-practices__do-table']}>
          <thead>
            <tr>
              <th className={styles['best-practices__do-table__cell']}>
                ✅ Do
              </th>
            </tr>
          </thead>

          <tbody>
            {dos.map((item, idx) => (
              <tr key={idx}>
                <td className={styles['best-practices__do-table__cell']}>
                  {item}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {donts && donts.length > 0 && (
        <Table className={styles['best-practices__dont-table']}>
          <thead>
            <tr>
              <th className={styles['best-practices__dont-table__cell']}>
                ❌ Don't
              </th>
            </tr>
          </thead>

          <tbody>
            {donts.map((item, idx) => (
              <tr key={idx}>
                <td className={styles['best-practices__dont-table__cell']}>
                  {item}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default StorybookBestPractices;

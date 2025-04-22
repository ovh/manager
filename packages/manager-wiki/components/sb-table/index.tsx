import React from 'react';
import styles from './sb-table.module.css';

const StorybookTable = ({ data }: any) => {
  if (!data || !data.columns || !data.rows) {
    return <p>No data provided</p>;
  }
  return (
    <table className={styles['sb-table']}>
      <thead>
        <tr>
          {data.columns.map((col: any, index: any) => (
            <th key={index}>{col}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.rows.map((row: any, rowIndex: any) => (
          <tr key={rowIndex}>
            {data.columns.map((col, colIndex) => (
              <td key={colIndex}>{row[col] || '-'}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default StorybookTable;

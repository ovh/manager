import { Badge, BADGE_COLOR } from '@ovhcloud/ods-react';
import { CodeOrSourceMdx, Markdown } from '@storybook/blocks';
import { Table } from '@storybook/components';
import React, { type ReactNode } from 'react';

type ItemStatus = 'removed' | 'updated';

type Props = {
  items: {
    formerName: string,
    replacement: string,
    status: ItemStatus,
  }[],
}

function renderBadge(status: ItemStatus): ReactNode {
  const isRemoved = status === 'removed';

  return (
    <Badge
      color={ isRemoved ? BADGE_COLOR.critical : BADGE_COLOR.information }
      size="sm">
      { isRemoved ? 'Removed' : 'Updated' }
    </Badge>
  )
}

const TokenMigrationTable = ({ items }: Props) => {
  return (
    <Table>
      <thead>
        <tr>
          <th>Former name</th>
          <th>Status</th>
          <th>New name</th>
        </tr>
      </thead>

      <tbody>
        {
          items.map((item, idx) => (
            <tr key={ idx }>
              <td>
                <CodeOrSourceMdx>
                  { item.formerName }
                </CodeOrSourceMdx>
              </td>

              <td>
                { renderBadge(item.status) }
              </td>

              <td>
                <Markdown>
                  {`${item.replacement}`}
                </Markdown>
              </td>
            </tr>
          ))
        }
      </tbody>
    </Table>
  );
};

export {
  TokenMigrationTable,
};

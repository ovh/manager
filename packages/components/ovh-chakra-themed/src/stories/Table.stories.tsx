import { Table, TableContainer, Thead, Tr, Th, Tbody, Td, Tfoot } from '@chakra-ui/react';
import { ComponentMeta } from '@storybook/react';

export default {
  title: 'Example/Tables',
  component: Table,
} as ComponentMeta<typeof Table>;

const TemplateTable = () => (
  <TableContainer>
    <Table>
      <Thead>
        <Tr>
          <Th>Header</Th>
          <Th>Header</Th>
          <Th>Header</Th>
          <Th>Header</Th>
        </Tr>
      </Thead>
      <Tbody>
        <Tr>
          <Td>Column</Td>
          <Td>Column</Td>
          <Td>Column</Td>
          <Td>Column</Td>
        </Tr>
        <Tr>
          <Td>Column</Td>
          <Td>Column</Td>
          <Td>Column</Td>
          <Td>Column</Td>
        </Tr>
        <Tr>
          <Td>Column</Td>
          <Td>Column</Td>
          <Td>Column</Td>
          <Td>Column</Td>
        </Tr>
        <Tr>
          <Td>Column</Td>
          <Td>Column</Td>
          <Td>Column</Td>
          <Td>Column</Td>
        </Tr>
        <Tr>
          <Td>Column</Td>
          <Td>Column</Td>
          <Td>Column</Td>
          <Td>Column</Td>
        </Tr>
      </Tbody>
      <Tfoot>
        <Tr>
          <Th>Footer</Th>
          <Th>Footer</Th>
          <Th>Footer</Th>
          <Th>Footer</Th>
        </Tr>
      </Tfoot>
    </Table>
  </TableContainer>
);

export const Basic = TemplateTable.bind({});

import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Table } from '@/components';

describe('Table Snapshot tests', () => {
  it('renders the component with default props and children', () => {
    const { container } = render(
      <>
        <Table>
          <caption>Front-end web developer course 2021</caption>
          <thead>
            <tr>
              <th scope="col">Person</th>
              <th scope="col">Most interest in</th>
              <th scope="col">Age</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Chris</th>
              <td>HTML tables</td>
              <td>22</td>
            </tr>
            <tr>
              <th scope="row">Dennis</th>
              <td>Web accessibility</td>
              <td>45</td>
            </tr>
            <tr>
              <th scope="row">Sarah</th>
              <td>JavaScript frameworks</td>
              <td>29</td>
            </tr>
            <tr>
              <th scope="row">Karen</th>
              <td>Web performance</td>
              <td>36</td>
            </tr>
          </tbody>
        </Table>
        <Table size="sm">
          <caption>Front-end web developer course 2021</caption>
          <thead>
            <tr>
              <th scope="col">Person</th>
              <th scope="col">Most interest in</th>
              <th scope="col">Age</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Chris</th>
              <td>HTML tables</td>
              <td>22</td>
            </tr>
            <tr>
              <th scope="row">Dennis</th>
              <td>Web accessibility</td>
              <td>45</td>
            </tr>
            <tr>
              <th scope="row">Sarah</th>
              <td>JavaScript frameworks</td>
              <td>29</td>
            </tr>
            <tr>
              <th scope="row">Karen</th>
              <td>Web performance</td>
              <td>36</td>
            </tr>
          </tbody>
        </Table>
        <Table size="md">
          <caption>Front-end web developer course 2021</caption>
          <thead>
            <tr>
              <th scope="col">Person</th>
              <th scope="col">Most interest in</th>
              <th scope="col">Age</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Chris</th>
              <td>HTML tables</td>
              <td>22</td>
            </tr>
            <tr>
              <th scope="row">Dennis</th>
              <td>Web accessibility</td>
              <td>45</td>
            </tr>
            <tr>
              <th scope="row">Sarah</th>
              <td>JavaScript frameworks</td>
              <td>29</td>
            </tr>
            <tr>
              <th scope="row">Karen</th>
              <td>Web performance</td>
              <td>36</td>
            </tr>
          </tbody>
        </Table>
        <Table size="lg">
          <caption>Front-end web developer course 2021</caption>
          <thead>
            <tr>
              <th scope="col">Person</th>
              <th scope="col">Most interest in</th>
              <th scope="col">Age</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Chris</th>
              <td>HTML tables</td>
              <td>22</td>
            </tr>
            <tr>
              <th scope="row">Dennis</th>
              <td>Web accessibility</td>
              <td>45</td>
            </tr>
            <tr>
              <th scope="row">Sarah</th>
              <td>JavaScript frameworks</td>
              <td>29</td>
            </tr>
            <tr>
              <th scope="row">Karen</th>
              <td>Web performance</td>
              <td>36</td>
            </tr>
          </tbody>
        </Table>
      </>,
    );
    expect(container).toMatchSnapshot();
  });
});

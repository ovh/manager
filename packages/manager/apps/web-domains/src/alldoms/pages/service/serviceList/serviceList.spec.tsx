import '@/alldoms/setupTests';
import { render } from '@testing-library/react';
import React from 'react';
import ServiceList from './serviceList';
import { wrapper } from '@/alldoms/utils/test.provider';

describe('AllDom datagrid', () => {
  it('display the datagrid', async () => {
    const { getByTestId } = render(<ServiceList />, { wrapper });
    expect(getByTestId('datagrid')).toBeInTheDocument();
  });
});

import { describe, expect } from 'vitest';
import {
  mockedStructuredForm,
  mockedValues,
} from '@/mocks/installationForm.mock';
import { formMappers } from './formMappers';

describe('formMappers.toStructured test suite', () => {
  it('should map the form to a structured object as wanted by the API', () => {
    const mapped = formMappers.toStructured(mockedValues);

    expect(mapped).toStrictEqual(mockedStructuredForm);
  });
});

describe('formMappers.toFlat test suite', () => {
  it('should map the form to a flat object as wanted by the front-end', () => {
    const mapped = formMappers.toFlat(mockedStructuredForm);

    expect(mapped).toStrictEqual({
      ...mockedValues,
      serviceDisplayName: '',
      datacenterName: '',
      clusterId: null,
    });
  });
});

import { getCountryCode } from '../region';

describe('getCountryCode', () => {
  it('should return the country code that matches a given region code', () => {
    // Given
    const regionCode = 'eu-south-mil';

    // When
    const output = getCountryCode(regionCode);

    // Then
    expect(output).toEqual('it');
  });
});

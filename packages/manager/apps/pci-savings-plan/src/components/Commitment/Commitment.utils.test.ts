import { getDiffInPercent } from './Commitment.utils';

describe('getDiffInPercent', () => {
  it.each`
    referencePrice | discountedPrice | expectedPercentage
    ${200}         | ${100}          | ${'50'}
    ${1386.29}     | ${1056}         | ${'24'}
    ${100}         | ${100}          | ${'0'}
    ${100}         | ${150}          | ${'-50'}
    ${0}           | ${51}           | ${null}
    ${100}         | ${0}            | ${null}
    ${37.376}      | ${31.7696}      | ${'15'}
    ${37.376}      | ${26.1632}      | ${'30'}
    ${1195.01}     | ${1015.7585}    | ${'15'}
    ${2390.02}     | ${2031.517}     | ${'15'}
    ${2987.16}     | ${2091.012}     | ${'30'}
  `(
    'discounts $referencePrice to $discountedPrice as $expectedPercentage',
    ({ referencePrice, discountedPrice, expectedPercentage }) => {
      expect(getDiffInPercent(referencePrice, discountedPrice)).toBe(
        expectedPercentage,
      );
    },
  );
});

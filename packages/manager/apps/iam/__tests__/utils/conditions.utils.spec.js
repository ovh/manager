import IAMConditionsUtils from '../../../../modules/iam/src/utils/conditions.utils';

describe('IAMConditionsUtils test suites', () => {
  it('should format conditions to be compliant with API', () => {
    // given
    const conditions = [
      { values: { 'date(Europe/London).WeekDay.IN': 'Saturday,Sunday' } },
      { values: { 'resource.Tag(environment)': 'prod' } },
      { values: { 'resource.Type': 'dnsZone' } },
    ];

    // expect
    expect(IAMConditionsUtils.parseToAPI(conditions)).toEqual({
      operator: 'AND',
      conditions: [
        {
          values: { 'date(Europe/London).WeekDay.IN': 'Saturday,Sunday' },
          operator: 'MATCH',
        },
        { values: { 'resource.Tag(environment)': 'prod' }, operator: 'MATCH' },
        { values: { 'resource.Type': 'dnsZone' }, operator: 'MATCH' },
      ],
    });
  });

  it('should decode conditions from API raw data', () => {
    // given
    const conditions = {
      operator: 'AND',
      conditions: [
        {
          values: { 'date(Europe/Paris).WeekDay.IN': 'Saturday,Sunday' },
          operator: 'MATCH',
        },
        {
          values: { 'resource.Tag(environment).STARTS_WITH': 'prod' },
          operator: 'MATCH',
        },
        { values: { 'resource.Type.EQ': 'dnsZone' }, operator: 'MATCH' },
        { values: { 'resource.Name': 'name' }, operator: 'MATCH' },
      ],
    };

    expect(IAMConditionsUtils.parseFromAPI(conditions)).toEqual([
      {
        values: { 'date(Europe/Paris).WeekDay.IN': 'Saturday,Sunday' },
        type: 'WeekDay',
        criterion: 'IN',
        conditionType: 'WeekDay',
        value: 'Saturday,Sunday',
        label: 'date(Europe/Paris).WeekDay.IN: Saturday,Sunday',
        id: expect.stringMatching(/^1-\d+$/),
        bracketValue: 'Europe/Paris',
      },
      {
        type: 'Tag',
        criterion: 'STARTS_WITH',
        conditionType: 'Tag(environment)',
        value: 'prod',
        label: 'resource.Tag(environment).STARTS_WITH: prod',
        id: expect.stringMatching(/^2-\d+$/),
        bracketValue: 'environment',
        values: { 'resource.Tag(environment).STARTS_WITH': 'prod' },
      },
      {
        type: 'Type',
        criterion: 'EQ',
        conditionType: 'Type',
        value: 'dnsZone',
        label: 'resource.Type.EQ: dnsZone',
        id: expect.stringMatching(/^3-\d+$/),
        bracketValue: '',
        values: { 'resource.Type.EQ': 'dnsZone' },
      },
      {
        type: 'Name',
        criterion: 'EQ',
        conditionType: 'Name',
        value: 'name',
        label: 'resource.Name: name',
        id: expect.stringMatching(/^4-\d+$/),
        bracketValue: '',
        values: { 'resource.Name': 'name' },
      },
    ]);
  });
});

const defaultUser = {
  firstname: 'Tester',
  name: 'testee',
  supportLevel: {
    level: '1',
  },
  country: 'FR',
};

const universe = 'web';

module.exports = {
  useAuthentication: () => ({
    subsidiary: 'fr_FR',
  }),
  useEnvironment: () => ({
    getRegion: () => 'FR',
    getUser: () => defaultUser,
    getUniverse: () => universe,
    getUserLocale: () => 'fr-FR',
  }),
};

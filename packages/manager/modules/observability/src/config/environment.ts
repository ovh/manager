// Environment configuration to control mock vs real API usage
const USE_MOCKS = import.meta.env.VITE_USE_MOCKS;
export const config = {
  // Set to true to use mock data, false to use real APIs
  useMocks: USE_MOCKS === 'true',
};

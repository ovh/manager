// Environment configuration to control mock vs real API usage
export const config = {
  // Set to true to use mock data, false to use real APIs
  useMocks:
    process.env.NODE_ENV === 'development' || process.env.USE_MOCKS === 'true',
};

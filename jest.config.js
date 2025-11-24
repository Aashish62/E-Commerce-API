// // jest.config.js
// export default {
//   testEnvironment: 'node',
//   verbose: true,
//   transform: {},
//   extensionsToTreatAsEsm: ['.js'],
//   moduleNameMapper: {
//     '^(\\.{1,2}/.*)\\.js$': '$1', // resolve relative imports without .js
//   },
// };


// jest.config.js
export default {
  testEnvironment: 'node',
  verbose: true,
  collectCoverage: true,                // enable coverage
  coverageDirectory: './coverage',      // output folder
  coverageReporters: ['html', 'text'], 
  transform: {}, // no transform needed for plain ESM
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1', // resolve relative imports without .js in tests
  },
  testTimeout: 30000, // 30 seconds timeout for database operations
  maxWorkers: 1, // Run tests sequentially to avoid database conflicts
};

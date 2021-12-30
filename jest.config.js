module.exports = {
  verbose: true,
  testURL: "http://localhost/",
  //testEnvironment: 'jsdom',
  testEnvironment:'node',
  //preset:'ts-jest',
  setupFilesAfterEnv: [
    "<rootDir>setupTests.js"
  ]
  //preset:'ts-jest',
  //forceExit:true,

}

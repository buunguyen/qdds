module.exports = (grunt) ->
  path = require "path"
  grunt.loadNpmTasks "grunt-contrib-coffee"
  grunt.loadNpmTasks "grunt-mocha-test"

  grunt.initConfig
    coffee:
      main:
        files:
          "./index.js"    : "./index.coffee"
          "./test/map.js" : "./test/map.coffee"
          "./test/set.js" : "./test/set.coffee"
    mochaTest:
      test:
        options: 
          reporter: "spec"
        src: ["test/**/*.js"]
   grunt.registerTask "default", ["coffee", "mochaTest"]
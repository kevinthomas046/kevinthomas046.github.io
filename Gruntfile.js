'use strict';

module.exports = function (grunt) {
    // Show elapsed time after tasks run
    require('time-grunt')(grunt);
    // Load all Grunt tasks
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            dist: {
                src: [
                    'public/js/**/*.js', '!public/js/script.js', '!public/js/script.min.js'
                ],
                dest: 'public/js/script.js'
            }
        },

        uglify: {
            build: {
                src: 'public/js/script.js',
                dest: 'public/js/script.min.js'
            }
        },

        cssmin: {
            combine: {
                files: {
                    'public/css/style.min.css': ['public/css/poole.css', 'public/css/hyde.css', 'public/css/syntax.css', 'public/css/custom.css', '!public/css/style.min.css']
                }
            }
        },

        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: ['<%= pkg.app.dist %>/*', '.jekyll']
                }]
            }
        },

        watch: {
            options: {
                livereload: true
            },
            scripts: {
                files: ['public/js/**/*.js'],
                tasks: ['concat', 'uglify', 'jekyll:server'],
                options: {
                    spawn: false
                }
            },
            stylesheets: {
                files: ['public/css/*.css'],
                tasks: ['cssmin', 'jekyll:server'],
                options: {
                    spawn: false
                }
            },
            jekyll: {
                files: [
                    '_includes/*.{html,yml,md,mkd,markdown}',
                    '_layouts/*.{html,yml,md,mkd,markdown}',
                    '_posts/*.{html,yml,md,mkd,markdown}'
                ],
                tasks: ['jekyll:server']
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '<%= pkg.app.dist %>/**/*.html'
                ]
            }
        },

        connect: {
            options: {
                port: 9000,
                livereload: 35729,
                // change this to '0.0.0.0' to access the server from outside
                hostname: '0.0.0.0'
            },
            livereload: {
                options: {
                    open: true,
                    base: [
                        '<%= pkg.app.dist %>',
                        '.'
                    ]
                }
            },
            dist: {
                options: {
                    open: true,
                    base: [
                        '<%= pkg.app.dist %>'
                    ]
                }
            },
            test: {
                options: {
                    base: [
                        '.tmp',
                        '<%= pkg.app.dist %>',
                        'test',
                        '.'
                    ]
                }
            }
        },

        jekyll: {
            options: {
                bundleExec: false,
                config: '_config.yml'
            },
            server: {
                options: {
                    config: '_config.yml',
                    dest: '<%= pkg.app.dist %>'
                }
            },
            check: {
                options: {
                    doctor: true
                }
            }
        }

    });

    grunt.registerTask('default', ['concat', 'uglify', 'cssmin', 'clean']);
    // Define Tasks
    grunt.registerTask('serve', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'default',
            'connect:livereload',
            'jekyll:server',
            'watch'
        ]);
    });
}
'use strict';

var gulp = require('gulp');
var Combine = require('stream-combiner');
var fileinclude = require('gulp-file-include');

// load plugins
var $ = require('gulp-load-plugins')();

//Compila arquivos LESS
var lessPath = 'app/styles/less/**/';
gulp.task('styles', function () {
    var combined = Combine (
        gulp.src([lessPath + '*.less', '!' + lessPath + 'utils.less']),
        $.sourcemaps.init(),
        $.less(),
        $.autoprefixer(['last 2 version', '> 1%', 'ie 7', 'ie 8'], {cascade: true}),
        $.sourcemaps.write('./maps'),
        gulp.dest('app/styles')
    );
    combined.on('error', function(err) {
        console.warn(err.message);
    });

    return combined;
});

//Analisa arquivos JS
gulp.task('scripts', function () {
    var combined = Combine(
        gulp.src('app/scripts/**/*.js'),
        $.jshint(),
        $.jshint.reporter(require('jshint-stylish'))
    );
    combined.on('error', function(err) {
        console.warn(err.message);
    });

    return combined;
});

//Injeta arquivos CSS
gulp.task('inject-css', ['include-html','styles'], function () {
    var sources = gulp.src(['app/styles/**/*.css'], {read: false});
    var combined = Combine (
        gulp.src(['app/*.html']),
        $.inject(sources, {
            ignorePath:'/app/',
            addRootSlash:false
        }),
        gulp.dest('app')
    );
    combined.on('error', function(err) {
        console.warn(err.message);
    });

    return combined;
});

//Injeta arquivos JS
gulp.task('inject-js', ['include-html','scripts'], function () {
    var sources = gulp.src(['app/scripts/**/*.js'], {read: false});
    var combined = Combine (
        gulp.src(['app/*.html']),
        $.inject(sources, {
            ignorePath:'/app/',
            addRootSlash:false
        }),
        gulp.dest('app')
    );
    combined.on('error', function(err) {
        console.warn(err.message);
    });

    return combined;
});

//START
gulp.task('kickoff', ['include-html','styles','scripts'], function () {
    var sources = gulp.src(['app/styles/**/*.css', 'app/scripts/**/*.js'], {read: false});
    var combined = Combine (
        gulp.src(['app/*.html']),
        $.inject(sources, {
            ignorePath:'/app/',
            addRootSlash:false
        }),
        gulp.dest('app')
    );
    combined.on('error', function(err) {
        console.warn(err.message);
    });

    return combined;
});

//ADD INITIAL DEPENDENCIES
gulp.task('initdep', ['kickoff'], function () {
    var wiredep = require('wiredep').stream;

    var combined = Combine(
        gulp.src(['app/*.html','!app/templates/*.html']),
        wiredep({
            directory: 'app/bower_components'
            //exclude: [ /bootstrap/ ]
        }),
        gulp.dest('app')
    );
    combined.on('error', function(err) {
        console.warn(err.message);
    });

    return combined;
});


//Inclui os HTML de componentes dentro de templates e copia o resultado na raiz
gulp.task('include-html', function() {
    var combined = Combine(
        gulp.src(['app/templates/*.html']),
        fileinclude({
            prefix: '@@',
            basepath: '@file'
        }),
        gulp.dest('app')
    );
    combined.on('error', function(err) {
        console.warn(err.message);
    });

    return combined;
});

/////////////////
//BUILD TASKS
////////////////

//comprime imagens
gulp.task('images', function () {
    var combined = Combine(
        gulp.src('app/images/**/*'),
        $.cache($.imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        })),
        gulp.dest('dist/images'),
        $.size()
    );
    combined.on('error', function(err) {
        console.warn(err.message);
    });

    return combined;
});

//Copia arquivos tipograficos
gulp.task('fonts', function () {
    var combined = Combine(
        $.bowerFiles(),
        $.filter('app/fonts/**/*.{eot,svg,ttf,woff}'),
        $.flatten(),
        gulp.dest('dist/fonts'),
        $.size()
    );
    combined.on('error', function(err) {
        console.warn(err.message);
    });

    return combined;
});

//Copia arquivos extras para a pasta dist
gulp.task('extras', function () {
    var combined = Combine(
        gulp.src(['app/*.*', '!app/*.html'], { dot: true }),
        gulp.dest('dist')
    );
    combined.on('error', function(err) {
        console.warn(err.message);
    });

    return combined;
});

//limpa a pasta dist
gulp.task('clean', function () {
    var combined = Combine(
        gulp.src(['dist'], { read: false }),
        $.clean()
    );
    combined.on('error', function(err) {
        console.warn(err.message);
    });

    return combined;
});

//cria html compilado e comprime arquivos
gulp.task('html', ['inject-css', 'inject-js'], function () {
    var jsFilter = $.filter('app/scripts/**/*.js');
    var cssFilter = $.filter('app/styles/**/*.css');

    var combined = Combine(
        gulp.src('app/*.html'),
        $.useref.assets({searchPath: 'app'}),
        $.sourcemaps.init(),
        jsFilter,
        $.uglify(),
        jsFilter.restore(),
        $.sourcemaps.write('.'),
        cssFilter,
        $.csso(),
        cssFilter.restore(),
        $.useref.restore(),
        $.useref(),
        gulp.dest('dist'),
        $.size()
    );
    combined.on('error', function(err) {
        console.warn(err.message);
    });

    return combined;
});

gulp.task('start', ['initdep'], function(){
    gulp.start('watch');
});

gulp.task('default', ['clean'], function () {
    gulp.start('build');
});

gulp.task('build', ['html', 'images', 'fonts', 'extras']);


////////////////////////////
///     WATCH OUT
////////////////////////////

gulp.task('connect', function () {
    var connect = require('connect');
    var app = connect()
        .use(require('connect-livereload')({ port: 35729 }))
        .use(connect.static('app'))
        .use(connect.directory('app'));

    require('http').createServer(app)
        .listen(9000)
        .on('listening', function () {
            console.log('Started connect web server on http://localhost:9000');
        });
});

gulp.task('serve', ['connect'], function () {
    require('opn')('http://localhost:9000');
});

// inject bower components
gulp.task('wiredep', function () {
    var wiredep = require('wiredep').stream;

    var combined = Combine(
        gulp.src(['app/*.html','!app/templates/*.html']),
        wiredep({
            directory: 'app/bower_components'
            //exclude: [ /bootstrap/ ]
        }),
        gulp.dest('app')
    );
    combined.on('error', function(err) {
        console.warn(err.message);
    });

    return combined;
});

gulp.task('deploy', function () {

    var combined = Combine (
        gulp.src('dist/*'),
        $.sftp({
            host: '_HOST_',
            user: '_USER',
            pass: '_PASSWORD_',
            remotePath: '_REMOTE_'
        })
    );
    combined.on('error', function(err) {
        console.warn(err.message);
    });

    return combined;
});

gulp.task('watch', ['connect', 'serve'], function () {
    var server = $.livereload();

    // watch for changes

    gulp.watch([
        'app/*.html',
        'app/styles/**/*.css',
        'app/scripts/**/*.js',
        'app/images/**/*'],
        {
            interval: 2000
        }
    )
    .on('change', function (file) {
        server.changed(file.path);
    });

    gulp.watch('app/templates/*.html', ['initdep']);
    gulp.watch('app/components/*.html', ['initdep']);
    gulp.watch('app/styles/less/**/*.less', ['inject-css']);
    gulp.watch('app/scripts/**/*.js', ['inject-js']);
    gulp.watch('bower.json', ['wiredep']);
});

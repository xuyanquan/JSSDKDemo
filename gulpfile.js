var gulp = require('gulp');
var webpack = require('gulp-webpack');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var mcss = require('gulp_mcss');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var spawn = require('child_process').spawn;
var node;

function getBootConfig() {
    return {
        output: {
            filename: 'sdkbootdemo.js',
            libraryTarget: 'umd'
        },
        loaders: [
            { test: /\.ejs$/, loader: 'ejs-loader?variable=data' },
        ],
        plugins: [
            new webpack.webpack.DefinePlugin({
                HTTP_SERVER: JSON.stringify("/server"),
                HTTP_PATH: JSON.stringify("/dist"),
                DEBUG: true
            })
        ]
    };
}

function getConfig() {
    var bootcfg = getBootConfig();
    bootcfg.output.filename = 'sdkdemo.js'
    return bootcfg;
}

gulp.task('browserSync', function() {
    browserSync({
        proxy: 'localhost:8019',
        index: '/demo.html'
    });
});

gulp.task('webpack', function() {
    gulp.src('src/javascript/boot.js')
        .pipe(webpack(getBootConfig()))
        .pipe(gulp.dest('./dist'))
        .on('error', function(err){
            throw err
        });
});

gulp.task('jshint', function() {
    gulp.src(['src/javascript/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
});

gulp.task('uglify', function() {
    gulp.src(['./dist/sdkbootdemo.js'])
        .pipe(uglify())
        .pipe(gulp.dest('./dist/min'));
});

gulp.task('mcss', function(){
    return gulp.src(['src/mcss/*.mcss', '!src/mcss/_*.mcss'])
        .pipe(mcss({
            format: 3,
            importCSS: true
        }))
        .pipe(gulp.dest('dist/'))
});

gulp.task('watch', function() {
    gulp.watch('src/mcss/**/*.mcss', ['mcss']);
    gulp.watch('src/**/*.js', ['jshint', 'webpack', 'uglify']);
    gulp.watch('src/**/*.ejs', ['compx']);
    gulp.watch(['server.js'], function() {
        gulp.run('server');
    });
    gulp.watch([
        'dist/main.css',
        'dist/sdkbootdemo.js'
    ], {cwd: '../JSSDKbootDemo'}).on('change', function() {
        setTimeout(reload, 1000);
    });
});

function publish(opts){

    var bootconfig = getBootConfig();
    var config = getConfig();
    var path = opts.path;

    config.plugins = bootconfig.plugins = [
        new webpack.webpack.DefinePlugin(opts.plugins)
    ];

    gulp.src('src/javascript/boot.js')
        .pipe(webpack(bootconfig))
        .pipe(uglify())
        .pipe(gulp.dest(path))
        .on('error', function(err){
            throw err
        });

    gulp.src('src/javascript/index.js')
        .pipe(webpack(config))
        .pipe(uglify())
        .pipe(gulp.dest(path))
        .on('error', function(err){
            throw err
        });

    gulp.src(['src/mcss/*.mcss', '!src/mcss/_*.mcss'])
        .pipe(mcss({
            format: 3,
            importCSS: true
        }))
        .pipe(gulp.dest(path));

    gulp.src('dist/res/**/*').pipe(gulp.dest(path + '/res'));

}

gulp.task('onlinerun', function () {

    publish({
        path : 'online/dist',
        plugins: {
            HTTP_SERVER: JSON.stringify(""),
            HTTP_PATH: JSON.stringify(""),
            DEBUG: false
        }
    });

});

gulp.task('testrun', function () {
    publish({
        path : 'test/dist',
        plugins: {
            HTTP_SERVER: JSON.stringify(""),
            HTTP_PATH: JSON.stringify(""),
            DEBUG: false
        }
    });
});

gulp.task('prerun', function () {
    publish({
        path : 'pre/dist',
        plugins: {
            HTTP_SERVER: JSON.stringify(""),
            HTTP_PATH: JSON.stringify(""),
            DEBUG: false
        }
    });
});

gulp.task('server', function() {
    node && node.kill();
    node = spawn('node', ['server.js'], {stdio: 'inherit'});
    node.on('close', function(code) {
        if(code === 8) {
            gulp.log('node close, Error detected, waiting for changes...');
        }
    });
});

gulp.task('compx', ['jshint', 'webpack', 'uglify', 'mcss']);

gulp.task('online', ['onlinerun']);

gulp.task('test', ['testrun']);

gulp.task('pre', ['prerun']);

gulp.task('publish', ['prerun', 'testrun', 'onlinerun']);

gulp.task('build', ['server', 'jshint', 'webpack', 'uglify', 'mcss', 'browserSync', 'watch']);

gulp.task('default', ['build']);






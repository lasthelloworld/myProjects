  'use strict';
  var gulp = require('gulp');
  var gutil = require("gulp-util");
  var concat = require("gulp-concat");

  var cssmin = require('gulp-cssmin');
  var uglify = require('gulp-uglify');
  var sourcemaps = require('gulp-sourcemaps');
  var del = require("del");
  var jshint = require('gulp-jshint');
  var bowerFiles = require('main-bower-files');
  var inject = require("gulp-inject");
  var wiredep = require("wiredep").stream;

  var templateCache = require('gulp-angular-templatecache');
  var browserSync = require("browser-sync").create();

  var options = {
      html:['./src/**/*.html'],
      js:['./src/app/**/*.js'],
      css: ['./src/**/*.css'],
      distHtml:['./dist/**/*.html'],
      distJs: ['./dist/**/*.js'],
      distCss: ['./dist/**/*.css'],
      moduleJs:['./src/app/**/*.module.js'],//模块js
      otherJs:['./src/app/**/*.js','!./src/app/**/*.module.js'],//非模块js:指令、服务、控制器
      appModuleJs: ['./src/js/app.module.js'],//启动app模块
      appRouteJs:['./src/js/app.route.js']//启用的路由
  };
  //清空发布
  gulp.task('clean',function(){
      return del(['./dist']);
  });
  //代码检测
  gulp.task('jshint',function(){
        //gulp.src(options.js)
        //    .pipe(jshint())
        //    .pipe(jshint.reporter('inject-source'));
  });

  //会将所有模板文件合并成一个 template.js, 并将其作为项目中的一个 module 而存在
  //gulp.task('template', function () {
  //    return gulp.src('./view/**/*.html')
  //        .pipe(templateCache({module: 'myApp'}))
  //        .pipe(gulp.dest('./js'))
  //});

  //js 压缩合并
  gulp.task("build-js",function(){
          return gulp.src(options.js)
              .pipe(sourcemaps.init())
              .pipe(uglify())
              .pipe(concat('source.min.js'))
              .pipe(sourcemaps.write())
              .pipe(gulp.dest('./dist/js'));
  });

  //css压缩合并
 gulp.task('build-css',function(){
    return gulp.src(options.css)
        .pipe(cssmin())
        .pipe(concat('main.min.css'))
        .pipe(gulp.dest("./dist/css"));
 })

  //加载压缩合并资源js、css、html
  gulp.task('build-source',['build-task','build-css']);

  //打包使用
  gulp.task('build-inject', ['clean', 'jshint', 'template'], function () {
      return gulp.src('./src/index.html')
          .pipe(inject(gulp.src(options.distJs, {read: false}), {relative: true}))
          .pipe(inject(gulp.src(options.distCss, {read: false}), {relative: true}))
          .pipe(inject(gulp.src(bowerFiles(), {read: false}), {name: 'bower', relative: true}))
          .pipe(gulp.dest('./dist'));
  });
  gulp.task('build-start',function(){
      gulp.run('build-source');
      gulp.run('build-inject');
  });

  //注入插件js引用
  gulp.task('inject-bower',function(){
      return gulp.src('./src/index.html')
          .pipe(wiredep({
              optional:'configuration',
              goes:'here'
          }))
          .pipe(gulp.dest('./dist'));
  });

  //注入资源
  gulp.task('inject-source',['clean','jshint'],function () {
      return gulp.src('./src/index.html')
          .pipe(inject(gulp.src(options.css, {read: false}), {relative: true}))
          .pipe(inject(gulp.src(options.moduleJs, {read: false}), {name:"module",relative: true}))
          .pipe(inject(gulp.src(options.otherJs, {read: false}), {name:"other",relative: true}))
          .pipe(inject(gulp.src(options.appModuleJs, {read: false}), {name: 'app',relative:true}))
          .pipe(inject(gulp.src(options.appRouteJs, {read: false}), {name: 'route',relative:true}))
          .pipe(inject(gulp.src(bowerFiles(), {read: false}), {name: 'bower', relative: true}))
          .pipe(gulp.dest('./src'));
  });

  //加载到browserSync中的js、html、css
  gulp.task('load-html',function(){
        gulp.src(options.html)
            .pipe(browserSync.stream());
  });
  gulp.task('load-js',function(){
      gulp.src(options.js)
          .pipe(browserSync.stream());
  });
  gulp.task('load-css',function(){
      gulp.src(options.css)
          .pipe(browserSync.stream());
  });
  gulp.task("watch-source",function(){
        gulp.watch(options.js,['load-js']);
        gulp.watch(options.css,['load-css']);
        gulp.watch(options.html,['load-html']);
  });

  //创建临时服务器
  gulp.task('browser-sync', function() {
      browserSync.init({
          port:4000,
          server: {
              baseDir: "./src", //这里是坑的重点，当时我设置的是 ./dist 后来发现，注入的插件报 404 错误，大家切记啊，一定不要跟我一样二
              index:"./index.html", //默认启动位置
              routes: {
                  "/bower_components": "bower_components" //配置相对工作目录
              }
          }
      });
      gulp.run("watch-source");
  });
  //启动项目
  gulp.task('app-start',['inject-source'],function(){
        gulp.run('browser-sync');
  });

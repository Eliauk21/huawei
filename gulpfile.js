

let {src,dest,watch,parallel,series} = require('gulp');
let sass = require('gulp-sass')(require('sass'));
let autoprefixer = require('gulp-autoprefixer');
let cssmin = require('gulp-cssmin');
let fileinclude = require('gulp-file-include');
let htmlmin = require('gulp-htmlmin');
let babel = require('gulp-babel');
let uglify = require('gulp-uglify');
let webserver = require('gulp-webserver');
let clean = require('gulp-clean');

//清理
function cleanTask(){
  return src('./dist',{allowEmpty:true})
        .pipe(clean())
}

//html
function htmlTask() {
  return src('./src/view/*.html')
    .pipe(fileinclude({
      prefix: '@',   // 默认 @@
      basepath: './src/view/modules'   // 需要进行组合html的文件路径
    }))
    .pipe(dest('./dist/view'));     //dist/html文件自动生成
}

//css
function sassTask() {
  return src('./src/css/*.scss')
    .pipe(sass())
    .pipe(dest('./dist/css'));
}


//开启服务器
function webTask() {
  //http://localhost:8000  === http://localhost:8000/index.html
  src('./dist')
    .pipe(webserver({
      livereload: true,    //浏览器自动刷新
      open: 'view/index.html',      // 启动服务器的时候，自动打开浏览器
    }));
}

//api
function apiTask(){
  return src('./src/api/**')
        .pipe(dest('./dist/api'))
};

//js
function jsTask(){
  return src('./src/js/**')
        .pipe(dest('./dist/js'))
};

//lib
function libTask(){
  return src('./src/lib/**')
        .pipe(dest('./dist/lib'))
};

//static
function staticTask(){
  return src('./src/static/**')
        .pipe(dest('./dist/static'))
};

//watch监听
function watchTask() {
  watch('./src/view/**', htmlTask);
  watch('./src/css/**', sassTask);
  watch('./src/api/**', apiTask);
  watch('./src/js/**', jsTask);
  watch('./src/lib/**', libTask);
  watch('./src/static/**', staticTask);
}

//转普通JS并压缩JS任务
function uglifyTask(){
  return src('./dist/js/**')
          .pipe(babel({
            presets: ['@babel/env']
          }))
          .pipe(uglify())
          .pipe(dest('./dist'))
}

//压缩html任务
function htmlminTask(){
  return src('./dist/view/**')
          .pipe(htmlmin({ 
            collapseWhitespace: true,    //删除空白区域
            minifyCSS: true   //压缩CSS 
          }))
          .pipe(dest('./dist'))
}

//加前缀并压缩css的任务
function cssminTask(){
  return src('./dist/css/**')
          .pipe(autoprefixer())
          .pipe(cssmin())
          .pipe(dest('./dist'))
}


module.exports = {
  dev:series(cleanTask,parallel(htmlTask,sassTask,apiTask,jsTask,libTask,staticTask),parallel(webTask, watchTask)),
  build:parallel(uglifyTask,htmlminTask,cssminTask)
};
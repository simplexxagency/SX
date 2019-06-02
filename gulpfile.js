var gulp = require('gulp'),
    sass = require('gulp-sass'), //Подключаем Sass пакет
    autoprefixer = require('gulp-autoprefixer'),// Подключаем библиотеку для автоматического добавления
    uglify = require('gulp-uglifyjs'),
  	concat = require('gulp-concat'),
    htmlhint = require("gulp-htmlhint"),
    browserSync  = require('browser-sync'); // Подключаем Browser Sync

    const FileInjector = require('./fileInjector');
    const workingDirectoryFI = 'E:\\Codyu\\Димас_КО\\Simplexx\\SX\\app\\pages';
    const urlBaseDirectoryFI = 'E:\\Codyu\\Димас_КО\\Simplexx\\SX\\app';
    const templatesDirectoryFI = 'E:\\Codyu\\Димас_КО\\Simplexx\\SX\\app\\template';


gulp.task('htmlhint', function () {
    return gulp.src('app/pages/output/*.html')
        .pipe(htmlhint())
        .pipe(htmlhint.reporter());
});

gulp.task('sass', function(){ // Создаем таск "sass"
    return gulp.src('app/sass/**/*.scss') // Берем источник
        .pipe(sass()) // Преобразуем Sass в CSS посредством gulp-sass
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(gulp.dest('app/build/css')) // Выгружаем результата в папку app/css
});

gulp.task('fileInjector', async () => {

    await FileInjector(workingDirectoryFI, templatesDirectoryFI, urlBaseDirectoryFI);
});

gulp.task('watch', ['sass', 'htmlhint', 'fileInjector'], function(){

    gulp.watch(['app/sass/**/*.scss', 'app/build/libs/**/*.css'], ['sass']);
    gulp.watch(['app/**/*.html', `${workingDirectoryFI}/configs/*.js`], ['fileInjector']);

    gulp.watch('app/**/*.html', ['htmlhint']); // Наблюдение за HTML файлами в корне проекта

});

gulp.task('clear', function () {
    return cache.clearAll();
})

gulp.task('default', ['watch']);

var gulp = require("gulp");
var less = require("gulp-less");
var browserSync = require("browser-sync").create();
var header = require("gulp-header");
var del = require("del");
var cleanCSS = require("gulp-clean-css");
var rename = require("gulp-rename");
var uglify = require("gulp-uglify");
var bundle = require("gulp-bundle-assets");
var inject = require("gulp-inject");

var pkg = require("./package.json");

// Set the banner content
var banner = ["/*!\n",
    " * Start Bootstrap - <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n",
    " * Copyright 2013-" + (new Date()).getFullYear(), " <%= pkg.author %>\n",
    " * Licensed under <%= pkg.license.type %> (<%= pkg.license.url %>)\n",
    " */\n",
    ""
].join("");


gulp.task("clean-start", function() {
  return del([
      "assets/*"
    ]);
});

gulp.task("minify-css", ["clean-start"], function() {
    return gulp.src("css/*.css")
        .pipe(cleanCSS({ compatibility: "ie8" }))
        .pipe(rename({ suffix: ".min" }))
        .pipe(gulp.dest("assets"))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// Minify JS
gulp.task("minify-js", ["clean-start"], function() {
    return gulp.src("js/*.js")
        .pipe(uglify())
        .pipe(header(banner, { pkg: pkg }))
        .pipe(rename({ suffix: ".min" }))
        .pipe(gulp.dest("assets"))
        .pipe(browserSync.reload({
            stream: true
        }))
});

gulp.task("bundle", ["minify-js", "minify-css"], function() {
  return gulp.src("./bundle.config.js")
    .pipe(bundle())
    .pipe(bundle.results("./")) // arg is destination of bundle.result.json
    .pipe(gulp.dest("./assets"));
});

gulp.task("inject", function() {
    var target = gulp.src("./index.html");
    var sources = gulp.src(["./assets/*.js", "./assets/*.css"], {read: false});

    return target.pipe(inject(sources))
        .pipe(gulp.dest("./"));
  });

gulp.task("clean-end", ["bundle"], function() {
  return del([
      "assets/*min*"
    ]);
});

// Copy vendor libraries from /node_modules into /vendor
gulp.task("copy", function() {
    gulp.src(["node_modules/bootstrap/dist/**/*", "!**/npm.js", "!**/bootstrap-theme.*", "!**/*.map"])
        .pipe(gulp.dest("vendor/bootstrap"))

    gulp.src(["node_modules/jquery/dist/jquery.min.js"])
        .pipe(gulp.dest("vendor/jquery"))

    gulp.src([
            "node_modules/font-awesome/**",
            "!node_modules/font-awesome/**/*.map",
            "!node_modules/font-awesome/.npmignore",
            "!node_modules/font-awesome/*.txt",
            "!node_modules/font-awesome/*.md",
            "!node_modules/font-awesome/*.json"
        ])
        .pipe(gulp.dest("vendor/font-awesome"))
})

// Run everything
gulp.task("default", ["clean-start", "minify-css", "minify-js", "copy", "bundle", "inject", "clean-end"]);


// Configure the browserSync task
gulp.task("browserSync", function() {
    browserSync.init({
        server: {
            baseDir: ""
        },
    })
})

// Dev task with browserSync
gulp.task("dev", ["browserSync", "clean-start", "minify-css", "minify-js", "bundle", "clean-end"], function() {
    gulp.watch("css/*.css", ["minify-css"]);
    gulp.watch("js/*.js", ["minify-js"]);
    // Reloads the browser whenever HTML or JS files change
    gulp.watch("*.html", browserSync.reload);
    gulp.watch("js/**/*.js", browserSync.reload);
});

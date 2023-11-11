let gulp = require('gulp');
let sass = require('gulp-sass')(require('sass'));
let plumber = require('gulp-plumber');
let concat = require('gulp-concat');
let inject = require("gulp-inject");
let uglify = require('gulp-uglify-es').default;
let rev = require('gulp-rev');
let revOutdated  = require('gulp-rev-outdated');
let clean = require('gulp-clean');
let replace = require('gulp-replace');
let rename = require('gulp-rename');
let connect = require('gulp-connect');
let del = require('del');
let series = require('stream-series');
let environments = require('gulp-environments');
//let headerComment = require('gulp-header-comment');
let argv = require('yargs').argv;
let dateFormat = require('dateformat');
let version = require('gulp-version-number');

sass.compiler = require('node-sass');

let development = environments.development;
let production = environments.production;
let folderDEV = "_DEV";
if (production()) {
  folderDEV = "";
  var now = new Date();
  if (argv.type=='site' || !argv.type) {
    var valVersionSite = incrementVersion('site');
    var textVersionS = 'version: '+valVersionSite+'\ngenerated: '+dateFormat(now, "mm/dd/yyyy h:MM:ss");
  }
  if (argv.type=='dashboard' || !argv.type) {
    var valVersionDashboard = incrementVersion('dashboard');
    var textVersionD = 'version: '+valVersionDashboard+'\ngenerated: '+dateFormat(now, "mm/dd/yyyy h:MM:ss");
  }
}

let pathBuildSite = '_build_site' + folderDEV;
let pathBuildDashboard = '_build_dashboard' + folderDEV;

const versionConfig = {
  'value': '%TS%',
  'append': {
    'key': 'v',
    'to': ['js','css'],
  },
};

var arrFrameworkSiteCss = [
    'framework/css/bootstrap.min.css',
    'framework/css/mdb.min.css',
    'framework/css/addons/toastr.min.css'
];
var arrFrameworkSiteJs = [
    'framework/js/jquery-3.4.1.min.js',
    'framework/js/popper.min.js',
    'framework/js/bootstrap.min.js',
    'framework/js/mdb.js',
    'framework/js/jquery.waypoints.min.js',
    'framework/js/angular/angular.js',
    'framework/js/angular/angular-ui-router.js',
    'framework/js/angular/angular-sanitize.js',
    'framework/js/angular/angular-cookies.js',
    'framework/js/angular/ocLazyLoad.js',
    'framework/js/bootstrap/ui-bootstrap-tpls.js',
    'framework/js/addons/angular-translate/angular-translate.min.js',
    'framework/js/addons/angular-translate-loader-static-files/angular-translate-loader-static-files.min.js',
    'framework/js/addons/angular-translate-storage-cookie/angular-translate-storage-cookie.js',
    'framework/js/addons/angular-translate-storage-local/angular-translate-storage-local.js',
    'framework/js/addons/toastr.min.js'
];
var arrFrameworkDashboardCss = [
    'framework/css/bootstrap.css',
    'framework/css/mdb.css',
    'framework/css/addons/toastr.min.css',
    'framework/css/addons/datatables.min.css'
];
var arrFrameworkDashboardJs = [
    'framework/js/jquery-3.4.1.min.js',
    'framework/js/popper.min.js',
    'framework/js/bootstrap.js',
    'framework/js/mdb.js',
    'framework/js/angular/angular.js',
    'framework/js/angular/angular-ui-router.js',
    'framework/js/angular/angular-sanitize.js',
    'framework/js/angular/angular-cookies.js',
    'framework/js/angular/ocLazyLoad.js',
    'framework/js/bootstrap/ui-bootstrap-tpls.js',
    'framework/js/addons/angular-translate/angular-translate.min.js',
    'framework/js/addons/angular-translate-loader-static-files/angular-translate-loader-static-files.min.js',
    'framework/js/addons/angular-translate-storage-cookie/angular-translate-storage-cookie.js',
    'framework/js/addons/angular-translate-storage-local/angular-translate-storage-local.js',
    'framework/js/addons/toastr.min.js',
    'framework/js/addons/file-upload/ng-file-upload-shim.js',
    'framework/js/addons/file-upload/ng-file-upload.js',
    'framework/js/addons/tinymce.min.js',
    'framework/js/addons/datatables.min.js'
];

//Clean build folder
function deleteBuild () {
    return del([pathBuildSite, pathBuildDashboard], {force: true});
};
function deleteBuildSite () {
    return del([pathBuildSite], {force: true});
};
function deleteBuildDashboard () {
    return del([pathBuildDashboard], {force: true});
};

//Create Framework folder
function createStaticFiles (done) {
    //base
    gulp.src(['framework/favicon/**/*']).pipe(gulp.dest(pathBuildSite+'/'));
    gulp.src(['framework/seo/**/*']).pipe(gulp.dest(pathBuildSite+'/'));
    gulp.src(['framework/files/*']).pipe(gulp.dest(pathBuildSite+'/content/files/'));
    //framework
    gulp.src(['framework/**/*']).pipe(gulp.dest(pathBuildSite+'/content/framework/'));
    gulp.src(['framework/**/*']).pipe(gulp.dest(pathBuildDashboard+'/content/framework/'));
    //others
    gulp.src('src_site/change_control.json').pipe(gulp.dest(pathBuildSite+'/'));
    gulp.src('src_site/change_control.json').pipe(gulp.dest(pathBuildDashboard+'/'));
    done();
};
function createStaticFilesSite (done) {
    //base
    gulp.src(['framework/favicon/**/*']).pipe(gulp.dest(pathBuildSite+'/'));
    gulp.src(['framework/seo/**/*']).pipe(gulp.dest(pathBuildSite+'/'));
    gulp.src(['framework/files/*']).pipe(gulp.dest(pathBuildSite+'/content/files/'));
    //framework
    gulp.src(['framework/**/*']).pipe(gulp.dest(pathBuildSite+'/content/framework/'));
    //signatures
    gulp.src(['signatures/**/*']).pipe(gulp.dest(pathBuildSite+'/signatures/'));
    //others
    gulp.src('src_site/change_control.json').pipe(gulp.dest(pathBuildSite+'/'));
    done();
};
function createStaticFilesDashboard (done) {
    //base
    gulp.src(['base/favicon/**/*']).pipe(gulp.dest(pathBuildDashboard+'/'));
    //framework
    gulp.src(['framework/**/*']).pipe(gulp.dest(pathBuildDashboard+'/content/framework/'));
    //others
    gulp.src('src_site/change_control.json').pipe(gulp.dest(pathBuildDashboard+'/'));
    done();
};

// Create translations
function createTranslations (done) {
    //translations
    gulp.src([
        'src/translations/*.json',
        'src_site/translations/*.json',
      ])
      .pipe(gulp.dest(pathBuildSite+'/translations/'));

    gulp.src([
        'src/translations/*.json',
        'src_dashboard/translations/dashboard-*.json'
      ])
      .pipe(gulp.dest(pathBuildDashboard+'/translations/'));
    done();
};
function createTranslationsSite (done) {
    //translations
    gulp.src([
        'src/translations/*.json',
        'src_site/translations/*.json',
      ])
      .pipe(gulp.dest(pathBuildSite+'/translations/'));
    done();
};
function createTranslationsDashboard (done) {
    //translations
    gulp.src([
        'src_dashboard/translations/dashboard-*.json',
        'src/translations/general-*.json'
      ])
      .pipe(gulp.dest(pathBuildDashboard+'/translations/'));
    done();
};

// Compile CSS
function compileSiteCss () {
    return gulp.src([
        'src/**/*.scss',
        'src_site/**/*.scss'
    ])
        .pipe(production(concat('assets-site.min.css')))
        .pipe(plumber())
        .pipe(sass())
        //.pipe(production(cleanCSS({compatibility: 'ie8'})))
        .pipe(production(rev()))
        //.pipe(production(headerComment(textVersionS)))
        .pipe(gulp.dest(pathBuildSite+'/content/assets/css'));
};
function compileDashboardCss () {
    return gulp.src([
        'src/**/*.scss',
        'src_dashboard/**/*.scss'
    ])
        .pipe(production(concat('assets-dashboard.min.css')))
        .pipe(plumber())
        .pipe(sass())
        //.pipe(production(cleanCSS({compatibility: 'ie8'})))
        .pipe(production(rev()))
        //.pipe(production(headerComment(textVersionD)))
        .pipe(gulp.dest(pathBuildDashboard+'/content/assets/css'));
};

// Compile JS
function compileSiteJs() {
  return gulp.src(development() ? [
      'src_site/**/*.js',
      'src/**/*.js',
      '!src_site/**/*.prod.js',
      '!src_site/**/@*.js',
      '!src/**/*.prod.js',
      '!src/**/@*.js'
  ] : [
      'src_site/**/*.js',
      'src/**/*.js',
      '!src_site/**/*.dev.js',
      '!src_site/**/@*.js',
      '!src/**/*.dev.js',
      '!src/**/@*.js'
  ])
    //.pipe(production(concat('assets-site.min.js')))
    .pipe(rename(function (path) {
        path.basename = path.basename.replace(development()?'.dev':'.prod','');
    }))
    /*
    .pipe(production(uglify({
      compress: true,
      mangle: false
    }).on('error', console.error)))
    */
    //.pipe(production(rev()))
    //.pipe(production(headerComment(textVersionS)))
    .pipe(gulp.dest(pathBuildSite+'/content/assets/js'));
};
function compileDashboardJs() {
  return gulp.src(development() ? [
      'src_dashboard/**/*.js',
      'src/**/*.js',
      '!src_dashboard/**/*.prod.js',
      '!src_dashboard/**/@*.js',
      '!src/**/*.prod.js',
      '!src/**/@*.js'
  ] : [
      'src_dashboard/**/*.js',
      'src/**/*.js',
      '!src_dashboard/**/*.dev.js',
      '!src_dashboard/**/@*.js',
      '!src/**/*.dev.js',
      '!src/**/@*.js'
  ])
    //.pipe(production(concat('assets-dashboard.min.js')))
    .pipe(rename(function (path) {
        path.basename = path.basename.replace(development()?'.dev':'.prod','');
    }))
    /*
    .pipe(production(uglify({
      compress: true,
      mangle: false
    }).on('error', console.error)))
    */
    //.pipe(production(rev()))
    //.pipe(production(headerComment(textVersionD)))
    .pipe(gulp.dest(pathBuildDashboard+'/content/assets/js'));
};

// Compile JS Partials
function compilePartialSiteJs(done) {
  gulp.src([
      'src_site/partials/**/@*.js'
    ])
    .pipe(rename(function (path) {
        path.basename = path.basename.replace('@','');
    }))
    /*
    .pipe(production(uglify({
      compress: true,
      mangle: false
    }).on('error', console.error)))
    */
    //.pipe(production(headerComment(textVersionS)))
    .pipe(gulp.dest(pathBuildSite+'/content/assets/js/partials'));
    done();
};
function compilePartialDashboardJs(done) {
  gulp.src([
      'src_dashboard/partials/**/@*.js'
    ])
    .pipe(rename(function (path) {
        path.basename = path.basename.replace('@','');
    }))
    /*
    .pipe(production(uglify({
      compress: true,
      mangle: false
    }).on('error', console.error)))
    */
    //.pipe(production(headerComment(textVersionD)))
    .pipe(gulp.dest(pathBuildDashboard+'/content/assets/js/partials'));
  done();
};

// Compile HTML
function compileSiteHtml() {
  return gulp.src([
    'src/**/*.html',
    'src_site/**/*.html'
  ])
    //.pipe(production(headerComment(textVersionS)))
    .pipe(gulp.dest(pathBuildSite+"/templates"));
};
function compileDashboardHtml() {
  return gulp.src([
    'src/**/*.html',
    'src_dashboard/**/*.html'
  ])
    //.pipe(production(headerComment(textVersionD)))
    .pipe(gulp.dest(pathBuildDashboard+"/templates"));
};

// Create Assets for compile HTML
function createAssets(done) {
    //html
    compileSiteHtml();
    compileDashboardHtml();

    //Images
    gulp.src([
        'src/img/**/*',
        'src_site/img/**/*'
        ]).pipe(gulp.dest(pathBuildSite+'/content/assets/img/'));
    gulp.src([
        'src/img/**/*',
        'src_dashboard/img/**/*'
        ]).pipe(gulp.dest(pathBuildDashboard+'/content/assets/img/'));

    // Assets Site into project
    var sourcesAsssetsSiteCss = gulp.src(arrFrameworkSiteCss)
        .pipe(production(concat('framework-site.min.css')))
        .pipe(production(rev()))
        .pipe(gulp.dest(pathBuildSite+'/content/framework/css'));
    var sourcesAsssetsSiteJs = gulp.src(arrFrameworkSiteJs)
        .pipe(production(concat('framework-site.min.js')))
        .pipe(production(uglify({
          compress: true,
          mangle: true
        }).on('error', console.error)))
        .pipe(production(rev()))
        .pipe(gulp.dest(pathBuildSite+'/content/framework/js'));

    gulp.src('src_site/site.html')
        .pipe(inject(series([sourcesAsssetsSiteCss,compileSiteCss()]), {ignorePath: pathBuildSite, addRootSlash: false}))
        .pipe(inject(series([sourcesAsssetsSiteJs,compileSiteJs()]), {ignorePath: pathBuildSite, addRootSlash: false}))
        .pipe(production(replace(/(<!--\s*inject:css\s*-->\s*)(\n*)(.*)(\n*)(\s*)(<!--\s*endinject\s*-->)/g, '$3$4$5')))
        .pipe(production(replace(/(<!--\s*inject:js\s*-->\s*)(\n*)(.*)(\n*)(\s*)(<!--\s*endinject\s*-->)/g, '$3$4$5')))
        //.pipe(production(headerComment(textVersionS)))
        .pipe(production(version(versionConfig)))
        .pipe(rename('index.html'))
        .pipe(gulp.dest(pathBuildSite));

    // Assets Dashboard into project
    var sourcesAsssetsDashboardCss = gulp.src(arrFrameworkDashboardCss)
        .pipe(production(concat('framework-dashboard.min.css')))
        .pipe(production(rev()))
        .pipe(gulp.dest(pathBuildDashboard+'/content/framework/css'));
    var sourcesAsssetsDashboardJs = gulp.src(arrFrameworkDashboardJs)
        .pipe(production(concat('framework-dashboard.min.js')))
        .pipe(production(uglify({
          compress: true,
          mangle: true
        }).on('error', console.error)))
        .pipe(production(rev()))
        .pipe(gulp.dest(pathBuildDashboard+'/content/framework/js'));

    gulp.src('src_dashboard/dashboard.html')
        .pipe(inject(series([sourcesAsssetsDashboardCss,compileDashboardCss()]), {ignorePath: pathBuildDashboard, addRootSlash: false}))
        .pipe(inject(series([sourcesAsssetsDashboardJs,compileDashboardJs()]), {ignorePath: pathBuildDashboard, addRootSlash: false}))
        .pipe(production(replace(/(<!--\s*inject:css\s*-->\s*)(\n*)(.*)(\n*)(\s*)(<!--\s*endinject\s*-->)/g, '$3$4$5')))
        .pipe(production(replace(/(<!--\s*inject:js\s*-->\s*)(\n*)(.*)(\n*)(\s*)(<!--\s*endinject\s*-->)/g, '$3$4$5')))
        //.pipe(production(headerComment(textVersionD)))
        .pipe(production(version(versionConfig)))
        .pipe(rename('index.html'))
        .pipe(gulp.dest(pathBuildDashboard));

    if (production()) {
      //Clean repeat assets in build folder
      gulp.src([pathBuildSite+'/*.*', pathBuildDashboard+'/*.*'], {read: false})
          .pipe(revOutdated(1)) // leave 1 latest asset file for every file name prefix.
          .pipe(clean());
    }
    done();
};
function createAssetsSite(done) {
    //html
    compileSiteHtml();

    //Images
    gulp.src([
        'src/img/**/*',
        'src_site/img/**/*'
        ]).pipe(gulp.dest(pathBuildSite+'/content/assets/img/'));

    // Assets Site into project
    var sourcesAsssetsSiteCss = gulp.src(arrFrameworkSiteCss)
        .pipe(production(concat('framework-site.min.css')))
        .pipe(production(rev()))
        .pipe(gulp.dest(pathBuildSite+'/content/framework/css'));
    var sourcesAsssetsSiteJs = gulp.src(arrFrameworkSiteJs)
        .pipe(production(concat('framework-site.min.js')))
        .pipe(production(uglify({
          compress: true,
          mangle: true
        }).on('error', console.error)))
        .pipe(production(rev()))
        .pipe(gulp.dest(pathBuildSite+'/content/framework/js'));

    gulp.src('src_site/site.html')
        .pipe(inject(series([sourcesAsssetsSiteCss,compileSiteCss()]), {ignorePath: pathBuildSite, addRootSlash: false}))
        .pipe(inject(series([sourcesAsssetsSiteJs,compileSiteJs()]), {ignorePath: pathBuildSite, addRootSlash: false}))
        .pipe(production(replace(/(<!--\s*inject:css\s*-->\s*)(\n*)(.*)(\n*)(\s*)(<!--\s*endinject\s*-->)/g, '$3$4$5')))
        .pipe(production(replace(/(<!--\s*inject:js\s*-->\s*)(\n*)(.*)(\n*)(\s*)(<!--\s*endinject\s*-->)/g, '$3$4$5')))
        //.pipe(production(headerComment(textVersionS)))
        .pipe(production(version(versionConfig)))
        .pipe(rename('index.html'))
        .pipe(gulp.dest(pathBuildSite));

    if (production()) {
      //Clean repeat assets in build folder
      gulp.src([pathBuildSite+'/*.*'], {read: false})
          .pipe(revOutdated(1)) // leave 1 latest asset file for every file name prefix.
          .pipe(clean());
    }
    done();
};
function createAssetsDashboard(done) {
    //html
    compileDashboardHtml();

    //Images
    gulp.src([
      'src/img/**/*',
      'src_dashboard/img/**/*'
    ]).pipe(gulp.dest(pathBuildDashboard+'/content/assets/img/'));

    // Assets Dashboard into project
    var sourcesAsssetsDashboardCss = gulp.src(arrFrameworkDashboardCss)
        .pipe(production(concat('framework-dashboard.min.css')))
        .pipe(production(rev()))
        .pipe(gulp.dest(pathBuildDashboard+'/framework/css'));
    var sourcesAsssetsDashboardJs = gulp.src(arrFrameworkDashboardJs)
        .pipe(production(concat('framework-dashboard.min.js')))
        .pipe(production(uglify({
          compress: true,
          mangle: true
        }).on('error', console.error)))
        .pipe(production(rev()))
        .pipe(gulp.dest(pathBuildDashboard+'/framework/js'));

    gulp.src('src_dashboard/dashboard.html')
        .pipe(inject(series([sourcesAsssetsDashboardCss,compileDashboardCss()]), {ignorePath: pathBuildDashboard, addRootSlash: false}))
        .pipe(inject(series([sourcesAsssetsDashboardJs,compileDashboardJs()]), {ignorePath: pathBuildDashboard, addRootSlash: false}))
        .pipe(production(replace(/(<!--\s*inject:css\s*-->\s*)(\n*)(.*)(\n*)(\s*)(<!--\s*endinject\s*-->)/g, '$3$4$5')))
        .pipe(production(replace(/(<!--\s*inject:js\s*-->\s*)(\n*)(.*)(\n*)(\s*)(<!--\s*endinject\s*-->)/g, '$3$4$5')))
        //.pipe(production(headerComment(textVersionD)))
        .pipe(production(version(versionConfig)))
        .pipe(rename('index.html'))
        .pipe(gulp.dest(pathBuildDashboard));

    if (production()) {
      //Clean repeat assets in build folder
      gulp.src([pathBuildDashboard+'/*.*'], {read: false})
          .pipe(revOutdated(1)) // leave 1 latest asset file for every file name prefix.
          .pipe(clean());
    }
    done();
};

// Connect server
function connectServer(done) {
  connect.server({
      root: pathBuildDashboard+'/',
      fallback: pathBuildDashboard+'/index.html',
      port: 8088,
      livereload: true
  });
  connect.server({
      root: pathBuildSite+'/',
      fallback: pathBuildSite+'/index.html',
      port: 8080,
      livereload: true
  });
  done();
};

function incrementVersion(type) {
  var fs = require('fs');
  var docString = fs.readFileSync('src_'+type+'/version.js', 'utf8');

  var versionNumPattern=/versionBuild = '(.*)';/;
  var vNumRexEx = new RegExp(versionNumPattern);
  var oldVersionNumber = (vNumRexEx.exec(docString))[1];

  var versionParts = oldVersionNumber.split('.');
  var vArray = {
      vMajor : versionParts[0],
      vMinor : versionParts[1],
      vPatch : versionParts[2]
  };

  vArray.vPatch = parseFloat(vArray.vPatch) + 1;
  var periodString = ".";

  var baseVersion = vArray.vMajor + periodString + vArray.vMinor;
  var newVersionNumber = baseVersion + periodString + vArray.vPatch;

  fs.writeFileSync('src_'+type+'/version.js', 'versionBuild = \''+newVersionNumber+'\';');

  //change control json
  var changeLogStr = fs.readFileSync('src_site/change_control.json', 'utf8');
  if (changeLogStr) {
    var changeLogJson = JSON.parse(changeLogStr);
    if (changeLogJson) {
      for (var keySite in changeLogJson){
        if (keySite == type) {
          for (var keyV in changeLogJson[keySite]){
            if (keyV == baseVersion) {
              let now = new Date();
              changeLogJson[keySite][keyV].last.version = newVersionNumber;
              changeLogJson[keySite][keyV].last.date = dateFormat(now, "mm/dd/yyyy");
              fs.writeFileSync('src_site/change_control.json', JSON.stringify(changeLogJson, null, "\t"));
            }
          }
        }
      }
    }
  }

  return newVersionNumber;
}

function watchFiles() {
  gulp.watch([
    'src/**/*.scss',
    'src_dashboard/**/*.scss'
  ], gulp.series(compileDashboardCss));
  gulp.watch([
    'src/**/*.scss',
    'src_site/**/*.scss'
  ], gulp.series(compileSiteCss));
  gulp.watch([
    'src/**/*.js',
    'src_site/**/*.js'
  ], gulp.series(compileSiteJs, compilePartialSiteJs));
  gulp.watch([
    'src/**/*.js',
    'src_dashboard/**/*.js'
  ], gulp.series(compileDashboardJs, compilePartialDashboardJs));
  gulp.watch([
    'src/**/*.html',
    'src_site/**/*.html',
    'src_dashboard/**/*.html'
  ], gulp.series(createAssets));
  gulp.watch([
    'src/translations/*.json',
    'src_site/translations/*.json',
    'src_dashboard/translations/*.json'
  ], gulp.series(createTranslations));
};

// define complex tasks
const build = gulp.series(deleteBuild, createStaticFiles, createTranslations, compilePartialSiteJs, compilePartialDashboardJs, createAssets);
const buildSite = gulp.series(deleteBuildSite, createStaticFilesSite, createTranslationsSite, compilePartialSiteJs, createAssetsSite);
const buildDashboard = gulp.series(deleteBuildDashboard, createStaticFilesDashboard, createTranslationsDashboard, compilePartialDashboardJs, createAssetsDashboard);

const watch = gulp.parallel(watchFiles, connectServer);
const full = gulp.series(deleteBuild, createStaticFiles, createTranslations, compilePartialSiteJs, compilePartialDashboardJs, createAssets, connectServer);
const server = gulp.series(connectServer);

const buildWatch = gulp.series(deleteBuild, createStaticFiles, createTranslations, compilePartialSiteJs, compilePartialDashboardJs, createAssets, watch);

// export tasks
exports.build = build;
exports.buildSite = buildSite;
exports.buildDashboard = buildDashboard;

exports.watch = watch;
exports.full = full;
exports.server = server;
exports.default = (production())?build:buildWatch;

const { dest, parallel, watch, src, } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const plumber = require("gulp-plumber");
const autoprefixer = require("gulp-autoprefixer");
const cleanCss = require("gulp-clean-css");
const concat = require("gulp-concat");

const paths = {
  styles: {
    from: ["./static/scss/*.scss", "!./static/scss/_*.scss"],
    to: "./static/css/",
    srcWatch: "./static/scss/*.scss",
  },
};

const styles = () => {
  return src(paths.styles.from)
    .pipe(plumber())
    .pipe(sass({ outputStyle: "expanded", }))
    .pipe(cleanCss({ level: { 1: { specialComments: 0, }, }, }))
    .pipe(autoprefixer({
      cascade: true,
      overrideBrowserslist: ["last 5 versions"],
    }))
    .pipe(concat("main.css"))
    .pipe(dest(paths.styles.to));
};

const watching = () => {
  watch(paths.styles.srcWatch || paths.styles.from, styles);
};

const buildFunc = () => parallel(styles);
const defaultFunc = () => parallel(buildFunc(), watching);

exports.build = buildFunc();
exports.default = defaultFunc();
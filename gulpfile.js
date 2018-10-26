var gulp = require("gulp");
var path = require("path");
var del = require("del");
var tslint = require("gulp-tslint");
var jasmine = require("gulp-jasmine");
var istanbul = require("gulp-istanbul");
var shell = require("gulp-shell");
var zip = require('gulp-zip');
var reporters = require("jasmine-reporters");
var Reporter = require("jasmine-terminal-reporter");
var child_process = require("child_process");
var template_list = require("./templates/template-list.json");

gulp.task("install:typings", shell.task(["gulp install:typings:src", "gulp install:typings:spec"]));
gulp.task("install:typings:src", shell.task("typings install"));
gulp.task("install:typings:spec", shell.task("typings install", { cwd: "spec/" }));

gulp.task("clean", function(cb) { return del(["lib", "spec/build"], cb); });
gulp.task("clean:typings", function (cb) { return del(["typings", "spec/typings"], cb); });

gulp.task("compile", shell.task("tsc"));
gulp.task("compile:spec", gulp.series("compile", shell.task("tsc", {cwd: path.join(__dirname, "spec")})));

gulp.task("zip", function(done) {
	var templates = template_list.templates;
	Object.keys(templates).forEach(function (key) {
		gulp.src("templates-src/" + key + "/**/*", {
			base: "templates-src/" + key,
			dot: true
		})
		.pipe(zip(key + ".zip"))
		.pipe(gulp.dest("templates"));
	});
	done();
});

gulp.task("lint-md", function(){
	return gulp.src(["**/*.md", "!node_modules/**/*.md"])
		.pipe(shell(["mdast <%= file.path %> --frail --no-stdout --quiet"]));
});

gulp.task("test", gulp.series("compile:spec", function(cb) {
	var server = child_process.spawn(
		"node",
		[path.join(__dirname, "node_modules", "http-server", "bin", "http-server"), "-p", "18080"],
		{cwd: path.join(__dirname, "templates")}
	);
	server.stdout.on("data", function (data) {
			console.log("\nhttp-server", data.toString());
	});
	server.stderr.on("data", function (data) {
			console.log("\nhttp-server (stderr)", data.toString());
	});
	server.on("close", function () {
			console.log("\nhttp-server: stop");
	});
	var jasmineReporters = [ new Reporter({
			isVerbose: true,
			showColors: true,
			includeStackTrace: true
		}),
		new reporters.JUnitXmlReporter()
	];
	return gulp.src(["lib/**/*.js"])
		.pipe(istanbul())
		.pipe(istanbul.hookRequire())
		.on("finish", function() {
			gulp.src("spec/TestSpec.js")
				.pipe(jasmine({ reporter: jasmineReporters}))
				.pipe(istanbul.writeReports({ reporters: ["text", "cobertura", "lcov"] }))
				.on("end", () => {
					server.kill("SIGINT");
					cb();
				});
		});
}));

gulp.task("default", gulp.series("compile"));

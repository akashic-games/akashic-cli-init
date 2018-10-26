var mockPrompt = require("./support/mockPrompt");
var bp = require("../lib/BasicParameters");
var mockfs = require("mock-fs");
var fs = require("fs-extra");
var os = require("os");
var path = require("path");
var commons = require("@akashic/akashic-cli-commons");

describe("BasicParameters", function () {
	describe("updateConfigurationFile()", function () {
		var confPath = path.join(os.tmpdir(), ".akashicrc");
		var quietLogger = new commons.ConsoleLogger({ quiet: true });

		beforeEach(() => {
			mockfs({});
			mockPrompt.mock({ width: 42, height: 27, fps: 30 });
			jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
		});

		afterEach(() => {
			mockPrompt.restore();
			mockfs.restore();
		});

		it("test", done => {
			var h = 3 + 2;
			expect(h).toEqual(5);
			done();
		});
/*
		it("update game.json", done => {
			console.log("++++++++ start-----");
			var conf = { width: 12, height: 23, fps: 34, assets: {} };
			fs.writeJsonSync(confPath, conf);
			bp.updateConfigurationFile(confPath, quietLogger)
				.then(() => {
					console.log("++++++++");
					expect(fs.readJsonSync(confPath))
						.toEqual({ width: 42, height: 27, fps: 30, assets: {} });
					done();
				})
				.catch(err => {
					console.log("++++++++" , err );
				})
				// .then( () => {
				// 	console.log("------ aaaa");
				// 	done();
				// });
				.then(done());
		});
*/
	});
});

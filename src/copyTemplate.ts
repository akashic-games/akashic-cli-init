import * as fs from "fs-extra";
import * as path from "path";
import { InitParameterObject } from "./InitParameterObject";
import { TemplateConfig, CopyListItem } from "./TemplateConfig";

/**
 * ローカルテンプレートをカレントディレクトリにコピーする
 */
export function copyTemplate(templateConfig: TemplateConfig, param: InitParameterObject): Promise<string> {
	return runTemplateConfig(templateConfig, param)
		.then(() => getGameJsonPath(templateConfig, param));
}

/**
 * TemplateConfig に従ってコピーする
 */
function runTemplateConfig(templateConfig: TemplateConfig, param: InitParameterObject): Promise<void> {
	const srcDirPath = path.join(param._realTemplateDirectory, param.type);
	const dstDirPath = param.cwd;
	if (templateConfig.files) {
		return Promise.resolve()
			.then(() => copyFiles(templateConfig.files, srcDirPath, dstDirPath, param));
	} else {
		return copyAllTemplateFiles(param);
	}
}

/**
 * 指定したファイルをコピーする
 */
function copyFiles(copyFiles: CopyListItem[], srcDir: string, dstDir: string, param: InitParameterObject): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		try {
			const existFiles = copyFiles.filter(file => fs.existsSync(path.join(dstDir, file.dst || "", file.src)));
			if (!param.forceCopy && existFiles.length > 0) {
				const existNames = existFiles.map(file => file.dst ? `${file.dst}/${file.src}` : file.src);
				const errorMessage = `skipped to copy files, because followings already exists. [${existNames.join(", ")}]`;
				param.logger.info(errorMessage);
				reject(new Error(errorMessage));
				return;
			}
			copyFiles.forEach(file => {
				if (file.src.indexOf("..") !== -1 || (file.dst != null && file.dst.indexOf("..") !== -1))
					throw(new Error("template.json has an invalid file name"));
				fs.copySync(
					path.join(srcDir, file.src),
					path.join(dstDir, file.dst || "", file.src),
					{clobber: param.forceCopy}
				);
				param.logger.info(`copied ${file.src}.`);
			});
		} catch (err) {
			reject(err);
			return;
		}
		resolve();
	});
}

/**
 * ディレクトリ以下のファイルを単純にコピーする。
 * - ディレクトリ直下の template.json は無視。
 * - ディレクトリ直下に game.json が存在する前提。
 */
function copyAllTemplateFiles(param: InitParameterObject): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		const srcDirPath = path.join(param._realTemplateDirectory, param.type);
		const dstDirPath = param.cwd;
		fs.readdir(srcDirPath, (err, files) => {
			if (err) {
				reject(err);
				return;
			}
			const existFiles = files.filter(fileName => fs.existsSync(path.join(dstDirPath, fileName)));
			if (!param.forceCopy && existFiles.length > 0) {
				const errorMessage = `skipped to copy files, because followings already exists. [${existFiles.join(", ")}]`;
				param.logger.error(errorMessage, existFiles);
				reject(new Error(errorMessage));
				return;
			}
			try {
				files.forEach(fileName => {
					const srcPath = path.join(srcDirPath, fileName);
					const dstPath = path.join(dstDirPath, fileName);
					if (fileName !== "template.json") {
						fs.copySync(srcPath, dstPath, {clobber: param.forceCopy});
						param.logger.info(`copied ${fileName}.`);
					}
				});
			} catch (err) {
				reject(new Error(`failed to copy template`));
				return;
			}
			// const gameJsonPath = path.join(dstDirPath, "game.json");
			resolve();
		});
	});
}

function isExist(filePath: string): boolean {
	try {
		return fs.statSync(filePath) ? true : false;
	} catch (e) {
		return false;
	}
}

/**
 * game.json の場所を取得する
 */
function getGameJsonPath(templateConfig: TemplateConfig, param: InitParameterObject): Promise<string> {
	const gameJsonPath = path.join(param.cwd, templateConfig.gameJson || "game.json");
	return Promise.resolve(gameJsonPath);
}

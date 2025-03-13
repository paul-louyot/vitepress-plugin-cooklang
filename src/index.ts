import * as fs from "node:fs";
import { Recipe } from "@cooklang/cooklang-ts";
import { glob } from "tinyglobby";

type TransformPathType = (input: string) => string;

export function dataLoader(
  watchedFiles: string[],
  transformPath?: TransformPathType,
) {
  return watchedFiles.map((file) => {
    let filePath = file;
    const source = fs.readFileSync(file, "utf-8");
    const recipe = new Recipe(source);
    const metadata = recipe.metadata;
    if (transformPath) {
      filePath = transformPath(file);
    }
    return { filePath, source, recipe, metadata };
  });
}

export async function pathsLoader(
  pattern: string,
  transformPath?: TransformPathType,
) {
  const files = await glob(pattern, {
    ignore: ["**/node_modules/**", "**/dist/**"],
    expandDirectories: false,
  });

  return files.map((file) => {
    let filePath = file;
    const source = fs.readFileSync(file, "utf-8");
    const recipe = new Recipe(source);
    const metadata = recipe.metadata;
    if (transformPath) {
      filePath = transformPath(file);
    }
    return { filePath, source, recipe, metadata };
  });
}

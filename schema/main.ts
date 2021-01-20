import * as definyCore from "../source/main";
import * as prettier from "prettier";
import * as typePartMap from "./typePartMap";
import { promises as fileSystem } from "fs";

const typeScriptPath = "source/data.ts";

const typeScriptCode = definyCore.generateTypeScriptCodeAsString(
  typePartMap.typePartMap
);

const formattedTypeScriptCode = prettier.format(typeScriptCode, {
  parser: "typescript",
});

fileSystem.writeFile(typeScriptPath, formattedTypeScriptCode).then(() => {
  console.log("output TypeScript code!");
});

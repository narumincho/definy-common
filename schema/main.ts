import * as codeGen from "js-ts-code-generator";
import * as definyCore from "../source/main";
import * as fs from "fs";
import * as prettier from "prettier";
import * as typePartMap from "./typePartMap";

const typeScriptCode = codeGen.generateCodeAsString(
  definyCore.generateTypeScriptCode(typePartMap.typePartMap),
  "TypeScript"
);

const typeScriptPath = "source/newData.ts";
fs.promises
  .writeFile(
    typeScriptPath,
    prettier.format(typeScriptCode, { parser: "typescript" })
  )
  .then(() => {
    console.log("output TypeScript code!");
  });

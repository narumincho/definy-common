import * as nt from "@narumincho/type";
import * as codeGen from "js-ts-code-generator";
import * as fs from "fs";
import * as prettier from "prettier";
import * as definition from "./definition";

const typeScriptCode = codeGen.generateCodeAsString(
  nt.generateTypeScriptCode(definition.customTypeList),
  "TypeScript"
);

const typeScriptPath = "source/data.ts";
fs.promises
  .writeFile(
    typeScriptPath,
    prettier.format(typeScriptCode, { parser: "typescript" })
  )
  .then(() => {
    console.log("output TypeScript code!");
  });

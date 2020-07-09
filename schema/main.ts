import * as codeGen from "js-ts-code-generator";
import * as definition from "./definition";
import * as fs from "fs";
import * as nt from "@narumincho/type";
import * as prettier from "prettier";

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

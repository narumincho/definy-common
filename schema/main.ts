import * as nt from "@narumincho/type";
import * as codeGen from "js-ts-code-generator";
import * as fs from "fs";

const code = codeGen.generateCodeAsString(
  nt.generateTypeScriptCode(
    {
      customTypeList: [],
      idOrHashTypeNameList: []
    },
    false
  ),
  "TypeScript"
);

fs.writeFileSync("source/data.ts", code);

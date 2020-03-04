import * as nt from "@narumincho/type";
import * as codeGen from "js-ts-code-generator";
import * as fs from "fs";

const code = codeGen.generateCodeAsString(
  nt.generateTypeScriptCode(
    {
      customTypeList: [
        {
          name: "Location",
          description:
            "DefinyWebアプリ内での場所を示すもの. URLから求められる. URLに変換できる",
          body: {
            _: "Sum",
            tagNameAndParameterArray: [
              {
                name: "Home",
                description: "最初のページ",
                parameter: { _: "Nothing" }
              }
            ]
          }
        }
      ],
      idOrHashTypeNameList: []
    },
    false
  ),
  "TypeScript"
);

fs.writeFileSync("source/data.ts", code);

import * as nt from "@narumincho/type";
import * as codeGen from "js-ts-code-generator";
import * as fs from "fs";

const location: nt.type.CustomType = {
  name: "Location",
  description:
    "DefinyWebアプリ内での場所を示すもの. URLから求められる. URLに変換できる",
  body: {
    _: "Sum",
    tagNameAndParameterArray: [
      {
        name: "Home",
        description: "最初のページ",
        parameter: nt.type.maybeNothing()
      },
      {
        name: "User",
        description: "ユーザーの詳細ページ",
        parameter: nt.type.maybeJust(nt.type.typeId("UserId"))
      },
      {
        name: "Project",
        description: "プロジェクトの詳細ページ",
        parameter: nt.type.maybeJust(nt.type.typeId("ProjectId"))
      }
    ]
  }
};

const code = codeGen.generateCodeAsString(
  nt.generateTypeScriptCode(
    {
      customTypeList: [location],
      idOrHashTypeNameList: ["UserId", "ProjectId"]
    },
    false
  ),
  "TypeScript"
);

fs.writeFileSync("source/data.ts", code);

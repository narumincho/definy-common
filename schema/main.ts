import * as nt from "@narumincho/type";
import * as codeGen from "js-ts-code-generator";
import * as fs from "fs";

const languageAndLocation: nt.type.CustomType = {
  name: "LanguageAndLocation",
  description:
    "言語と場所. URLとして表現される. Googleなどの検索エンジンの都合で,URLにページの言語のを入れて,言語ごとに別のURLである必要がある",
  body: nt.type.customTypeBodyProduct([
    {
      name: "language",
      description: "言語",
      memberType: nt.type.typeCustom("Language")
    },
    {
      name: "location",
      description: "場所",
      memberType: nt.type.typeCustom("Location")
    }
  ])
};

const language: nt.type.CustomType = {
  name: "Language",
  description: "英語,日本語,エスペラント語などの言語",
  body: nt.type.customTypeBodySum([
    {
      name: "Japanese",
      description: "日本語",
      parameter: nt.type.maybeNothing()
    },
    {
      name: "English",
      description: "英語",
      parameter: nt.type.maybeNothing()
    },
    {
      name: "Esperanto",
      description: "エスペラント語",
      parameter: nt.type.maybeNothing()
    }
  ])
};

const location: nt.type.CustomType = {
  name: "Location",
  description:
    "DefinyWebアプリ内での場所を示すもの. URLから求められる. URLに変換できる",
  body: nt.type.customTypeBodySum([
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
  ])
};

const code = codeGen.generateCodeAsString(
  nt.generateTypeScriptCode(
    {
      customTypeList: [languageAndLocation, language, location],
      idOrHashTypeNameList: ["UserId", "ProjectId"]
    },
    false
  ),
  "TypeScript"
);

fs.writeFileSync("source/data.ts", code);

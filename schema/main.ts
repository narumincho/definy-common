import * as nt from "@narumincho/type";
import { type } from "@narumincho/type";
import * as codeGen from "js-ts-code-generator";
import * as fs from "fs";
import * as childProcess from "child_process";

const accessToken = type.typeToken("AccessToken");
const userId = type.typeId("UserId");
const projectId = type.typeId("ProjectId");
const ideaId = type.typeId("IdeaId");
const fileHash = type.typeToken("FileHash");
const projectHash = type.typeToken("ProjectHash");
const moduleHash = type.typeToken("ModuleHash");
const typeHash = type.typeToken("TypeHash");
const partHash = type.typeToken("PartHash");

const dateTimeName = "DateTime";
const requestLogInUrlRequestDataName = "RequestLogInUrlRequestData";
const openIdConnectProviderName = "OpenIdConnectProvider";
const urlDataName = "UrlData";
const clientModeName = "ClientMode";
const locationName = "Location";
const languageName = "Language";
const userPublicName = "UserPublic";
const projectName = "Project";
const ideaName = "Idea";
const ideaCommentName = "IdeaComment";
const ideaCommentMessageName = "IdeaCommentMessage";
const projectSnapshotName = "ProjectSnapshot";
const moduleSnapshotName = "ModuleSnapshot";
const typeSnapshotName = "TypeSnapshot";
const partSnapshotName = "PartSnapshot";

const dateTime: type.CustomType = {
  name: dateTimeName,
  description: "日時 最小単位は秒",
  body: type.customTypeBodyProduct([
    {
      name: "year",
      description: "年. 人類紀元. 西暦に10000を足したもの Human Era",
      memberType: type.typeInt32
    },
    {
      name: "month",
      description: "月. 1月～12月. 最大値は月や年によって決まる",
      memberType: type.typeInt32
    },
    {
      name: "day",
      description: "日",
      memberType: type.typeInt32
    },
    {
      name: "hour",
      description: "時. 0時～23時",
      memberType: type.typeInt32
    },
    {
      name: "minute",
      description: "分",
      memberType: type.typeInt32
    },
    {
      name: "second",
      description: "秒",
      memberType: type.typeInt32
    }
  ])
};

const requestLogInUrlRequestData: type.CustomType = {
  name: requestLogInUrlRequestDataName,
  description: "ログインのURLを発行するために必要なデータ",
  body: type.customTypeBodyProduct([
    {
      name: "openIdConnectProvider",
      description: "ログインに使用するプロバイダー",
      memberType: type.typeCustom(openIdConnectProviderName)
    },
    {
      name: "urlData",
      description: "ログインした後に返ってくるURLに必要なデータ",
      memberType: type.typeCustom(urlDataName)
    }
  ])
};

const openIdConnectProvider: type.CustomType = {
  name: openIdConnectProviderName,
  description: "プロバイダー (例: LINE, Google, GitHub)",
  body: type.customTypeBodySum([
    {
      name: "Google",
      description:
        "Google ( https://developers.google.com/identity/sign-in/web/ )",
      parameter: type.maybeNothing()
    },
    {
      name: "GitHub",
      description:
        "GitHub ( https://developer.github.com/v3/guides/basics-of-authentication/ )",
      parameter: type.maybeNothing()
    }
  ])
};

const urlData: type.CustomType = {
  name: urlDataName,
  description:
    "デバッグモードかどうか,言語とページの場所. URLとして表現されるデータ. Googleなどの検索エンジンの都合( https://support.google.com/webmasters/answer/182192?hl=ja )で,URLにページの言語のを入れて,言語ごとに別のURLである必要がある. デバッグ時のホスト名は http://[::1] になる",
  body: type.customTypeBodyProduct([
    {
      name: "clientMode",
      description: "クライアントモード",
      memberType: type.typeCustom(clientModeName)
    },
    {
      name: "location",
      description: "場所",
      memberType: type.typeCustom(locationName)
    },
    {
      name: "language",
      description: "言語",
      memberType: type.typeCustom(languageName)
    },
    {
      name: "accessToken",
      description:
        "アクセストークン. ログインした後のリダイレクト先としてサーバーから渡される",
      memberType: type.typeMaybe(accessToken)
    }
  ])
};

const clientMode: type.CustomType = {
  name: clientModeName,
  description: "デバッグの状態と, デバッグ時ならアクセスしているポート番号",
  body: type.customTypeBodySum([
    {
      name: "DebugMode",
      description:
        "デバッグモード. ポート番号を保持する. オリジンは http://[::1]:2520 のようなもの",
      parameter: type.maybeJust(type.typeInt32)
    },
    {
      name: "Release",
      description: "リリースモード. https://definy.app ",
      parameter: type.maybeNothing()
    }
  ])
};

const location: type.CustomType = {
  name: locationName,
  description:
    "DefinyWebアプリ内での場所を示すもの. URLから求められる. URLに変換できる",
  body: type.customTypeBodySum([
    {
      name: "Home",
      description: "最初のページ",
      parameter: type.maybeNothing()
    },
    {
      name: "User",
      description: "ユーザーの詳細ページ",
      parameter: type.maybeJust(type.typeId("UserId"))
    },
    {
      name: "Project",
      description: "プロジェクトの詳細ページ",
      parameter: type.maybeJust(type.typeId("ProjectId"))
    }
  ])
};

const language: type.CustomType = {
  name: languageName,
  description: "英語,日本語,エスペラント語などの言語",
  body: type.customTypeBodySum([
    {
      name: "Japanese",
      description: "日本語",
      parameter: type.maybeNothing()
    },
    {
      name: "English",
      description: "英語",
      parameter: type.maybeNothing()
    },
    {
      name: "Esperanto",
      description: "エスペラント語",
      parameter: type.maybeNothing()
    }
  ])
};

const userPublic: type.CustomType = {
  name: userPublicName,
  description: "ユーザーが公開している情報",
  body: type.customTypeBodyProduct([
    {
      name: "name",
      description:
        "ユーザー名. 表示される名前。他のユーザーとかぶっても良い. 絵文字も使える. 全角英数は半角英数,半角カタカナは全角カタカナ, (株)の合字を分解するなどのNFKCの正規化がされる. U+0000-U+0019 と U+007F-U+00A0 の範囲の文字は入らない. 前後に空白を含められない. 間の空白は2文字以上連続しない. 文字数のカウント方法は正規化されたあとのCodePoint単位. Twitterと同じ、1文字以上50文字以下",
      memberType: type.typeString
    },
    {
      name: "imageHash",
      description: "プロフィール画像",
      memberType: fileHash
    },
    {
      name: "introduction",
      description:
        "自己紹介文. 改行文字を含めることができる. Twitterと同じ 0～160文字",
      memberType: type.typeString
    },
    {
      name: "createdAt",
      description: "ユーザーが作成された日時",
      memberType: type.typeCustom(dateTimeName)
    },
    {
      name: "likedProjectIdList",
      description: "プロジェクトに対する いいね",
      memberType: type.typeList(projectId)
    },
    {
      name: "developedProjectIdList",
      description: "開発に参加した (書いたコードが使われた) プロジェクト",
      memberType: type.typeList(projectId)
    },
    {
      name: "commentedIdeaIdList",
      description: "コメントをしたアイデア",
      memberType: type.typeList(ideaId)
    }
  ])
};

const project: type.CustomType = {
  name: projectName,
  description: "プロジェクト",
  body: type.customTypeBodyProduct([
    {
      name: "name",
      description: "プロジェクト名",
      memberType: type.typeString
    },
    {
      name: "icon",
      description: "プロジェクトのアイコン画像",
      memberType: fileHash
    },
    {
      name: "image",
      description: "プロジェクトのカバー画像",
      memberType: fileHash
    },
    {
      name: "releaseBranchCommitHashList",
      description:
        "リリースブランチ. 外部から依存プロジェクトとして読み込める.",
      memberType: type.typeList(projectHash)
    },
    {
      name: "developBranchCommitHashList",
      description: "デベロップブランチ. ",
      memberType: type.typeList(projectHash)
    },
    {
      name: "createdAt",
      description: "作成日時",
      memberType: type.typeCustom(dateTimeName)
    }
  ])
};

const idea: type.CustomType = {
  name: ideaName,
  description: "アイデア",
  body: type.customTypeBodyProduct([
    {
      name: "name",
      description: "プロジェクト名",
      memberType: type.typeString
    },
    {
      name: "createdAt",
      description: "作成日時",
      memberType: type.typeCustom(dateTimeName)
    },
    {
      name: "commentList",
      description: "コメント",
      memberType: type.typeList(type.typeCustom(ideaCommentName))
    },
    {
      name: "draftCommitIdList",
      description: "下書きのコミット",
      memberType: type.typeList(type.typeCustom(projectSnapshotName))
    }
  ])
};

const ideaComment: type.CustomType = {
  name: ideaCommentName,
  description: "アイデアのコメント",
  body: type.customTypeBodySum([
    {
      name: "CommentByMessage",
      description: "文章でのコメント",
      parameter: type.maybeJust(type.typeCustom(ideaCommentMessageName))
    },
    {
      name: "CommentByCommit",
      description: "編集提案をする",
      parameter: type.maybeJust(type.typeCustom(projectSnapshotName))
    }
  ])
};

const ideaCommentMessage: type.CustomType = {
  name: ideaCommentMessageName,
  description: "文章でのコメント",
  body: type.customTypeBodyProduct([
    {
      name: "body",
      description: "本文",
      memberType: type.typeString
    },
    {
      name: "createdBy",
      description: "作成者",
      memberType: userId
    },
    {
      name: "createdAt",
      description: "作成日時",
      memberType: type.typeCustom(dateTimeName)
    }
  ])
};

const projectSnapshot: type.CustomType = {
  name: projectSnapshotName,
  description: "プロジェクトのスナップショット. Gitでいうコミット",
  body: type.customTypeBodyProduct([
    {
      name: "createdAt",
      description: "アイデアに投稿した日時",
      memberType: type.typeCustom(dateTimeName)
    },
    {
      name: "description",
      description: "どんな変更をしたのかの説明",
      memberType: type.typeString
    },
    {
      name: "projectName",
      description: "プロジェクト名",
      memberType: type.typeString
    },
    {
      name: "projectIcon",
      description: "プロジェクトのアイコン画像",
      memberType: fileHash
    },
    {
      name: "projectImage",
      description: "プロジェクトのカバー画像",
      memberType: fileHash
    },
    {
      name: "projectDescription",
      description: "プロジェクトの詳しい説明",
      memberType: type.typeString
    },
    {
      name: "moduleList",
      description: "直下以外のモジュール",
      memberType: type.typeList(moduleHash)
    },
    {
      name: "typeList",
      description: "直下の型",
      memberType: type.typeList(typeHash)
    },
    {
      name: "partList",
      description: "直下のパーツ",
      memberType: type.typeList(partHash)
    }
  ])
};

const moduleSnapshot: type.CustomType = {
  name: moduleSnapshotName,
  description: "モジュールのスナップショット",
  body: type.customTypeBodyProduct([
    {
      name: "name",
      description: "モジュール名",
      memberType: type.typeString
    },
    {
      name: "description",
      description: "モジュールの説明",
      memberType: type.typeString
    },
    {
      name: "export",
      description: "外部のプロジェクトに公開するかどうか",
      memberType: type.typeBool
    },
    {
      name: "children",
      description: "子のモジュール",
      memberType: type.typeList(moduleHash)
    },
    {
      name: "typeList",
      description: "型",
      memberType: type.typeList(typeHash)
    },
    {
      name: "partList",
      description: "パーツ",
      memberType: type.typeList(partHash)
    }
  ])
};

const typeSnapshot: type.CustomType = {
  name: typeSnapshotName,
  description: "型のスナップショット",
  body: type.customTypeBodyProduct([
    {
      name: "name",
      description: "型の名前",
      memberType: type.typeString
    },
    {
      name: "parentList",
      description: "この型の元",
      memberType: type.typeList(partHash)
    },
    {
      name: "description",
      description: "型の説明",
      memberType: type.typeString
    }
  ])
};

const partSnapshot: type.CustomType = {
  name: partSnapshotName,
  description: "パーツのスナップショット",
  body: type.customTypeBodyProduct([
    {
      name: "name",
      description: "パーツの名前",
      memberType: type.typeString
    },
    {
      name: "parentList",
      description: "このパーツの元",
      memberType: type.typeList(partHash)
    },
    {
      name: "description",
      description: "パーツの説明",
      memberType: type.typeString
    }
  ])
};

const listCustomType: ReadonlyArray<type.CustomType> = [
  dateTime,
  clientMode,
  requestLogInUrlRequestData,
  openIdConnectProvider,
  urlData,
  language,
  location,
  userPublic,
  project,
  idea,
  ideaComment,
  ideaCommentMessage,
  projectSnapshot,
  moduleSnapshot,
  typeSnapshot,
  partSnapshot
];

const code = codeGen.generateCodeAsString(
  nt.generateTypeScriptCode(listCustomType),
  "TypeScript"
);

const typeScriptPath = "source/data.ts";
fs.promises.writeFile(typeScriptPath, code).then(() => {
  childProcess.exec(
    "npx prettier " + typeScriptPath,
    (error, standardOutput) => {
      if (error !== null) {
        throw new Error("TypeScript code error! " + error.toString());
      }
      fs.promises.writeFile(typeScriptPath, standardOutput);
      console.log("output TypeScript code!");
    }
  );
});
const elmPath = "Data.elm";
fs.promises
  .writeFile(elmPath, nt.generateElmCode("Data", listCustomType))
  .then(() => {
    childProcess.exec("elm-format --yes " + elmPath, error => {
      console.log("output Elm code!");
      if (error !== null) {
        throw new Error("elm code error! " + error.toString());
      }
    });
  });

import * as nt from "@narumincho/type";
import * as codeGen from "js-ts-code-generator";
import * as fs from "fs";
import * as childProcess from "child_process";

const accessTokenName = "AccessToken";
const userIdName = "UserId";
const projectIdName = "ProjectId";
const ideaIdName = "IdeaId";
const fileHashName = "FileHash";
const projectHashName = "ProjectHash";
const moduleHashName = "ModuleHash";
const typeHashName = "TypeHash";
const partHashName = "PartHash";

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

const dateTime: nt.type.CustomType = {
  name: dateTimeName,
  description: "日時 最小単位は秒",
  body: nt.type.customTypeBodyProduct([
    {
      name: "year",
      description: "年. 人類紀元. 西暦に10000を足したもの Human Era",
      memberType: nt.type.typeInt32
    },
    {
      name: "month",
      description: "月. 1月～12月. 最大値は月や年によって決まる",
      memberType: nt.type.typeInt32
    },
    {
      name: "day",
      description: "日",
      memberType: nt.type.typeInt32
    },
    {
      name: "hour",
      description: "時. 0時～23時",
      memberType: nt.type.typeInt32
    },
    {
      name: "minute",
      description: "分",
      memberType: nt.type.typeInt32
    },
    {
      name: "second",
      description: "秒",
      memberType: nt.type.typeInt32
    }
  ])
};

const requestLogInUrlRequestData: nt.type.CustomType = {
  name: requestLogInUrlRequestDataName,
  description: "ログインのURLを発行するために必要なデータ",
  body: nt.type.customTypeBodyProduct([
    {
      name: "openIdConnectProvider",
      description: "ログインに使用するプロバイダー",
      memberType: nt.type.typeCustom(openIdConnectProviderName)
    },
    {
      name: "urlData",
      description: "ログインした後に返ってくるURLに必要なデータ",
      memberType: nt.type.typeCustom(urlDataName)
    }
  ])
};

const openIdConnectProvider: nt.type.CustomType = {
  name: openIdConnectProviderName,
  description: "プロバイダー (例: LINE, Google, GitHub)",
  body: nt.type.customTypeBodySum([
    {
      name: "Google",
      description:
        "Google ( https://developers.google.com/identity/sign-in/web/ )",
      parameter: nt.type.maybeNothing()
    },
    {
      name: "GitHub",
      description:
        "GitHub ( https://developer.github.com/v3/guides/basics-of-authentication/ )",
      parameter: nt.type.maybeNothing()
    }
  ])
};

const urlData: nt.type.CustomType = {
  name: urlDataName,
  description:
    "デバッグモードかどうか,言語とページの場所. URLとして表現されるデータ. Googleなどの検索エンジンの都合( https://support.google.com/webmasters/answer/182192?hl=ja )で,URLにページの言語のを入れて,言語ごとに別のURLである必要がある. デバッグ時のホスト名は http://[::1] になる",
  body: nt.type.customTypeBodyProduct([
    {
      name: "clientMode",
      description: "クライアントモード",
      memberType: nt.type.typeCustom(clientModeName)
    },
    {
      name: "location",
      description: "場所",
      memberType: nt.type.typeCustom(locationName)
    },
    {
      name: "language",
      description: "言語",
      memberType: nt.type.typeCustom(languageName)
    },
    {
      name: "accessToken",
      description:
        "アクセストークン. ログインした後のリダイレクト先としてサーバーから渡される",
      memberType: nt.type.typeMaybe(nt.type.typeToken(accessTokenName))
    }
  ])
};

const clientMode: nt.type.CustomType = {
  name: clientModeName,
  description: "デバッグの状態と, デバッグ時ならアクセスしているポート番号",
  body: nt.type.customTypeBodySum([
    {
      name: "DebugMode",
      description:
        "デバッグモード. ポート番号を保持する. オリジンは http://[::1]:2520 のようなもの",
      parameter: nt.type.maybeJust(nt.type.typeInt32)
    },
    {
      name: "Release",
      description: "リリースモード. https://definy.app ",
      parameter: nt.type.maybeNothing()
    }
  ])
};

const location: nt.type.CustomType = {
  name: locationName,
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

const language: nt.type.CustomType = {
  name: languageName,
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

const userPublic: nt.type.CustomType = {
  name: userPublicName,
  description: "ユーザーが公開している情報",
  body: nt.type.customTypeBodyProduct([
    {
      name: "name",
      description:
        "ユーザー名. 表示される名前。他のユーザーとかぶっても良い. 絵文字も使える. 全角英数は半角英数,半角カタカナは全角カタカナ, (株)の合字を分解するなどのNFKCの正規化がされる. U+0000-U+0019 と U+007F-U+00A0 の範囲の文字は入らない. 前後に空白を含められない. 間の空白は2文字以上連続しない. 文字数のカウント方法は正規化されたあとのCodePoint単位. Twitterと同じ、1文字以上50文字以下",
      memberType: nt.type.typeString
    },
    {
      name: "imageHash",
      description: "プロフィール画像",
      memberType: nt.type.typeToken(fileHashName)
    },
    {
      name: "introduction",
      description:
        "自己紹介文. 改行文字を含めることができる. Twitterと同じ 0～160文字",
      memberType: nt.type.typeString
    },
    {
      name: "createdAt",
      description: "ユーザーが作成された日時",
      memberType: nt.type.typeCustom(dateTimeName)
    },
    {
      name: "likedProjectIdList",
      description: "プロジェクトに対する いいね",
      memberType: nt.type.typeList(nt.type.typeId(projectIdName))
    },
    {
      name: "developedProjectIdList",
      description: "開発に参加した (書いたコードが使われた) プロジェクト",
      memberType: nt.type.typeList(nt.type.typeId(projectIdName))
    },
    {
      name: "commentedIdeaIdList",
      description: "コメントをしたアイデア",
      memberType: nt.type.typeList(nt.type.typeId(ideaIdName))
    }
  ])
};

const project: nt.type.CustomType = {
  name: projectName,
  description: "プロジェクト",
  body: nt.type.customTypeBodyProduct([
    {
      name: "name",
      description: "プロジェクト名",
      memberType: nt.type.typeString
    },
    {
      name: "icon",
      description: "プロジェクトのアイコン画像",
      memberType: nt.type.typeToken(fileHashName)
    },
    {
      name: "image",
      description: "プロジェクトのカバー画像",
      memberType: nt.type.typeToken(fileHashName)
    },
    {
      name: "releaseBranchCommitHashList",
      description:
        "リリースブランチ. 外部から依存プロジェクトとして読み込める.",
      memberType: nt.type.typeList(nt.type.typeToken(projectHashName))
    },
    {
      name: "developBranchCommitHashList",
      description: "デベロップブランチ. ",
      memberType: nt.type.typeList(nt.type.typeToken(projectHashName))
    },
    {
      name: "createdAt",
      description: "作成日時",
      memberType: nt.type.typeCustom(dateTimeName)
    }
  ])
};

const idea: nt.type.CustomType = {
  name: ideaName,
  description: "アイデア",
  body: nt.type.customTypeBodyProduct([
    {
      name: "name",
      description: "プロジェクト名",
      memberType: nt.type.typeString
    },
    {
      name: "createdAt",
      description: "作成日時",
      memberType: nt.type.typeCustom(dateTimeName)
    },
    {
      name: "commentList",
      description: "コメント",
      memberType: nt.type.typeList(nt.type.typeCustom(ideaCommentName))
    },
    {
      name: "draftCommitIdList",
      description: "下書きのコミット",
      memberType: nt.type.typeList(nt.type.typeCustom(projectSnapshotName))
    }
  ])
};

const ideaComment: nt.type.CustomType = {
  name: ideaCommentName,
  description: "アイデアのコメント",
  body: nt.type.customTypeBodySum([
    {
      name: "CommentByMessage",
      description: "文章でのコメント",
      parameter: nt.type.maybeJust(nt.type.typeCustom(ideaCommentMessageName))
    },
    {
      name: "CommentByCommit",
      description: "編集提案をする",
      parameter: nt.type.maybeJust(nt.type.typeCustom(projectSnapshotName))
    }
  ])
};

const ideaCommentMessage: nt.type.CustomType = {
  name: ideaCommentMessageName,
  description: "文章でのコメント",
  body: nt.type.customTypeBodyProduct([
    {
      name: "body",
      description: "本文",
      memberType: nt.type.typeString
    },
    {
      name: "createdBy",
      description: "作成者",
      memberType: nt.type.typeId(userIdName)
    },
    {
      name: "createdAt",
      description: "作成日時",
      memberType: nt.type.typeCustom(dateTimeName)
    }
  ])
};

const projectSnapshot: nt.type.CustomType = {
  name: projectSnapshotName,
  description: "プロジェクトのスナップショット. Gitでいうコミット",
  body: nt.type.customTypeBodyProduct([
    {
      name: "createdAt",
      description: "アイデアに投稿した日時",
      memberType: nt.type.typeCustom(dateTimeName)
    },
    {
      name: "description",
      description: "どんな変更をしたのかの説明",
      memberType: nt.type.typeString
    },
    {
      name: "projectName",
      description: "プロジェクト名",
      memberType: nt.type.typeString
    },
    {
      name: "projectIcon",
      description: "プロジェクトのアイコン画像",
      memberType: nt.type.typeToken(fileHashName)
    },
    {
      name: "projectImage",
      description: "プロジェクトのカバー画像",
      memberType: nt.type.typeToken(fileHashName)
    },
    {
      name: "projectDescription",
      description: "プロジェクトの詳しい説明",
      memberType: nt.type.typeString
    },
    {
      name: "moduleList",
      description: "直下以外のモジュール",
      memberType: nt.type.typeList(nt.type.typeToken(moduleHashName))
    },
    {
      name: "typeList",
      description: "直下の型",
      memberType: nt.type.typeList(nt.type.typeToken(typeSnapshotName))
    },
    {
      name: "partList",
      description: "直下のパーツ",
      memberType: nt.type.typeList(nt.type.typeToken(partSnapshotName))
    }
  ])
};

const moduleSnapshot: nt.type.CustomType = {
  name: moduleSnapshotName,
  description: "モジュールのスナップショット",
  body: nt.type.customTypeBodyProduct([
    {
      name: "name",
      description: "モジュール名",
      memberType: nt.type.typeString
    },
    {
      name: "description",
      description: "モジュールの説明",
      memberType: nt.type.typeString
    },
    {
      name: "export",
      description: "外部のプロジェクトに公開するかどうか",
      memberType: nt.type.typeBool
    },
    {
      name: "children",
      description: "子のモジュール",
      memberType: nt.type.typeList(nt.type.typeToken(moduleHashName))
    },
    {
      name: "typeList",
      description: "型",
      memberType: nt.type.typeList(nt.type.typeToken(typeSnapshotName))
    },
    {
      name: "partList",
      description: "パーツ",
      memberType: nt.type.typeList(nt.type.typeToken(partSnapshotName))
    }
  ])
};

const typeSnapshot: nt.type.CustomType = {
  name: typeSnapshotName,
  description: "型のスナップショット",
  body: nt.type.customTypeBodyProduct([
    {
      name: "name",
      description: "型の名前",
      memberType: nt.type.typeString
    },
    {
      name: "parentList",
      description: "この型の元",
      memberType: nt.type.typeList(nt.type.typeToken(partHashName))
    },
    {
      name: "description",
      description: "型の説明",
      memberType: nt.type.typeString
    }
  ])
};

const partSnapshot: nt.type.CustomType = {
  name: partSnapshotName,
  description: "パーツのスナップショット",
  body: nt.type.customTypeBodyProduct([
    {
      name: "name",
      description: "パーツの名前",
      memberType: nt.type.typeString
    },
    {
      name: "parentList",
      description: "このパーツの元",
      memberType: nt.type.typeList(nt.type.typeToken(partHashName))
    },
    {
      name: "description",
      description: "パーツの説明",
      memberType: nt.type.typeString
    }
  ])
};

const schema: nt.type.Schema = {
  customTypeList: [
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
  ],
  idOrTokenTypeNameList: [
    accessTokenName,
    userIdName,
    projectIdName,
    ideaIdName,
    fileHashName,
    projectHashName,
    moduleHashName,
    typeHashName,
    partHashName
  ]
};

const code = codeGen.generateCodeAsString(
  nt.generateTypeScriptCode(schema),
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
fs.promises.writeFile(elmPath, nt.elm.generateCode("Data", schema)).then(() => {
  childProcess.exec("elm-format --yes " + elmPath, error => {
    console.log("output Elm code!");
    if (error !== null) {
      throw new Error("elm code error! " + error.toString());
    }
  });
});

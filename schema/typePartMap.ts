import * as id from "./typePartId";
import * as type from "./type";
import * as util from "../source/util";
import {
  Maybe,
  TypeAttribute,
  TypeParameter,
  TypePart,
  TypePartBody,
  TypePartBodyKernel,
  TypePartId,
} from "../source/data";

const maybeValueTypePartId = "7340e6b552af43695335a64e057f4250" as TypePartId;

const resultOkTypePartId = "2163b3c97b382de8085973eff850c919" as TypePartId;
const resultErrorTypePartId = "bd8be8409130f30f15c5c86c01de6dc5" as TypePartId;

const idAndDataIdTypePartId = "fc6ea18b02d5cfa07c79182be262ad72" as TypePartId;
const idAndDataDataTypePartId = "5ca542b76f5199346931fb46caec2a85" as TypePartId;

const resourceDataTypePartId = "79be6a507196441f8c317c8a7415a9d0" as TypePartId;

const resourceStateDataTypePartId = "5089ac70cf7b31947a7ba2c244212578" as TypePartId;

const staticResourceStateDataTypePartId = "c99b0600c7aca05a1716e4a4c3519cec" as TypePartId;

const t = (param: {
  name: string;
  description: string;
  attribute?: TypeAttribute;
  typeParameterList?: ReadonlyArray<TypeParameter>;
  body: TypePartBody;
}): TypePart => {
  return {
    name: param.name,
    description: param.description,
    attribute:
      param.attribute === undefined
        ? Maybe.Nothing()
        : Maybe.Just(param.attribute),
    projectId: util.definyCodeProjectId,
    typeParameterList: param.typeParameterList ?? [],
    body: param.body,
  };
};

export const typePartMap: ReadonlyMap<TypePartId, TypePart> = new Map<
  TypePartId,
  TypePart
>([
  [
    id.Int32,
    t({
      name: "Int32",
      description:
        "-2 147 483 648 ～ 2 147 483 647. 32bit 符号付き整数. JavaScriptのnumberとして扱える. numberの32bit符号あり整数をSigned Leb128のバイナリに変換する",
      body: TypePartBody.Kernel(TypePartBodyKernel.Int32),
    }),
  ],
  [
    id.Binary,
    t({
      name: "Binary",
      description:
        "バイナリ. JavaScriptのUint8Arrayで扱える. 最初にLED128でバイト数, その次にバイナリそのまま",
      body: TypePartBody.Kernel(TypePartBodyKernel.Binary),
    }),
  ],
  [
    id.Bool,
    t({
      name: "Bool",
      description:
        "Bool. 真か偽. JavaScriptのbooleanで扱える. true: 1, false: 0. (1byte)としてバイナリに変換する",
      attribute: TypeAttribute.AsBoolean,
      body: TypePartBody.Sum([
        {
          name: "False",
          description: "偽",
          parameter: Maybe.Nothing(),
        },
        {
          name: "True",
          description: "真",
          parameter: Maybe.Nothing(),
        },
      ]),
    }),
  ],
  [
    id.List,
    t({
      name: "List",
      description: "リスト. JavaScriptのArrayで扱う",
      typeParameterList: [
        {
          name: "e",
          typePartId: "cf95a75adf60a7eecabe7d0b4c3e68cd" as TypePartId,
        },
      ],
      body: TypePartBody.Kernel(TypePartBodyKernel.List),
    }),
  ],
  [
    id.Maybe,
    t({
      name: "Maybe",
      description:
        "Maybe. nullableのようなもの. 今後はRustのstd::Optionに出力するために属性をつける?",
      typeParameterList: [
        {
          typePartId: maybeValueTypePartId,
          name: "value",
        },
      ],
      body: TypePartBody.Sum([
        {
          name: "Just",
          description: "値があるということ",
          parameter: Maybe.Just({
            typePartId: maybeValueTypePartId,
            parameter: [],
          }),
        },
        {
          name: "Nothing",
          description: "値がないということ",
          parameter: Maybe.Nothing(),
        },
      ]),
    }),
  ],
  [
    id.Result,
    t({
      name: "Result",
      description:
        "成功と失敗を表す型. 今後はRustのstd::Resultに出力するために属性をつける?",
      typeParameterList: [
        {
          typePartId: resultOkTypePartId,
          name: "ok",
        },
        {
          typePartId: resultErrorTypePartId,
          name: "error",
        },
      ],
      body: TypePartBody.Sum([
        {
          name: "Ok",
          description: "成功",
          parameter: Maybe.Just({
            typePartId: resultOkTypePartId,
            parameter: [],
          }),
        },
        {
          name: "Error",
          description: "失敗",
          parameter: Maybe.Just({
            typePartId: resultErrorTypePartId,
            parameter: [],
          }),
        },
      ]),
    }),
  ],
  [
    id.String,
    t({
      name: "String",
      description:
        "文字列. JavaScriptのstringで扱う. バイナリ形式はUTF-8. 不正な文字が入っている可能性がある",
      body: TypePartBody.Kernel(TypePartBodyKernel.String),
    }),
  ],
  [
    id.Unit,
    t({
      name: "Unit",
      description: "Unit. 1つの値しかない型. JavaScriptのundefinedで扱う",
      attribute: TypeAttribute.AsUndefined,
      body: TypePartBody.Sum([
        {
          name: "Unit",
          description: "Unit型にある.唯一の値",
          parameter: Maybe.Nothing(),
        },
      ]),
    }),
  ],
  [
    id.ProjectId,
    t({
      name: "ProjectId",
      description: "プロジェクトの識別子",
      body: TypePartBody.Kernel(TypePartBodyKernel.Id),
    }),
  ],
  [
    id.UserId,
    t({
      name: "UserId",
      description: "ユーザーの識別子",
      body: TypePartBody.Kernel(TypePartBodyKernel.Id),
    }),
  ],
  [
    id.IdeaId,
    t({
      name: "IdeaId",
      description: "アイデアの識別子",
      body: TypePartBody.Kernel(TypePartBodyKernel.Id),
    }),
  ],
  [
    id.CommitId,
    t({
      name: "CommitId",
      description: "提案の識別子",
      body: TypePartBody.Kernel(TypePartBodyKernel.Id),
    }),
  ],
  [
    id.ImageToken,
    t({
      name: "ImageToken",
      description:
        "画像から求められるトークン.キャッシュのキーとして使われる.1つのトークンに対して永久に1つの画像データしか表さない. キャッシュを更新する必要はない",
      body: TypePartBody.Kernel(TypePartBodyKernel.Token),
    }),
  ],
  [
    id.PartId,
    t({
      name: "PartId",
      description: "パーツの識別子",
      body: TypePartBody.Kernel(TypePartBodyKernel.Id),
    }),
  ],
  [
    id.TypePartId,
    t({
      name: "TypePartId",
      description: "型パーツの識別子",
      body: TypePartBody.Kernel(TypePartBodyKernel.Id),
    }),
  ],
  [
    id.TagId,
    t({
      name: "TagId",
      description: "タグの識別子",
      body: TypePartBody.Kernel(TypePartBodyKernel.Id),
    }),
  ],
  [
    id.AccountToken,
    t({
      name: "AccountToken",
      description:
        "アカウントトークン. アカウントトークンを持っていればアクセストークンをDefinyのサーバーにリクエストした際に得られるIDのアカウントを保有していると証明できる. サーバーにハッシュ化したものを保存している. これが盗まれた場合,不正に得た人はアカウントを乗っ取ることができる. 有効期限はなし, 最後に発行したアカウントトークン以外は無効になる",
      body: TypePartBody.Kernel(TypePartBodyKernel.Token),
    }),
  ],
  [
    id.PartHash,
    t({
      name: "PartHash",
      description:
        "コミット内に入る. パーツのハッシュ化したもの. ハッシュ化にはパーツ名やドキュメントも含める",
      body: TypePartBody.Kernel(TypePartBodyKernel.Token),
    }),
  ],
  [
    id.TypePartHash,
    t({
      name: "TypePartHash",
      description:
        "コミット内に入る. 型パーツのハッシュ化したもの. ハッシュ化には型パーツ名やドキュメントも含める",
      body: TypePartBody.Kernel(TypePartBodyKernel.Token),
    }),
  ],
  [
    id.ReleasePartId,
    t({
      name: "ReleasePartId",
      description:
        "他のプロジェクトのパーツを使うときに使う. 互換性が維持される限り,IDが同じになる",
      body: TypePartBody.Kernel(TypePartBodyKernel.Id),
    }),
  ],
  [
    id.ReleaseTypePartId,
    t({
      name: "ReleaseTypePartId",
      description:
        "他のプロジェクトの型パーツを使うときに使う. 互換性が維持される限り,IDが同じになる",
      body: TypePartBody.Kernel(TypePartBodyKernel.Id),
    }),
  ],
  [
    id.Time,
    t({
      name: "Time",
      description:
        "日時. 0001-01-01T00:00:00.000Z to 9999-12-31T23:59:59.999Z 最小単位はミリ秒. ミリ秒の求め方は day*1000*60*60*24 + millisecond",
      body: TypePartBody.Product([
        {
          name: "day",
          description: "1970-01-01からの経過日数. マイナスになることもある",
          type: type.Int32,
        },
        {
          name: "millisecond",
          description: "日にちの中のミリ秒. 0 to 86399999 (=1000*60*60*24-1)",
          type: type.Int32,
        },
      ]),
    }),
  ],
  [
    id.RequestLogInUrlRequestData,
    t({
      name: "RequestLogInUrlRequestData",
      description: "ログインのURLを発行するために必要なデータ",
      body: TypePartBody.Product([
        {
          name: "openIdConnectProvider",
          description: "ログインに使用するプロバイダー",
          type: type.OpenIdConnectProvider,
        },
        {
          name: "urlData",
          description: "ログインした後に返ってくるURLに必要なデータ",
          type: type.UrlData,
        },
      ]),
    }),
  ],
  [
    id.OpenIdConnectProvider,
    t({
      name: "OpenIdConnectProvider",
      description:
        "ソーシャルログインを提供するプロバイダー (例: Google, GitHub)",
      body: TypePartBody.Sum([
        {
          name: "Google",
          description:
            "Google ( https://developers.google.com/identity/sign-in/web/ )",
          parameter: Maybe.Nothing(),
        },
        {
          name: "GitHub",
          description:
            "GitHub ( https://developer.github.com/v3/guides/basics-of-authentication/ )",
          parameter: Maybe.Nothing(),
        },
      ]),
    }),
  ],
  [
    id.UrlData,
    t({
      name: "UrlData",
      description:
        "デバッグモードかどうか,言語とページの場所. URLとして表現されるデータ. Googleなどの検索エンジンの都合( https://support.google.com/webmasters/answer/182192?hl=ja )で,URLにページの言語を入れて,言語ごとに別のURLである必要がある. デバッグ時のホスト名は http://localhost になる",
      body: TypePartBody.Product([
        {
          name: "clientMode",
          description: "クライアントモード",
          type: type.ClientMode,
        },
        {
          name: "location",
          description: "場所",
          type: type.Location,
        },
        {
          name: "language",
          description: "言語",
          type: type.Language,
        },
      ]),
    }),
  ],
  [
    id.ClientMode,
    t({
      name: "ClientMode",
      description: "デバッグモードか, リリースモード",
      body: TypePartBody.Sum([
        {
          name: "DebugMode",
          description: "デバッグモード. オリジンは http://localshot:2520",
          parameter: Maybe.Nothing(),
        },
        {
          name: "Release",
          description: "リリースモード. オリジンは https://definy.app ",
          parameter: Maybe.Nothing(),
        },
      ]),
    }),
  ],
  [
    id.Location,
    t({
      name: "Location",
      description:
        "DefinyWebアプリ内での場所を示すもの. URLから求められる. URLに変換できる",
      body: TypePartBody.Sum([
        {
          name: "Home",
          description: "最初のページ",
          parameter: Maybe.Nothing(),
        },
        {
          name: "CreateProject",
          description: "プロジェクト作成画面",
          parameter: Maybe.Nothing(),
        },
        {
          name: "Project",
          description: "プロジェクトの詳細ページ",
          parameter: Maybe.Just(type.ProjectId),
        },
        {
          name: "User",
          description: "ユーザーの詳細ページ",
          parameter: Maybe.Just(type.UserId),
        },
        {
          name: "Idea",
          description: "アイデア詳細ページ",
          parameter: Maybe.Just(type.IdeaId),
        },
        {
          name: "Commit",
          description: "コミットの詳細, 編集ページ",
          parameter: Maybe.Just(type.CommitId),
        },
        {
          name: "Setting",
          description: "設定ページ",
          parameter: Maybe.Nothing(),
        },
        {
          name: "About",
          description: "Definyについて説明したページ",
          parameter: Maybe.Nothing(),
        },
        {
          name: "Debug",
          description: "デバッグページ",
          parameter: Maybe.Nothing(),
        },
      ]),
    }),
  ],
  [
    id.Language,
    t({
      name: "Language",
      description: "英語,日本語,エスペラント語などの言語",
      body: TypePartBody.Sum([
        {
          name: "Japanese",
          description: "日本語",
          parameter: Maybe.Nothing(),
        },
        {
          name: "English",
          description: "英語",
          parameter: Maybe.Nothing(),
        },
        {
          name: "Esperanto",
          description: "エスペラント語",
          parameter: Maybe.Nothing(),
        },
      ]),
    }),
  ],
  [
    id.User,
    t({
      name: "User",
      description: "ユーザーのデータのスナップショット",
      body: TypePartBody.Product([
        {
          name: "name",
          description:
            "ユーザー名. 表示される名前. 他のユーザーとかぶっても良い. 絵文字も使える. 全角英数は半角英数,半角カタカナは全角カタカナ, (株)の合字を分解するなどのNFKCの正規化がされる. U+0000-U+0019 と U+007F-U+00A0 の範囲の文字は入らない. 前後に空白を含められない. 間の空白は2文字以上連続しない. 文字数のカウント方法は正規化されたあとのCodePoint単位. Twitterと同じ, 1文字以上50文字以下",
          type: type.String,
        },
        {
          name: "imageHash",
          description: "プロフィール画像",
          type: type.ImageToken,
        },
        {
          name: "introduction",
          description:
            "自己紹介文. 改行文字を含めることができる. Twitterと同じ 0～160文字",
          type: type.String,
        },
        {
          name: "createTime",
          description: "Definyでユーザーが作成された日時",
          type: type.Time,
        },
      ]),
    }),
  ],
  [
    id.IdAndData,
    t({
      name: "IdAndData",
      description: "データを識別するIdとデータ",
      typeParameterList: [
        { name: "id", typePartId: idAndDataIdTypePartId },
        { name: "data", typePartId: idAndDataDataTypePartId },
      ],
      body: TypePartBody.Product([
        {
          name: "id",
          description: "ID",
          type: { typePartId: idAndDataIdTypePartId, parameter: [] },
        },
        {
          name: "data",
          description: "データ",
          type: { typePartId: idAndDataDataTypePartId, parameter: [] },
        },
      ]),
    }),
  ],
  [
    id.Project,
    t({
      name: "Project",
      description: "プロジェクト",
      body: TypePartBody.Product([
        {
          name: "name",
          description: "プロジェクト名",
          type: type.String,
        },
        {
          name: "iconHash",
          description: "プロジェクトのアイコン画像",
          type: type.ImageToken,
        },
        {
          name: "imageHash",
          description: "プロジェクトのカバー画像",
          type: type.ImageToken,
        },
        {
          name: "createTime",
          description: "作成日時",
          type: type.Time,
        },
        {
          name: "createUserId",
          description: "プロジェクトを作成したユーザー",
          type: type.UserId,
        },
        {
          name: "updateTime",
          description: "更新日時",
          type: type.Time,
        },
        {
          name: "rootIdeaId",
          description: "ルートのアイデア",
          type: type.IdeaId,
        },
        {
          name: "commitId",
          description: "リリースされたコミット",
          type: type.CommitId,
        },
      ]),
    }),
  ],
  [
    id.Idea,
    t({
      name: "Idea",
      description: "アイデア",
      body: TypePartBody.Product([
        {
          name: "name",
          description: "アイデア名 最大240文字まで",
          type: type.String,
        },
        {
          name: "createUserId",
          description: "言い出しっぺ",
          type: type.UserId,
        },
        {
          name: "createTime",
          description: "作成日時 ",
          type: type.Time,
        },
        {
          name: "projectId",
          description: "対象のプロジェクト",
          type: type.ProjectId,
        },
        {
          name: "commentList",
          description: "アイデアのコメント",
          type: type.List(type.Comment),
        },
        {
          name: "parentIdeaId",
          description: "親のアイデア",
          type: type.Maybe(type.IdeaId),
        },
        {
          name: "updateTime",
          description: "更新日時",
          type: type.Time,
        },
        {
          name: "state",
          description: "アイデアの状態",
          type: type.IdeaState,
        },
      ]),
    }),
  ],
  [
    id.Comment,
    t({
      name: "Comment",
      description: "アイデアのコメント",
      body: TypePartBody.Product([
        {
          name: "createUserId",
          description: "作成者",
          type: type.UserId,
        },
        {
          name: "createTime",
          description: "作成日時",
          type: type.Time,
        },
        {
          name: "body",
          description: "本文 1～10000文字",
          type: type.String,
        },
      ]),
    }),
  ],
  [
    id.Commit,
    t({
      name: "Commit",
      description: "コミット. コードのスナップショット",
      body: TypePartBody.Product([
        {
          name: "createUserId",
          description: "作成者",
          type: type.UserId,
        },
        {
          name: "description",
          description: "説明",
          type: type.String,
        },
        {
          name: "isDraft",
          description: "まだ確定していないか",
          type: type.Bool,
        },
        {
          name: "projectName",
          description: "プロジェクト名",
          type: type.String,
        },
        {
          name: "projectImage",
          description: "プロジェクトの画像",
          type: type.ImageToken,
        },
        {
          name: "projectIcon",
          description: "プロジェクトのアイコン",
          type: type.ImageToken,
        },
        {
          name: "partHashList",
          description: "パーツ",
          type: type.List(type.PartHash),
        },
        {
          name: "typePartHashList",
          description: "型パーツ",
          type: type.List(type.TypePartHash),
        },
        {
          name: "projectId",
          description: "変更をするプロジェクト",
          type: type.ProjectId,
        },
        {
          name: "ideaId",
          description: "投稿したアイデアID",
          type: type.IdeaId,
        },
        {
          name: "createTime",
          description: "作成日時",
          type: type.Time,
        },
        {
          name: "updateTime",
          description: "更新日時",
          type: type.Time,
        },
      ]),
    }),
  ],
  [
    id.IdeaState,
    t({
      name: "IdeaState",
      description: "アイデアの状況",
      body: TypePartBody.Sum([
        {
          name: "Creating",
          description: "コミットと子アイデアとコメントを受付中",
          parameter: Maybe.Nothing(),
        },
        {
          name: "Approved",
          description: "実現するコミットが作られ, 承認された",
          parameter: Maybe.Just(type.CommitId),
        },
      ]),
    }),
  ],
  [
    id.Part,
    t({
      name: "Part",
      description: "パーツの定義",
      body: TypePartBody.Product([
        {
          name: "name",
          description: "パーツの名前",
          type: type.String,
        },
        {
          name: "description",
          description: "パーツの説明",
          type: type.String,
        },
        {
          name: "type",
          description: "パーツの型",
          type: type.Type,
        },
        {
          name: "expr",
          description: "パーツの式",
          type: type.Expr,
        },
        {
          name: "projectId",
          description: "所属しているプロジェクトのID",
          type: type.ProjectId,
        },
        {
          name: "createCommitId",
          description: "このパーツが作成されたコミット",
          type: type.CommitId,
        },
      ]),
    }),
  ],
  [
    id.TypePart,
    t({
      name: "TypePart",
      description: "型パーツ",
      body: TypePartBody.Product([
        {
          name: "name",
          description: "型パーツの名前",
          type: type.String,
        },
        {
          name: "description",
          description: "型パーツの説明",
          type: type.String,
        },
        {
          name: "projectId",
          description: "所属しているプロジェクトのID",
          type: type.ProjectId,
        },
        {
          name: "attribute",
          description:
            "コンパイラに与える,この型を表現するのにどういう特殊な状態にするかという情報",
          type: type.Maybe(type.TypeAttribute),
        },
        {
          name: "typeParameterList",
          description: "型パラメーター",
          type: type.List(type.TypeParameter),
        },
        {
          name: "body",
          description: "定義本体",
          type: type.TypePartBody,
        },
      ]),
    }),
  ],
  [
    id.TypeAttribute,
    t({
      name: "TypeAttribute",
      description: "コンパイラに向けた, 型のデータ形式をどうするかの情報",
      body: TypePartBody.Sum([
        {
          name: "AsBoolean",
          description:
            "JavaScript, TypeScript で boolean として扱うように指示する. 定義が2つのパターンで両方パラメーターなし false, trueの順である必要がある",
          parameter: Maybe.Nothing(),
        },
        {
          name: "AsUndefined",
          description:
            "JavaScript, TypeScript で undefined として扱うように指示する. 定義が1つのパターンでパラメーターなしである必要がある",
          parameter: Maybe.Nothing(),
        },
      ]),
    }),
  ],
  [
    id.TypeParameter,
    t({
      name: "TypeParameter",
      description: "型パラメーター",
      body: TypePartBody.Product([
        {
          name: "name",
          description: "型パラメーターの名前",
          type: type.String,
        },
        {
          name: "typePartId",
          description: "型パラメーターの型ID",
          type: type.TypePartId,
        },
      ]),
    }),
  ],
  [
    id.TypePartBody,
    t({
      name: "TypePartBody",
      description: "型の定義本体",
      body: TypePartBody.Sum([
        {
          name: "Product",
          description: "直積型",
          parameter: Maybe.Just(type.List(type.Member)),
        },
        {
          name: "Sum",
          description: "直和型",
          parameter: Maybe.Just(type.List(type.Pattern)),
        },
        {
          name: "Kernel",
          description: "Definyだけでは表現できないデータ型",
          parameter: Maybe.Just(type.TypePartBodyKernel),
        },
      ]),
    }),
  ],
  [
    id.Member,
    t({
      name: "Member",
      description: "直積型のメンバー",
      body: TypePartBody.Product([
        {
          name: "name",
          description: "メンバー名",
          type: type.String,
        },
        {
          name: "description",
          description: "メンバーの説明",
          type: type.String,
        },
        {
          name: "type",
          description: "メンバー値の型",
          type: type.Type,
        },
      ]),
    }),
  ],
  [
    id.Pattern,
    t({
      name: "Pattern",
      description: "直積型のパターン",
      body: TypePartBody.Product([
        {
          name: "name",
          description: "タグ名",
          type: type.String,
        },
        {
          name: "description",
          description: "パターンの説明",
          type: type.String,
        },
        {
          name: "parameter",
          description: "そのパターンにつけるデータの型",
          type: type.Maybe(type.Type),
        },
      ]),
    }),
  ],
  [
    id.TypePartBodyKernel,
    t({
      name: "TypePartBodyKernel",
      description: "Definyだけでは表現できないデータ型",
      body: TypePartBody.Sum([
        {
          name: "Function",
          description: "関数",
          parameter: Maybe.Nothing(),
        },
        {
          name: "Int32",
          description: "32bit整数",
          parameter: Maybe.Nothing(),
        },
        {
          name: "String",
          description:
            "文字列. Definyだけで表現できるが, TypeScriptでstringとして扱うために必要",
          parameter: Maybe.Nothing(),
        },
        {
          name: "Binary",
          description: "バイナリ型. TypeScriptではUint8Arrayとして扱う",
          parameter: Maybe.Nothing(),
        },
        {
          name: "Id",
          description:
            "UUID (16byte) を表現する. 内部表現はとりあえず0-f長さ32の文字列",
          parameter: Maybe.Nothing(),
        },
        {
          name: "Token",
          description:
            "sha256などでハッシュ化したもの (32byte) を表現する. 内部表現はとりあえず0-f長さ64の文字列",
          parameter: Maybe.Nothing(),
        },
        {
          name: "List",
          description: "配列型. TypeScriptではReadonlyArrayとして扱う",
          parameter: Maybe.Nothing(),
        },
      ]),
    }),
  ],
  [
    id.Type,
    t({
      name: "Type",
      description: "型",
      body: TypePartBody.Product([
        {
          name: "typePartId",
          description: "型の参照",
          type: type.TypePartId,
        },
        {
          name: "parameter",
          description: "型のパラメーター",
          type: type.List(type.Type),
        },
      ]),
    }),
  ],
  [
    id.Expr,
    t({
      name: "Expr",
      description: "式",
      body: TypePartBody.Sum([
        {
          name: "Kernel",
          description: "Definyだけでは表現できない式",
          parameter: Maybe.Just(type.KernelExpr),
        },
        {
          name: "Int32Literal",
          description: "32bit整数",
          parameter: Maybe.Just(type.Int32),
        },
        {
          name: "PartReference",
          description: "パーツの値を参照",
          parameter: Maybe.Just(type.PartId),
        },
        {
          name: "TagReference",
          description: "タグを参照",
          parameter: Maybe.Just(type.TagReference),
        },
        {
          name: "FunctionCall",
          description: "関数呼び出し",
          parameter: Maybe.Just(type.FunctionCall),
        },
        {
          name: "Lambda",
          description: "ラムダ",
          parameter: Maybe.Just(type.List(type.LambdaBranch)),
        },
      ]),
    }),
  ],
  [
    id.KernelExpr,
    t({
      name: "KernelExpr",
      description: "Definyだけでは表現できない式",
      body: TypePartBody.Sum([
        {
          name: "Int32Add",
          description: "32bit整数を足す関数",
          parameter: Maybe.Nothing(),
        },
        {
          name: "Int32Sub",
          description: "32bit整数を引く関数",
          parameter: Maybe.Nothing(),
        },
        {
          name: "Int32Mul",
          description: "32bit整数をかける関数",
          parameter: Maybe.Nothing(),
        },
      ]),
    }),
  ],
  [
    id.TagReference,
    t({
      name: "TagReference",
      description: "タグの参照を表す",
      body: TypePartBody.Product([
        {
          name: "typePartId",
          description: "型ID",
          type: type.TypePartId,
        },
        {
          name: "tagId",
          description: "タグID",
          type: type.TagId,
        },
      ]),
    }),
  ],
  [
    id.FunctionCall,
    t({
      name: "FunctionCall",
      description: "関数呼び出し",
      body: TypePartBody.Product([
        {
          name: "function",
          description: "関数",
          type: type.Expr,
        },
        {
          name: "parameter",
          description: "パラメーター",
          type: type.Expr,
        },
      ]),
    }),
  ],
  [
    id.LambdaBranch,
    t({
      name: "LambdaBranch",
      description: "ラムダのブランチ. Just x -> data x のようなところ",
      body: TypePartBody.Product([
        {
          name: "condition",
          description: "入力値の条件を書くところ. Just x",
          type: type.Condition,
        },
        {
          name: "description",
          description: "ブランチの説明",
          type: type.String,
        },
        {
          name: "localPartList",
          description: "",
          type: type.List(type.BranchPartDefinition),
        },
        {
          name: "expr",
          description: "式",
          type: type.Expr,
        },
      ]),
    }),
  ],
  [
    id.Condition,
    t({
      name: "Condition",
      description: "ブランチの式を使う条件",
      body: TypePartBody.Sum([
        {
          name: "ByTag",
          description: "タグ",
          parameter: Maybe.Just(type.ConditionTag),
        },
        {
          name: "ByCapture",
          description: "キャプチャパーツへのキャプチャ",
          parameter: Maybe.Just(type.ConditionCapture),
        },
        {
          name: "Any",
          description: "_ すべてのパターンを通すもの",
          parameter: Maybe.Nothing(),
        },
        {
          name: "Int32",
          description: "32bit整数の完全一致",
          parameter: Maybe.Just(type.Int32),
        },
      ]),
    }),
  ],
  [
    id.ConditionTag,
    t({
      name: "ConditionTag",
      description: "タグによる条件",
      body: TypePartBody.Product([
        {
          name: "tag",
          description: "タグ",
          type: type.TagId,
        },
        {
          name: "parameter",
          description: "パラメーター",
          type: type.Maybe(type.Condition),
        },
      ]),
    }),
  ],
  [
    id.ConditionCapture,
    t({
      name: "ConditionCapture",
      description: "キャプチャパーツへのキャプチャ",
      body: TypePartBody.Product([
        {
          name: "name",
          description: "キャプチャパーツの名前",
          type: type.String,
        },
        {
          name: "partId",
          description: "ローカルパーツのパーツId",
          type: type.PartId,
        },
      ]),
    }),
  ],
  [
    id.BranchPartDefinition,
    t({
      name: "BranchPartDefinition",
      description: "ラムダのブランチで使えるパーツを定義する部分",
      body: TypePartBody.Product([
        {
          name: "partId",
          description: "ローカルパーツのPartId",
          type: type.PartId,
        },
        {
          name: "name",
          description: "ブランチパーツの名前",
          type: type.String,
        },
        {
          name: "description",
          description: "ブランチパーツの説明",
          type: type.String,
        },
        {
          name: "type",
          description: "ローカルパーツの型",
          type: type.Type,
        },
        {
          name: "expr",
          description: "ローカルパーツの式",
          type: type.Expr,
        },
      ]),
    }),
  ],
  [
    id.EvaluatedExpr,
    t({
      name: "EvaluatedExpr",
      description: "評価しきった式",
      body: TypePartBody.Sum([
        {
          name: "Kernel",
          description: "Definyだけでは表現できない式",
          parameter: Maybe.Just(type.KernelExpr),
        },
        {
          name: "Int32",
          description: "32bit整数",
          parameter: Maybe.Just(type.Int32),
        },
        {
          name: "TagReference",
          description: "タグを参照",
          parameter: Maybe.Just(type.TagReference),
        },
        {
          name: "Lambda",
          description: "ラムダ",
          parameter: Maybe.Just(type.List(type.LambdaBranch)),
        },
        {
          name: "KernelCall",
          description: "内部関数呼び出し",
          parameter: Maybe.Just(type.KernelCall),
        },
      ]),
    }),
  ],
  [
    id.KernelCall,
    t({
      name: "KernelCall",
      description: "複数の引数が必要な内部関数の部分呼び出し",
      body: TypePartBody.Product([
        {
          name: "kernel",
          description: "関数",
          type: type.KernelExpr,
        },
        {
          name: "expr",
          description: "呼び出すパラメーター",
          type: type.EvaluatedExpr,
        },
      ]),
    }),
  ],
  [
    id.EvaluateExprError,
    t({
      name: "EvaluateExprError",
      description: "評価したときに失敗した原因を表すもの",
      body: TypePartBody.Sum([
        {
          name: "NeedPartDefinition",
          description: "式を評価するには,このパーツの定義が必要だと言っている",
          parameter: Maybe.Just(type.PartId),
        },
        {
          name: "Blank",
          description: "計算結果にblankが含まれている",
          parameter: Maybe.Nothing(),
        },
        {
          name: "TypeError",
          description: "型が合わない",
          parameter: Maybe.Just(type.TypeError),
        },
        {
          name: "NotSupported",
          description: "まだサポートしていないものが含まれている",
          parameter: Maybe.Nothing(),
        },
      ]),
    }),
  ],
  [
    id.TypeError,
    t({
      name: "TypeError",
      description: "型エラー",
      body: TypePartBody.Product([
        {
          name: "message",
          description: "型エラーの説明",
          type: type.String,
        },
      ]),
    }),
  ],
  [
    id.CreateProjectParameter,
    t({
      name: "CreateProjectParameter",
      description: "プロジェクト作成時に必要なパラメーター",
      body: TypePartBody.Product([
        {
          name: "accountToken",
          description: "プロジェクトを作るときのアカウント",
          type: type.AccountToken,
        },
        {
          name: "projectName",
          description: "プロジェクト名",
          type: type.String,
        },
      ]),
    }),
  ],
  [
    id.CreateIdeaParameter,
    t({
      name: "CreateIdeaParameter",
      description: "アイデアを作成時に必要なパラメーター",
      body: TypePartBody.Product([
        {
          name: "accountToken",
          description: "プロジェクトを作るときのアカウント",
          type: type.AccountToken,
        },
        {
          name: "ideaName",
          description: "アイデア名",
          type: type.String,
        },
        {
          name: "parentId",
          description: "親アイデアID",
          type: type.IdeaId,
        },
      ]),
    }),
  ],
  [
    id.AddCommentParameter,
    t({
      name: "AddCommentParameter",
      description: "アイデアにコメントを追加するときに必要なパラメーター",
      body: TypePartBody.Product([
        {
          name: "accountToken",
          description: "コメントをするユーザー",
          type: type.AccountToken,
        },
        {
          name: "ideaId",
          description: "コメントを追加するアイデア",
          type: type.IdeaId,
        },
        {
          name: "comment",
          description: "コメント本文",
          type: type.String,
        },
      ]),
    }),
  ],
  [
    id.AddCommitParameter,
    t({
      name: "AddCommitParameter",
      description: "提案を作成するときに必要なパラメーター",
      body: TypePartBody.Product([
        {
          name: "accountToken",
          description: "提案を作成するユーザー",
          type: type.AccountToken,
        },
        {
          name: "ideaId",
          description: "提案に関連付けられるアイデア",
          type: type.IdeaId,
        },
      ]),
    }),
  ],
  [
    id.AccountTokenAndCommitId,
    t({
      name: "AccountTokenAndCommitId",
      description: "コミットを確定状態にしたり, 承認したりするときなどに使う",
      body: TypePartBody.Product([
        {
          name: "accountToken",
          description: "アカウントトークン",
          type: type.AccountToken,
        },
        {
          name: "commitId",
          description: "commitId",
          type: type.CommitId,
        },
      ]),
    }),
  ],
  [
    id.LogInState,
    t({
      name: "LogInState",
      description: "ログイン状態",
      body: TypePartBody.Sum([
        {
          name: "LoadingAccountTokenFromIndexedDB",
          description: "アカウントトークンをindexedDBから読み取っている状態",
          parameter: Maybe.Nothing(),
        },
        {
          name: "Guest",
          description: "ログインしていない状態",
          parameter: Maybe.Nothing(),
        },
        {
          name: "RequestingLogInUrl",
          description: "ログインへの画面URLをリクエストした状態",
          parameter: Maybe.Just(type.OpenIdConnectProvider),
        },
        {
          name: "JumpingToLogInPage",
          description: "ログインURLを受け取り,ログイン画面へ移行中",
          parameter: Maybe.Just(type.String),
        },
        {
          name: "VerifyingAccountToken",
          description:
            "アカウントトークンの検証とログインしているユーザーの情報を取得している状態",
          parameter: Maybe.Just(type.AccountToken),
        },
        {
          name: "LoggedIn",
          description: "ログインしている状態",
          parameter: Maybe.Just(type.AccountTokenAndUserId),
        },
      ]),
    }),
  ],
  [
    id.AccountTokenAndUserId,
    t({
      name: "AccountTokenAndUserId",
      description: "AccountTokenとUserId",
      body: TypePartBody.Product([
        {
          name: "accountToken",
          description: "accountToken",
          type: type.AccountToken,
        },
        {
          name: "userId",
          description: "UserId",
          type: type.UserId,
        },
      ]),
    }),
  ],
  [
    id.WithTime,
    t({
      name: "WithTime",
      description: "取得日時と任意のデータ",
      typeParameterList: [{ name: "data", typePartId: resourceDataTypePartId }],
      body: TypePartBody.Product([
        {
          name: "getTime",
          description: "データベースから取得した日時",
          type: type.Time,
        },
        {
          name: "data",
          description: "データ",
          type: {
            typePartId: resourceDataTypePartId,
            parameter: [],
          },
        },
      ]),
    }),
  ],
  [
    id.ResourceState,
    t({
      name: "ResourceState",
      description:
        "ProjectやUserなどのリソースの状態とデータ. 読み込み中だとか",
      typeParameterList: [
        { name: "data", typePartId: resourceStateDataTypePartId },
      ],
      body: TypePartBody.Sum([
        {
          name: "Loaded",
          description: "読み込み済み",
          parameter: Maybe.Just(
            type.WithTime({
              typePartId: resourceStateDataTypePartId,
              parameter: [],
            })
          ),
        },
        {
          name: "Deleted",
          description: "削除されたか, 存在しない",
          parameter: Maybe.Just(type.Time),
        },
        {
          name: "Unknown",
          description: "データを取得できなかった (サーバーの障害, オフライン)",
          parameter: Maybe.Just(type.Time),
        },
        {
          name: "Requesting",
          description: "サーバに問い合わせ中",
          parameter: Maybe.Nothing(),
        },
      ]),
    }),
  ],
  [
    id.StaticResourceState,
    t({
      name: "StaticResourceState",
      description:
        "キーであるTokenによってデータが必ず1つに決まるもの. 絶対に更新されない. リソースがないということはデータが不正な状態になっているということ",
      typeParameterList: [
        { name: "data", typePartId: staticResourceStateDataTypePartId },
      ],
      body: TypePartBody.Sum([
        {
          name: "Loaded",
          description: "取得済み",
          parameter: Maybe.Just({
            typePartId: staticResourceStateDataTypePartId,
            parameter: [],
          }),
        },
        {
          name: "Unknown",
          description: "データを取得できなかった (サーバーの障害, オフライン)",
          parameter: Maybe.Nothing(),
        },
        {
          name: "Loading",
          description: "indexedDBにアクセス中",
          parameter: Maybe.Nothing(),
        },
        {
          name: "Requesting",
          description: "サーバに問い合わせ中",
          parameter: Maybe.Nothing(),
        },
      ]),
    }),
  ],
  [
    id.AccountTokenAndProjectId,
    t({
      name: "AccountTokenAndProjectId",
      description: "アカウントトークンとプロジェクトID",
      body: TypePartBody.Product([
        {
          name: "accountToken",
          description: "アカウントトークン",
          type: type.AccountToken,
        },
        {
          name: "projectId",
          description: "プロジェクトID",
          type: type.ProjectId,
        },
      ]),
    }),
  ],
  [
    id.SetTypePartListParameter,
    t({
      name: "SetTypePartListParameter",
      description: "型パーツのリストを変更する",
      body: TypePartBody.Product([
        {
          name: "accountToken",
          description: "アカウントトークン",
          type: type.AccountToken,
        },
        {
          name: "projectId",
          description: "プロジェクトID",
          type: type.ProjectId,
        },
        {
          name: "typePartList",
          description: "型パーツのリスト",
          type: type.List(type.IdAndData(type.TypePartId, type.TypePart)),
        },
      ]),
    }),
  ],
]);

import * as data from "./source/data";
import * as main from "./source/main";
import * as typePartMap from "./schema/typePartMap";
import * as util from "./source/util";
// import { promises as fs } from "fs";
import { strict as strictAssert } from "assert";

const codecEqual = <T>(
  value: T,
  codec: data.Codec<T>,
  message: string
): void => {
  strictAssert.deepEqual(
    value,
    codec.decode(0, new Uint8Array(codec.encode(value))).result,
    message
  );
};

strictAssert.deepEqual(
  main.urlDataAndAccountTokenFromUrl(new URL("https://definy.app/")).urlData,
  {
    clientMode: "Release",
    location: data.Location.Home,
    language: "English",
  },
  "https://definy.app/ is Home in English"
);

strictAssert.deepEqual(
  main.urlDataAndAccountTokenFromUrl(
    new URL("https://definy.app/project/580d8d6a54cf43e4452a0bba6694a4ed?hl=ja")
  ).urlData,
  {
    clientMode: "Release",
    location: data.Location.Project(
      "580d8d6a54cf43e4452a0bba6694a4ed" as data.ProjectId
    ),
    language: "Japanese",
  },
  "project url"
);
{
  const url = new URL(
    "http://localhost:2520/user/580d8d6a54cf43e4452a0bba6694a4ed?hl=eo#account-token=f81919b78537257302b50f776b77a90b984cc3d75fa899f9f460ff972dcc8cb0"
  );
  strictAssert.deepEqual(
    main.urlDataAndAccountTokenFromUrl(url).urlData,
    {
      clientMode: "DebugMode",
      location: data.Location.User(
        "580d8d6a54cf43e4452a0bba6694a4ed" as data.UserId
      ),
      language: "Esperanto",
    },
    "local host"
  );
}
{
  const url = new URL(
    "http://localhost:2520/user/580d8d6a54cf43e4452a0bba6694a4ed?hl=eo#account-token=f81919b78537257302b50f776b77a90b984cc3d75fa899f9f460ff972dcc8cb0"
  );
  strictAssert.deepEqual(
    main.urlDataAndAccountTokenFromUrl(url).accountToken,
    data.Maybe.Just(
      "f81919b78537257302b50f776b77a90b984cc3d75fa899f9f460ff972dcc8cb0" as data.AccountToken
    ),
    "accountToken"
  );
}
{
  const languageAndLocation: data.UrlData = {
    clientMode: "DebugMode",
    location: data.Location.User(
      "580d8d6a54cf43e4452a0bba6694a4ed" as data.UserId
    ),
    language: "Esperanto",
  };
  const url = main.urlDataAndAccountTokenToUrl(
    languageAndLocation,
    data.Maybe.Nothing()
  );
  const decodedLanguageAndLocation: data.UrlData = main.urlDataAndAccountTokenFromUrl(
    url
  ).urlData;
  strictAssert.deepEqual(
    languageAndLocation,
    decodedLanguageAndLocation,
    "encode, decode user url"
  );
}
{
  const sampleDateTime: data.Time = util.timeFromDate(
    new Date(2015, 3, 21, 14, 46, 3, 1234)
  );
  strictAssert.deepEqual(
    sampleDateTime,
    util.timeFromDate(util.timeToDate(sampleDateTime)),
    "dateTime and js Date conversion"
  );
}

strictAssert.deepEqual(
  util.stringToTypePartName("Definy is web  app! for.web::App"),
  "definyIsWebAppForWebApp",
  "stringToTypePartName"
);

{
  /*
   * = (add 50) ((add 32) 100)
   */
  const result = main.evaluateSuggestionExpr(
    {
      typePartMap: new Map(),
      partMap: new Map(),
      evaluatedPartMap: new Map(),
      evaluatedSuggestionPartMap: new Map(),
    },
    data.Expr.FunctionCall({
      function: data.Expr.FunctionCall({
        function: data.Expr.Kernel("Int32Add"),
        parameter: data.Expr.Int32Literal(50),
      }),
      parameter: data.Expr.FunctionCall({
        function: data.Expr.FunctionCall({
          function: data.Expr.Kernel("Int32Add"),
          parameter: data.Expr.Int32Literal(32),
        }),
        parameter: data.Expr.Int32Literal(100),
      }),
    })
  );
  strictAssert.deepEqual(
    result,
    data.Result.Ok(data.EvaluatedExpr.Int32(182)),
    "dynamic Evaluation: simple expr"
  );
}

{
  /*
   * [0]
   * one = 1
   *
   * [1]
   * addOneHundred = + 100
   *
   *
   * = (add (addOneHundred one)) one
   */
  const intType: data.Type = {
    typePartId: "int" as data.TypePartId,
    parameter: [],
  };
  const oneName = "0" as data.PartId;
  const addOneHundredName = "1" as data.PartId;
  const result = main.evaluateSuggestionExpr(
    {
      typePartMap: new Map(),
      partMap: new Map<data.PartId, data.Part>([
        [
          oneName,
          {
            name: "one",
            description: "1を表す",
            type: intType,
            expr: data.Expr.Int32Literal(1),
            createCommitId: "oneCreateCommitId" as data.CommitId,
            projectId: "sampleProject" as data.ProjectId,
          },
        ],
        [
          addOneHundredName,
          {
            name: "addOneHundred",
            description: "100を足す関数",
            type: intType,
            expr: data.Expr.FunctionCall({
              function: data.Expr.Kernel("Int32Add"),
              parameter: data.Expr.Int32Literal(100),
            }),
            createCommitId: "addOneHundredCreateCommitId" as data.CommitId,
            projectId: "sampleProject" as data.ProjectId,
          },
        ],
      ]),
      evaluatedSuggestionPartMap: new Map(),
      evaluatedPartMap: new Map(),
    },
    data.Expr.FunctionCall({
      function: data.Expr.FunctionCall({
        function: data.Expr.Kernel("Int32Add"),
        parameter: data.Expr.FunctionCall({
          function: data.Expr.PartReference(addOneHundredName),
          parameter: data.Expr.PartReference(oneName),
        }),
      }),
      parameter: data.Expr.PartReference(oneName),
    })
  );
  strictAssert.deepEqual(
    result,
    data.Result.Ok(data.EvaluatedExpr.Int32(102)),
    "dynamic Evaluation: use part definition"
  );
}

strictAssert.deepEqual(
  util.isFirstLowerCaseName("value"),
  true,
  "util lower case"
);

codecEqual(123, data.Int32.codec, "int32 codec");

codecEqual(-(2 ** 31), data.Int32.codec, "int32 min codec");

codecEqual(true, data.Bool.codec, "boolean true codec");

codecEqual(false, data.Bool.codec, "boolean false codec");

codecEqual("sample text", data.String.codec, "string ascii codec");

codecEqual("やったぜ😀👨‍👩‍👧‍👦", data.String.codec, "strong japanese emoji codec");

codecEqual(
  data.Maybe.Just("それな"),
  data.Maybe.codec(data.String.codec),
  "maybe string codec"
);

codecEqual(
  [1, 43, 6423, 334, 663, 0, 74, -1, -29031, 2 ** 31 - 1],
  data.List.codec(data.Int32.codec),
  "list number codec"
);

codecEqual(
  "24b6b3789d903e841490ac04ffc2b6f9848ea529b2d9db380d190583b09995e6" as data.AccountToken,
  data.AccountToken.codec,
  "token codec"
);

codecEqual(
  "756200c85a0ff28f08daa2d201d616a9" as data.UserId,
  data.UserId.codec,
  "id codec"
);

codecEqual(
  {
    name: "ナルミンチョ",
    createTime: { day: 18440, millisecond: 12000 },
    imageHash: "0a8eed336ca61252c13da0ff0b82ce37e81b84622a4052ab33693c434b4f6434" as data.ImageToken,
    introduction: "ナルミンチョはDefinyを作っている人です.",
  },
  data.User.codec,
  "user codec"
);

codecEqual<data.Maybe<data.IdAndData<data.UserId, data.User>>>(
  data.Maybe.Just({
    id: "933055412132d6aa46f8dde7159ecb38" as data.UserId,
    data: {
      name: "ナルミンチョ",
      createTime: { day: 18440, millisecond: 12000 },
      imageHash: "0a8eed336ca61252c13da0ff0b82ce37e81b84622a4052ab33693c434b4f6434" as data.ImageToken,
      introduction: "ナルミンチョはDefinyを作っている人です.",
    },
  }),
  data.Maybe.codec(data.IdAndData.codec(data.UserId.codec, data.User.codec)),
  "Maybe (IdAndData UserId User) codec"
);

strictAssert.deepEqual(
  main.generateElmCodeAsString(typePartMap.typePartMap),
  `module Data exposing (Bool(..), Maybe(..), Result(..), Unit(..), ProjectId(..), UserId(..), IdeaId(..), CommitId(..), ImageToken(..), PartId(..), TypePartId(..), TagId(..), AccountToken(..), PartHash(..), TypePartHash(..), ReleasePartId(..), ReleaseTypePartId(..), Time, RequestLogInUrlRequestData, OpenIdConnectProvider(..), UrlData, ClientMode(..), Location(..), Language(..), User, IdAndData, Project, Idea, Comment, Commit, IdeaState(..), Part, TypePart, TypeAttribute(..), TypeParameter, TypePartBody(..), Member, Pattern, TypePartBodyKernel(..), Type, Expr(..), KernelExpr(..), TagReference, FunctionCall, LambdaBranch, Condition(..), ConditionTag, ConditionCapture, BranchPartDefinition, EvaluatedExpr(..), KernelCall, EvaluateExprError(..), TypeError, CreateProjectParameter, CreateIdeaParameter, AddCommentParameter, AddCommitParameter, AccountTokenAndCommitId, LogInState(..), AccountTokenAndUserId, WithTime, ResourceState(..), StaticResourceState(..), AccountTokenAndProjectId, SetTypePartListParameter)

import String

{-| Bool. 真か偽. JavaScriptのbooleanで扱える. true: 1, false: 0. (1byte)としてバイナリに変換する
-}
type Bool
    = False
    | True

{-| Maybe. nullableのようなもの. 今後はRustのstd::Optionに出力するために属性をつける?
-}
type Maybe value
    = Just value
    | Nothing

{-| 成功と失敗を表す型. 今後はRustのstd::Resultに出力するために属性をつける?
-}
type Result ok error
    = Ok ok
    | Error error

{-| Unit. 1つの値しかない型. JavaScriptのundefinedで扱う
-}
type Unit
    = Unit

{-| プロジェクトの識別子
-}
type ProjectId
    = ProjectId String.String

{-| ユーザーの識別子
-}
type UserId
    = UserId String.String

{-| アイデアの識別子
-}
type IdeaId
    = IdeaId String.String

{-| 提案の識別子
-}
type CommitId
    = CommitId String.String

{-| 画像から求められるトークン.キャッシュのキーとして使われる.1つのトークンに対して永久に1つの画像データしか表さない. キャッシュを更新する必要はない
-}
type ImageToken
    = ImageToken String.String

{-| パーツの識別子
-}
type PartId
    = PartId String.String

{-| 型パーツの識別子
-}
type TypePartId
    = TypePartId String.String

{-| タグの識別子
-}
type TagId
    = TagId String.String

{-| アカウントトークン. アカウントトークンを持っていればアクセストークンをDefinyのサーバーにリクエストした際に得られるIDのアカウントを保有していると証明できる. サーバーにハッシュ化したものを保存している. これが盗まれた場合,不正に得た人はアカウントを乗っ取ることができる. 有効期限はなし, 最後に発行したアカウントトークン以外は無効になる
-}
type AccountToken
    = AccountToken String.String

{-| コミット内に入る. パーツのハッシュ化したもの. ハッシュ化にはパーツ名やドキュメントも含める
-}
type PartHash
    = PartHash String.String

{-| コミット内に入る. 型パーツのハッシュ化したもの. ハッシュ化には型パーツ名やドキュメントも含める
-}
type TypePartHash
    = TypePartHash String.String

{-| 他のプロジェクトのパーツを使うときに使う. 互換性が維持される限り,IDが同じになる
-}
type ReleasePartId
    = ReleasePartId String.String

{-| 他のプロジェクトの型パーツを使うときに使う. 互換性が維持される限り,IDが同じになる
-}
type ReleaseTypePartId
    = ReleaseTypePartId String.String

{-| 日時. 0001-01-01T00:00:00.000Z to 9999-12-31T23:59:59.999Z 最小単位はミリ秒. ミリ秒の求め方は day*1000*60*60*24 + millisecond
-}
type alias Time =
    { day : Int32, millisecond : Int32 }

{-| ログインのURLを発行するために必要なデータ
-}
type alias RequestLogInUrlRequestData =
    { openIdConnectProvider : OpenIdConnectProvider, urlData : UrlData }

{-| ソーシャルログインを提供するプロバイダー (例: Google, GitHub)
-}
type OpenIdConnectProvider
    = Google
    | GitHub

{-| デバッグモードかどうか,言語とページの場所. URLとして表現されるデータ. Googleなどの検索エンジンの都合( https://support.google.com/webmasters/answer/182192?hl=ja )で,URLにページの言語を入れて,言語ごとに別のURLである必要がある. デバッグ時のホスト名は http://localhost になる
-}
type alias UrlData =
    { clientMode : ClientMode, location : Location, language : Language }

{-| デバッグモードか, リリースモード
-}
type ClientMode
    = DebugMode
    | Release

{-| DefinyWebアプリ内での場所を示すもの. URLから求められる. URLに変換できる
-}
type Location
    = Home
    | CreateProject
    | Project ProjectId
    | User UserId
    | Idea IdeaId
    | Commit CommitId
    | Setting
    | About
    | Debug

{-| 英語,日本語,エスペラント語などの言語
-}
type Language
    = Japanese
    | English
    | Esperanto

{-| ユーザーのデータのスナップショット
-}
type alias User =
    { name : String, imageHash : ImageToken, introduction : String, createTime : Time }

{-| データを識別するIdとデータ
-}
type alias IdAndData id data =
    { id : id, data : data }

{-| プロジェクト
-}
type alias Project =
    { name : String, iconHash : ImageToken, imageHash : ImageToken, createTime : Time, createUserId : UserId, updateTime : Time, rootIdeaId : IdeaId, commitId : CommitId }

{-| アイデア
-}
type alias Idea =
    { name : String, createUserId : UserId, createTime : Time, projectId : ProjectId, commentList : (List Comment), parentIdeaId : (Maybe IdeaId), updateTime : Time, state : IdeaState }

{-| アイデアのコメント
-}
type alias Comment =
    { createUserId : UserId, createTime : Time, body : String }

{-| コミット. コードのスナップショット
-}
type alias Commit =
    { createUserId : UserId, description : String, isDraft : Bool, projectName : String, projectImage : ImageToken, projectIcon : ImageToken, partHashList : (List PartHash), typePartHashList : (List TypePartHash), projectId : ProjectId, ideaId : IdeaId, createTime : Time, updateTime : Time }

{-| アイデアの状況
-}
type IdeaState
    = Creating
    | Approved CommitId

{-| パーツの定義
-}
type alias Part =
    { name : String, description : String, type_ : Type, expr : Expr, projectId : ProjectId, createCommitId : CommitId }

{-| 型パーツ
-}
type alias TypePart =
    { name : String, description : String, projectId : ProjectId, attribute : (Maybe TypeAttribute), typeParameterList : (List TypeParameter), body : TypePartBody }

{-| コンパイラに向けた, 型のデータ形式をどうするかの情報
-}
type TypeAttribute
    = AsBoolean
    | AsUndefined

{-| 型パラメーター
-}
type alias TypeParameter =
    { name : String, typePartId : TypePartId }

{-| 型の定義本体
-}
type TypePartBody
    = Product (List Member)
    | Sum (List Pattern)
    | Kernel TypePartBodyKernel

{-| 直積型のメンバー
-}
type alias Member =
    { name : String, description : String, type_ : Type }

{-| 直積型のパターン
-}
type alias Pattern =
    { name : String, description : String, parameter : (Maybe Type) }

{-| Definyだけでは表現できないデータ型
-}
type TypePartBodyKernel
    = Function
    | Int32
    | String
    | Binary
    | Id
    | Token
    | List

{-| 型
-}
type alias Type =
    { typePartId : TypePartId, parameter : (List Type) }

{-| 式
-}
type Expr
    = Kernel KernelExpr
    | Int32Literal Int32
    | PartReference PartId
    | TagReference TagReference
    | FunctionCall FunctionCall
    | Lambda (List LambdaBranch)

{-| Definyだけでは表現できない式
-}
type KernelExpr
    = Int32Add
    | Int32Sub
    | Int32Mul

{-| タグの参照を表す
-}
type alias TagReference =
    { typePartId : TypePartId, tagId : TagId }

{-| 関数呼び出し
-}
type alias FunctionCall =
    { function : Expr, parameter : Expr }

{-| ラムダのブランチ. Just x -> data x のようなところ
-}
type alias LambdaBranch =
    { condition : Condition, description : String, localPartList : (List BranchPartDefinition), expr : Expr }

{-| ブランチの式を使う条件
-}
type Condition
    = ByTag ConditionTag
    | ByCapture ConditionCapture
    | Any
    | Int32 Int32

{-| タグによる条件
-}
type alias ConditionTag =
    { tag : TagId, parameter : (Maybe Condition) }

{-| キャプチャパーツへのキャプチャ
-}
type alias ConditionCapture =
    { name : String, partId : PartId }

{-| ラムダのブランチで使えるパーツを定義する部分
-}
type alias BranchPartDefinition =
    { partId : PartId, name : String, description : String, type_ : Type, expr : Expr }

{-| 評価しきった式
-}
type EvaluatedExpr
    = Kernel KernelExpr
    | Int32 Int32
    | TagReference TagReference
    | Lambda (List LambdaBranch)
    | KernelCall KernelCall

{-| 複数の引数が必要な内部関数の部分呼び出し
-}
type alias KernelCall =
    { kernel : KernelExpr, expr : EvaluatedExpr }

{-| 評価したときに失敗した原因を表すもの
-}
type EvaluateExprError
    = NeedPartDefinition PartId
    | Blank
    | TypeError TypeError
    | NotSupported

{-| 型エラー
-}
type alias TypeError =
    { message : String }

{-| プロジェクト作成時に必要なパラメーター
-}
type alias CreateProjectParameter =
    { accountToken : AccountToken, projectName : String }

{-| アイデアを作成時に必要なパラメーター
-}
type alias CreateIdeaParameter =
    { accountToken : AccountToken, ideaName : String, parentId : IdeaId }

{-| アイデアにコメントを追加するときに必要なパラメーター
-}
type alias AddCommentParameter =
    { accountToken : AccountToken, ideaId : IdeaId, comment : String }

{-| 提案を作成するときに必要なパラメーター
-}
type alias AddCommitParameter =
    { accountToken : AccountToken, ideaId : IdeaId }

{-| コミットを確定状態にしたり, 承認したりするときなどに使う
-}
type alias AccountTokenAndCommitId =
    { accountToken : AccountToken, commitId : CommitId }

{-| ログイン状態
-}
type LogInState
    = LoadingAccountTokenFromIndexedDB
    | Guest
    | RequestingLogInUrl OpenIdConnectProvider
    | JumpingToLogInPage String
    | VerifyingAccountToken AccountToken
    | LoggedIn AccountTokenAndUserId

{-| AccountTokenとUserId
-}
type alias AccountTokenAndUserId =
    { accountToken : AccountToken, userId : UserId }

{-| 取得日時と任意のデータ
-}
type alias WithTime data =
    { getTime : Time, data : data }

{-| ProjectやUserなどのリソースの状態とデータ. 読み込み中だとか
-}
type ResourceState data
    = Loaded (WithTime data)
    | Deleted Time
    | Unknown Time
    | Requesting

{-| キーであるTokenによってデータが必ず1つに決まるもの. 絶対に更新されない. リソースがないということはデータが不正な状態になっているということ
-}
type StaticResourceState data
    = Loaded data
    | Unknown
    | Loading
    | Requesting

{-| アカウントトークンとプロジェクトID
-}
type alias AccountTokenAndProjectId =
    { accountToken : AccountToken, projectId : ProjectId }

{-| 型パーツのリストを変更する
-}
type alias SetTypePartListParameter =
    { accountToken : AccountToken, projectId : ProjectId, typePartList : (List (IdAndData TypePartId TypePart)) }
`,
  "Elm output"
);
/*
 * fs.writeFile(
 *   "elm.txt",
 *   main.generateElmCodeAsString(typePartMap.typePartMap)
 * ).then(() => {
 *   console.log("ok");
 * });
 */

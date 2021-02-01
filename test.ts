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

strictAssert.deepEqual(
  main.generateTypeScriptCodeAsString(typePartMap.typePartMap),
  `/* eslint-disable */
/* generated by js-ts-code-generator. Do not edit! */



/**
 * UserId, ProjectIdなどのIdをバイナリ形式にエンコードする
 */
export const encodeId = (value: string): ReadonlyArray<number> => (Array.from({ length: 16 }, (_: undefined, i: number): number => (Number.parseInt(value.slice(i * 2, i * 2 + 2), 16))));


/**
 * バイナリ形式をUserId, ProjectIdなどのIdにデコードする
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeId = (index: number, binary: Uint8Array): { readonly result: string; readonly nextIndex: number } => ({ result: [...binary.slice(index, index + 16)].map((n: number): string => (n.toString(16).padStart(2, "0"))).join(""), nextIndex: index + 16 });


/**
 * ImageTokenなどのTokenをバイナリ形式にエンコードする
 */
export const encodeToken = (value: string): ReadonlyArray<number> => (Array.from({ length: 32 }, (_: undefined, i: number): number => (Number.parseInt(value.slice(i * 2, i * 2 + 2), 16))));


/**
 * バイナリ形式をImageTokenなどのTokenにエンコードする
 * @param index バイナリを読み込み開始位置
 * @param binary バイナリ
 */
export const decodeToken = (index: number, binary: Uint8Array): { readonly result: string; readonly nextIndex: number } => ({ result: [...binary.slice(index, index + 32)].map((n: number): string => (n.toString(16).padStart(2, "0"))).join(""), nextIndex: index + 32 });


/**
 * バイナリと相互変換するための関数
 */
export type Codec<T extends unknown> = { readonly encode: (a: T) => ReadonlyArray<number>; readonly decode: (a: number, b: Uint8Array) => { readonly result: T; readonly nextIndex: number } };


/**
 * -2 147 483 648 ～ 2 147 483 647. 32bit 符号付き整数. JavaScriptのnumberとして扱える. numberの32bit符号あり整数をSigned Leb128のバイナリに変換する
 * @typePartId ccf22e92cea3639683c0271d65d00673
 */
export type Int32 = number;


/**
 * バイナリ. JavaScriptのUint8Arrayで扱える. 最初にLED128でバイト数, その次にバイナリそのまま
 * @typePartId 743d625544767e750c453fa344194599
 */
export type Binary = Uint8Array;


/**
 * Bool. 真か偽. JavaScriptのbooleanで扱える. true: 1, false: 0. (1byte)としてバイナリに変換する
 * @typePartId 93e91ed730b5e7689250a76096ae60a4
 */
export type Bool = boolean;


/**
 * リスト. JavaScriptのArrayで扱う
 * @typePartId d7a1efe440138793962eed5625de8196
 */
export type List<e extends unknown> = ReadonlyArray<e>;


/**
 * Maybe. nullableのようなもの. 今後はRustのstd::Optionに出力するために属性をつける?
 * @typePartId cdd7dd74dd0f2036b44dcae6aaac46f5
 */
export type Maybe<value extends unknown> = { readonly _: "Just"; readonly value: value } | { readonly _: "Nothing" };


/**
 * 成功と失敗を表す型. 今後はRustのstd::Resultに出力するために属性をつける?
 * @typePartId 943ef399d0891f897f26bc02fa24af70
 */
export type Result<ok extends unknown, error extends unknown> = { readonly _: "Ok"; readonly ok: ok } | { readonly _: "Error"; readonly error: error };


/**
 * 文字列. JavaScriptのstringで扱う. バイナリ形式はUTF-8. 不正な文字が入っている可能性がある
 * @typePartId f1f830d23ffab8cec4d0191d157b9fc4
 */
export type String = string;


/**
 * Unit. 1つの値しかない型. JavaScriptのundefinedで扱う
 * @typePartId 2df0cf39f4b05c960c34856663d26fd1
 */
export type Unit = undefined;


/**
 * プロジェクトの識別子
 * @typePartId 4e3ab0f9499404a5fa100c4b57835906
 */
export type ProjectId = string & { readonly _projectId: never };


/**
 * ユーザーの識別子
 * @typePartId 5a71cddc0b95298cb57ec66089190e9b
 */
export type UserId = string & { readonly _userId: never };


/**
 * アイデアの識別子
 * @typePartId 719fa4020ae23a96d301d9fa31d8fcaf
 */
export type IdeaId = string & { readonly _ideaId: never };


/**
 * 提案の識別子
 * @typePartId 72cc637f6803ef5ca7536889a7fff52e
 */
export type CommitId = string & { readonly _commitId: never };


/**
 * 画像から求められるトークン.キャッシュのキーとして使われる.1つのトークンに対して永久に1つの画像データしか表さない. キャッシュを更新する必要はない
 * @typePartId b193be207840b5b489517eb5d7b492b2
 */
export type ImageToken = string & { readonly _imageToken: never };


/**
 * パーツの識別子
 * @typePartId d2c65983f602ee7e0a7be06e6af61acf
 */
export type PartId = string & { readonly _partId: never };


/**
 * 型パーツの識別子
 * @typePartId 2562ffbc386c801f5132e10b945786e0
 */
export type TypePartId = string & { readonly _typePartId: never };


/**
 * タグの識別子
 * @typePartId 3133b45b0078dd3b79b067c3ce0c4a67
 */
export type TagId = string & { readonly _tagId: never };


/**
 * アカウントトークン. アカウントトークンを持っていればアクセストークンをDefinyのサーバーにリクエストした際に得られるIDのアカウントを保有していると証明できる. サーバーにハッシュ化したものを保存している. これが盗まれた場合,不正に得た人はアカウントを乗っ取ることができる. 有効期限はなし, 最後に発行したアカウントトークン以外は無効になる
 * @typePartId be993929300452364c8bb658609f682d
 */
export type AccountToken = string & { readonly _accountToken: never };


/**
 * コミット内に入る. パーツのハッシュ化したもの. ハッシュ化にはパーツ名やドキュメントも含める
 * @typePartId f0f801e3ab1f50d01e2521b63630d6c4
 */
export type PartHash = string & { readonly _partHash: never };


/**
 * コミット内に入る. 型パーツのハッシュ化したもの. ハッシュ化には型パーツ名やドキュメントも含める
 * @typePartId 9db6ff8756ff0a14768f55f9524f8fd8
 */
export type TypePartHash = string & { readonly _typePartHash: never };


/**
 * 他のプロジェクトのパーツを使うときに使う. 互換性が維持される限り,IDが同じになる
 * @typePartId f2f240718b8ac94d550c2dd3d96a322b
 */
export type ReleasePartId = string & { readonly _releasePartId: never };


/**
 * 他のプロジェクトの型パーツを使うときに使う. 互換性が維持される限り,IDが同じになる
 * @typePartId 11c5e4b4b797b001ce22b508a68f6c9e
 */
export type ReleaseTypePartId = string & { readonly _releaseTypePartId: never };


/**
 * 日時. 0001-01-01T00:00:00.000Z to 9999-12-31T23:59:59.999Z 最小単位はミリ秒. ミリ秒の求め方は day*1000*60*60*24 + millisecond
 * @typePartId fa64c1721a3285f112a4118b66b43712
 */
export type Time = { 
/**
 * 1970-01-01からの経過日数. マイナスになることもある
 */
readonly day: Int32; 
/**
 * 日にちの中のミリ秒. 0 to 86399999 (=1000*60*60*24-1)
 */
readonly millisecond: Int32 };


/**
 * ログインのURLを発行するために必要なデータ
 * @typePartId db245392b9296a48a195e4bd8824dd2b
 */
export type RequestLogInUrlRequestData = { 
/**
 * ログインに使用するプロバイダー
 */
readonly openIdConnectProvider: OpenIdConnectProvider; 
/**
 * ログインした後に返ってくるURLに必要なデータ
 */
readonly urlData: UrlData };


/**
 * ソーシャルログインを提供するプロバイダー (例: Google, GitHub)
 * @typePartId 0264130f1d9473f670907755cbee50d9
 */
export type OpenIdConnectProvider = "Google" | "GitHub";


/**
 * デバッグモードかどうか,言語とページの場所. URLとして表現されるデータ. Googleなどの検索エンジンの都合( https://support.google.com/webmasters/answer/182192?hl=ja )で,URLにページの言語を入れて,言語ごとに別のURLである必要がある. デバッグ時のホスト名は http://localhost になる
 * @typePartId dc3b3cd3f125b344fb60a91c0b184f3e
 */
export type UrlData = { 
/**
 * クライアントモード
 */
readonly clientMode: ClientMode; 
/**
 * 場所
 */
readonly location: Location; 
/**
 * 言語
 */
readonly language: Language };


/**
 * デバッグモードか, リリースモード
 * @typePartId 261b20a84f5b94b93559aaf98ffc6d33
 */
export type ClientMode = "DebugMode" | "Release";


/**
 * DefinyWebアプリ内での場所を示すもの. URLから求められる. URLに変換できる
 * @typePartId e830168583e34ff0750716aa6b253c5f
 */
export type Location = { readonly _: "Home" } | { readonly _: "CreateProject" } | { readonly _: "Project"; readonly projectId: ProjectId } | { readonly _: "User"; readonly userId: UserId } | { readonly _: "Idea"; readonly ideaId: IdeaId } | { readonly _: "Commit"; readonly commitId: CommitId } | { readonly _: "Setting" } | { readonly _: "About" } | { readonly _: "Debug" };


/**
 * 英語,日本語,エスペラント語などの言語
 * @typePartId a7c52f1164c69f56625e8febd5f44bf3
 */
export type Language = "Japanese" | "English" | "Esperanto";


/**
 * ユーザーのデータのスナップショット
 * @typePartId 655cea387d1aca74e54df4fc2888bcbb
 */
export type User = { 
/**
 * ユーザー名. 表示される名前. 他のユーザーとかぶっても良い. 絵文字も使える. 全角英数は半角英数,半角カタカナは全角カタカナ, (株)の合字を分解するなどのNFKCの正規化がされる. U+0000-U+0019 と U+007F-U+00A0 の範囲の文字は入らない. 前後に空白を含められない. 間の空白は2文字以上連続しない. 文字数のカウント方法は正規化されたあとのCodePoint単位. Twitterと同じ, 1文字以上50文字以下
 */
readonly name: String; 
/**
 * プロフィール画像
 */
readonly imageHash: ImageToken; 
/**
 * 自己紹介文. 改行文字を含めることができる. Twitterと同じ 0～160文字
 */
readonly introduction: String; 
/**
 * Definyでユーザーが作成された日時
 */
readonly createTime: Time };


/**
 * データを識別するIdとデータ
 * @typePartId 12a442ac046b1757e8684652c2669450
 */
export type IdAndData<id extends unknown, data extends unknown> = { 
/**
 * ID
 */
readonly id: id; 
/**
 * データ
 */
readonly data: data };


/**
 * プロジェクト
 * @typePartId 3fb93c7e94724891d2a224c6f945acbd
 */
export type Project = { 
/**
 * プロジェクト名
 */
readonly name: String; 
/**
 * プロジェクトのアイコン画像
 */
readonly iconHash: ImageToken; 
/**
 * プロジェクトのカバー画像
 */
readonly imageHash: ImageToken; 
/**
 * 作成日時
 */
readonly createTime: Time; 
/**
 * プロジェクトを作成したユーザー
 */
readonly createUserId: UserId; 
/**
 * 更新日時
 */
readonly updateTime: Time; 
/**
 * ルートのアイデア
 */
readonly rootIdeaId: IdeaId; 
/**
 * リリースされたコミット
 */
readonly commitId: CommitId };


/**
 * アイデア
 * @typePartId 98d993c8105a292781e3d3291fb477b6
 */
export type Idea = { 
/**
 * アイデア名 最大240文字まで
 */
readonly name: String; 
/**
 * 言い出しっぺ
 */
readonly createUserId: UserId; 
/**
 * 作成日時
 */
readonly createTime: Time; 
/**
 * 対象のプロジェクト
 */
readonly projectId: ProjectId; 
/**
 * アイデアのコメント
 */
readonly commentList: List<Comment>; 
/**
 * 親のアイデア
 */
readonly parentIdeaId: Maybe<IdeaId>; 
/**
 * 更新日時
 */
readonly updateTime: Time; 
/**
 * アイデアの状態
 */
readonly state: IdeaState };


/**
 * アイデアのコメント
 * @typePartId ce630fa90ed090bd14c941915abd3293
 */
export type Comment = { 
/**
 * 作成者
 */
readonly createUserId: UserId; 
/**
 * 作成日時
 */
readonly createTime: Time; 
/**
 * 本文 1～10000文字
 */
readonly body: String };


/**
 * コミット. コードのスナップショット
 * @typePartId f16c59a2158d9642481085d2492007f8
 */
export type Commit = { 
/**
 * 作成者
 */
readonly createUserId: UserId; 
/**
 * 説明
 */
readonly description: String; 
/**
 * まだ確定していないか
 */
readonly isDraft: Bool; 
/**
 * プロジェクト名
 */
readonly projectName: String; 
/**
 * プロジェクトの画像
 */
readonly projectImage: ImageToken; 
/**
 * プロジェクトのアイコン
 */
readonly projectIcon: ImageToken; 
/**
 * パーツ
 */
readonly partHashList: List<PartHash>; 
/**
 * 型パーツ
 */
readonly typePartHashList: List<TypePartHash>; 
/**
 * 変更をするプロジェクト
 */
readonly projectId: ProjectId; 
/**
 * 投稿したアイデアID
 */
readonly ideaId: IdeaId; 
/**
 * 作成日時
 */
readonly createTime: Time; 
/**
 * 更新日時
 */
readonly updateTime: Time };


/**
 * アイデアの状況
 * @typePartId 9b97c1996665f1009a2f5a0f334d6bff
 */
export type IdeaState = { readonly _: "Creating" } | { readonly _: "Approved"; readonly commitId: CommitId };


/**
 * パーツの定義
 * @typePartId 68599f9f5f2405a4f83d4dc4a8d4dfd7
 */
export type Part = { 
/**
 * パーツの名前
 */
readonly name: String; 
/**
 * パーツの説明
 */
readonly description: String; 
/**
 * パーツの型
 */
readonly type: Type; 
/**
 * パーツの式
 */
readonly expr: Expr; 
/**
 * 所属しているプロジェクトのID
 */
readonly projectId: ProjectId; 
/**
 * このパーツが作成されたコミット
 */
readonly createCommitId: CommitId };


/**
 * 型パーツ
 * @typePartId 95932121474f7db6f7a1256734be7746
 */
export type TypePart = { 
/**
 * 型パーツの名前
 */
readonly name: String; 
/**
 * 型パーツの説明
 */
readonly description: String; 
/**
 * 所属しているプロジェクトのID
 */
readonly projectId: ProjectId; 
/**
 * コンパイラに与える,この型を表現するのにどういう特殊な状態にするかという情報
 */
readonly attribute: Maybe<TypeAttribute>; 
/**
 * 型パラメーター
 */
readonly typeParameterList: List<TypeParameter>; 
/**
 * 定義本体
 */
readonly body: TypePartBody };


/**
 * コンパイラに向けた, 型のデータ形式をどうするかの情報
 * @typePartId 225e93ce3e35aa0bd76d07ea6f6b89cf
 */
export type TypeAttribute = "AsBoolean" | "AsUndefined";


/**
 * 型パラメーター
 * @typePartId e1333f2af01621585b96e47aea9bfee1
 */
export type TypeParameter = { 
/**
 * 型パラメーターの名前
 */
readonly name: String; 
/**
 * 型パラメーターの型ID
 */
readonly typePartId: TypePartId };


/**
 * 型の定義本体
 * @typePartId 27c027f90fb0fed86c8205cbd90cd08e
 */
export type TypePartBody = { readonly _: "Product"; readonly memberList: List<Member> } | { readonly _: "Sum"; readonly patternList: List<Pattern> } | { readonly _: "Kernel"; readonly typePartBodyKernel: TypePartBodyKernel };


/**
 * 直積型のメンバー
 * @typePartId 73b8e53686ac76acb085cb096f658d58
 */
export type Member = { 
/**
 * メンバー名
 */
readonly name: String; 
/**
 * メンバーの説明
 */
readonly description: String; 
/**
 * メンバー値の型
 */
readonly type: Type };


/**
 * 直積型のパターン
 * @typePartId 512c55527a1ce9822e1e51b2f6063789
 */
export type Pattern = { 
/**
 * タグ名
 */
readonly name: String; 
/**
 * パターンの説明
 */
readonly description: String; 
/**
 * そのパターンにつけるデータの型
 */
readonly parameter: Maybe<Type> };


/**
 * Definyだけでは表現できないデータ型
 * @typePartId 739fb46c7b45d8c51865fc91d5d2ebb1
 */
export type TypePartBodyKernel = "Function" | "Int32" | "String" | "Binary" | "Id" | "Token" | "List";


/**
 * 型
 * @typePartId 0e16754e227d7287a01596ee10e1244f
 */
export type Type = { 
/**
 * 型の参照
 */
readonly typePartId: TypePartId; 
/**
 * 型のパラメーター
 */
readonly parameter: List<Type> };


/**
 * 式
 * @typePartId 6e0366a4344ee3f670bd5238aa86cb9e
 */
export type Expr = { readonly _: "Kernel"; readonly kernelExpr: KernelExpr } | { readonly _: "Int32Literal"; readonly int32: Int32 } | { readonly _: "PartReference"; readonly partId: PartId } | { readonly _: "TagReference"; readonly tagReference: TagReference } | { readonly _: "FunctionCall"; readonly functionCall: FunctionCall } | { readonly _: "Lambda"; readonly lambdaBranchList: List<LambdaBranch> };


/**
 * Definyだけでは表現できない式
 * @typePartId dfd22b704f16a4033ad6a07b6ce7fb5b
 */
export type KernelExpr = "Int32Add" | "Int32Sub" | "Int32Mul";


/**
 * タグの参照を表す
 * @typePartId 9e622b94f66cccedeb7cd9eb10232867
 */
export type TagReference = { 
/**
 * 型ID
 */
readonly typePartId: TypePartId; 
/**
 * タグID
 */
readonly tagId: TagId };


/**
 * 関数呼び出し
 * @typePartId eb48ccda184401de37cee133ee046e94
 */
export type FunctionCall = { 
/**
 * 関数
 */
readonly function: Expr; 
/**
 * パラメーター
 */
readonly parameter: Expr };


/**
 * ラムダのブランチ. Just x -> data x のようなところ
 * @typePartId e1c39a207e4c950b326f1294550f40ac
 */
export type LambdaBranch = { 
/**
 * 入力値の条件を書くところ. Just x
 */
readonly condition: Condition; 
/**
 * ブランチの説明
 */
readonly description: String; readonly localPartList: List<BranchPartDefinition>; 
/**
 * 式
 */
readonly expr: Expr };


/**
 * ブランチの式を使う条件
 * @typePartId a27c39d96ff09d8bafa4b37d386995d9
 */
export type Condition = { readonly _: "ByTag"; readonly conditionTag: ConditionTag } | { readonly _: "ByCapture"; readonly conditionCapture: ConditionCapture } | { readonly _: "Any" } | { readonly _: "Int32"; readonly int32: Int32 };


/**
 * タグによる条件
 * @typePartId 46ec720c126a7093a527d29c176c5b59
 */
export type ConditionTag = { 
/**
 * タグ
 */
readonly tag: TagId; 
/**
 * パラメーター
 */
readonly parameter: Maybe<Condition> };


/**
 * キャプチャパーツへのキャプチャ
 * @typePartId 1e0084ab494ca046f98cd6334ecf0944
 */
export type ConditionCapture = { 
/**
 * キャプチャパーツの名前
 */
readonly name: String; 
/**
 * ローカルパーツのパーツId
 */
readonly partId: PartId };


/**
 * ラムダのブランチで使えるパーツを定義する部分
 * @typePartId 7591b507c8c0477470c0eadca88b86c3
 */
export type BranchPartDefinition = { 
/**
 * ローカルパーツのPartId
 */
readonly partId: PartId; 
/**
 * ブランチパーツの名前
 */
readonly name: String; 
/**
 * ブランチパーツの説明
 */
readonly description: String; 
/**
 * ローカルパーツの型
 */
readonly type: Type; 
/**
 * ローカルパーツの式
 */
readonly expr: Expr };


/**
 * 評価しきった式
 * @typePartId 76b94bf171eb1dd4cbfb7835938b76b2
 */
export type EvaluatedExpr = { readonly _: "Kernel"; readonly kernelExpr: KernelExpr } | { readonly _: "Int32"; readonly int32: Int32 } | { readonly _: "TagReference"; readonly tagReference: TagReference } | { readonly _: "Lambda"; readonly lambdaBranchList: List<LambdaBranch> } | { readonly _: "KernelCall"; readonly kernelCall: KernelCall };


/**
 * 複数の引数が必要な内部関数の部分呼び出し
 * @typePartId 1db3d6bfb8b0b396a3f94f062d37a630
 */
export type KernelCall = { 
/**
 * 関数
 */
readonly kernel: KernelExpr; 
/**
 * 呼び出すパラメーター
 */
readonly expr: EvaluatedExpr };


/**
 * 評価したときに失敗した原因を表すもの
 * @typePartId 6519a080b86da2627bef4032319ac621
 */
export type EvaluateExprError = { readonly _: "NeedPartDefinition"; readonly partId: PartId } | { readonly _: "Blank" } | { readonly _: "TypeError"; readonly typeError: TypeError } | { readonly _: "NotSupported" };


/**
 * 型エラー
 * @typePartId 466fbfeeb2d6ead0f6bd0833b5ea3d71
 */
export type TypeError = { 
/**
 * 型エラーの説明
 */
readonly message: String };


/**
 * プロジェクト作成時に必要なパラメーター
 * @typePartId 8ac0f1e4609a750afb9e068d9914a2db
 */
export type CreateProjectParameter = { 
/**
 * プロジェクトを作るときのアカウント
 */
readonly accountToken: AccountToken; 
/**
 * プロジェクト名
 */
readonly projectName: String };


/**
 * アイデアを作成時に必要なパラメーター
 * @typePartId 036e55068c26060c3632062801b0216b
 */
export type CreateIdeaParameter = { 
/**
 * プロジェクトを作るときのアカウント
 */
readonly accountToken: AccountToken; 
/**
 * アイデア名
 */
readonly ideaName: String; 
/**
 * 親アイデアID
 */
readonly parentId: IdeaId };


/**
 * アイデアにコメントを追加するときに必要なパラメーター
 * @typePartId ad7a6a667a36a79c3bbc81f8f0789fe8
 */
export type AddCommentParameter = { 
/**
 * コメントをするユーザー
 */
readonly accountToken: AccountToken; 
/**
 * コメントを追加するアイデア
 */
readonly ideaId: IdeaId; 
/**
 * コメント本文
 */
readonly comment: String };


/**
 * 提案を作成するときに必要なパラメーター
 * @typePartId 8b40f4351fe048ff78f14c523b6f76f1
 */
export type AddCommitParameter = { 
/**
 * 提案を作成するユーザー
 */
readonly accountToken: AccountToken; 
/**
 * 提案に関連付けられるアイデア
 */
readonly ideaId: IdeaId };


/**
 * コミットを確定状態にしたり, 承認したりするときなどに使う
 * @typePartId 74280d6a5db1d48b6815a73a819756c3
 */
export type AccountTokenAndCommitId = { 
/**
 * アカウントトークン
 */
readonly accountToken: AccountToken; 
/**
 * commitId
 */
readonly commitId: CommitId };


/**
 * ログイン状態
 * @typePartId d562fe803c7e40c32269e24c1435e4d1
 */
export type LogInState = { readonly _: "LoadingAccountTokenFromIndexedDB" } | { readonly _: "Guest" } | { readonly _: "RequestingLogInUrl"; readonly openIdConnectProvider: OpenIdConnectProvider } | { readonly _: "JumpingToLogInPage"; readonly string: String } | { readonly _: "VerifyingAccountToken"; readonly accountToken: AccountToken } | { readonly _: "LoggedIn"; readonly accountTokenAndUserId: AccountTokenAndUserId };


/**
 * AccountTokenとUserId
 * @typePartId 895fb0f083f1828da2c56b25ed77eb54
 */
export type AccountTokenAndUserId = { 
/**
 * accountToken
 */
readonly accountToken: AccountToken; 
/**
 * UserId
 */
readonly userId: UserId };


/**
 * 取得日時と任意のデータ
 * @typePartId f7590073f3ed06452193dddbb91e82e0
 */
export type WithTime<data extends unknown> = { 
/**
 * データベースから取得した日時
 */
readonly getTime: Time; 
/**
 * データ
 */
readonly data: data };


/**
 * ProjectやUserなどのリソースの状態とデータ. 読み込み中だとか
 * @typePartId 833fbf3dcab7e9365f334f8b00c24d55
 */
export type ResourceState<data extends unknown> = { readonly _: "Loaded"; readonly dataWithTime: WithTime<data> } | { readonly _: "Deleted"; readonly time: Time } | { readonly _: "Unknown"; readonly time: Time } | { readonly _: "Requesting" };


/**
 * キーであるTokenによってデータが必ず1つに決まるもの. 絶対に更新されない. リソースがないということはデータが不正な状態になっているということ
 * @typePartId 134205335ce83693fd83994e907acabd
 */
export type StaticResourceState<data extends unknown> = { readonly _: "Loaded"; readonly data: data } | { readonly _: "Unknown" } | { readonly _: "Loading" } | { readonly _: "Requesting" };


/**
 * アカウントトークンとプロジェクトID
 * @typePartId 4143a0787c0f06dfddc2f2f13f7e7a20
 */
export type AccountTokenAndProjectId = { 
/**
 * アカウントトークン
 */
readonly accountToken: AccountToken; 
/**
 * プロジェクトID
 */
readonly projectId: ProjectId };


/**
 * 型パーツのリストを変更する
 * @typePartId 0d8c602dce6d495c31fbde469acf235d
 */
export type SetTypePartListParameter = { 
/**
 * アカウントトークン
 */
readonly accountToken: AccountToken; 
/**
 * プロジェクトID
 */
readonly projectId: ProjectId; 
/**
 * 型パーツのリスト
 */
readonly typePartList: List<IdAndData<TypePartId, TypePart>> };


/**
 * -2 147 483 648 ～ 2 147 483 647. 32bit 符号付き整数. JavaScriptのnumberとして扱える. numberの32bit符号あり整数をSigned Leb128のバイナリに変換する
 * @typePartId ccf22e92cea3639683c0271d65d00673
 */
export const Int32: { readonly codec: Codec<Int32> } = { codec: { encode: (value: Int32): ReadonlyArray<number> => {
  let rest: number = value | 0;
  const result: Array<number> = [];
  while (true) {
    const byte: number = rest & 127;
    rest >>= 7;
    if (rest === 0 && (byte & 64) === 0 || rest === -1 && (byte & 64) !== 0) {
      result.push(byte);
      return result;
    }
    result.push(byte | 128);
  }
}, decode: (index: number, binary: Uint8Array): { readonly result: Int32; readonly nextIndex: number } => {
  let result: number = 0;
  let offset: number = 0;
  while (true) {
    const byte: number | undefined = binary[index + offset];
    if (byte === undefined) {
      throw new Error("invalid byte in decode int32");
    }
    result |= (byte & 127) << offset * 7;
    offset += 1;
    if ((128 & byte) === 0) {
      if (offset * 7 < 32 && (byte & 64) !== 0) {
        return { result: result | ~0 << offset * 7, nextIndex: index + offset };
      }
      return { result, nextIndex: index + offset };
    }
  }
} } };


/**
 * バイナリ. JavaScriptのUint8Arrayで扱える. 最初にLED128でバイト数, その次にバイナリそのまま
 * @typePartId 743d625544767e750c453fa344194599
 */
export const Binary: { readonly codec: Codec<Binary> } = { codec: { encode: (value: Binary): ReadonlyArray<number> => (Int32.codec.encode(value.length).concat([...value])), decode: (index: number, binary: Uint8Array): { readonly result: Binary; readonly nextIndex: number } => {
  const length: { readonly result: number; readonly nextIndex: number } = Int32.codec.decode(index, binary);
  const nextIndex: number = length.nextIndex + length.result;
  return { result: binary.slice(length.nextIndex, nextIndex), nextIndex };
} } };


/**
 * Bool. 真か偽. JavaScriptのbooleanで扱える. true: 1, false: 0. (1byte)としてバイナリに変換する
 * @typePartId 93e91ed730b5e7689250a76096ae60a4
 */
export const Bool: { 
/**
 * 偽
 */
readonly False: Bool; 
/**
 * 真
 */
readonly True: Bool; readonly codec: Codec<Bool> } = { False: false, True: true, codec: { encode: (value: Bool): ReadonlyArray<number> => [value?1:0], decode: (index: number, binary: Uint8Array): { readonly result: Bool; readonly nextIndex: number } => {
  const patternIndex: { readonly result: number; readonly nextIndex: number } = Int32.codec.decode(index, binary);
  if (patternIndex.result === 0) {
    return { result: Bool.False, nextIndex: patternIndex.nextIndex };
  }
  if (patternIndex.result === 1) {
    return { result: Bool.True, nextIndex: patternIndex.nextIndex };
  }
  throw new Error("存在しないパターンを指定された 型を更新してください");
} } };


/**
 * リスト. JavaScriptのArrayで扱う
 * @typePartId d7a1efe440138793962eed5625de8196
 */
export const List: { readonly codec: <e extends unknown>(a: Codec<e>) => Codec<List<e>> } = { codec: <e extends unknown>(eCodec: Codec<e>): Codec<List<e>> => ({ encode: (value: List<e>): ReadonlyArray<number> => {
  let result: Array<number> = Int32.codec.encode(value.length) as Array<number>;
  for (const element of value){
    result = result.concat(eCodec.encode(element));
  }
  return result;
}, decode: (index: number, binary: Uint8Array): { readonly result: List<e>; readonly nextIndex: number } => {
  const lengthResult: { readonly result: number; readonly nextIndex: number } = Int32.codec.decode(index, binary);
  let nextIndex: number = lengthResult.nextIndex;
  const result: Array<e> = [];
  for (let i = 0; i < lengthResult.result; i += 1){
    const resultAndNextIndex: { readonly result: e; readonly nextIndex: number } = eCodec.decode(nextIndex, binary);
    result.push(resultAndNextIndex.result);
    nextIndex = resultAndNextIndex.nextIndex;
  }
  return { result, nextIndex };
} }) };


/**
 * Maybe. nullableのようなもの. 今後はRustのstd::Optionに出力するために属性をつける?
 * @typePartId cdd7dd74dd0f2036b44dcae6aaac46f5
 */
export const Maybe: { 
/**
 * 値があるということ
 */
readonly Just: <value extends unknown>(a: value) => Maybe<value>; 
/**
 * 値がないということ
 */
readonly Nothing: <value extends unknown>() => Maybe<value>; readonly codec: <value extends unknown>(a: Codec<value>) => Codec<Maybe<value>> } = { Just: <value extends unknown>(value: value): Maybe<value> => ({ _: "Just", value }), Nothing: <value extends unknown>(): Maybe<value> => ({ _: "Nothing" }), codec: <value extends unknown>(valueCodec: Codec<value>): Codec<Maybe<value>> => ({ encode: (value: Maybe<value>): ReadonlyArray<number> => {
  switch (value._) {
    case "Just": {
      return [0].concat(valueCodec.encode(value.value));
    }
    case "Nothing": {
      return [1];
    }
  }
}, decode: (index: number, binary: Uint8Array): { readonly result: Maybe<value>; readonly nextIndex: number } => {
  const patternIndex: { readonly result: number; readonly nextIndex: number } = Int32.codec.decode(index, binary);
  if (patternIndex.result === 0) {
    const result: { readonly result: value; readonly nextIndex: number } = valueCodec.decode(patternIndex.nextIndex, binary);
    return { result: Maybe.Just(result.result), nextIndex: result.nextIndex };
  }
  if (patternIndex.result === 1) {
    return { result: Maybe.Nothing(), nextIndex: patternIndex.nextIndex };
  }
  throw new Error("存在しないパターンを指定された 型を更新してください");
} }) };


/**
 * 成功と失敗を表す型. 今後はRustのstd::Resultに出力するために属性をつける?
 * @typePartId 943ef399d0891f897f26bc02fa24af70
 */
export const Result: { 
/**
 * 成功
 */
readonly Ok: <ok extends unknown, error extends unknown>(a: ok) => Result<ok, error>; 
/**
 * 失敗
 */
readonly Error: <ok extends unknown, error extends unknown>(a: error) => Result<ok, error>; readonly codec: <ok extends unknown, error extends unknown>(a: Codec<ok>, b: Codec<error>) => Codec<Result<ok, error>> } = { Ok: <ok extends unknown, error extends unknown>(ok: ok): Result<ok, error> => ({ _: "Ok", ok }), Error: <ok extends unknown, error extends unknown>(error: error): Result<ok, error> => ({ _: "Error", error }), codec: <ok extends unknown, error extends unknown>(okCodec: Codec<ok>, errorCodec: Codec<error>): Codec<Result<ok, error>> => ({ encode: (value: Result<ok, error>): ReadonlyArray<number> => {
  switch (value._) {
    case "Ok": {
      return [0].concat(okCodec.encode(value.ok));
    }
    case "Error": {
      return [1].concat(errorCodec.encode(value.error));
    }
  }
}, decode: (index: number, binary: Uint8Array): { readonly result: Result<ok, error>; readonly nextIndex: number } => {
  const patternIndex: { readonly result: number; readonly nextIndex: number } = Int32.codec.decode(index, binary);
  if (patternIndex.result === 0) {
    const result: { readonly result: ok; readonly nextIndex: number } = okCodec.decode(patternIndex.nextIndex, binary);
    return { result: Result.Ok(result.result), nextIndex: result.nextIndex };
  }
  if (patternIndex.result === 1) {
    const result: { readonly result: error; readonly nextIndex: number } = errorCodec.decode(patternIndex.nextIndex, binary);
    return { result: Result.Error(result.result), nextIndex: result.nextIndex };
  }
  throw new Error("存在しないパターンを指定された 型を更新してください");
} }) };


/**
 * 文字列. JavaScriptのstringで扱う. バイナリ形式はUTF-8. 不正な文字が入っている可能性がある
 * @typePartId f1f830d23ffab8cec4d0191d157b9fc4
 */
export const String: { readonly codec: Codec<String> } = { codec: { encode: (value: String): ReadonlyArray<number> => {
  const result: ReadonlyArray<number> = [...new TextEncoder().encode(value)];
  return Int32.codec.encode(result.length).concat(result);
}, decode: (index: number, binary: Uint8Array): { readonly result: String; readonly nextIndex: number } => {
  const length: { readonly result: number; readonly nextIndex: number } = Int32.codec.decode(index, binary);
  const nextIndex: number = length.nextIndex + length.result;
  const textBinary: Uint8Array = binary.slice(length.nextIndex, nextIndex);
  return { result: new TextDecoder().decode(textBinary), nextIndex };
} } };


/**
 * Unit. 1つの値しかない型. JavaScriptのundefinedで扱う
 * @typePartId 2df0cf39f4b05c960c34856663d26fd1
 */
export const Unit: { 
/**
 * Unit型にある.唯一の値
 */
readonly Unit: Unit; readonly codec: Codec<Unit> } = { Unit: undefined, codec: { encode: (value: Unit): ReadonlyArray<number> => [], decode: (index: number, binary: Uint8Array): { readonly result: Unit; readonly nextIndex: number } => ({ result: Unit.Unit, nextIndex: index }) } };


/**
 * プロジェクトの識別子
 * @typePartId 4e3ab0f9499404a5fa100c4b57835906
 */
export const ProjectId: { readonly codec: Codec<ProjectId> } = { codec: { encode: (value: ProjectId): ReadonlyArray<number> => (encodeId(value)), decode: (index: number, binary: Uint8Array): { readonly result: ProjectId; readonly nextIndex: number } => (decodeId(index, binary) as { readonly result: ProjectId; readonly nextIndex: number }) } };


/**
 * ユーザーの識別子
 * @typePartId 5a71cddc0b95298cb57ec66089190e9b
 */
export const UserId: { readonly codec: Codec<UserId> } = { codec: { encode: (value: UserId): ReadonlyArray<number> => (encodeId(value)), decode: (index: number, binary: Uint8Array): { readonly result: UserId; readonly nextIndex: number } => (decodeId(index, binary) as { readonly result: UserId; readonly nextIndex: number }) } };


/**
 * アイデアの識別子
 * @typePartId 719fa4020ae23a96d301d9fa31d8fcaf
 */
export const IdeaId: { readonly codec: Codec<IdeaId> } = { codec: { encode: (value: IdeaId): ReadonlyArray<number> => (encodeId(value)), decode: (index: number, binary: Uint8Array): { readonly result: IdeaId; readonly nextIndex: number } => (decodeId(index, binary) as { readonly result: IdeaId; readonly nextIndex: number }) } };


/**
 * 提案の識別子
 * @typePartId 72cc637f6803ef5ca7536889a7fff52e
 */
export const CommitId: { readonly codec: Codec<CommitId> } = { codec: { encode: (value: CommitId): ReadonlyArray<number> => (encodeId(value)), decode: (index: number, binary: Uint8Array): { readonly result: CommitId; readonly nextIndex: number } => (decodeId(index, binary) as { readonly result: CommitId; readonly nextIndex: number }) } };


/**
 * 画像から求められるトークン.キャッシュのキーとして使われる.1つのトークンに対して永久に1つの画像データしか表さない. キャッシュを更新する必要はない
 * @typePartId b193be207840b5b489517eb5d7b492b2
 */
export const ImageToken: { readonly codec: Codec<ImageToken> } = { codec: { encode: (value: ImageToken): ReadonlyArray<number> => (encodeToken(value)), decode: (index: number, binary: Uint8Array): { readonly result: ImageToken; readonly nextIndex: number } => (decodeToken(index, binary) as { readonly result: ImageToken; readonly nextIndex: number }) } };


/**
 * パーツの識別子
 * @typePartId d2c65983f602ee7e0a7be06e6af61acf
 */
export const PartId: { readonly codec: Codec<PartId> } = { codec: { encode: (value: PartId): ReadonlyArray<number> => (encodeId(value)), decode: (index: number, binary: Uint8Array): { readonly result: PartId; readonly nextIndex: number } => (decodeId(index, binary) as { readonly result: PartId; readonly nextIndex: number }) } };


/**
 * 型パーツの識別子
 * @typePartId 2562ffbc386c801f5132e10b945786e0
 */
export const TypePartId: { readonly codec: Codec<TypePartId> } = { codec: { encode: (value: TypePartId): ReadonlyArray<number> => (encodeId(value)), decode: (index: number, binary: Uint8Array): { readonly result: TypePartId; readonly nextIndex: number } => (decodeId(index, binary) as { readonly result: TypePartId; readonly nextIndex: number }) } };


/**
 * タグの識別子
 * @typePartId 3133b45b0078dd3b79b067c3ce0c4a67
 */
export const TagId: { readonly codec: Codec<TagId> } = { codec: { encode: (value: TagId): ReadonlyArray<number> => (encodeId(value)), decode: (index: number, binary: Uint8Array): { readonly result: TagId; readonly nextIndex: number } => (decodeId(index, binary) as { readonly result: TagId; readonly nextIndex: number }) } };


/**
 * アカウントトークン. アカウントトークンを持っていればアクセストークンをDefinyのサーバーにリクエストした際に得られるIDのアカウントを保有していると証明できる. サーバーにハッシュ化したものを保存している. これが盗まれた場合,不正に得た人はアカウントを乗っ取ることができる. 有効期限はなし, 最後に発行したアカウントトークン以外は無効になる
 * @typePartId be993929300452364c8bb658609f682d
 */
export const AccountToken: { readonly codec: Codec<AccountToken> } = { codec: { encode: (value: AccountToken): ReadonlyArray<number> => (encodeToken(value)), decode: (index: number, binary: Uint8Array): { readonly result: AccountToken; readonly nextIndex: number } => (decodeToken(index, binary) as { readonly result: AccountToken; readonly nextIndex: number }) } };


/**
 * コミット内に入る. パーツのハッシュ化したもの. ハッシュ化にはパーツ名やドキュメントも含める
 * @typePartId f0f801e3ab1f50d01e2521b63630d6c4
 */
export const PartHash: { readonly codec: Codec<PartHash> } = { codec: { encode: (value: PartHash): ReadonlyArray<number> => (encodeToken(value)), decode: (index: number, binary: Uint8Array): { readonly result: PartHash; readonly nextIndex: number } => (decodeToken(index, binary) as { readonly result: PartHash; readonly nextIndex: number }) } };


/**
 * コミット内に入る. 型パーツのハッシュ化したもの. ハッシュ化には型パーツ名やドキュメントも含める
 * @typePartId 9db6ff8756ff0a14768f55f9524f8fd8
 */
export const TypePartHash: { readonly codec: Codec<TypePartHash> } = { codec: { encode: (value: TypePartHash): ReadonlyArray<number> => (encodeToken(value)), decode: (index: number, binary: Uint8Array): { readonly result: TypePartHash; readonly nextIndex: number } => (decodeToken(index, binary) as { readonly result: TypePartHash; readonly nextIndex: number }) } };


/**
 * 他のプロジェクトのパーツを使うときに使う. 互換性が維持される限り,IDが同じになる
 * @typePartId f2f240718b8ac94d550c2dd3d96a322b
 */
export const ReleasePartId: { readonly codec: Codec<ReleasePartId> } = { codec: { encode: (value: ReleasePartId): ReadonlyArray<number> => (encodeId(value)), decode: (index: number, binary: Uint8Array): { readonly result: ReleasePartId; readonly nextIndex: number } => (decodeId(index, binary) as { readonly result: ReleasePartId; readonly nextIndex: number }) } };


/**
 * 他のプロジェクトの型パーツを使うときに使う. 互換性が維持される限り,IDが同じになる
 * @typePartId 11c5e4b4b797b001ce22b508a68f6c9e
 */
export const ReleaseTypePartId: { readonly codec: Codec<ReleaseTypePartId> } = { codec: { encode: (value: ReleaseTypePartId): ReadonlyArray<number> => (encodeId(value)), decode: (index: number, binary: Uint8Array): { readonly result: ReleaseTypePartId; readonly nextIndex: number } => (decodeId(index, binary) as { readonly result: ReleaseTypePartId; readonly nextIndex: number }) } };


/**
 * 日時. 0001-01-01T00:00:00.000Z to 9999-12-31T23:59:59.999Z 最小単位はミリ秒. ミリ秒の求め方は day*1000*60*60*24 + millisecond
 * @typePartId fa64c1721a3285f112a4118b66b43712
 */
export const Time: { readonly codec: Codec<Time> } = { codec: { encode: (value: Time): ReadonlyArray<number> => (Int32.codec.encode(value.day).concat(Int32.codec.encode(value.millisecond))), decode: (index: number, binary: Uint8Array): { readonly result: Time; readonly nextIndex: number } => {
  const dayAndNextIndex: { readonly result: Int32; readonly nextIndex: number } = Int32.codec.decode(index, binary);
  const millisecondAndNextIndex: { readonly result: Int32; readonly nextIndex: number } = Int32.codec.decode(dayAndNextIndex.nextIndex, binary);
  return { result: { day: dayAndNextIndex.result, millisecond: millisecondAndNextIndex.result }, nextIndex: millisecondAndNextIndex.nextIndex };
} } };


/**
 * ログインのURLを発行するために必要なデータ
 * @typePartId db245392b9296a48a195e4bd8824dd2b
 */
export const RequestLogInUrlRequestData: { readonly codec: Codec<RequestLogInUrlRequestData> } = { codec: { encode: (value: RequestLogInUrlRequestData): ReadonlyArray<number> => (OpenIdConnectProvider.codec.encode(value.openIdConnectProvider).concat(UrlData.codec.encode(value.urlData))), decode: (index: number, binary: Uint8Array): { readonly result: RequestLogInUrlRequestData; readonly nextIndex: number } => {
  const openIdConnectProviderAndNextIndex: { readonly result: OpenIdConnectProvider; readonly nextIndex: number } = OpenIdConnectProvider.codec.decode(index, binary);
  const urlDataAndNextIndex: { readonly result: UrlData; readonly nextIndex: number } = UrlData.codec.decode(openIdConnectProviderAndNextIndex.nextIndex, binary);
  return { result: { openIdConnectProvider: openIdConnectProviderAndNextIndex.result, urlData: urlDataAndNextIndex.result }, nextIndex: urlDataAndNextIndex.nextIndex };
} } };


/**
 * ソーシャルログインを提供するプロバイダー (例: Google, GitHub)
 * @typePartId 0264130f1d9473f670907755cbee50d9
 */
export const OpenIdConnectProvider: { 
/**
 * Google ( https://developers.google.com/identity/sign-in/web/ )
 */
readonly Google: OpenIdConnectProvider; 
/**
 * GitHub ( https://developer.github.com/v3/guides/basics-of-authentication/ )
 */
readonly GitHub: OpenIdConnectProvider; readonly codec: Codec<OpenIdConnectProvider> } = { Google: "Google", GitHub: "GitHub", codec: { encode: (value: OpenIdConnectProvider): ReadonlyArray<number> => {
  switch (value) {
    case "Google": {
      return [0];
    }
    case "GitHub": {
      return [1];
    }
  }
}, decode: (index: number, binary: Uint8Array): { readonly result: OpenIdConnectProvider; readonly nextIndex: number } => {
  const patternIndex: { readonly result: number; readonly nextIndex: number } = Int32.codec.decode(index, binary);
  if (patternIndex.result === 0) {
    return { result: OpenIdConnectProvider.Google, nextIndex: patternIndex.nextIndex };
  }
  if (patternIndex.result === 1) {
    return { result: OpenIdConnectProvider.GitHub, nextIndex: patternIndex.nextIndex };
  }
  throw new Error("存在しないパターンを指定された 型を更新してください");
} } };


/**
 * デバッグモードかどうか,言語とページの場所. URLとして表現されるデータ. Googleなどの検索エンジンの都合( https://support.google.com/webmasters/answer/182192?hl=ja )で,URLにページの言語を入れて,言語ごとに別のURLである必要がある. デバッグ時のホスト名は http://localhost になる
 * @typePartId dc3b3cd3f125b344fb60a91c0b184f3e
 */
export const UrlData: { readonly codec: Codec<UrlData> } = { codec: { encode: (value: UrlData): ReadonlyArray<number> => (ClientMode.codec.encode(value.clientMode).concat(Location.codec.encode(value.location)).concat(Language.codec.encode(value.language))), decode: (index: number, binary: Uint8Array): { readonly result: UrlData; readonly nextIndex: number } => {
  const clientModeAndNextIndex: { readonly result: ClientMode; readonly nextIndex: number } = ClientMode.codec.decode(index, binary);
  const locationAndNextIndex: { readonly result: Location; readonly nextIndex: number } = Location.codec.decode(clientModeAndNextIndex.nextIndex, binary);
  const languageAndNextIndex: { readonly result: Language; readonly nextIndex: number } = Language.codec.decode(locationAndNextIndex.nextIndex, binary);
  return { result: { clientMode: clientModeAndNextIndex.result, location: locationAndNextIndex.result, language: languageAndNextIndex.result }, nextIndex: languageAndNextIndex.nextIndex };
} } };


/**
 * デバッグモードか, リリースモード
 * @typePartId 261b20a84f5b94b93559aaf98ffc6d33
 */
export const ClientMode: { 
/**
 * デバッグモード. オリジンは http://localshot:2520
 */
readonly DebugMode: ClientMode; 
/**
 * リリースモード. オリジンは https://definy.app
 */
readonly Release: ClientMode; readonly codec: Codec<ClientMode> } = { DebugMode: "DebugMode", Release: "Release", codec: { encode: (value: ClientMode): ReadonlyArray<number> => {
  switch (value) {
    case "DebugMode": {
      return [0];
    }
    case "Release": {
      return [1];
    }
  }
}, decode: (index: number, binary: Uint8Array): { readonly result: ClientMode; readonly nextIndex: number } => {
  const patternIndex: { readonly result: number; readonly nextIndex: number } = Int32.codec.decode(index, binary);
  if (patternIndex.result === 0) {
    return { result: ClientMode.DebugMode, nextIndex: patternIndex.nextIndex };
  }
  if (patternIndex.result === 1) {
    return { result: ClientMode.Release, nextIndex: patternIndex.nextIndex };
  }
  throw new Error("存在しないパターンを指定された 型を更新してください");
} } };


/**
 * DefinyWebアプリ内での場所を示すもの. URLから求められる. URLに変換できる
 * @typePartId e830168583e34ff0750716aa6b253c5f
 */
export const Location: { 
/**
 * 最初のページ
 */
readonly Home: Location; 
/**
 * プロジェクト作成画面
 */
readonly CreateProject: Location; 
/**
 * プロジェクトの詳細ページ
 */
readonly Project: (a: ProjectId) => Location; 
/**
 * ユーザーの詳細ページ
 */
readonly User: (a: UserId) => Location; 
/**
 * アイデア詳細ページ
 */
readonly Idea: (a: IdeaId) => Location; 
/**
 * コミットの詳細, 編集ページ
 */
readonly Commit: (a: CommitId) => Location; 
/**
 * 設定ページ
 */
readonly Setting: Location; 
/**
 * Definyについて説明したページ
 */
readonly About: Location; 
/**
 * デバッグページ
 */
readonly Debug: Location; readonly codec: Codec<Location> } = { Home: { _: "Home" }, CreateProject: { _: "CreateProject" }, Project: (projectId: ProjectId): Location => ({ _: "Project", projectId }), User: (userId: UserId): Location => ({ _: "User", userId }), Idea: (ideaId: IdeaId): Location => ({ _: "Idea", ideaId }), Commit: (commitId: CommitId): Location => ({ _: "Commit", commitId }), Setting: { _: "Setting" }, About: { _: "About" }, Debug: { _: "Debug" }, codec: { encode: (value: Location): ReadonlyArray<number> => {
  switch (value._) {
    case "Home": {
      return [0];
    }
    case "CreateProject": {
      return [1];
    }
    case "Project": {
      return [2].concat(ProjectId.codec.encode(value.projectId));
    }
    case "User": {
      return [3].concat(UserId.codec.encode(value.userId));
    }
    case "Idea": {
      return [4].concat(IdeaId.codec.encode(value.ideaId));
    }
    case "Commit": {
      return [5].concat(CommitId.codec.encode(value.commitId));
    }
    case "Setting": {
      return [6];
    }
    case "About": {
      return [7];
    }
    case "Debug": {
      return [8];
    }
  }
}, decode: (index: number, binary: Uint8Array): { readonly result: Location; readonly nextIndex: number } => {
  const patternIndex: { readonly result: number; readonly nextIndex: number } = Int32.codec.decode(index, binary);
  if (patternIndex.result === 0) {
    return { result: Location.Home, nextIndex: patternIndex.nextIndex };
  }
  if (patternIndex.result === 1) {
    return { result: Location.CreateProject, nextIndex: patternIndex.nextIndex };
  }
  if (patternIndex.result === 2) {
    const result: { readonly result: ProjectId; readonly nextIndex: number } = ProjectId.codec.decode(patternIndex.nextIndex, binary);
    return { result: Location.Project(result.result), nextIndex: result.nextIndex };
  }
  if (patternIndex.result === 3) {
    const result: { readonly result: UserId; readonly nextIndex: number } = UserId.codec.decode(patternIndex.nextIndex, binary);
    return { result: Location.User(result.result), nextIndex: result.nextIndex };
  }
  if (patternIndex.result === 4) {
    const result: { readonly result: IdeaId; readonly nextIndex: number } = IdeaId.codec.decode(patternIndex.nextIndex, binary);
    return { result: Location.Idea(result.result), nextIndex: result.nextIndex };
  }
  if (patternIndex.result === 5) {
    const result: { readonly result: CommitId; readonly nextIndex: number } = CommitId.codec.decode(patternIndex.nextIndex, binary);
    return { result: Location.Commit(result.result), nextIndex: result.nextIndex };
  }
  if (patternIndex.result === 6) {
    return { result: Location.Setting, nextIndex: patternIndex.nextIndex };
  }
  if (patternIndex.result === 7) {
    return { result: Location.About, nextIndex: patternIndex.nextIndex };
  }
  if (patternIndex.result === 8) {
    return { result: Location.Debug, nextIndex: patternIndex.nextIndex };
  }
  throw new Error("存在しないパターンを指定された 型を更新してください");
} } };


/**
 * 英語,日本語,エスペラント語などの言語
 * @typePartId a7c52f1164c69f56625e8febd5f44bf3
 */
export const Language: { 
/**
 * 日本語
 */
readonly Japanese: Language; 
/**
 * 英語
 */
readonly English: Language; 
/**
 * エスペラント語
 */
readonly Esperanto: Language; readonly codec: Codec<Language> } = { Japanese: "Japanese", English: "English", Esperanto: "Esperanto", codec: { encode: (value: Language): ReadonlyArray<number> => {
  switch (value) {
    case "Japanese": {
      return [0];
    }
    case "English": {
      return [1];
    }
    case "Esperanto": {
      return [2];
    }
  }
}, decode: (index: number, binary: Uint8Array): { readonly result: Language; readonly nextIndex: number } => {
  const patternIndex: { readonly result: number; readonly nextIndex: number } = Int32.codec.decode(index, binary);
  if (patternIndex.result === 0) {
    return { result: Language.Japanese, nextIndex: patternIndex.nextIndex };
  }
  if (patternIndex.result === 1) {
    return { result: Language.English, nextIndex: patternIndex.nextIndex };
  }
  if (patternIndex.result === 2) {
    return { result: Language.Esperanto, nextIndex: patternIndex.nextIndex };
  }
  throw new Error("存在しないパターンを指定された 型を更新してください");
} } };


/**
 * ユーザーのデータのスナップショット
 * @typePartId 655cea387d1aca74e54df4fc2888bcbb
 */
export const User: { readonly codec: Codec<User> } = { codec: { encode: (value: User): ReadonlyArray<number> => (String.codec.encode(value.name).concat(ImageToken.codec.encode(value.imageHash)).concat(String.codec.encode(value.introduction)).concat(Time.codec.encode(value.createTime))), decode: (index: number, binary: Uint8Array): { readonly result: User; readonly nextIndex: number } => {
  const nameAndNextIndex: { readonly result: String; readonly nextIndex: number } = String.codec.decode(index, binary);
  const imageHashAndNextIndex: { readonly result: ImageToken; readonly nextIndex: number } = ImageToken.codec.decode(nameAndNextIndex.nextIndex, binary);
  const introductionAndNextIndex: { readonly result: String; readonly nextIndex: number } = String.codec.decode(imageHashAndNextIndex.nextIndex, binary);
  const createTimeAndNextIndex: { readonly result: Time; readonly nextIndex: number } = Time.codec.decode(introductionAndNextIndex.nextIndex, binary);
  return { result: { name: nameAndNextIndex.result, imageHash: imageHashAndNextIndex.result, introduction: introductionAndNextIndex.result, createTime: createTimeAndNextIndex.result }, nextIndex: createTimeAndNextIndex.nextIndex };
} } };


/**
 * データを識別するIdとデータ
 * @typePartId 12a442ac046b1757e8684652c2669450
 */
export const IdAndData: { readonly codec: <id extends unknown, data extends unknown>(a: Codec<id>, b: Codec<data>) => Codec<IdAndData<id, data>> } = { codec: <id extends unknown, data extends unknown>(idCodec: Codec<id>, dataCodec: Codec<data>): Codec<IdAndData<id, data>> => ({ encode: (value: IdAndData<id, data>): ReadonlyArray<number> => (idCodec.encode(value.id).concat(dataCodec.encode(value.data))), decode: (index: number, binary: Uint8Array): { readonly result: IdAndData<id, data>; readonly nextIndex: number } => {
  const idAndNextIndex: { readonly result: id; readonly nextIndex: number } = idCodec.decode(index, binary);
  const dataAndNextIndex: { readonly result: data; readonly nextIndex: number } = dataCodec.decode(idAndNextIndex.nextIndex, binary);
  return { result: { id: idAndNextIndex.result, data: dataAndNextIndex.result }, nextIndex: dataAndNextIndex.nextIndex };
} }) };


/**
 * プロジェクト
 * @typePartId 3fb93c7e94724891d2a224c6f945acbd
 */
export const Project: { readonly codec: Codec<Project> } = { codec: { encode: (value: Project): ReadonlyArray<number> => (String.codec.encode(value.name).concat(ImageToken.codec.encode(value.iconHash)).concat(ImageToken.codec.encode(value.imageHash)).concat(Time.codec.encode(value.createTime)).concat(UserId.codec.encode(value.createUserId)).concat(Time.codec.encode(value.updateTime)).concat(IdeaId.codec.encode(value.rootIdeaId)).concat(CommitId.codec.encode(value.commitId))), decode: (index: number, binary: Uint8Array): { readonly result: Project; readonly nextIndex: number } => {
  const nameAndNextIndex: { readonly result: String; readonly nextIndex: number } = String.codec.decode(index, binary);
  const iconHashAndNextIndex: { readonly result: ImageToken; readonly nextIndex: number } = ImageToken.codec.decode(nameAndNextIndex.nextIndex, binary);
  const imageHashAndNextIndex: { readonly result: ImageToken; readonly nextIndex: number } = ImageToken.codec.decode(iconHashAndNextIndex.nextIndex, binary);
  const createTimeAndNextIndex: { readonly result: Time; readonly nextIndex: number } = Time.codec.decode(imageHashAndNextIndex.nextIndex, binary);
  const createUserIdAndNextIndex: { readonly result: UserId; readonly nextIndex: number } = UserId.codec.decode(createTimeAndNextIndex.nextIndex, binary);
  const updateTimeAndNextIndex: { readonly result: Time; readonly nextIndex: number } = Time.codec.decode(createUserIdAndNextIndex.nextIndex, binary);
  const rootIdeaIdAndNextIndex: { readonly result: IdeaId; readonly nextIndex: number } = IdeaId.codec.decode(updateTimeAndNextIndex.nextIndex, binary);
  const commitIdAndNextIndex: { readonly result: CommitId; readonly nextIndex: number } = CommitId.codec.decode(rootIdeaIdAndNextIndex.nextIndex, binary);
  return { result: { name: nameAndNextIndex.result, iconHash: iconHashAndNextIndex.result, imageHash: imageHashAndNextIndex.result, createTime: createTimeAndNextIndex.result, createUserId: createUserIdAndNextIndex.result, updateTime: updateTimeAndNextIndex.result, rootIdeaId: rootIdeaIdAndNextIndex.result, commitId: commitIdAndNextIndex.result }, nextIndex: commitIdAndNextIndex.nextIndex };
} } };


/**
 * アイデア
 * @typePartId 98d993c8105a292781e3d3291fb477b6
 */
export const Idea: { readonly codec: Codec<Idea> } = { codec: { encode: (value: Idea): ReadonlyArray<number> => (String.codec.encode(value.name).concat(UserId.codec.encode(value.createUserId)).concat(Time.codec.encode(value.createTime)).concat(ProjectId.codec.encode(value.projectId)).concat(List.codec(Comment.codec).encode(value.commentList)).concat(Maybe.codec(IdeaId.codec).encode(value.parentIdeaId)).concat(Time.codec.encode(value.updateTime)).concat(IdeaState.codec.encode(value.state))), decode: (index: number, binary: Uint8Array): { readonly result: Idea; readonly nextIndex: number } => {
  const nameAndNextIndex: { readonly result: String; readonly nextIndex: number } = String.codec.decode(index, binary);
  const createUserIdAndNextIndex: { readonly result: UserId; readonly nextIndex: number } = UserId.codec.decode(nameAndNextIndex.nextIndex, binary);
  const createTimeAndNextIndex: { readonly result: Time; readonly nextIndex: number } = Time.codec.decode(createUserIdAndNextIndex.nextIndex, binary);
  const projectIdAndNextIndex: { readonly result: ProjectId; readonly nextIndex: number } = ProjectId.codec.decode(createTimeAndNextIndex.nextIndex, binary);
  const commentListAndNextIndex: { readonly result: List<Comment>; readonly nextIndex: number } = List.codec(Comment.codec).decode(projectIdAndNextIndex.nextIndex, binary);
  const parentIdeaIdAndNextIndex: { readonly result: Maybe<IdeaId>; readonly nextIndex: number } = Maybe.codec(IdeaId.codec).decode(commentListAndNextIndex.nextIndex, binary);
  const updateTimeAndNextIndex: { readonly result: Time; readonly nextIndex: number } = Time.codec.decode(parentIdeaIdAndNextIndex.nextIndex, binary);
  const stateAndNextIndex: { readonly result: IdeaState; readonly nextIndex: number } = IdeaState.codec.decode(updateTimeAndNextIndex.nextIndex, binary);
  return { result: { name: nameAndNextIndex.result, createUserId: createUserIdAndNextIndex.result, createTime: createTimeAndNextIndex.result, projectId: projectIdAndNextIndex.result, commentList: commentListAndNextIndex.result, parentIdeaId: parentIdeaIdAndNextIndex.result, updateTime: updateTimeAndNextIndex.result, state: stateAndNextIndex.result }, nextIndex: stateAndNextIndex.nextIndex };
} } };


/**
 * アイデアのコメント
 * @typePartId ce630fa90ed090bd14c941915abd3293
 */
export const Comment: { readonly codec: Codec<Comment> } = { codec: { encode: (value: Comment): ReadonlyArray<number> => (UserId.codec.encode(value.createUserId).concat(Time.codec.encode(value.createTime)).concat(String.codec.encode(value.body))), decode: (index: number, binary: Uint8Array): { readonly result: Comment; readonly nextIndex: number } => {
  const createUserIdAndNextIndex: { readonly result: UserId; readonly nextIndex: number } = UserId.codec.decode(index, binary);
  const createTimeAndNextIndex: { readonly result: Time; readonly nextIndex: number } = Time.codec.decode(createUserIdAndNextIndex.nextIndex, binary);
  const bodyAndNextIndex: { readonly result: String; readonly nextIndex: number } = String.codec.decode(createTimeAndNextIndex.nextIndex, binary);
  return { result: { createUserId: createUserIdAndNextIndex.result, createTime: createTimeAndNextIndex.result, body: bodyAndNextIndex.result }, nextIndex: bodyAndNextIndex.nextIndex };
} } };


/**
 * コミット. コードのスナップショット
 * @typePartId f16c59a2158d9642481085d2492007f8
 */
export const Commit: { readonly codec: Codec<Commit> } = { codec: { encode: (value: Commit): ReadonlyArray<number> => (UserId.codec.encode(value.createUserId).concat(String.codec.encode(value.description)).concat(Bool.codec.encode(value.isDraft)).concat(String.codec.encode(value.projectName)).concat(ImageToken.codec.encode(value.projectImage)).concat(ImageToken.codec.encode(value.projectIcon)).concat(List.codec(PartHash.codec).encode(value.partHashList)).concat(List.codec(TypePartHash.codec).encode(value.typePartHashList)).concat(ProjectId.codec.encode(value.projectId)).concat(IdeaId.codec.encode(value.ideaId)).concat(Time.codec.encode(value.createTime)).concat(Time.codec.encode(value.updateTime))), decode: (index: number, binary: Uint8Array): { readonly result: Commit; readonly nextIndex: number } => {
  const createUserIdAndNextIndex: { readonly result: UserId; readonly nextIndex: number } = UserId.codec.decode(index, binary);
  const descriptionAndNextIndex: { readonly result: String; readonly nextIndex: number } = String.codec.decode(createUserIdAndNextIndex.nextIndex, binary);
  const isDraftAndNextIndex: { readonly result: Bool; readonly nextIndex: number } = Bool.codec.decode(descriptionAndNextIndex.nextIndex, binary);
  const projectNameAndNextIndex: { readonly result: String; readonly nextIndex: number } = String.codec.decode(isDraftAndNextIndex.nextIndex, binary);
  const projectImageAndNextIndex: { readonly result: ImageToken; readonly nextIndex: number } = ImageToken.codec.decode(projectNameAndNextIndex.nextIndex, binary);
  const projectIconAndNextIndex: { readonly result: ImageToken; readonly nextIndex: number } = ImageToken.codec.decode(projectImageAndNextIndex.nextIndex, binary);
  const partHashListAndNextIndex: { readonly result: List<PartHash>; readonly nextIndex: number } = List.codec(PartHash.codec).decode(projectIconAndNextIndex.nextIndex, binary);
  const typePartHashListAndNextIndex: { readonly result: List<TypePartHash>; readonly nextIndex: number } = List.codec(TypePartHash.codec).decode(partHashListAndNextIndex.nextIndex, binary);
  const projectIdAndNextIndex: { readonly result: ProjectId; readonly nextIndex: number } = ProjectId.codec.decode(typePartHashListAndNextIndex.nextIndex, binary);
  const ideaIdAndNextIndex: { readonly result: IdeaId; readonly nextIndex: number } = IdeaId.codec.decode(projectIdAndNextIndex.nextIndex, binary);
  const createTimeAndNextIndex: { readonly result: Time; readonly nextIndex: number } = Time.codec.decode(ideaIdAndNextIndex.nextIndex, binary);
  const updateTimeAndNextIndex: { readonly result: Time; readonly nextIndex: number } = Time.codec.decode(createTimeAndNextIndex.nextIndex, binary);
  return { result: { createUserId: createUserIdAndNextIndex.result, description: descriptionAndNextIndex.result, isDraft: isDraftAndNextIndex.result, projectName: projectNameAndNextIndex.result, projectImage: projectImageAndNextIndex.result, projectIcon: projectIconAndNextIndex.result, partHashList: partHashListAndNextIndex.result, typePartHashList: typePartHashListAndNextIndex.result, projectId: projectIdAndNextIndex.result, ideaId: ideaIdAndNextIndex.result, createTime: createTimeAndNextIndex.result, updateTime: updateTimeAndNextIndex.result }, nextIndex: updateTimeAndNextIndex.nextIndex };
} } };


/**
 * アイデアの状況
 * @typePartId 9b97c1996665f1009a2f5a0f334d6bff
 */
export const IdeaState: { 
/**
 * コミットと子アイデアとコメントを受付中
 */
readonly Creating: IdeaState; 
/**
 * 実現するコミットが作られ, 承認された
 */
readonly Approved: (a: CommitId) => IdeaState; readonly codec: Codec<IdeaState> } = { Creating: { _: "Creating" }, Approved: (commitId: CommitId): IdeaState => ({ _: "Approved", commitId }), codec: { encode: (value: IdeaState): ReadonlyArray<number> => {
  switch (value._) {
    case "Creating": {
      return [0];
    }
    case "Approved": {
      return [1].concat(CommitId.codec.encode(value.commitId));
    }
  }
}, decode: (index: number, binary: Uint8Array): { readonly result: IdeaState; readonly nextIndex: number } => {
  const patternIndex: { readonly result: number; readonly nextIndex: number } = Int32.codec.decode(index, binary);
  if (patternIndex.result === 0) {
    return { result: IdeaState.Creating, nextIndex: patternIndex.nextIndex };
  }
  if (patternIndex.result === 1) {
    const result: { readonly result: CommitId; readonly nextIndex: number } = CommitId.codec.decode(patternIndex.nextIndex, binary);
    return { result: IdeaState.Approved(result.result), nextIndex: result.nextIndex };
  }
  throw new Error("存在しないパターンを指定された 型を更新してください");
} } };


/**
 * パーツの定義
 * @typePartId 68599f9f5f2405a4f83d4dc4a8d4dfd7
 */
export const Part: { readonly codec: Codec<Part> } = { codec: { encode: (value: Part): ReadonlyArray<number> => (String.codec.encode(value.name).concat(String.codec.encode(value.description)).concat(Type.codec.encode(value.type)).concat(Expr.codec.encode(value.expr)).concat(ProjectId.codec.encode(value.projectId)).concat(CommitId.codec.encode(value.createCommitId))), decode: (index: number, binary: Uint8Array): { readonly result: Part; readonly nextIndex: number } => {
  const nameAndNextIndex: { readonly result: String; readonly nextIndex: number } = String.codec.decode(index, binary);
  const descriptionAndNextIndex: { readonly result: String; readonly nextIndex: number } = String.codec.decode(nameAndNextIndex.nextIndex, binary);
  const typeAndNextIndex: { readonly result: Type; readonly nextIndex: number } = Type.codec.decode(descriptionAndNextIndex.nextIndex, binary);
  const exprAndNextIndex: { readonly result: Expr; readonly nextIndex: number } = Expr.codec.decode(typeAndNextIndex.nextIndex, binary);
  const projectIdAndNextIndex: { readonly result: ProjectId; readonly nextIndex: number } = ProjectId.codec.decode(exprAndNextIndex.nextIndex, binary);
  const createCommitIdAndNextIndex: { readonly result: CommitId; readonly nextIndex: number } = CommitId.codec.decode(projectIdAndNextIndex.nextIndex, binary);
  return { result: { name: nameAndNextIndex.result, description: descriptionAndNextIndex.result, type: typeAndNextIndex.result, expr: exprAndNextIndex.result, projectId: projectIdAndNextIndex.result, createCommitId: createCommitIdAndNextIndex.result }, nextIndex: createCommitIdAndNextIndex.nextIndex };
} } };


/**
 * 型パーツ
 * @typePartId 95932121474f7db6f7a1256734be7746
 */
export const TypePart: { readonly codec: Codec<TypePart> } = { codec: { encode: (value: TypePart): ReadonlyArray<number> => (String.codec.encode(value.name).concat(String.codec.encode(value.description)).concat(ProjectId.codec.encode(value.projectId)).concat(Maybe.codec(TypeAttribute.codec).encode(value.attribute)).concat(List.codec(TypeParameter.codec).encode(value.typeParameterList)).concat(TypePartBody.codec.encode(value.body))), decode: (index: number, binary: Uint8Array): { readonly result: TypePart; readonly nextIndex: number } => {
  const nameAndNextIndex: { readonly result: String; readonly nextIndex: number } = String.codec.decode(index, binary);
  const descriptionAndNextIndex: { readonly result: String; readonly nextIndex: number } = String.codec.decode(nameAndNextIndex.nextIndex, binary);
  const projectIdAndNextIndex: { readonly result: ProjectId; readonly nextIndex: number } = ProjectId.codec.decode(descriptionAndNextIndex.nextIndex, binary);
  const attributeAndNextIndex: { readonly result: Maybe<TypeAttribute>; readonly nextIndex: number } = Maybe.codec(TypeAttribute.codec).decode(projectIdAndNextIndex.nextIndex, binary);
  const typeParameterListAndNextIndex: { readonly result: List<TypeParameter>; readonly nextIndex: number } = List.codec(TypeParameter.codec).decode(attributeAndNextIndex.nextIndex, binary);
  const bodyAndNextIndex: { readonly result: TypePartBody; readonly nextIndex: number } = TypePartBody.codec.decode(typeParameterListAndNextIndex.nextIndex, binary);
  return { result: { name: nameAndNextIndex.result, description: descriptionAndNextIndex.result, projectId: projectIdAndNextIndex.result, attribute: attributeAndNextIndex.result, typeParameterList: typeParameterListAndNextIndex.result, body: bodyAndNextIndex.result }, nextIndex: bodyAndNextIndex.nextIndex };
} } };


/**
 * コンパイラに向けた, 型のデータ形式をどうするかの情報
 * @typePartId 225e93ce3e35aa0bd76d07ea6f6b89cf
 */
export const TypeAttribute: { 
/**
 * JavaScript, TypeScript で boolean として扱うように指示する. 定義が2つのパターンで両方パラメーターなし false, trueの順である必要がある
 */
readonly AsBoolean: TypeAttribute; 
/**
 * JavaScript, TypeScript で undefined として扱うように指示する. 定義が1つのパターンでパラメーターなしである必要がある
 */
readonly AsUndefined: TypeAttribute; readonly codec: Codec<TypeAttribute> } = { AsBoolean: "AsBoolean", AsUndefined: "AsUndefined", codec: { encode: (value: TypeAttribute): ReadonlyArray<number> => {
  switch (value) {
    case "AsBoolean": {
      return [0];
    }
    case "AsUndefined": {
      return [1];
    }
  }
}, decode: (index: number, binary: Uint8Array): { readonly result: TypeAttribute; readonly nextIndex: number } => {
  const patternIndex: { readonly result: number; readonly nextIndex: number } = Int32.codec.decode(index, binary);
  if (patternIndex.result === 0) {
    return { result: TypeAttribute.AsBoolean, nextIndex: patternIndex.nextIndex };
  }
  if (patternIndex.result === 1) {
    return { result: TypeAttribute.AsUndefined, nextIndex: patternIndex.nextIndex };
  }
  throw new Error("存在しないパターンを指定された 型を更新してください");
} } };


/**
 * 型パラメーター
 * @typePartId e1333f2af01621585b96e47aea9bfee1
 */
export const TypeParameter: { readonly codec: Codec<TypeParameter> } = { codec: { encode: (value: TypeParameter): ReadonlyArray<number> => (String.codec.encode(value.name).concat(TypePartId.codec.encode(value.typePartId))), decode: (index: number, binary: Uint8Array): { readonly result: TypeParameter; readonly nextIndex: number } => {
  const nameAndNextIndex: { readonly result: String; readonly nextIndex: number } = String.codec.decode(index, binary);
  const typePartIdAndNextIndex: { readonly result: TypePartId; readonly nextIndex: number } = TypePartId.codec.decode(nameAndNextIndex.nextIndex, binary);
  return { result: { name: nameAndNextIndex.result, typePartId: typePartIdAndNextIndex.result }, nextIndex: typePartIdAndNextIndex.nextIndex };
} } };


/**
 * 型の定義本体
 * @typePartId 27c027f90fb0fed86c8205cbd90cd08e
 */
export const TypePartBody: { 
/**
 * 直積型
 */
readonly Product: (a: List<Member>) => TypePartBody; 
/**
 * 直和型
 */
readonly Sum: (a: List<Pattern>) => TypePartBody; 
/**
 * Definyだけでは表現できないデータ型
 */
readonly Kernel: (a: TypePartBodyKernel) => TypePartBody; readonly codec: Codec<TypePartBody> } = { Product: (memberList: List<Member>): TypePartBody => ({ _: "Product", memberList }), Sum: (patternList: List<Pattern>): TypePartBody => ({ _: "Sum", patternList }), Kernel: (typePartBodyKernel: TypePartBodyKernel): TypePartBody => ({ _: "Kernel", typePartBodyKernel }), codec: { encode: (value: TypePartBody): ReadonlyArray<number> => {
  switch (value._) {
    case "Product": {
      return [0].concat(List.codec(Member.codec).encode(value.memberList));
    }
    case "Sum": {
      return [1].concat(List.codec(Pattern.codec).encode(value.patternList));
    }
    case "Kernel": {
      return [2].concat(TypePartBodyKernel.codec.encode(value.typePartBodyKernel));
    }
  }
}, decode: (index: number, binary: Uint8Array): { readonly result: TypePartBody; readonly nextIndex: number } => {
  const patternIndex: { readonly result: number; readonly nextIndex: number } = Int32.codec.decode(index, binary);
  if (patternIndex.result === 0) {
    const result: { readonly result: List<Member>; readonly nextIndex: number } = List.codec(Member.codec).decode(patternIndex.nextIndex, binary);
    return { result: TypePartBody.Product(result.result), nextIndex: result.nextIndex };
  }
  if (patternIndex.result === 1) {
    const result: { readonly result: List<Pattern>; readonly nextIndex: number } = List.codec(Pattern.codec).decode(patternIndex.nextIndex, binary);
    return { result: TypePartBody.Sum(result.result), nextIndex: result.nextIndex };
  }
  if (patternIndex.result === 2) {
    const result: { readonly result: TypePartBodyKernel; readonly nextIndex: number } = TypePartBodyKernel.codec.decode(patternIndex.nextIndex, binary);
    return { result: TypePartBody.Kernel(result.result), nextIndex: result.nextIndex };
  }
  throw new Error("存在しないパターンを指定された 型を更新してください");
} } };


/**
 * 直積型のメンバー
 * @typePartId 73b8e53686ac76acb085cb096f658d58
 */
export const Member: { readonly codec: Codec<Member> } = { codec: { encode: (value: Member): ReadonlyArray<number> => (String.codec.encode(value.name).concat(String.codec.encode(value.description)).concat(Type.codec.encode(value.type))), decode: (index: number, binary: Uint8Array): { readonly result: Member; readonly nextIndex: number } => {
  const nameAndNextIndex: { readonly result: String; readonly nextIndex: number } = String.codec.decode(index, binary);
  const descriptionAndNextIndex: { readonly result: String; readonly nextIndex: number } = String.codec.decode(nameAndNextIndex.nextIndex, binary);
  const typeAndNextIndex: { readonly result: Type; readonly nextIndex: number } = Type.codec.decode(descriptionAndNextIndex.nextIndex, binary);
  return { result: { name: nameAndNextIndex.result, description: descriptionAndNextIndex.result, type: typeAndNextIndex.result }, nextIndex: typeAndNextIndex.nextIndex };
} } };


/**
 * 直積型のパターン
 * @typePartId 512c55527a1ce9822e1e51b2f6063789
 */
export const Pattern: { readonly codec: Codec<Pattern> } = { codec: { encode: (value: Pattern): ReadonlyArray<number> => (String.codec.encode(value.name).concat(String.codec.encode(value.description)).concat(Maybe.codec(Type.codec).encode(value.parameter))), decode: (index: number, binary: Uint8Array): { readonly result: Pattern; readonly nextIndex: number } => {
  const nameAndNextIndex: { readonly result: String; readonly nextIndex: number } = String.codec.decode(index, binary);
  const descriptionAndNextIndex: { readonly result: String; readonly nextIndex: number } = String.codec.decode(nameAndNextIndex.nextIndex, binary);
  const parameterAndNextIndex: { readonly result: Maybe<Type>; readonly nextIndex: number } = Maybe.codec(Type.codec).decode(descriptionAndNextIndex.nextIndex, binary);
  return { result: { name: nameAndNextIndex.result, description: descriptionAndNextIndex.result, parameter: parameterAndNextIndex.result }, nextIndex: parameterAndNextIndex.nextIndex };
} } };


/**
 * Definyだけでは表現できないデータ型
 * @typePartId 739fb46c7b45d8c51865fc91d5d2ebb1
 */
export const TypePartBodyKernel: { 
/**
 * 関数
 */
readonly Function: TypePartBodyKernel; 
/**
 * 32bit整数
 */
readonly Int32: TypePartBodyKernel; 
/**
 * 文字列. Definyだけで表現できるが, TypeScriptでstringとして扱うために必要
 */
readonly String: TypePartBodyKernel; 
/**
 * バイナリ型. TypeScriptではUint8Arrayとして扱う
 */
readonly Binary: TypePartBodyKernel; 
/**
 * UUID (16byte) を表現する. 内部表現はとりあえず0-f長さ32の文字列
 */
readonly Id: TypePartBodyKernel; 
/**
 * sha256などでハッシュ化したもの (32byte) を表現する. 内部表現はとりあえず0-f長さ64の文字列
 */
readonly Token: TypePartBodyKernel; 
/**
 * 配列型. TypeScriptではReadonlyArrayとして扱う
 */
readonly List: TypePartBodyKernel; readonly codec: Codec<TypePartBodyKernel> } = { Function: "Function", Int32: "Int32", String: "String", Binary: "Binary", Id: "Id", Token: "Token", List: "List", codec: { encode: (value: TypePartBodyKernel): ReadonlyArray<number> => {
  switch (value) {
    case "Function": {
      return [0];
    }
    case "Int32": {
      return [1];
    }
    case "String": {
      return [2];
    }
    case "Binary": {
      return [3];
    }
    case "Id": {
      return [4];
    }
    case "Token": {
      return [5];
    }
    case "List": {
      return [6];
    }
  }
}, decode: (index: number, binary: Uint8Array): { readonly result: TypePartBodyKernel; readonly nextIndex: number } => {
  const patternIndex: { readonly result: number; readonly nextIndex: number } = Int32.codec.decode(index, binary);
  if (patternIndex.result === 0) {
    return { result: TypePartBodyKernel.Function, nextIndex: patternIndex.nextIndex };
  }
  if (patternIndex.result === 1) {
    return { result: TypePartBodyKernel.Int32, nextIndex: patternIndex.nextIndex };
  }
  if (patternIndex.result === 2) {
    return { result: TypePartBodyKernel.String, nextIndex: patternIndex.nextIndex };
  }
  if (patternIndex.result === 3) {
    return { result: TypePartBodyKernel.Binary, nextIndex: patternIndex.nextIndex };
  }
  if (patternIndex.result === 4) {
    return { result: TypePartBodyKernel.Id, nextIndex: patternIndex.nextIndex };
  }
  if (patternIndex.result === 5) {
    return { result: TypePartBodyKernel.Token, nextIndex: patternIndex.nextIndex };
  }
  if (patternIndex.result === 6) {
    return { result: TypePartBodyKernel.List, nextIndex: patternIndex.nextIndex };
  }
  throw new Error("存在しないパターンを指定された 型を更新してください");
} } };


/**
 * 型
 * @typePartId 0e16754e227d7287a01596ee10e1244f
 */
export const Type: { readonly codec: Codec<Type> } = { codec: { encode: (value: Type): ReadonlyArray<number> => (TypePartId.codec.encode(value.typePartId).concat(List.codec(Type.codec).encode(value.parameter))), decode: (index: number, binary: Uint8Array): { readonly result: Type; readonly nextIndex: number } => {
  const typePartIdAndNextIndex: { readonly result: TypePartId; readonly nextIndex: number } = TypePartId.codec.decode(index, binary);
  const parameterAndNextIndex: { readonly result: List<Type>; readonly nextIndex: number } = List.codec(Type.codec).decode(typePartIdAndNextIndex.nextIndex, binary);
  return { result: { typePartId: typePartIdAndNextIndex.result, parameter: parameterAndNextIndex.result }, nextIndex: parameterAndNextIndex.nextIndex };
} } };


/**
 * 式
 * @typePartId 6e0366a4344ee3f670bd5238aa86cb9e
 */
export const Expr: { 
/**
 * Definyだけでは表現できない式
 */
readonly Kernel: (a: KernelExpr) => Expr; 
/**
 * 32bit整数
 */
readonly Int32Literal: (a: Int32) => Expr; 
/**
 * パーツの値を参照
 */
readonly PartReference: (a: PartId) => Expr; 
/**
 * タグを参照
 */
readonly TagReference: (a: TagReference) => Expr; 
/**
 * 関数呼び出し
 */
readonly FunctionCall: (a: FunctionCall) => Expr; 
/**
 * ラムダ
 */
readonly Lambda: (a: List<LambdaBranch>) => Expr; readonly codec: Codec<Expr> } = { Kernel: (kernelExpr: KernelExpr): Expr => ({ _: "Kernel", kernelExpr }), Int32Literal: (int32: Int32): Expr => ({ _: "Int32Literal", int32 }), PartReference: (partId: PartId): Expr => ({ _: "PartReference", partId }), TagReference: (tagReference: TagReference): Expr => ({ _: "TagReference", tagReference }), FunctionCall: (functionCall: FunctionCall): Expr => ({ _: "FunctionCall", functionCall }), Lambda: (lambdaBranchList: List<LambdaBranch>): Expr => ({ _: "Lambda", lambdaBranchList }), codec: { encode: (value: Expr): ReadonlyArray<number> => {
  switch (value._) {
    case "Kernel": {
      return [0].concat(KernelExpr.codec.encode(value.kernelExpr));
    }
    case "Int32Literal": {
      return [1].concat(Int32.codec.encode(value.int32));
    }
    case "PartReference": {
      return [2].concat(PartId.codec.encode(value.partId));
    }
    case "TagReference": {
      return [3].concat(TagReference.codec.encode(value.tagReference));
    }
    case "FunctionCall": {
      return [4].concat(FunctionCall.codec.encode(value.functionCall));
    }
    case "Lambda": {
      return [5].concat(List.codec(LambdaBranch.codec).encode(value.lambdaBranchList));
    }
  }
}, decode: (index: number, binary: Uint8Array): { readonly result: Expr; readonly nextIndex: number } => {
  const patternIndex: { readonly result: number; readonly nextIndex: number } = Int32.codec.decode(index, binary);
  if (patternIndex.result === 0) {
    const result: { readonly result: KernelExpr; readonly nextIndex: number } = KernelExpr.codec.decode(patternIndex.nextIndex, binary);
    return { result: Expr.Kernel(result.result), nextIndex: result.nextIndex };
  }
  if (patternIndex.result === 1) {
    const result: { readonly result: Int32; readonly nextIndex: number } = Int32.codec.decode(patternIndex.nextIndex, binary);
    return { result: Expr.Int32Literal(result.result), nextIndex: result.nextIndex };
  }
  if (patternIndex.result === 2) {
    const result: { readonly result: PartId; readonly nextIndex: number } = PartId.codec.decode(patternIndex.nextIndex, binary);
    return { result: Expr.PartReference(result.result), nextIndex: result.nextIndex };
  }
  if (patternIndex.result === 3) {
    const result: { readonly result: TagReference; readonly nextIndex: number } = TagReference.codec.decode(patternIndex.nextIndex, binary);
    return { result: Expr.TagReference(result.result), nextIndex: result.nextIndex };
  }
  if (patternIndex.result === 4) {
    const result: { readonly result: FunctionCall; readonly nextIndex: number } = FunctionCall.codec.decode(patternIndex.nextIndex, binary);
    return { result: Expr.FunctionCall(result.result), nextIndex: result.nextIndex };
  }
  if (patternIndex.result === 5) {
    const result: { readonly result: List<LambdaBranch>; readonly nextIndex: number } = List.codec(LambdaBranch.codec).decode(patternIndex.nextIndex, binary);
    return { result: Expr.Lambda(result.result), nextIndex: result.nextIndex };
  }
  throw new Error("存在しないパターンを指定された 型を更新してください");
} } };


/**
 * Definyだけでは表現できない式
 * @typePartId dfd22b704f16a4033ad6a07b6ce7fb5b
 */
export const KernelExpr: { 
/**
 * 32bit整数を足す関数
 */
readonly Int32Add: KernelExpr; 
/**
 * 32bit整数を引く関数
 */
readonly Int32Sub: KernelExpr; 
/**
 * 32bit整数をかける関数
 */
readonly Int32Mul: KernelExpr; readonly codec: Codec<KernelExpr> } = { Int32Add: "Int32Add", Int32Sub: "Int32Sub", Int32Mul: "Int32Mul", codec: { encode: (value: KernelExpr): ReadonlyArray<number> => {
  switch (value) {
    case "Int32Add": {
      return [0];
    }
    case "Int32Sub": {
      return [1];
    }
    case "Int32Mul": {
      return [2];
    }
  }
}, decode: (index: number, binary: Uint8Array): { readonly result: KernelExpr; readonly nextIndex: number } => {
  const patternIndex: { readonly result: number; readonly nextIndex: number } = Int32.codec.decode(index, binary);
  if (patternIndex.result === 0) {
    return { result: KernelExpr.Int32Add, nextIndex: patternIndex.nextIndex };
  }
  if (patternIndex.result === 1) {
    return { result: KernelExpr.Int32Sub, nextIndex: patternIndex.nextIndex };
  }
  if (patternIndex.result === 2) {
    return { result: KernelExpr.Int32Mul, nextIndex: patternIndex.nextIndex };
  }
  throw new Error("存在しないパターンを指定された 型を更新してください");
} } };


/**
 * タグの参照を表す
 * @typePartId 9e622b94f66cccedeb7cd9eb10232867
 */
export const TagReference: { readonly codec: Codec<TagReference> } = { codec: { encode: (value: TagReference): ReadonlyArray<number> => (TypePartId.codec.encode(value.typePartId).concat(TagId.codec.encode(value.tagId))), decode: (index: number, binary: Uint8Array): { readonly result: TagReference; readonly nextIndex: number } => {
  const typePartIdAndNextIndex: { readonly result: TypePartId; readonly nextIndex: number } = TypePartId.codec.decode(index, binary);
  const tagIdAndNextIndex: { readonly result: TagId; readonly nextIndex: number } = TagId.codec.decode(typePartIdAndNextIndex.nextIndex, binary);
  return { result: { typePartId: typePartIdAndNextIndex.result, tagId: tagIdAndNextIndex.result }, nextIndex: tagIdAndNextIndex.nextIndex };
} } };


/**
 * 関数呼び出し
 * @typePartId eb48ccda184401de37cee133ee046e94
 */
export const FunctionCall: { readonly codec: Codec<FunctionCall> } = { codec: { encode: (value: FunctionCall): ReadonlyArray<number> => (Expr.codec.encode(value.function).concat(Expr.codec.encode(value.parameter))), decode: (index: number, binary: Uint8Array): { readonly result: FunctionCall; readonly nextIndex: number } => {
  const functionAndNextIndex: { readonly result: Expr; readonly nextIndex: number } = Expr.codec.decode(index, binary);
  const parameterAndNextIndex: { readonly result: Expr; readonly nextIndex: number } = Expr.codec.decode(functionAndNextIndex.nextIndex, binary);
  return { result: { function: functionAndNextIndex.result, parameter: parameterAndNextIndex.result }, nextIndex: parameterAndNextIndex.nextIndex };
} } };


/**
 * ラムダのブランチ. Just x -> data x のようなところ
 * @typePartId e1c39a207e4c950b326f1294550f40ac
 */
export const LambdaBranch: { readonly codec: Codec<LambdaBranch> } = { codec: { encode: (value: LambdaBranch): ReadonlyArray<number> => (Condition.codec.encode(value.condition).concat(String.codec.encode(value.description)).concat(List.codec(BranchPartDefinition.codec).encode(value.localPartList)).concat(Expr.codec.encode(value.expr))), decode: (index: number, binary: Uint8Array): { readonly result: LambdaBranch; readonly nextIndex: number } => {
  const conditionAndNextIndex: { readonly result: Condition; readonly nextIndex: number } = Condition.codec.decode(index, binary);
  const descriptionAndNextIndex: { readonly result: String; readonly nextIndex: number } = String.codec.decode(conditionAndNextIndex.nextIndex, binary);
  const localPartListAndNextIndex: { readonly result: List<BranchPartDefinition>; readonly nextIndex: number } = List.codec(BranchPartDefinition.codec).decode(descriptionAndNextIndex.nextIndex, binary);
  const exprAndNextIndex: { readonly result: Expr; readonly nextIndex: number } = Expr.codec.decode(localPartListAndNextIndex.nextIndex, binary);
  return { result: { condition: conditionAndNextIndex.result, description: descriptionAndNextIndex.result, localPartList: localPartListAndNextIndex.result, expr: exprAndNextIndex.result }, nextIndex: exprAndNextIndex.nextIndex };
} } };


/**
 * ブランチの式を使う条件
 * @typePartId a27c39d96ff09d8bafa4b37d386995d9
 */
export const Condition: { 
/**
 * タグ
 */
readonly ByTag: (a: ConditionTag) => Condition; 
/**
 * キャプチャパーツへのキャプチャ
 */
readonly ByCapture: (a: ConditionCapture) => Condition; 
/**
 * _ すべてのパターンを通すもの
 */
readonly Any: Condition; 
/**
 * 32bit整数の完全一致
 */
readonly Int32: (a: Int32) => Condition; readonly codec: Codec<Condition> } = { ByTag: (conditionTag: ConditionTag): Condition => ({ _: "ByTag", conditionTag }), ByCapture: (conditionCapture: ConditionCapture): Condition => ({ _: "ByCapture", conditionCapture }), Any: { _: "Any" }, Int32: (int32: Int32): Condition => ({ _: "Int32", int32 }), codec: { encode: (value: Condition): ReadonlyArray<number> => {
  switch (value._) {
    case "ByTag": {
      return [0].concat(ConditionTag.codec.encode(value.conditionTag));
    }
    case "ByCapture": {
      return [1].concat(ConditionCapture.codec.encode(value.conditionCapture));
    }
    case "Any": {
      return [2];
    }
    case "Int32": {
      return [3].concat(Int32.codec.encode(value.int32));
    }
  }
}, decode: (index: number, binary: Uint8Array): { readonly result: Condition; readonly nextIndex: number } => {
  const patternIndex: { readonly result: number; readonly nextIndex: number } = Int32.codec.decode(index, binary);
  if (patternIndex.result === 0) {
    const result: { readonly result: ConditionTag; readonly nextIndex: number } = ConditionTag.codec.decode(patternIndex.nextIndex, binary);
    return { result: Condition.ByTag(result.result), nextIndex: result.nextIndex };
  }
  if (patternIndex.result === 1) {
    const result: { readonly result: ConditionCapture; readonly nextIndex: number } = ConditionCapture.codec.decode(patternIndex.nextIndex, binary);
    return { result: Condition.ByCapture(result.result), nextIndex: result.nextIndex };
  }
  if (patternIndex.result === 2) {
    return { result: Condition.Any, nextIndex: patternIndex.nextIndex };
  }
  if (patternIndex.result === 3) {
    const result: { readonly result: Int32; readonly nextIndex: number } = Int32.codec.decode(patternIndex.nextIndex, binary);
    return { result: Condition.Int32(result.result), nextIndex: result.nextIndex };
  }
  throw new Error("存在しないパターンを指定された 型を更新してください");
} } };


/**
 * タグによる条件
 * @typePartId 46ec720c126a7093a527d29c176c5b59
 */
export const ConditionTag: { readonly codec: Codec<ConditionTag> } = { codec: { encode: (value: ConditionTag): ReadonlyArray<number> => (TagId.codec.encode(value.tag).concat(Maybe.codec(Condition.codec).encode(value.parameter))), decode: (index: number, binary: Uint8Array): { readonly result: ConditionTag; readonly nextIndex: number } => {
  const tagAndNextIndex: { readonly result: TagId; readonly nextIndex: number } = TagId.codec.decode(index, binary);
  const parameterAndNextIndex: { readonly result: Maybe<Condition>; readonly nextIndex: number } = Maybe.codec(Condition.codec).decode(tagAndNextIndex.nextIndex, binary);
  return { result: { tag: tagAndNextIndex.result, parameter: parameterAndNextIndex.result }, nextIndex: parameterAndNextIndex.nextIndex };
} } };


/**
 * キャプチャパーツへのキャプチャ
 * @typePartId 1e0084ab494ca046f98cd6334ecf0944
 */
export const ConditionCapture: { readonly codec: Codec<ConditionCapture> } = { codec: { encode: (value: ConditionCapture): ReadonlyArray<number> => (String.codec.encode(value.name).concat(PartId.codec.encode(value.partId))), decode: (index: number, binary: Uint8Array): { readonly result: ConditionCapture; readonly nextIndex: number } => {
  const nameAndNextIndex: { readonly result: String; readonly nextIndex: number } = String.codec.decode(index, binary);
  const partIdAndNextIndex: { readonly result: PartId; readonly nextIndex: number } = PartId.codec.decode(nameAndNextIndex.nextIndex, binary);
  return { result: { name: nameAndNextIndex.result, partId: partIdAndNextIndex.result }, nextIndex: partIdAndNextIndex.nextIndex };
} } };


/**
 * ラムダのブランチで使えるパーツを定義する部分
 * @typePartId 7591b507c8c0477470c0eadca88b86c3
 */
export const BranchPartDefinition: { readonly codec: Codec<BranchPartDefinition> } = { codec: { encode: (value: BranchPartDefinition): ReadonlyArray<number> => (PartId.codec.encode(value.partId).concat(String.codec.encode(value.name)).concat(String.codec.encode(value.description)).concat(Type.codec.encode(value.type)).concat(Expr.codec.encode(value.expr))), decode: (index: number, binary: Uint8Array): { readonly result: BranchPartDefinition; readonly nextIndex: number } => {
  const partIdAndNextIndex: { readonly result: PartId; readonly nextIndex: number } = PartId.codec.decode(index, binary);
  const nameAndNextIndex: { readonly result: String; readonly nextIndex: number } = String.codec.decode(partIdAndNextIndex.nextIndex, binary);
  const descriptionAndNextIndex: { readonly result: String; readonly nextIndex: number } = String.codec.decode(nameAndNextIndex.nextIndex, binary);
  const typeAndNextIndex: { readonly result: Type; readonly nextIndex: number } = Type.codec.decode(descriptionAndNextIndex.nextIndex, binary);
  const exprAndNextIndex: { readonly result: Expr; readonly nextIndex: number } = Expr.codec.decode(typeAndNextIndex.nextIndex, binary);
  return { result: { partId: partIdAndNextIndex.result, name: nameAndNextIndex.result, description: descriptionAndNextIndex.result, type: typeAndNextIndex.result, expr: exprAndNextIndex.result }, nextIndex: exprAndNextIndex.nextIndex };
} } };


/**
 * 評価しきった式
 * @typePartId 76b94bf171eb1dd4cbfb7835938b76b2
 */
export const EvaluatedExpr: { 
/**
 * Definyだけでは表現できない式
 */
readonly Kernel: (a: KernelExpr) => EvaluatedExpr; 
/**
 * 32bit整数
 */
readonly Int32: (a: Int32) => EvaluatedExpr; 
/**
 * タグを参照
 */
readonly TagReference: (a: TagReference) => EvaluatedExpr; 
/**
 * ラムダ
 */
readonly Lambda: (a: List<LambdaBranch>) => EvaluatedExpr; 
/**
 * 内部関数呼び出し
 */
readonly KernelCall: (a: KernelCall) => EvaluatedExpr; readonly codec: Codec<EvaluatedExpr> } = { Kernel: (kernelExpr: KernelExpr): EvaluatedExpr => ({ _: "Kernel", kernelExpr }), Int32: (int32: Int32): EvaluatedExpr => ({ _: "Int32", int32 }), TagReference: (tagReference: TagReference): EvaluatedExpr => ({ _: "TagReference", tagReference }), Lambda: (lambdaBranchList: List<LambdaBranch>): EvaluatedExpr => ({ _: "Lambda", lambdaBranchList }), KernelCall: (kernelCall: KernelCall): EvaluatedExpr => ({ _: "KernelCall", kernelCall }), codec: { encode: (value: EvaluatedExpr): ReadonlyArray<number> => {
  switch (value._) {
    case "Kernel": {
      return [0].concat(KernelExpr.codec.encode(value.kernelExpr));
    }
    case "Int32": {
      return [1].concat(Int32.codec.encode(value.int32));
    }
    case "TagReference": {
      return [2].concat(TagReference.codec.encode(value.tagReference));
    }
    case "Lambda": {
      return [3].concat(List.codec(LambdaBranch.codec).encode(value.lambdaBranchList));
    }
    case "KernelCall": {
      return [4].concat(KernelCall.codec.encode(value.kernelCall));
    }
  }
}, decode: (index: number, binary: Uint8Array): { readonly result: EvaluatedExpr; readonly nextIndex: number } => {
  const patternIndex: { readonly result: number; readonly nextIndex: number } = Int32.codec.decode(index, binary);
  if (patternIndex.result === 0) {
    const result: { readonly result: KernelExpr; readonly nextIndex: number } = KernelExpr.codec.decode(patternIndex.nextIndex, binary);
    return { result: EvaluatedExpr.Kernel(result.result), nextIndex: result.nextIndex };
  }
  if (patternIndex.result === 1) {
    const result: { readonly result: Int32; readonly nextIndex: number } = Int32.codec.decode(patternIndex.nextIndex, binary);
    return { result: EvaluatedExpr.Int32(result.result), nextIndex: result.nextIndex };
  }
  if (patternIndex.result === 2) {
    const result: { readonly result: TagReference; readonly nextIndex: number } = TagReference.codec.decode(patternIndex.nextIndex, binary);
    return { result: EvaluatedExpr.TagReference(result.result), nextIndex: result.nextIndex };
  }
  if (patternIndex.result === 3) {
    const result: { readonly result: List<LambdaBranch>; readonly nextIndex: number } = List.codec(LambdaBranch.codec).decode(patternIndex.nextIndex, binary);
    return { result: EvaluatedExpr.Lambda(result.result), nextIndex: result.nextIndex };
  }
  if (patternIndex.result === 4) {
    const result: { readonly result: KernelCall; readonly nextIndex: number } = KernelCall.codec.decode(patternIndex.nextIndex, binary);
    return { result: EvaluatedExpr.KernelCall(result.result), nextIndex: result.nextIndex };
  }
  throw new Error("存在しないパターンを指定された 型を更新してください");
} } };


/**
 * 複数の引数が必要な内部関数の部分呼び出し
 * @typePartId 1db3d6bfb8b0b396a3f94f062d37a630
 */
export const KernelCall: { readonly codec: Codec<KernelCall> } = { codec: { encode: (value: KernelCall): ReadonlyArray<number> => (KernelExpr.codec.encode(value.kernel).concat(EvaluatedExpr.codec.encode(value.expr))), decode: (index: number, binary: Uint8Array): { readonly result: KernelCall; readonly nextIndex: number } => {
  const kernelAndNextIndex: { readonly result: KernelExpr; readonly nextIndex: number } = KernelExpr.codec.decode(index, binary);
  const exprAndNextIndex: { readonly result: EvaluatedExpr; readonly nextIndex: number } = EvaluatedExpr.codec.decode(kernelAndNextIndex.nextIndex, binary);
  return { result: { kernel: kernelAndNextIndex.result, expr: exprAndNextIndex.result }, nextIndex: exprAndNextIndex.nextIndex };
} } };


/**
 * 評価したときに失敗した原因を表すもの
 * @typePartId 6519a080b86da2627bef4032319ac621
 */
export const EvaluateExprError: { 
/**
 * 式を評価するには,このパーツの定義が必要だと言っている
 */
readonly NeedPartDefinition: (a: PartId) => EvaluateExprError; 
/**
 * 計算結果にblankが含まれている
 */
readonly Blank: EvaluateExprError; 
/**
 * 型が合わない
 */
readonly TypeError: (a: TypeError) => EvaluateExprError; 
/**
 * まだサポートしていないものが含まれている
 */
readonly NotSupported: EvaluateExprError; readonly codec: Codec<EvaluateExprError> } = { NeedPartDefinition: (partId: PartId): EvaluateExprError => ({ _: "NeedPartDefinition", partId }), Blank: { _: "Blank" }, TypeError: (typeError: TypeError): EvaluateExprError => ({ _: "TypeError", typeError }), NotSupported: { _: "NotSupported" }, codec: { encode: (value: EvaluateExprError): ReadonlyArray<number> => {
  switch (value._) {
    case "NeedPartDefinition": {
      return [0].concat(PartId.codec.encode(value.partId));
    }
    case "Blank": {
      return [1];
    }
    case "TypeError": {
      return [2].concat(TypeError.codec.encode(value.typeError));
    }
    case "NotSupported": {
      return [3];
    }
  }
}, decode: (index: number, binary: Uint8Array): { readonly result: EvaluateExprError; readonly nextIndex: number } => {
  const patternIndex: { readonly result: number; readonly nextIndex: number } = Int32.codec.decode(index, binary);
  if (patternIndex.result === 0) {
    const result: { readonly result: PartId; readonly nextIndex: number } = PartId.codec.decode(patternIndex.nextIndex, binary);
    return { result: EvaluateExprError.NeedPartDefinition(result.result), nextIndex: result.nextIndex };
  }
  if (patternIndex.result === 1) {
    return { result: EvaluateExprError.Blank, nextIndex: patternIndex.nextIndex };
  }
  if (patternIndex.result === 2) {
    const result: { readonly result: TypeError; readonly nextIndex: number } = TypeError.codec.decode(patternIndex.nextIndex, binary);
    return { result: EvaluateExprError.TypeError(result.result), nextIndex: result.nextIndex };
  }
  if (patternIndex.result === 3) {
    return { result: EvaluateExprError.NotSupported, nextIndex: patternIndex.nextIndex };
  }
  throw new Error("存在しないパターンを指定された 型を更新してください");
} } };


/**
 * 型エラー
 * @typePartId 466fbfeeb2d6ead0f6bd0833b5ea3d71
 */
export const TypeError: { readonly codec: Codec<TypeError> } = { codec: { encode: (value: TypeError): ReadonlyArray<number> => (String.codec.encode(value.message)), decode: (index: number, binary: Uint8Array): { readonly result: TypeError; readonly nextIndex: number } => {
  const messageAndNextIndex: { readonly result: String; readonly nextIndex: number } = String.codec.decode(index, binary);
  return { result: { message: messageAndNextIndex.result }, nextIndex: messageAndNextIndex.nextIndex };
} } };


/**
 * プロジェクト作成時に必要なパラメーター
 * @typePartId 8ac0f1e4609a750afb9e068d9914a2db
 */
export const CreateProjectParameter: { readonly codec: Codec<CreateProjectParameter> } = { codec: { encode: (value: CreateProjectParameter): ReadonlyArray<number> => (AccountToken.codec.encode(value.accountToken).concat(String.codec.encode(value.projectName))), decode: (index: number, binary: Uint8Array): { readonly result: CreateProjectParameter; readonly nextIndex: number } => {
  const accountTokenAndNextIndex: { readonly result: AccountToken; readonly nextIndex: number } = AccountToken.codec.decode(index, binary);
  const projectNameAndNextIndex: { readonly result: String; readonly nextIndex: number } = String.codec.decode(accountTokenAndNextIndex.nextIndex, binary);
  return { result: { accountToken: accountTokenAndNextIndex.result, projectName: projectNameAndNextIndex.result }, nextIndex: projectNameAndNextIndex.nextIndex };
} } };


/**
 * アイデアを作成時に必要なパラメーター
 * @typePartId 036e55068c26060c3632062801b0216b
 */
export const CreateIdeaParameter: { readonly codec: Codec<CreateIdeaParameter> } = { codec: { encode: (value: CreateIdeaParameter): ReadonlyArray<number> => (AccountToken.codec.encode(value.accountToken).concat(String.codec.encode(value.ideaName)).concat(IdeaId.codec.encode(value.parentId))), decode: (index: number, binary: Uint8Array): { readonly result: CreateIdeaParameter; readonly nextIndex: number } => {
  const accountTokenAndNextIndex: { readonly result: AccountToken; readonly nextIndex: number } = AccountToken.codec.decode(index, binary);
  const ideaNameAndNextIndex: { readonly result: String; readonly nextIndex: number } = String.codec.decode(accountTokenAndNextIndex.nextIndex, binary);
  const parentIdAndNextIndex: { readonly result: IdeaId; readonly nextIndex: number } = IdeaId.codec.decode(ideaNameAndNextIndex.nextIndex, binary);
  return { result: { accountToken: accountTokenAndNextIndex.result, ideaName: ideaNameAndNextIndex.result, parentId: parentIdAndNextIndex.result }, nextIndex: parentIdAndNextIndex.nextIndex };
} } };


/**
 * アイデアにコメントを追加するときに必要なパラメーター
 * @typePartId ad7a6a667a36a79c3bbc81f8f0789fe8
 */
export const AddCommentParameter: { readonly codec: Codec<AddCommentParameter> } = { codec: { encode: (value: AddCommentParameter): ReadonlyArray<number> => (AccountToken.codec.encode(value.accountToken).concat(IdeaId.codec.encode(value.ideaId)).concat(String.codec.encode(value.comment))), decode: (index: number, binary: Uint8Array): { readonly result: AddCommentParameter; readonly nextIndex: number } => {
  const accountTokenAndNextIndex: { readonly result: AccountToken; readonly nextIndex: number } = AccountToken.codec.decode(index, binary);
  const ideaIdAndNextIndex: { readonly result: IdeaId; readonly nextIndex: number } = IdeaId.codec.decode(accountTokenAndNextIndex.nextIndex, binary);
  const commentAndNextIndex: { readonly result: String; readonly nextIndex: number } = String.codec.decode(ideaIdAndNextIndex.nextIndex, binary);
  return { result: { accountToken: accountTokenAndNextIndex.result, ideaId: ideaIdAndNextIndex.result, comment: commentAndNextIndex.result }, nextIndex: commentAndNextIndex.nextIndex };
} } };


/**
 * 提案を作成するときに必要なパラメーター
 * @typePartId 8b40f4351fe048ff78f14c523b6f76f1
 */
export const AddCommitParameter: { readonly codec: Codec<AddCommitParameter> } = { codec: { encode: (value: AddCommitParameter): ReadonlyArray<number> => (AccountToken.codec.encode(value.accountToken).concat(IdeaId.codec.encode(value.ideaId))), decode: (index: number, binary: Uint8Array): { readonly result: AddCommitParameter; readonly nextIndex: number } => {
  const accountTokenAndNextIndex: { readonly result: AccountToken; readonly nextIndex: number } = AccountToken.codec.decode(index, binary);
  const ideaIdAndNextIndex: { readonly result: IdeaId; readonly nextIndex: number } = IdeaId.codec.decode(accountTokenAndNextIndex.nextIndex, binary);
  return { result: { accountToken: accountTokenAndNextIndex.result, ideaId: ideaIdAndNextIndex.result }, nextIndex: ideaIdAndNextIndex.nextIndex };
} } };


/**
 * コミットを確定状態にしたり, 承認したりするときなどに使う
 * @typePartId 74280d6a5db1d48b6815a73a819756c3
 */
export const AccountTokenAndCommitId: { readonly codec: Codec<AccountTokenAndCommitId> } = { codec: { encode: (value: AccountTokenAndCommitId): ReadonlyArray<number> => (AccountToken.codec.encode(value.accountToken).concat(CommitId.codec.encode(value.commitId))), decode: (index: number, binary: Uint8Array): { readonly result: AccountTokenAndCommitId; readonly nextIndex: number } => {
  const accountTokenAndNextIndex: { readonly result: AccountToken; readonly nextIndex: number } = AccountToken.codec.decode(index, binary);
  const commitIdAndNextIndex: { readonly result: CommitId; readonly nextIndex: number } = CommitId.codec.decode(accountTokenAndNextIndex.nextIndex, binary);
  return { result: { accountToken: accountTokenAndNextIndex.result, commitId: commitIdAndNextIndex.result }, nextIndex: commitIdAndNextIndex.nextIndex };
} } };


/**
 * ログイン状態
 * @typePartId d562fe803c7e40c32269e24c1435e4d1
 */
export const LogInState: { 
/**
 * アカウントトークンをindexedDBから読み取っている状態
 */
readonly LoadingAccountTokenFromIndexedDB: LogInState; 
/**
 * ログインしていない状態
 */
readonly Guest: LogInState; 
/**
 * ログインへの画面URLをリクエストした状態
 */
readonly RequestingLogInUrl: (a: OpenIdConnectProvider) => LogInState; 
/**
 * ログインURLを受け取り,ログイン画面へ移行中
 */
readonly JumpingToLogInPage: (a: String) => LogInState; 
/**
 * アカウントトークンの検証とログインしているユーザーの情報を取得している状態
 */
readonly VerifyingAccountToken: (a: AccountToken) => LogInState; 
/**
 * ログインしている状態
 */
readonly LoggedIn: (a: AccountTokenAndUserId) => LogInState; readonly codec: Codec<LogInState> } = { LoadingAccountTokenFromIndexedDB: { _: "LoadingAccountTokenFromIndexedDB" }, Guest: { _: "Guest" }, RequestingLogInUrl: (openIdConnectProvider: OpenIdConnectProvider): LogInState => ({ _: "RequestingLogInUrl", openIdConnectProvider }), JumpingToLogInPage: (string_: String): LogInState => ({ _: "JumpingToLogInPage", string: string_ }), VerifyingAccountToken: (accountToken: AccountToken): LogInState => ({ _: "VerifyingAccountToken", accountToken }), LoggedIn: (accountTokenAndUserId: AccountTokenAndUserId): LogInState => ({ _: "LoggedIn", accountTokenAndUserId }), codec: { encode: (value: LogInState): ReadonlyArray<number> => {
  switch (value._) {
    case "LoadingAccountTokenFromIndexedDB": {
      return [0];
    }
    case "Guest": {
      return [1];
    }
    case "RequestingLogInUrl": {
      return [2].concat(OpenIdConnectProvider.codec.encode(value.openIdConnectProvider));
    }
    case "JumpingToLogInPage": {
      return [3].concat(String.codec.encode(value.string));
    }
    case "VerifyingAccountToken": {
      return [4].concat(AccountToken.codec.encode(value.accountToken));
    }
    case "LoggedIn": {
      return [5].concat(AccountTokenAndUserId.codec.encode(value.accountTokenAndUserId));
    }
  }
}, decode: (index: number, binary: Uint8Array): { readonly result: LogInState; readonly nextIndex: number } => {
  const patternIndex: { readonly result: number; readonly nextIndex: number } = Int32.codec.decode(index, binary);
  if (patternIndex.result === 0) {
    return { result: LogInState.LoadingAccountTokenFromIndexedDB, nextIndex: patternIndex.nextIndex };
  }
  if (patternIndex.result === 1) {
    return { result: LogInState.Guest, nextIndex: patternIndex.nextIndex };
  }
  if (patternIndex.result === 2) {
    const result: { readonly result: OpenIdConnectProvider; readonly nextIndex: number } = OpenIdConnectProvider.codec.decode(patternIndex.nextIndex, binary);
    return { result: LogInState.RequestingLogInUrl(result.result), nextIndex: result.nextIndex };
  }
  if (patternIndex.result === 3) {
    const result: { readonly result: String; readonly nextIndex: number } = String.codec.decode(patternIndex.nextIndex, binary);
    return { result: LogInState.JumpingToLogInPage(result.result), nextIndex: result.nextIndex };
  }
  if (patternIndex.result === 4) {
    const result: { readonly result: AccountToken; readonly nextIndex: number } = AccountToken.codec.decode(patternIndex.nextIndex, binary);
    return { result: LogInState.VerifyingAccountToken(result.result), nextIndex: result.nextIndex };
  }
  if (patternIndex.result === 5) {
    const result: { readonly result: AccountTokenAndUserId; readonly nextIndex: number } = AccountTokenAndUserId.codec.decode(patternIndex.nextIndex, binary);
    return { result: LogInState.LoggedIn(result.result), nextIndex: result.nextIndex };
  }
  throw new Error("存在しないパターンを指定された 型を更新してください");
} } };


/**
 * AccountTokenとUserId
 * @typePartId 895fb0f083f1828da2c56b25ed77eb54
 */
export const AccountTokenAndUserId: { readonly codec: Codec<AccountTokenAndUserId> } = { codec: { encode: (value: AccountTokenAndUserId): ReadonlyArray<number> => (AccountToken.codec.encode(value.accountToken).concat(UserId.codec.encode(value.userId))), decode: (index: number, binary: Uint8Array): { readonly result: AccountTokenAndUserId; readonly nextIndex: number } => {
  const accountTokenAndNextIndex: { readonly result: AccountToken; readonly nextIndex: number } = AccountToken.codec.decode(index, binary);
  const userIdAndNextIndex: { readonly result: UserId; readonly nextIndex: number } = UserId.codec.decode(accountTokenAndNextIndex.nextIndex, binary);
  return { result: { accountToken: accountTokenAndNextIndex.result, userId: userIdAndNextIndex.result }, nextIndex: userIdAndNextIndex.nextIndex };
} } };


/**
 * 取得日時と任意のデータ
 * @typePartId f7590073f3ed06452193dddbb91e82e0
 */
export const WithTime: { readonly codec: <data extends unknown>(a: Codec<data>) => Codec<WithTime<data>> } = { codec: <data extends unknown>(dataCodec: Codec<data>): Codec<WithTime<data>> => ({ encode: (value: WithTime<data>): ReadonlyArray<number> => (Time.codec.encode(value.getTime).concat(dataCodec.encode(value.data))), decode: (index: number, binary: Uint8Array): { readonly result: WithTime<data>; readonly nextIndex: number } => {
  const getTimeAndNextIndex: { readonly result: Time; readonly nextIndex: number } = Time.codec.decode(index, binary);
  const dataAndNextIndex: { readonly result: data; readonly nextIndex: number } = dataCodec.decode(getTimeAndNextIndex.nextIndex, binary);
  return { result: { getTime: getTimeAndNextIndex.result, data: dataAndNextIndex.result }, nextIndex: dataAndNextIndex.nextIndex };
} }) };


/**
 * ProjectやUserなどのリソースの状態とデータ. 読み込み中だとか
 * @typePartId 833fbf3dcab7e9365f334f8b00c24d55
 */
export const ResourceState: { 
/**
 * 読み込み済み
 */
readonly Loaded: <data extends unknown>(a: WithTime<data>) => ResourceState<data>; 
/**
 * 削除されたか, 存在しない
 */
readonly Deleted: <data extends unknown>(a: Time) => ResourceState<data>; 
/**
 * データを取得できなかった (サーバーの障害, オフライン)
 */
readonly Unknown: <data extends unknown>(a: Time) => ResourceState<data>; 
/**
 * サーバに問い合わせ中
 */
readonly Requesting: <data extends unknown>() => ResourceState<data>; readonly codec: <data extends unknown>(a: Codec<data>) => Codec<ResourceState<data>> } = { Loaded: <data extends unknown>(dataWithTime: WithTime<data>): ResourceState<data> => ({ _: "Loaded", dataWithTime }), Deleted: <data extends unknown>(time: Time): ResourceState<data> => ({ _: "Deleted", time }), Unknown: <data extends unknown>(time: Time): ResourceState<data> => ({ _: "Unknown", time }), Requesting: <data extends unknown>(): ResourceState<data> => ({ _: "Requesting" }), codec: <data extends unknown>(dataCodec: Codec<data>): Codec<ResourceState<data>> => ({ encode: (value: ResourceState<data>): ReadonlyArray<number> => {
  switch (value._) {
    case "Loaded": {
      return [0].concat(WithTime.codec(dataCodec).encode(value.dataWithTime));
    }
    case "Deleted": {
      return [1].concat(Time.codec.encode(value.time));
    }
    case "Unknown": {
      return [2].concat(Time.codec.encode(value.time));
    }
    case "Requesting": {
      return [3];
    }
  }
}, decode: (index: number, binary: Uint8Array): { readonly result: ResourceState<data>; readonly nextIndex: number } => {
  const patternIndex: { readonly result: number; readonly nextIndex: number } = Int32.codec.decode(index, binary);
  if (patternIndex.result === 0) {
    const result: { readonly result: WithTime<data>; readonly nextIndex: number } = WithTime.codec(dataCodec).decode(patternIndex.nextIndex, binary);
    return { result: ResourceState.Loaded(result.result), nextIndex: result.nextIndex };
  }
  if (patternIndex.result === 1) {
    const result: { readonly result: Time; readonly nextIndex: number } = Time.codec.decode(patternIndex.nextIndex, binary);
    return { result: ResourceState.Deleted(result.result), nextIndex: result.nextIndex };
  }
  if (patternIndex.result === 2) {
    const result: { readonly result: Time; readonly nextIndex: number } = Time.codec.decode(patternIndex.nextIndex, binary);
    return { result: ResourceState.Unknown(result.result), nextIndex: result.nextIndex };
  }
  if (patternIndex.result === 3) {
    return { result: ResourceState.Requesting(), nextIndex: patternIndex.nextIndex };
  }
  throw new Error("存在しないパターンを指定された 型を更新してください");
} }) };


/**
 * キーであるTokenによってデータが必ず1つに決まるもの. 絶対に更新されない. リソースがないということはデータが不正な状態になっているということ
 * @typePartId 134205335ce83693fd83994e907acabd
 */
export const StaticResourceState: { 
/**
 * 取得済み
 */
readonly Loaded: <data extends unknown>(a: data) => StaticResourceState<data>; 
/**
 * データを取得できなかった (サーバーの障害, オフライン)
 */
readonly Unknown: <data extends unknown>() => StaticResourceState<data>; 
/**
 * indexedDBにアクセス中
 */
readonly Loading: <data extends unknown>() => StaticResourceState<data>; 
/**
 * サーバに問い合わせ中
 */
readonly Requesting: <data extends unknown>() => StaticResourceState<data>; readonly codec: <data extends unknown>(a: Codec<data>) => Codec<StaticResourceState<data>> } = { Loaded: <data extends unknown>(data: data): StaticResourceState<data> => ({ _: "Loaded", data }), Unknown: <data extends unknown>(): StaticResourceState<data> => ({ _: "Unknown" }), Loading: <data extends unknown>(): StaticResourceState<data> => ({ _: "Loading" }), Requesting: <data extends unknown>(): StaticResourceState<data> => ({ _: "Requesting" }), codec: <data extends unknown>(dataCodec: Codec<data>): Codec<StaticResourceState<data>> => ({ encode: (value: StaticResourceState<data>): ReadonlyArray<number> => {
  switch (value._) {
    case "Loaded": {
      return [0].concat(dataCodec.encode(value.data));
    }
    case "Unknown": {
      return [1];
    }
    case "Loading": {
      return [2];
    }
    case "Requesting": {
      return [3];
    }
  }
}, decode: (index: number, binary: Uint8Array): { readonly result: StaticResourceState<data>; readonly nextIndex: number } => {
  const patternIndex: { readonly result: number; readonly nextIndex: number } = Int32.codec.decode(index, binary);
  if (patternIndex.result === 0) {
    const result: { readonly result: data; readonly nextIndex: number } = dataCodec.decode(patternIndex.nextIndex, binary);
    return { result: StaticResourceState.Loaded(result.result), nextIndex: result.nextIndex };
  }
  if (patternIndex.result === 1) {
    return { result: StaticResourceState.Unknown(), nextIndex: patternIndex.nextIndex };
  }
  if (patternIndex.result === 2) {
    return { result: StaticResourceState.Loading(), nextIndex: patternIndex.nextIndex };
  }
  if (patternIndex.result === 3) {
    return { result: StaticResourceState.Requesting(), nextIndex: patternIndex.nextIndex };
  }
  throw new Error("存在しないパターンを指定された 型を更新してください");
} }) };


/**
 * アカウントトークンとプロジェクトID
 * @typePartId 4143a0787c0f06dfddc2f2f13f7e7a20
 */
export const AccountTokenAndProjectId: { readonly codec: Codec<AccountTokenAndProjectId> } = { codec: { encode: (value: AccountTokenAndProjectId): ReadonlyArray<number> => (AccountToken.codec.encode(value.accountToken).concat(ProjectId.codec.encode(value.projectId))), decode: (index: number, binary: Uint8Array): { readonly result: AccountTokenAndProjectId; readonly nextIndex: number } => {
  const accountTokenAndNextIndex: { readonly result: AccountToken; readonly nextIndex: number } = AccountToken.codec.decode(index, binary);
  const projectIdAndNextIndex: { readonly result: ProjectId; readonly nextIndex: number } = ProjectId.codec.decode(accountTokenAndNextIndex.nextIndex, binary);
  return { result: { accountToken: accountTokenAndNextIndex.result, projectId: projectIdAndNextIndex.result }, nextIndex: projectIdAndNextIndex.nextIndex };
} } };


/**
 * 型パーツのリストを変更する
 * @typePartId 0d8c602dce6d495c31fbde469acf235d
 */
export const SetTypePartListParameter: { readonly codec: Codec<SetTypePartListParameter> } = { codec: { encode: (value: SetTypePartListParameter): ReadonlyArray<number> => (AccountToken.codec.encode(value.accountToken).concat(ProjectId.codec.encode(value.projectId)).concat(List.codec(IdAndData.codec(TypePartId.codec, TypePart.codec)).encode(value.typePartList))), decode: (index: number, binary: Uint8Array): { readonly result: SetTypePartListParameter; readonly nextIndex: number } => {
  const accountTokenAndNextIndex: { readonly result: AccountToken; readonly nextIndex: number } = AccountToken.codec.decode(index, binary);
  const projectIdAndNextIndex: { readonly result: ProjectId; readonly nextIndex: number } = ProjectId.codec.decode(accountTokenAndNextIndex.nextIndex, binary);
  const typePartListAndNextIndex: { readonly result: List<IdAndData<TypePartId, TypePart>>; readonly nextIndex: number } = List.codec(IdAndData.codec(TypePartId.codec, TypePart.codec)).decode(projectIdAndNextIndex.nextIndex, binary);
  return { result: { accountToken: accountTokenAndNextIndex.result, projectId: projectIdAndNextIndex.result, typePartList: typePartListAndNextIndex.result }, nextIndex: typePartListAndNextIndex.nextIndex };
} } };


`,
  "TypeScript output"
);

/*
 * fs.writeFile(
 *   "ts.txt",
 *   main.generateTypeScriptCodeAsString(typePartMap.typePartMap)
 * ).then(() => {
 *   console.log("www");
 * });
 */

import * as id from "./typePartId";
import * as type from "./type";
import * as util from "../source/util";
import {
  Maybe,
  TypeAttribute,
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

export const typePartMap: ReadonlyMap<TypePartId, TypePart> = new Map<
  TypePartId,
  TypePart
>([
  [
    id.Int32,
    {
      name: "Int32",
      migrationPartId: Maybe.Nothing(),
      description:
        "-2 147 483 648 ～ 2 147 483 647. 32bit 符号付き整数. JavaScriptのnumberとして扱える. numberの32bit符号あり整数をSigned Leb128のバイナリに変換する",
      projectId: util.definyCodeProjectId,
      createSuggestionId: util.codeSuggestionId,
      getTime: { day: 0, millisecond: 0 },
      attribute: Maybe.Nothing(),
      typeParameterList: [],
      body: TypePartBody.Kernel(TypePartBodyKernel.Int32),
    },
  ],
  [
    id.Binary,
    {
      name: "Binary",
      migrationPartId: Maybe.Nothing(),
      description:
        "バイナリ. JavaScriptのUint8Arrayで扱える. 最初にLED128でバイト数, その次にバイナリそのまま",
      projectId: util.definyCodeProjectId,
      createSuggestionId: util.codeSuggestionId,
      getTime: { day: 0, millisecond: 0 },
      attribute: Maybe.Nothing(),
      typeParameterList: [],
      body: TypePartBody.Kernel(TypePartBodyKernel.Binary),
    },
  ],
  [
    id.Bool,
    {
      name: "Bool",
      migrationPartId: Maybe.Nothing(),
      description:
        "Bool. 真か偽. JavaScriptのbooleanで扱える. true: 1, false: 0. (1byte)としてバイナリに変換する",
      projectId: util.definyCodeProjectId,
      createSuggestionId: util.codeSuggestionId,
      getTime: { day: 0, millisecond: 0 },
      attribute: Maybe.Just(TypeAttribute.AsBoolean),
      typeParameterList: [],
      body: TypePartBody.Sum([
        {
          name: "True",
          description: "真",
          parameter: Maybe.Nothing(),
        },
        {
          name: "False",
          description: "偽",
          parameter: Maybe.Nothing(),
        },
      ]),
    },
  ],
  [
    id.List,
    {
      name: "List",
      migrationPartId: Maybe.Nothing(),
      description: "リスト. JavaScriptのArrayで扱う",
      projectId: util.definyCodeProjectId,
      createSuggestionId: util.codeSuggestionId,
      getTime: { day: 0, millisecond: 0 },
      attribute: Maybe.Nothing(),
      typeParameterList: [
        {
          name: "e",
          typePartId: "cf95a75adf60a7eecabe7d0b4c3e68cd" as TypePartId,
        },
      ],
      body: TypePartBody.Kernel(TypePartBodyKernel.List),
    },
  ],
  [
    id.Maybe,
    {
      name: "Maybe",
      migrationPartId: Maybe.Nothing(),
      description:
        "Maybe. nullableのようなもの. 今後はRustのstd::Optionに出力するために属性をつける?",
      projectId: util.definyCodeProjectId,
      createSuggestionId: util.codeSuggestionId,
      getTime: { day: 0, millisecond: 0 },
      attribute: Maybe.Nothing(),
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
    },
  ],
  [
    id.Result,
    {
      name: "Result",
      migrationPartId: Maybe.Nothing(),
      description:
        "成功と失敗を表す型. 今後はRustのstd::Resultに出力するために属性をつける?",
      projectId: util.definyCodeProjectId,
      createSuggestionId: util.codeSuggestionId,
      getTime: { day: 0, millisecond: 0 },
      attribute: Maybe.Nothing(),
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
    },
  ],
  [
    id.String,
    {
      name: "String",
      migrationPartId: Maybe.Nothing(),
      description:
        "文字列. JavaScriptのstringで扱う. バイナリ形式はUTF-8. 不正な文字が入っている可能性がある",
      projectId: util.definyCodeProjectId,
      createSuggestionId: util.codeSuggestionId,
      getTime: { day: 0, millisecond: 0 },
      attribute: Maybe.Nothing(),
      typeParameterList: [],
      body: TypePartBody.Kernel(TypePartBodyKernel.String),
    },
  ],
  [
    id.Time,
    {
      name: "Time",
      migrationPartId: Maybe.Nothing(),
      description:
        "日時. 0001-01-01T00:00:00.000Z to 9999-12-31T23:59:59.999Z 最小単位はミリ秒. ミリ秒の求め方は day*1000*60*60*24 + millisecond",
      projectId: util.definyCodeProjectId,
      createSuggestionId: util.codeSuggestionId,
      getTime: { day: 0, millisecond: 0 },
      typeParameterList: [],
      attribute: Maybe.Nothing(),
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
    },
  ],
  [
    id.RequestLogInUrlRequestData,
    {
      name: "RequestLogInUrlRequestData",
      migrationPartId: Maybe.Nothing(),
      description: "ログインのURLを発行するために必要なデータ",
      projectId: util.definyCodeProjectId,
      createSuggestionId: util.codeSuggestionId,
      getTime: { day: 0, millisecond: 0 },
      typeParameterList: [],
      attribute: Maybe.Nothing(),
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
    },
  ],
  [
    id.OpenIdConnectProvider,
    {
      name: "OpenIdConnectProvider",
      migrationPartId: Maybe.Nothing(),
      description:
        "ソーシャルログインを提供するプロバイダー (例: Google, GitHub)",
      projectId: util.definyCodeProjectId,
      createSuggestionId: util.codeSuggestionId,
      getTime: { day: 0, millisecond: 0 },
      typeParameterList: [],
      attribute: Maybe.Nothing(),
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
    },
  ],
  [
    id.UrlData,
    {
      name: "UrlData",
      migrationPartId: Maybe.Nothing(),
      description:
        "デバッグモードかどうか,言語とページの場所. URLとして表現されるデータ. Googleなどの検索エンジンの都合( https://support.google.com/webmasters/answer/182192?hl=ja )で,URLにページの言語を入れて,言語ごとに別のURLである必要がある. デバッグ時のホスト名は http://localhost になる",
      projectId: util.definyCodeProjectId,
      createSuggestionId: util.codeSuggestionId,
      getTime: { day: 0, millisecond: 0 },
      attribute: Maybe.Nothing(),
      typeParameterList: [],
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
    },
  ],
  [
    id.ClientMode,
    {
      name: "ClientMode",
      migrationPartId: Maybe.Nothing(),
      description: "デバッグモードか, リリースモード",
      projectId: util.definyCodeProjectId,
      createSuggestionId: util.codeSuggestionId,
      getTime: { day: 0, millisecond: 0 },
      attribute: Maybe.Nothing(),
      typeParameterList: [],
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
    },
  ],
  [
    id.Location,
    {
      name: "Location",
      migrationPartId: Maybe.Nothing(),
      description:
        "DefinyWebアプリ内での場所を示すもの. URLから求められる. URLに変換できる",
      projectId: util.definyCodeProjectId,
      createSuggestionId: util.codeSuggestionId,
      getTime: { day: 0, millisecond: 0 },
      attribute: Maybe.Nothing(),
      typeParameterList: [],
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
          name: "Suggestion",
          description: "提案のページ",
          parameter: Maybe.Just(type.SuggestionId),
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
    },
  ],
  [
    id.Language,
    {
      name: "Language",
      migrationPartId: Maybe.Nothing(),
      description: "英語,日本語,エスペラント語などの言語",
      projectId: util.definyCodeProjectId,
      createSuggestionId: util.codeSuggestionId,
      getTime: { day: 0, millisecond: 0 },
      attribute: Maybe.Nothing(),
      typeParameterList: [],
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
    },
  ],
  [
    id.User,
    {
      name: "User",
      migrationPartId: Maybe.Nothing(),
      description: "ユーザーのデータのスナップショット",
      projectId: util.definyCodeProjectId,
      createSuggestionId: util.codeSuggestionId,
      getTime: { day: 0, millisecond: 0 },
      attribute: Maybe.Nothing(),
      typeParameterList: [],
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
        {
          name: "likeProjectIdList",
          description: "プロジェクトに対する いいね",
          type: type.List(type.ProjectId),
        },
        {
          name: "developProjectIdList",
          description: "開発に参加した (書いたコードが使われた) プロジェクト",
          type: type.List(type.ProjectId),
        },
        {
          name: "commentIdeaIdList",
          description: "コメントをしたアイデア",
          type: type.List(type.IdeaId),
        },
        {
          name: "getTime",
          description: "取得日時",
          type: type.Time,
        },
      ]),
    },
  ],
  [
    id.IdAndData,
    {
      name: "IdAndData",
      migrationPartId: Maybe.Nothing(),
      description: "データを識別するIdとデータ",
      projectId: util.definyCodeProjectId,
      createSuggestionId: util.codeSuggestionId,
      getTime: { day: 0, millisecond: 0 },
      attribute: Maybe.Nothing(),
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
    },
  ],
  [
    id.Project,
    {
      name: "Project",
      description: "プロジェクト",
      migrationPartId: Maybe.Nothing(),
      projectId: util.definyCodeProjectId,
      createSuggestionId: util.codeSuggestionId,
      getTime: { day: 0, millisecond: 0 },
      attribute: Maybe.Nothing(),
      typeParameterList: [],
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
          description: "作成アカウント",
          type: type.UserId,
        },
        {
          name: "updateTime",
          description: "更新日時",
          type: type.Time,
        },
        {
          name: "getTime",
          description: "取得日時",
          type: type.Time,
        },
        {
          name: "partIdList",
          description: "所属しているのパーツのIDのリスト",
          type: type.List(type.PartId),
        },
        {
          name: "typePartIdList",
          description: "所属している型パーツのIDのリスト",
          type: type.List(type.TypePartId),
        },
      ]),
    },
  ],
  [
    id.Idea,
    {
      name: "Idea",
      description: "アイデア",
      migrationPartId: Maybe.Nothing(),
      projectId: util.definyCodeProjectId,
      createSuggestionId: util.codeSuggestionId,
      getTime: { day: 0, millisecond: 0 },
      attribute: Maybe.Nothing(),
      typeParameterList: [],
      body: TypePartBody.Product([
        {
          name: "name",
          description: "アイデア名",
          type: type.String,
        },
        {
          name: "createUserId",
          description: "言い出しっぺ",
          type: type.UserId,
        },
        {
          name: "createTime",
          description: "作成日時",
          type: type.Time,
        },
        {
          name: "projectId",
          description: "対象のプロジェクト",
          type: type.ProjectId,
        },
        {
          name: "itemList",
          description: "アイデアの要素",
          type: type.List(type.IdeaItem),
        },
        {
          name: "updateTime",
          description: "更新日時",
          type: type.Time,
        },
        {
          name: "getTime",
          description: "取得日時",
          type: type.Time,
        },
      ]),
    },
  ],
  [
    id.IdeaItem,
    {
      name: "IdeaItem",
      description: "アイデアのコメント",
      migrationPartId: Maybe.Nothing(),
      projectId: util.definyCodeProjectId,
      createSuggestionId: util.codeSuggestionId,
      getTime: { day: 0, millisecond: 0 },
      attribute: Maybe.Nothing(),
      typeParameterList: [],
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
          description: "本文",
          type: type.IdeaItemBody,
        },
      ]),
    },
  ],
  [
    id.IdeaItemBody,
    {
      name: "IdeaItemBody",
      description: "アイデアのアイテム",
      migrationPartId: Maybe.Nothing(),
      projectId: util.definyCodeProjectId,
      createSuggestionId: util.codeSuggestionId,
      getTime: { day: 0, millisecond: 0 },
      attribute: Maybe.Nothing(),
      typeParameterList: [],
      body: TypePartBody.Sum([
        {
          name: "Comment",
          description: "文章でのコメントをした",
          parameter: Maybe.Just(type.String),
        },
        {
          name: "SuggestionCreate",
          description: "提案を作成した",
          parameter: Maybe.Just(type.SuggestionId),
        },
        {
          name: "SuggestionToApprovalPending",
          description: "提案を承認待ちにした",
          parameter: Maybe.Just(type.SuggestionId),
        },
        {
          name: "SuggestionCancelToApprovalPending",
          description: "承認待ちをキャンセルした",
          parameter: Maybe.Just(type.SuggestionId),
        },
        {
          name: "SuggestionApprove",
          description: "提案を承認した",
          parameter: Maybe.Just(type.SuggestionId),
        },
        {
          name: "SuggestionReject",
          description: "提案を拒否した",
          parameter: Maybe.Just(type.SuggestionId),
        },
        {
          name: "SuggestionCancelRejection",
          description: "提案の拒否をキャンセルした",
          parameter: Maybe.Just(type.SuggestionId),
        },
      ]),
    },
  ],
  [
    id.Suggestion,
    {
      name: "Suggestion",
      description: "提案",
      migrationPartId: Maybe.Nothing(),
      projectId: util.definyCodeProjectId,
      createSuggestionId: util.codeSuggestionId,
      getTime: { day: 0, millisecond: 0 },
      attribute: Maybe.Nothing(),
      typeParameterList: [],
      body: TypePartBody.Product([
        {
          name: "name",
          description: "変更概要",
          type: type.String,
        },
        {
          name: "createUserId",
          description: "作成者",
          type: type.UserId,
        },
        {
          name: "reason",
          description: "変更理由",
          type: type.String,
        },
        {
          name: "state",
          description: "承認状態",
          type: type.SuggestionState,
        },
        {
          name: "changeList",
          description: "変更",
          type: type.List(type.Change),
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
          name: "updateTime",
          description: "更新日時",
          type: type.Time,
        },
        {
          name: "getTime",
          description: "取得日時",
          type: type.Time,
        },
      ]),
    },
  ],
  [
    id.SuggestionState,
    {
      name: "SuggestionState",
      description: "提案の状況",
      migrationPartId: Maybe.Nothing(),
      projectId: util.definyCodeProjectId,
      createSuggestionId: util.codeSuggestionId,
      getTime: { day: 0, millisecond: 0 },
      attribute: Maybe.Nothing(),
      typeParameterList: [],
      body: TypePartBody.Sum([
        {
          name: "Creating",
          description: "作成中",
          parameter: Maybe.Nothing(),
        },
        {
          name: "ApprovalPending",
          description: "承認待ち",
          parameter: Maybe.Nothing(),
        },
        {
          name: "Approved",
          description: "承認済み",
          parameter: Maybe.Nothing(),
        },
        {
          name: "Rejected",
          description: "拒否された",
          parameter: Maybe.Nothing(),
        },
      ]),
    },
  ],
  [
    id.Change,
    {
      name: "Change",
      description: "変更点",
      migrationPartId: Maybe.Nothing(),
      projectId: util.definyCodeProjectId,
      createSuggestionId: util.codeSuggestionId,
      getTime: { day: 0, millisecond: 0 },
      attribute: Maybe.Nothing(),
      typeParameterList: [],
      body: TypePartBody.Sum([
        {
          name: "ProjectName",
          description: "プロジェクト名の変更",
          parameter: Maybe.Just(type.String),
        },
      ]),
    },
  ],
  [
    id.Part,
    {
      name: "Part",
      description: "パーツの定義",
      migrationPartId: Maybe.Nothing(),
      projectId: util.definyCodeProjectId,
      createSuggestionId: util.codeSuggestionId,
      getTime: { day: 0, millisecond: 0 },
      attribute: Maybe.Nothing(),
      typeParameterList: [],
      body: TypePartBody.Product([
        {
          name: "name",
          description: "パーツの名前",
          type: type.String,
        },
        {
          name: "migrationPartId",
          description:
            "Justのときはパーツは非推奨になっていて移行プログラムのパーツIDが含まれる",
          type: type.Maybe(type.PartId),
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
          name: "createSuggestionId",
          description: "このパーツが作成された提案",
          type: type.SuggestionId,
        },
        {
          name: "getTime",
          description: "取得日時",
          type: type.Time,
        },
      ]),
    },
  ],
  [
    id.TypePart,
    {
      name: "TypePart",
      description: "型パーツ",
      migrationPartId: Maybe.Nothing(),
      projectId: util.definyCodeProjectId,
      createSuggestionId: util.codeSuggestionId,
      getTime: { day: 0, millisecond: 0 },
      attribute: Maybe.Nothing(),
      typeParameterList: [],
      body: TypePartBody.Product([
        {
          name: "name",
          description: "型パーツの名前",
          type: type.String,
        },
        {
          name: "migrationPartId",
          description:
            "Justのときは型パーツは非推奨になっていて移行プログラムのパーツIDが含まれる",
          type: type.Maybe(type.PartId),
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
          name: "createSuggestionId",
          description: "この型パーツが作成された提案",
          type: type.SuggestionId,
        },
        {
          name: "getTime",
          description: "取得日時",
          type: type.Time,
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
    },
  ],
  [
    id.TypeAttribute,
    {
      name: "TypeAttribute",
      description: "コンパイラに向けた, 型のデータ形式をどうするかの情報",
      migrationPartId: Maybe.Nothing(),
      projectId: util.definyCodeProjectId,
      createSuggestionId: util.codeSuggestionId,
      getTime: { day: 0, millisecond: 0 },
      attribute: Maybe.Nothing(),
      typeParameterList: [],
      body: TypePartBody.Sum([
        {
          name: "AsBoolean",
          description:
            "JavaScriptのbooleanとしれ扱うように指示する. 定義が True | Falseのような形のみをサポートする",
          parameter: Maybe.Nothing(),
        },
      ]),
    },
  ],
  [
    id.TypeParameter,
    {
      name: "TypeParameter",
      description: "型パラメーター",
      migrationPartId: Maybe.Nothing(),
      projectId: util.definyCodeProjectId,
      createSuggestionId: util.codeSuggestionId,
      getTime: { day: 0, millisecond: 0 },
      attribute: Maybe.Nothing(),
      typeParameterList: [],
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
    },
  ],
  [
    id.TypePartBody,
    {
      name: "TypePartBody",
      description: "型の定義本体",
      migrationPartId: Maybe.Nothing(),
      projectId: util.definyCodeProjectId,
      createSuggestionId: util.codeSuggestionId,
      getTime: { day: 0, millisecond: 0 },
      attribute: Maybe.Nothing(),
      typeParameterList: [],
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
    },
  ],
  [
    id.Member,
    {
      name: "Member",
      description: "直積型のメンバー",
      migrationPartId: Maybe.Nothing(),
      projectId: util.definyCodeProjectId,
      createSuggestionId: util.codeSuggestionId,
      getTime: { day: 0, millisecond: 0 },
      attribute: Maybe.Nothing(),
      typeParameterList: [],
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
    },
  ],
  [
    id.Pattern,
    {
      name: "Pattern",
      description: "直積型のパターン",
      migrationPartId: Maybe.Nothing(),
      projectId: util.definyCodeProjectId,
      createSuggestionId: util.codeSuggestionId,
      getTime: { day: 0, millisecond: 0 },
      attribute: Maybe.Nothing(),
      typeParameterList: [],
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
    },
  ],
  [
    id.TypePartBodyKernel,
    {
      name: "TypePartBodyKernel",
      description: "Definyだけでは表現できないデータ型",
      migrationPartId: Maybe.Nothing(),
      projectId: util.definyCodeProjectId,
      createSuggestionId: util.codeSuggestionId,
      getTime: { day: 0, millisecond: 0 },
      attribute: Maybe.Nothing(),
      typeParameterList: [],
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
    },
  ],
  [
    id.Type,
    {
      name: "Type",
      description: "型",
      migrationPartId: Maybe.Nothing(),
      projectId: util.definyCodeProjectId,
      createSuggestionId: util.codeSuggestionId,
      getTime: { day: 0, millisecond: 0 },
      attribute: Maybe.Nothing(),
      typeParameterList: [],
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
    },
  ],
  [
    id.Expr,
    {
      name: "Expr",
      description: "式",
      migrationPartId: Maybe.Nothing(),
      projectId: util.definyCodeProjectId,
      createSuggestionId: util.codeSuggestionId,
      getTime: { day: 0, millisecond: 0 },
      attribute: Maybe.Nothing(),
      typeParameterList: [],
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
    },
  ],
  [
    id.KernelExpr,
    {
      name: "KernelExpr",
      description: "Definyだけでは表現できない式",
      migrationPartId: Maybe.Nothing(),
      projectId: util.definyCodeProjectId,
      createSuggestionId: util.codeSuggestionId,
      getTime: { day: 0, millisecond: 0 },
      attribute: Maybe.Nothing(),
      typeParameterList: [],
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
    },
  ],
  [
    id.TagReference,
    {
      name: "TagReference",
      description: "タグの参照を表す",
      migrationPartId: Maybe.Nothing(),
      projectId: util.definyCodeProjectId,
      createSuggestionId: util.codeSuggestionId,
      getTime: { day: 0, millisecond: 0 },
      attribute: Maybe.Nothing(),
      typeParameterList: [],
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
    },
  ],
  [
    id.FunctionCall,
    {
      name: "FunctionCall",
      description: "関数呼び出し",
      migrationPartId: Maybe.Nothing(),
      projectId: util.definyCodeProjectId,
      createSuggestionId: util.codeSuggestionId,
      getTime: { day: 0, millisecond: 0 },
      attribute: Maybe.Nothing(),
      typeParameterList: [],
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
    },
  ],
  [
    id.LambdaBranch,
    {
      name: "LambdaBranch",
      description: "ラムダのブランチ. Just x -> data x のようなところ",
      migrationPartId: Maybe.Nothing(),
      projectId: util.definyCodeProjectId,
      createSuggestionId: util.codeSuggestionId,
      getTime: { day: 0, millisecond: 0 },
      attribute: Maybe.Nothing(),
      typeParameterList: [],
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
    },
  ],
  [
    id.Condition,
    {
      name: "Condition",
      description: "ブランチの式を使う条件",
      migrationPartId: Maybe.Nothing(),
      projectId: util.definyCodeProjectId,
      createSuggestionId: util.codeSuggestionId,
      getTime: { day: 0, millisecond: 0 },
      attribute: Maybe.Nothing(),
      typeParameterList: [],
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
    },
  ],
  [
    id.ConditionTag,
    {
      name: "ConditionTag",
      description: "タグによる条件",
      migrationPartId: Maybe.Nothing(),
      projectId: util.definyCodeProjectId,
      createSuggestionId: util.codeSuggestionId,
      getTime: { day: 0, millisecond: 0 },
      attribute: Maybe.Nothing(),
      typeParameterList: [],
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
    },
  ],
  [
    id.ConditionCapture,
    {
      name: "ConditionCapture",
      description: "キャプチャパーツへのキャプチャ",
      migrationPartId: Maybe.Nothing(),
      projectId: util.definyCodeProjectId,
      createSuggestionId: util.codeSuggestionId,
      getTime: { day: 0, millisecond: 0 },
      attribute: Maybe.Nothing(),
      typeParameterList: [],
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
    },
  ],
  [
    id.BranchPartDefinition,
    {
      name: "BranchPartDefinition",
      description: "ラムダのブランチで使えるパーツを定義する部分",
      migrationPartId: Maybe.Nothing(),
      projectId: util.definyCodeProjectId,
      createSuggestionId: util.codeSuggestionId,
      getTime: { day: 0, millisecond: 0 },
      attribute: Maybe.Nothing(),
      typeParameterList: [],
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
    },
  ],
  [
    id.EvaluatedExpr,
    {
      name: "EvaluatedExpr",
      description: "評価しきった式",
      migrationPartId: Maybe.Nothing(),
      projectId: util.definyCodeProjectId,
      createSuggestionId: util.codeSuggestionId,
      getTime: { day: 0, millisecond: 0 },
      attribute: Maybe.Nothing(),
      typeParameterList: [],
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
    },
  ],
  [
    id.KernelCall,
    {
      name: "KernelCall",
      description: "複数の引数が必要な内部関数の部分呼び出し",
      migrationPartId: Maybe.Nothing(),
      projectId: util.definyCodeProjectId,
      createSuggestionId: util.codeSuggestionId,
      getTime: { day: 0, millisecond: 0 },
      attribute: Maybe.Nothing(),
      typeParameterList: [],
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
    },
  ],
  [
    id.EvaluateExprError,
    {
      name: "EvaluateExprError",
      description: "評価したときに失敗した原因を表すもの",
      migrationPartId: Maybe.Nothing(),
      projectId: util.definyCodeProjectId,
      createSuggestionId: util.codeSuggestionId,
      getTime: { day: 0, millisecond: 0 },
      attribute: Maybe.Nothing(),
      typeParameterList: [],
      body: TypePartBody.Sum([
        {
          name: "NeedPartDefinition",
          description: "式を評価するには,このパーツの定義が必要だと言っている",
          parameter: Maybe.Just(type.PartId),
        },
        {
          name: "NeedSuggestionPart",
          description: "式を評価するために必要なSuggestionPartが見つからない",
          parameter: Maybe.Just(type.Int32),
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
    },
  ],
  [
    id.TypeError,
    {
      name: "TypeError",
      description: "型エラー",
      migrationPartId: Maybe.Nothing(),
      projectId: util.definyCodeProjectId,
      createSuggestionId: util.codeSuggestionId,
      getTime: { day: 0, millisecond: 0 },
      attribute: Maybe.Nothing(),
      typeParameterList: [],
      body: TypePartBody.Product([
        {
          name: "message",
          description: "型エラーの説明",
          type: type.String,
        },
      ]),
    },
  ],
  [
    id.CreateProjectParameter,
    {
      name: "CreateProjectParameter",
      description: "プロジェクト作成時に必要なパラメーター",
      migrationPartId: Maybe.Nothing(),
      projectId: util.definyCodeProjectId,
      createSuggestionId: util.codeSuggestionId,
      getTime: { day: 0, millisecond: 0 },
      attribute: Maybe.Nothing(),
      typeParameterList: [],
      body: TypePartBody.Product([
        {
          name: "accessToken",
          description: "プロジェクトを作るときのアカウント",
          type: type.AccessToken,
        },
        {
          name: "projectName",
          description: "プロジェクト名",
          type: type.String,
        },
      ]),
    },
  ],
  [
    id.CreateIdeaParameter,
    {
      name: "CreateIdeaParameter",
      description: "アイデアを作成時に必要なパラメーター",
      migrationPartId: Maybe.Nothing(),
      projectId: util.definyCodeProjectId,
      createSuggestionId: util.codeSuggestionId,
      getTime: { day: 0, millisecond: 0 },
      attribute: Maybe.Nothing(),
      typeParameterList: [],
      body: TypePartBody.Product([
        {
          name: "accessToken",
          description: "プロジェクトを作るときのアカウント",
          type: type.AccessToken,
        },
        {
          name: "ideaName",
          description: "アイデア名",
          type: type.String,
        },
        {
          name: "projectId",
          description: "対象のプロジェクトID",
          type: type.ProjectId,
        },
      ]),
    },
  ],
  [
    id.AddCommentParameter,
    {
      name: "AddCommentParameter",
      description: "アイデアにコメントを追加するときに必要なパラメーター",
      migrationPartId: Maybe.Nothing(),
      projectId: util.definyCodeProjectId,
      createSuggestionId: util.codeSuggestionId,
      getTime: { day: 0, millisecond: 0 },
      attribute: Maybe.Nothing(),
      typeParameterList: [],
      body: TypePartBody.Product([
        {
          name: "accessToken",
          description: "コメントをするユーザー",
          type: type.AccessToken,
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
    },
  ],
  [
    id.AddSuggestionParameter,
    {
      name: "AddSuggestionParameter",
      description: "提案を作成するときに必要なパラメーター",
      migrationPartId: Maybe.Nothing(),
      projectId: util.definyCodeProjectId,
      createSuggestionId: util.codeSuggestionId,
      getTime: { day: 0, millisecond: 0 },
      attribute: Maybe.Nothing(),
      typeParameterList: [],
      body: TypePartBody.Product([
        {
          name: "accessToken",
          description: "提案を作成するユーザー",
          type: type.AccessToken,
        },
        {
          name: "ideaId",
          description: "提案に関連付けられるアイデア",
          type: type.IdeaId,
        },
      ]),
    },
  ],
  [
    id.AccessTokenAndSuggestionId,
    {
      name: "AccessTokenAndSuggestionId",
      description: "提案を承認待ちにしたり許可したりするときなどに使う",
      migrationPartId: Maybe.Nothing(),
      projectId: util.definyCodeProjectId,
      createSuggestionId: util.codeSuggestionId,
      getTime: { day: 0, millisecond: 0 },
      attribute: Maybe.Nothing(),
      typeParameterList: [],
      body: TypePartBody.Product([
        {
          name: "accessToken",
          description: "アクセストークン",
          type: type.AccessToken,
        },
        {
          name: "suggestionId",
          description: "SuggestionId",
          type: type.SuggestionId,
        },
      ]),
    },
  ],
  [
    id.ProjectId,
    {
      name: "ProjectId",
      migrationPartId: Maybe.Nothing(),
      description: "プロジェクトの識別子",
      projectId: util.definyCodeProjectId,
      createSuggestionId: util.codeSuggestionId,
      getTime: { day: 0, millisecond: 0 },
      attribute: Maybe.Nothing(),
      typeParameterList: [],
      body: TypePartBody.Kernel(TypePartBodyKernel.Id),
    },
  ],
  [
    id.UserId,
    {
      name: "UserId",
      migrationPartId: Maybe.Nothing(),
      description: "ユーザーの識別子",
      projectId: util.definyCodeProjectId,
      createSuggestionId: util.codeSuggestionId,
      getTime: { day: 0, millisecond: 0 },
      attribute: Maybe.Nothing(),
      typeParameterList: [],
      body: TypePartBody.Kernel(TypePartBodyKernel.Id),
    },
  ],
  [
    id.IdeaId,
    {
      name: "IdeaId",
      migrationPartId: Maybe.Nothing(),
      description: "アイデアの識別子",
      projectId: util.definyCodeProjectId,
      createSuggestionId: util.codeSuggestionId,
      getTime: { day: 0, millisecond: 0 },
      attribute: Maybe.Nothing(),
      typeParameterList: [],
      body: TypePartBody.Kernel(TypePartBodyKernel.Id),
    },
  ],
  [
    id.SuggestionId,
    {
      name: "SuggestionId",
      migrationPartId: Maybe.Nothing(),
      description: "提案の識別子",
      projectId: util.definyCodeProjectId,
      createSuggestionId: util.codeSuggestionId,
      getTime: { day: 0, millisecond: 0 },
      attribute: Maybe.Nothing(),
      typeParameterList: [],
      body: TypePartBody.Kernel(TypePartBodyKernel.Id),
    },
  ],
  [
    id.ImageToken,
    {
      name: "ImageToken",
      migrationPartId: Maybe.Nothing(),
      description:
        "画像から求められるトークン.キャッシュのキーとして使われる.1つのトークンに対して永久に1つの画像データしか表さない. キャッシュを更新する必要はない",
      projectId: util.definyCodeProjectId,
      createSuggestionId: util.codeSuggestionId,
      getTime: { day: 0, millisecond: 0 },
      attribute: Maybe.Nothing(),
      typeParameterList: [],
      body: TypePartBody.Kernel(TypePartBodyKernel.Id),
    },
  ],
  [
    id.PartId,
    {
      name: "PartId",
      migrationPartId: Maybe.Nothing(),
      description: "パーツの識別子",
      projectId: util.definyCodeProjectId,
      createSuggestionId: util.codeSuggestionId,
      getTime: { day: 0, millisecond: 0 },
      attribute: Maybe.Nothing(),
      typeParameterList: [],
      body: TypePartBody.Kernel(TypePartBodyKernel.Id),
    },
  ],
  [
    id.TypePartId,
    {
      name: "TypePartId",
      migrationPartId: Maybe.Nothing(),
      description: "型パーツの識別子",
      projectId: util.definyCodeProjectId,
      createSuggestionId: util.codeSuggestionId,
      getTime: { day: 0, millisecond: 0 },
      attribute: Maybe.Nothing(),
      typeParameterList: [],
      body: TypePartBody.Kernel(TypePartBodyKernel.Id),
    },
  ],
  [
    id.TagId,
    {
      name: "TagId",
      migrationPartId: Maybe.Nothing(),
      description: "タグの識別子",
      projectId: util.definyCodeProjectId,
      createSuggestionId: util.codeSuggestionId,
      getTime: { day: 0, millisecond: 0 },
      attribute: Maybe.Nothing(),
      typeParameterList: [],
      body: TypePartBody.Kernel(TypePartBodyKernel.Id),
    },
  ],
  [
    id.AccessToken,
    {
      name: "AccessToken",
      migrationPartId: Maybe.Nothing(),
      description:
        "アクセストークン. アクセストークンを持っていれば特定のユーザーであるが証明される. これが盗まれた場合,不正に得た相手はそのユーザーになりすますことができる",
      projectId: util.definyCodeProjectId,
      createSuggestionId: util.codeSuggestionId,
      getTime: { day: 0, millisecond: 0 },
      attribute: Maybe.Nothing(),
      typeParameterList: [],
      body: TypePartBody.Kernel(TypePartBodyKernel.Id),
    },
  ],
]);

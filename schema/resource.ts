import {
  Maybe,
  Type,
  CustomTypeDefinition,
  CustomTypeDefinitionBody,
} from "@narumincho/type/distribution/data";
import * as idAndToken from "./idAndToken";
import * as time from "./time";

const userSnapshotName = "UserSnapshot";
const userSnapshotAndIdName = "UserSnapshotAndId";
const userResponseName = "UserResponse";

const projectSnapshotName = "ProjectSnapshot";
const projectSnapshotAndIdName = "ProjectSnapshotAndId";
const projectResponseName = "ProjectResponse";

const ideaSnapshotName = "IdeaSnapshot";
const ideaSnapshotAndIdName = "IdeaSnapshotAndId";
const ideaResponseName = "IdeaResponse";
const IdeaListByProjectIdResponseName = "IdeaListByProjectIdResponse";

const ideaItemName = "IdeaItem";
const itemBodyName = "ItemBody";

const userSnapshotType = Type.Custom({
  name: userSnapshotName,
  parameterList: [],
});
const projectSnapshotType = Type.Custom({
  name: projectSnapshotName,
  parameterList: [],
});

const ideaItemType = Type.Custom({
  name: ideaItemName,
  parameterList: [],
});
const ideaSnapshotType = Type.Custom({
  name: ideaSnapshotName,
  parameterList: [],
});
const ideaSnapshotAndIdType = Type.Custom({
  name: ideaSnapshotAndIdName,
  parameterList: [],
});
const itemBodyType = Type.Custom({
  name: itemBodyName,
  parameterList: [],
});

export const customTypeList: ReadonlyArray<CustomTypeDefinition> = [
  {
    name: userSnapshotName,
    description: "ユーザーのデータのスナップショット",
    typeParameterList: [],
    body: CustomTypeDefinitionBody.Product([
      {
        name: "name",
        description:
          "ユーザー名. 表示される名前. 他のユーザーとかぶっても良い. 絵文字も使える. 全角英数は半角英数,半角カタカナは全角カタカナ, (株)の合字を分解するなどのNFKCの正規化がされる. U+0000-U+0019 と U+007F-U+00A0 の範囲の文字は入らない. 前後に空白を含められない. 間の空白は2文字以上連続しない. 文字数のカウント方法は正規化されたあとのCodePoint単位. Twitterと同じ, 1文字以上50文字以下",
        type: Type.String,
      },
      {
        name: "imageHash",
        description: "プロフィール画像",
        type: idAndToken.imageToken,
      },
      {
        name: "introduction",
        description:
          "自己紹介文. 改行文字を含めることができる. Twitterと同じ 0～160文字",
        type: Type.String,
      },
      {
        name: "createTime",
        description: "Definyでユーザーが作成された日時",
        type: time.time,
      },
      {
        name: "likeProjectIdList",
        description: "プロジェクトに対する いいね",
        type: Type.List(idAndToken.projectId),
      },
      {
        name: "developProjectIdList",
        description: "開発に参加した (書いたコードが使われた) プロジェクト",
        type: Type.List(idAndToken.projectId),
      },
      {
        name: "commentIdeaIdList",
        description: "コメントをしたアイデア",
        type: Type.List(idAndToken.ideaId),
      },
      {
        name: "getTime",
        description: "取得日時",
        type: time.time,
      },
    ]),
  },
  {
    name: userSnapshotAndIdName,
    description: "最初に自分の情報を得るときに返ってくるデータ",
    typeParameterList: [],
    body: CustomTypeDefinitionBody.Product([
      {
        name: "id",
        description: "ユーザーID",
        type: idAndToken.userId,
      },
      {
        name: "snapshot",
        description: "ユーザーのスナップショット",
        type: userSnapshotType,
      },
    ]),
  },
  {
    name: userResponseName,
    description:
      "Maybe プロジェクトのスナップショット と userId. TypeScript→Elmに渡す用",
    typeParameterList: [],
    body: CustomTypeDefinitionBody.Product([
      {
        name: "id",
        description: "ユーザーID",
        type: idAndToken.userId,
      },
      {
        name: "snapshotMaybe",
        description: "ユーザーのデータ",
        type: Type.Maybe(userSnapshotType),
      },
    ]),
  },
  {
    name: projectSnapshotName,
    description: "プロジェクト",
    typeParameterList: [],
    body: CustomTypeDefinitionBody.Product([
      {
        name: "name",
        description: "プロジェクト名",
        type: Type.String,
      },
      {
        name: "iconHash",
        description: "プロジェクトのアイコン画像",
        type: idAndToken.imageToken,
      },
      {
        name: "imageHash",
        description: "プロジェクトのカバー画像",
        type: idAndToken.imageToken,
      },
      {
        name: "createTime",
        description: "作成日時",
        type: time.time,
      },
      {
        name: "createUserId",
        description: "作成アカウント",
        type: idAndToken.userId,
      },
      {
        name: "updateTime",
        description: "更新日時",
        type: time.time,
      },
      {
        name: "getTime",
        description: "取得日時",
        type: time.time,
      },
      {
        name: "partIdList",
        description: "所属しているのパーツのIDのリスト",
        type: Type.List(idAndToken.partId),
      },
      {
        name: "typePartIdList",
        description: "所属している型パーツのIDのリスト",
        type: Type.List(idAndToken.typePartId),
      },
    ]),
  },
  {
    name: projectSnapshotAndIdName,
    description: "プロジェクトを作成したときに返ってくるデータ",
    typeParameterList: [],
    body: CustomTypeDefinitionBody.Product([
      {
        name: "id",
        description: "プロジェクトID",
        type: idAndToken.projectId,
      },
      {
        name: "snapshot",
        description: "プロジェクトのスナップショット",
        type: projectSnapshotType,
      },
    ]),
  },
  {
    name: projectResponseName,
    description:
      "Maybe プロジェクトのスナップショット と projectId. TypeScript→Elmに渡す用",
    typeParameterList: [],
    body: CustomTypeDefinitionBody.Product([
      {
        name: "id",
        description: "プロジェクトのID",
        type: idAndToken.projectId,
      },
      {
        name: "snapshotMaybe",
        description: "プロジェクトのデータ",
        type: Type.Maybe(projectSnapshotType),
      },
    ]),
  },
  {
    name: ideaSnapshotName,
    description: "アイデア",
    typeParameterList: [],
    body: CustomTypeDefinitionBody.Product([
      {
        name: "name",
        description: "アイデア名",
        type: Type.String,
      },
      {
        name: "createUserId",
        description: "言い出しっぺ",
        type: idAndToken.userId,
      },
      {
        name: "createTime",
        description: "作成日時",
        type: time.time,
      },
      {
        name: "projectId",
        description: "対象のプロジェクト",
        type: idAndToken.projectId,
      },
      {
        name: "itemList",
        description: "アイデアの要素",
        type: Type.List(ideaItemType),
      },
      {
        name: "updateTime",
        description: "更新日時",
        type: time.time,
      },
      {
        name: "getTime",
        description: "取得日時",
        type: time.time,
      },
    ]),
  },
  {
    name: ideaSnapshotAndIdName,
    description: "アイデアとそのID. アイデア作成時に返ってくる",
    typeParameterList: [],
    body: CustomTypeDefinitionBody.Product([
      {
        name: "id",
        description: "アイデアID",
        type: idAndToken.ideaId,
      },
      {
        name: "snapshot",
        description: "アイデアのスナップショット",
        type: ideaSnapshotType,
      },
    ]),
  },
  {
    name: ideaResponseName,
    description: "Maybe アイデア と ideaId. TypeScript→Elmに渡す用",
    typeParameterList: [],
    body: CustomTypeDefinitionBody.Product([
      {
        name: "id",
        description: "アイデアID",
        type: idAndToken.ideaId,
      },
      {
        name: "snapshotMaybe",
        description: "アイデアのスナップショット",
        type: Type.Maybe(ideaSnapshotType),
      },
    ]),
  },
  {
    name: IdeaListByProjectIdResponseName,
    description: "プロジェクトからアイデアの一覧を取得したときにElmに渡すもの",
    typeParameterList: [],
    body: CustomTypeDefinitionBody.Product([
      {
        name: "projectId",
        description: "プロジェクトID",
        type: idAndToken.projectId,
      },
      {
        name: "ideaSnapshotAndIdList",
        description: "アイデアの一覧",
        type: Type.List(ideaSnapshotAndIdType),
      },
    ]),
  },
  {
    name: ideaItemName,
    description: "アイデアのコメント",
    typeParameterList: [],
    body: CustomTypeDefinitionBody.Product([
      {
        name: "createUserId",
        description: "作成者",
        type: idAndToken.userId,
      },
      {
        name: "createTime",
        description: "作成日時",
        type: time.time,
      },
      {
        name: "body",
        description: "本文",
        type: itemBodyType,
      },
    ]),
  },
  {
    name: itemBodyName,
    description: "アイデアのアイテム",
    typeParameterList: [],
    body: CustomTypeDefinitionBody.Sum([
      {
        name: "Comment",
        description: "文章でのコメントをした",
        parameter: Maybe.Just(Type.String),
      },
      {
        name: "SuggestionCreate",
        description: "提案を作成した",
        parameter: Maybe.Just(idAndToken.suggestionId),
      },
      {
        name: "SuggestionToApprovalPending",
        description: "提案を承認待ちにした",
        parameter: Maybe.Just(idAndToken.suggestionId),
      },
      {
        name: "SuggestionCancelToApprovalPending",
        description: "承認待ちをキャンセルした",
        parameter: Maybe.Just(idAndToken.suggestionId),
      },
      {
        name: "SuggestionApprove",
        description: "提案を承認した",
        parameter: Maybe.Just(idAndToken.suggestionId),
      },
      {
        name: "SuggestionReject",
        description: "提案を拒否した",
        parameter: Maybe.Just(idAndToken.suggestionId),
      },
      {
        name: "SuggestionCancelRejection",
        description: "提案の拒否をキャンセルした",
        parameter: Maybe.Just(idAndToken.suggestionId),
      },
    ]),
  },
];

module Data exposing (Bool(..), Maybe(..), Result(..), ProjectId(..), UserId(..), IdeaId(..), CommitId(..), ImageToken(..), PartId(..), TypePartId(..), TagId(..), AccountToken(..), PartHash(..), TypePartHash(..), ReleasePartId(..), ReleaseTypePartId(..), Time, RequestLogInUrlRequestData, OpenIdConnectProvider(..), UrlData, ClientMode(..), Location(..), Language(..), User, IdAndData, Project, Idea, Comment, Commit, IdeaState(..), Part, TypePart, TypeAttribute(..), TypeParameter, TypePartBody(..), Member, Pattern, TypePartBodyKernel(..), Type, Expr(..), KernelExpr(..), TagReference, FunctionCall, LambdaBranch, Condition(..), ConditionTag, ConditionCapture, BranchPartDefinition, EvaluatedExpr(..), KernelCall, EvaluateExprError(..), TypeError, CreateProjectParameter, CreateIdeaParameter, AddCommentParameter, AddCommitParameter, AccountTokenAndCommitId, LogInState(..), AccountTokenAndUserId, Resource, ResourceState(..), StaticResourceState(..), AccountTokenAndProjectId)

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
    { name : String, description : String, projectId : ProjectId, createCommitId : CommitId, attribute : (Maybe TypeAttribute), typeParameterList : (List TypeParameter), body : TypePartBody }

{-| コンパイラに向けた, 型のデータ形式をどうするかの情報
-}
type TypeAttribute
    = AsBoolean

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
    = WaitLoadingAccountTokenFromIndexedDB
    | LoadingAccountTokenFromIndexedDB
    | Guest
    | WaitRequestingLogInUrl OpenIdConnectProvider
    | RequestingLogInUrl OpenIdConnectProvider
    | JumpingToLogInPage String
    | WaitVerifyingAccountToken AccountToken
    | VerifyingAccountToken AccountToken
    | LoggedIn AccountTokenAndUserId

{-| AccountTokenとUserId
-}
type alias AccountTokenAndUserId =
    { accountToken : AccountToken, userId : UserId }

{-| 取得日時とデータ本体. データ本体がない場合も含まれているのでMaybe
-}
type alias Resource data =
    { getTime : Time, dataMaybe : (Maybe data) }

{-| ProjectやUserなどのリソースの状態とデータ. 読み込み中だとか
-}
type ResourceState data
    = Loaded (Resource data)
    | Unknown
    | WaitLoading
    | Loading
    | WaitRequesting
    | Requesting
    | WaitUpdating (Resource data)
    | Updating (Resource data)
    | WaitRetrying
    | Retrying

{-| キーであるTokenによってデータが必ず1つに決まるもの. 絶対に更新されない
-}
type StaticResourceState data
    = Loaded data
    | Unknown
    | WaitLoading
    | Loading
    | WaitRequesting
    | Requesting
    | WaitRetrying
    | Retrying

{-| アカウントトークンとプロジェクトID
-}
type alias AccountTokenAndProjectId =
    { accountToken : AccountToken, projectId : ProjectId }

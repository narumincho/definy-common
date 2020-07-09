import * as data from "./data";
import * as util from "./util";

export { data };
export { util };

export const releaseOrigin = "https://definy.app";
export const debugOrigin = "http://localhost:2520";

export const clientModeToOriginUrl = (clientMode: data.ClientMode): URL => {
  switch (clientMode) {
    case "DebugMode": {
      return new URL(debugOrigin);
    }
    case "Release":
      return new URL(releaseOrigin);
  }
};

const languageQueryKey = "hl";
export const defaultLanguage: data.Language = "English";

export const urlDataAndAccessTokenToUrl = (
  urlData: data.UrlData,
  accessToken: data.Maybe<data.AccessToken>
): URL => {
  const url = clientModeToOriginUrl(urlData.clientMode);
  url.pathname = locationToPath(urlData.location);
  url.searchParams.append(
    languageQueryKey,
    languageToIdString(urlData.language)
  );
  if (accessToken._ === "Just") {
    url.hash = "access-token=" + (accessToken.value as string);
  }
  return url;
};

const locationToPath = (location: data.Location): string => {
  switch (location._) {
    case "Home":
      return "/";
    case "CreateProject":
      return "/create-project";
    case "User":
      return "/user/" + (location.userId as string);
    case "Project":
      return "/project/" + (location.projectId as string);
    case "Idea":
      return "/idea/" + (location.ideaId as string);
    case "Suggestion":
      return "/suggestion/" + (location.suggestionId as string);
    case "About":
      return "/about";
    case "Debug":
      return "/debug";
  }
};

const languageToIdString = (language: data.Language): string => {
  switch (language) {
    case "English":
      return "en";
    case "Japanese":
      return "ja";
    case "Esperanto":
      return "eo";
  }
};

/**
 * URLのパスを場所のデータに変換する
 * @param url `https://definy.app/project/580d8d6a54cf43e4452a0bba6694a4ed?hl=ja` のようなURL
 */
export const urlDataAndAccessTokenFromUrl = (
  url: URL
): { urlData: data.UrlData; accessToken: data.Maybe<data.AccessToken> } => {
  const languageId = url.searchParams.get(languageQueryKey);
  const language: data.Language =
    languageId === null ? defaultLanguage : languageFromIdString(languageId);
  return {
    urlData: {
      clientMode: clientModeFromUrl(url.origin),
      location: locationFromUrl(url.pathname),
      language,
    },
    accessToken: accessTokenFromUrl(url.hash),
  };
};

const clientModeFromUrl = (origin: string): data.ClientMode =>
  origin === debugOrigin ? "DebugMode" : "Release";

const locationFromUrl = (pathName: string): data.Location => {
  if (pathName === "/create-project") {
    return data.Location.CreateProject;
  }
  if (pathName === "/about") {
    return data.Location.About;
  }
  if (pathName === "/debug") {
    return data.Location.Debug;
  }
  const projectResult = pathName.match(/^\/project\/(?<id>[0-9a-f]{32})$/u);
  if (projectResult !== null && projectResult.groups !== undefined) {
    return data.Location.Project(projectResult.groups.id as data.ProjectId);
  }
  const userResult = pathName.match(/^\/user\/(?<id>[0-9a-f]{32})$/u);
  if (userResult !== null && userResult.groups !== undefined) {
    return data.Location.User(userResult.groups.id as data.UserId);
  }
  const ideaResult = pathName.match(/^\/idea\/(?<id>[0-9a-f]{32})$/u);
  if (ideaResult !== null && ideaResult.groups !== undefined) {
    return data.Location.Idea(ideaResult.groups.id as data.IdeaId);
  }
  const suggestionResult = pathName.match(
    /^\/suggestion\/(?<id>[0-9a-f]{32})$/u
  );
  if (suggestionResult !== null && suggestionResult.groups !== undefined) {
    return data.Location.Suggestion(
      suggestionResult.groups.id as data.SuggestionId
    );
  }
  return data.Location.Home;
};

const languageFromIdString = (languageAsString: string): data.Language => {
  switch (languageAsString) {
    case "ja":
      return "Japanese";
    case "en":
      return "English";
    case "eo":
      return "Esperanto";
  }
  return defaultLanguage;
};

const accessTokenFromUrl = (hash: string): data.Maybe<data.AccessToken> => {
  const matchResult = hash.match(/access-token=(?<token>[0-9a-f]{64})/u);
  if (matchResult === null || matchResult.groups === undefined) {
    return data.Maybe.Nothing();
  }
  return data.Maybe.Just(matchResult.groups.token as data.AccessToken);
};

export const stringToValidUserName = (userName: string): string | null => {
  const normalized = normalizeOneLineString(userName);
  const { length } = [...normalized];
  if (length <= 0 || length > 50) {
    return null;
  }
  return normalized;
};

export const stringToValidProjectName = (
  projectName: string
): string | null => {
  const normalized = normalizeOneLineString(projectName);
  const { length } = [...normalized];
  if (length <= 0 || length > 50) {
    return null;
  }
  return normalized;
};

export const stringToValidIdeaName = (ideaName: string): string | null => {
  const normalized = normalizeOneLineString(ideaName);
  const { length } = [...normalized];
  if (length <= 0 || length > 100) {
    return null;
  }
  return normalized;
};

export const stringToValidComment = (comment: string): string | null => {
  const normalized = normalizeMultiLineString(comment);
  const { length } = [...normalized];
  if (length <= 0 || length > 1500) {
    return null;
  }
  return normalized;
};

/**
 * NFKCで正規化して, 改行をLFのみにする
 */
const normalizeMultiLineString = (text: string): string => {
  const normalized = text.normalize("NFKC");
  let result = "";
  for (const char of normalized) {
    const codePoint = char.codePointAt(0);
    if (
      codePoint !== undefined &&
      (codePoint === 0x0a ||
        (codePoint > 0x1f && codePoint < 0x7f) ||
        codePoint > 0xa0)
    ) {
      result += char;
    }
  }
  return result;
};

/**
 * NFKCで正規化して, 先頭末尾の空白をなくし, 空白の連続を1つの空白にまとめ, 改行を取り除く
 */
const normalizeOneLineString = (text: string): string => {
  const normalized = text.normalize("NFKC").trim();
  let result = "";
  let beforeSpace = false;
  for (const char of normalized) {
    const codePoint = char.codePointAt(0);
    // 制御文字
    if (
      codePoint !== undefined &&
      ((codePoint > 0x1f && codePoint < 0x7f) || codePoint > 0xa0)
    ) {
      if (!(beforeSpace && char === " ")) {
        result += char;
        beforeSpace = char === " ";
      }
    }
  }
  return result;
};

export const exprToSuggestionExpr = (expr: data.Expr): data.SuggestionExpr => {
  switch (expr._) {
    case "Kernel":
      return data.SuggestionExpr.Kernel(expr.kernelExpr);
    case "Int32Literal":
      return data.SuggestionExpr.Int32Literal(expr.int32);
    case "PartReference":
      return data.SuggestionExpr.PartReference(expr.partId);
    case "LocalPartReference":
      return data.SuggestionExpr.LocalPartReference(expr.localPartReference);
    case "TagReference":
      return data.SuggestionExpr.TagReference(expr.tagReference);
    case "FunctionCall":
      return data.SuggestionExpr.FunctionCall({
        function: exprToSuggestionExpr(expr.functionCall.function),
        parameter: exprToSuggestionExpr(expr.functionCall.parameter),
      });
    case "Lambda":
      return data.SuggestionExpr.Lambda(
        expr.lambdaBranchList.map(lambdaBranchToSuggestionLambdaBranch)
      );
  }
};

const lambdaBranchToSuggestionLambdaBranch = (
  lambdaBranch: data.LambdaBranch
): data.SuggestionLambdaBranch => ({
  condition: lambdaBranch.condition,
  description: lambdaBranch.description,
  localPartList: lambdaBranch.localPartList.map(
    branchPartDefinitionToSuggestion
  ),
  expr: exprToSuggestionExpr(lambdaBranch.expr),
});

const branchPartDefinitionToSuggestion = (
  branchPartDefinition: data.BranchPartDefinition
): data.SuggestionBranchPartDefinition => ({
  localPartId: branchPartDefinition.localPartId,
  name: branchPartDefinition.name,
  description: branchPartDefinition.description,
  type: typeToSuggestion(branchPartDefinition.type),
  expr: exprToSuggestionExpr(branchPartDefinition.expr),
});

const typeToSuggestion = (type: data.Type): data.SuggestionType => {
  return data.SuggestionType.TypePartWithParameter({
    parameter: type.parameter.map(typeToSuggestion),
    typePartId: type.typePartId,
  });
};

type SourceAndCache = {
  /** 型パーツ */
  typePartMap: ReadonlyMap<data.TypePartId, data.TypePart>;
  /** パーツ */
  partMap: ReadonlyMap<data.PartId, data.Part>;
  /** Suggestion内で作ったパーツ */
  suggestionPartMap: ReadonlyMap<number, data.SuggestionExpr>;
  /** 評価されたパーツ (キャッシュ) */
  evaluatedPartMap: Map<data.PartId, data.EvaluatedExpr>;
  /** 評価されたSuggestion内での作ったパーツ (キャッシュ) */
  evaluatedSuggestionPartMap: Map<number, data.EvaluatedExpr>;
};

export type EvaluationResult = data.Result<
  data.EvaluatedExpr,
  ReadonlyArray<data.EvaluateExprError>
>;

/**
 * Elmから送られてきたデータを元にして式を評価する
 */
export const evalExpr = (evalParameter: data.EvalParameter): EvaluationResult =>
  evaluateSuggestionExpr(
    {
      partMap: new Map(
        evalParameter.partList.map((partAndId) => [
          partAndId.id,
          partAndId.data,
        ])
      ),
      typePartMap: new Map(
        evalParameter.typePartList.map((typeAndId) => [
          typeAndId.id,
          typeAndId.data,
        ])
      ),
      suggestionPartMap: changeListToSuggestionPartMap(
        evalParameter.changeList
      ),
      evaluatedPartMap: new Map(),
      evaluatedSuggestionPartMap: new Map(),
    },
    evalParameter.expr
  );

const changeListToSuggestionPartMap = (
  changeList: ReadonlyArray<data.Change>
): ReadonlyMap<number, data.SuggestionExpr> => {
  const map: Map<number, data.SuggestionExpr> = new Map();
  for (const change of changeList) {
    switch (change._) {
      case "AddPart":
        map.set(change.addPart.id, change.addPart.expr);
        break;
      case "ProjectName":
        break;
    }
  }
  return map;
};

export const evaluateSuggestionExpr = (
  sourceAndCache: SourceAndCache,
  suggestionExpr: data.SuggestionExpr
): EvaluationResult => {
  switch (suggestionExpr._) {
    case "Kernel":
      return data.Result.Ok(
        data.EvaluatedExpr.Kernel(suggestionExpr.kernelExpr)
      );
    case "Int32Literal":
      return data.Result.Ok(data.EvaluatedExpr.Int32(suggestionExpr.int32));
    case "PartReference":
      return evaluatePartReference(sourceAndCache, suggestionExpr.partId);
    case "SuggestionPartReference":
      return evaluateSuggestionPartReference(
        sourceAndCache,
        suggestionExpr.int32
      );
    case "LocalPartReference":
      return evaluateLocalPartReference(
        sourceAndCache,
        suggestionExpr.localPartReference
      );
    case "TagReference":
      return data.Result.Ok(
        data.EvaluatedExpr.TagReference(suggestionExpr.tagReference)
      );
    case "SuggestionTagReference":
      return data.Result.Error([data.EvaluateExprError.NotSupported]);
    case "FunctionCall":
      return evaluateSuggestionFunctionCall(
        sourceAndCache,
        suggestionExpr.suggestionFunctionCall
      );
    case "Lambda":
      return data.Result.Error([data.EvaluateExprError.NotSupported]);
    case "Blank":
      return data.Result.Error([data.EvaluateExprError.Blank]);
  }
};

const localPartReferenceAndEvaluatedExpr = (
  localPartReference: data.LocalPartReference,
  evaluateExpr: data.EvaluatedExpr
): [string, data.EvaluatedExpr] => [
  (localPartReference.partId as string) +
    (localPartReference.localPartId as string),
  evaluateExpr,
];

const evaluatePartReference = (
  sourceAndCache: SourceAndCache,
  partId: data.PartId
): EvaluationResult => {
  const evaluatedPart = sourceAndCache.evaluatedPartMap.get(partId);
  if (evaluatedPart !== undefined) {
    return data.Result.Ok(evaluatedPart);
  }
  const part = sourceAndCache.partMap.get(partId);
  if (part === undefined) {
    return data.Result.Error([
      data.EvaluateExprError.NeedPartDefinition(partId),
    ]);
  }
  const result = evaluateSuggestionExpr(
    sourceAndCache,
    exprToSuggestionExpr(part.expr)
  );
  if (result._ === "Ok") {
    sourceAndCache.evaluatedPartMap.set(partId, result.ok);
  }
  return result;
};

const evaluateSuggestionPartReference = (
  sourceAndCache: SourceAndCache,
  addPartId: number
): EvaluationResult => {
  const evaluatedSuggestionPart = sourceAndCache.evaluatedSuggestionPartMap.get(
    addPartId
  );
  if (evaluatedSuggestionPart !== undefined) {
    return data.Result.Ok(evaluatedSuggestionPart);
  }
  const suggestionPart = sourceAndCache.suggestionPartMap.get(addPartId);
  if (suggestionPart === undefined) {
    return data.Result.Error([
      data.EvaluateExprError.NeedSuggestionPart(addPartId),
    ]);
  }
  const result = evaluateSuggestionExpr(sourceAndCache, suggestionPart);
  if (result._ === "Ok") {
    sourceAndCache.evaluatedSuggestionPartMap.set(addPartId, result.ok);
  }
  return result;
};

const evaluateLocalPartReference = (
  sourceAndCache: SourceAndCache,
  localPartReference: data.LocalPartReference
): EvaluationResult => {
  return data.Result.Error([data.EvaluateExprError.NotSupported]);
};

const localEvaluatedPartMapGetLocalPartExpr = (
  evaluatedLocalPartMap: ReadonlyMap<string, data.EvaluatedExpr>,
  localPartReference: data.LocalPartReference
): data.EvaluatedExpr | undefined => {
  return evaluatedLocalPartMap.get(
    (localPartReference.partId as string) +
      (localPartReference.localPartId as string)
  );
};

const localPartMapGetLocalPartExpr = (
  localPartMap: ReadonlyMap<string, data.Expr>,
  localPartReference: data.LocalPartReference
): data.Expr | undefined => {
  return localPartMap.get(
    (localPartReference.partId as string) +
      (localPartReference.localPartId as string)
  );
};

const localEvaluatedPartMapSetLocalPartExpr = (
  optimizedLocalPart: ReadonlyMap<string, data.EvaluatedExpr>,
  localPartReference: data.LocalPartReference,
  evaluatedExpr: data.EvaluatedExpr
): ReadonlyMap<string, data.EvaluatedExpr> => {
  return new Map(optimizedLocalPart).set(
    (localPartReference.partId as string) +
      (localPartReference.localPartId as string),
    evaluatedExpr
  );
};

const localPartMapSetLocalPartExpr = (
  localPartMap: ReadonlyMap<string, data.Expr>,
  localPartReference: data.LocalPartReference,
  expr: data.Expr
): ReadonlyMap<string, data.Expr> => {
  return new Map(localPartMap).set(
    (localPartReference.partId as string) +
      (localPartReference.localPartId as string),
    expr
  );
};

const evaluateSuggestionFunctionCall = (
  sourceAndCache: SourceAndCache,
  functionCall: data.SuggestionFunctionCall
): EvaluationResult => {
  const functionResult = evaluateSuggestionExpr(
    sourceAndCache,
    functionCall.function
  );
  const parameterResult = evaluateSuggestionExpr(
    sourceAndCache,
    functionCall.parameter
  );
  switch (functionResult._) {
    case "Ok":
      switch (parameterResult._) {
        case "Ok": {
          return evaluateFunctionCallResultOk(
            functionResult.ok,
            parameterResult.ok
          );
        }
        case "Error":
          return parameterResult;
      }
      break;

    case "Error":
      return data.Result.Error(
        functionResult.error.concat(
          parameterResult._ === "Error" ? parameterResult.error : []
        )
      );
  }
};

const evaluateFunctionCallResultOk = (
  functionExpr: data.EvaluatedExpr,
  parameter: data.EvaluatedExpr
): data.Result<data.EvaluatedExpr, ReadonlyArray<data.EvaluateExprError>> => {
  switch (functionExpr._) {
    case "Kernel": {
      return data.Result.Ok(
        data.EvaluatedExpr.KernelCall({
          kernel: functionExpr.kernelExpr,
          expr: parameter,
        })
      );
    }
    case "KernelCall": {
      switch (functionExpr.kernelCall.kernel) {
        case "Int32Add":
          return int32Add(functionExpr.kernelCall.expr, parameter);
        case "Int32Mul":
          return int32Mul(functionExpr.kernelCall.expr, parameter);
        case "Int32Sub":
          return int32Sub(functionExpr.kernelCall.expr, parameter);
      }
    }
  }
  return data.Result.Error([
    data.EvaluateExprError.TypeError({
      message: "関数のところにkernel,kernelCall以外が来てしまった",
    }),
  ]);
};

const int32Add = (
  parameterA: data.EvaluatedExpr,
  parameterB: data.EvaluatedExpr
): data.Result<data.EvaluatedExpr, ReadonlyArray<data.EvaluateExprError>> => {
  switch (parameterA._) {
    case "Int32":
      switch (parameterB._) {
        case "Int32": {
          const parameterAInt: number = parameterA.int32;
          const parameterBInt: number = parameterB.int32;
          return data.Result.Ok(
            data.EvaluatedExpr.Int32((parameterAInt + parameterBInt) | 0)
          );
        }
      }
  }
  return data.Result.Error([
    data.EvaluateExprError.TypeError({
      message: "int32Addで整数が渡されなかった",
    }),
  ]);
};

const int32Mul = (
  parameterA: data.EvaluatedExpr,
  parameterB: data.EvaluatedExpr
): data.Result<data.EvaluatedExpr, ReadonlyArray<data.EvaluateExprError>> => {
  switch (parameterA._) {
    case "Int32":
      switch (parameterB._) {
        case "Int32": {
          const parameterAInt: number = parameterA.int32;
          const parameterBInt: number = parameterB.int32;
          return data.Result.Ok(
            data.EvaluatedExpr.Int32((parameterAInt * parameterBInt) | 0)
          );
        }
      }
  }
  return data.Result.Error([
    data.EvaluateExprError.TypeError({
      message: "int33Mulで整数が渡されなかった",
    }),
  ]);
};

const int32Sub = (
  parameterA: data.EvaluatedExpr,
  parameterB: data.EvaluatedExpr
): data.Result<data.EvaluatedExpr, ReadonlyArray<data.EvaluateExprError>> => {
  switch (parameterA._) {
    case "Int32":
      switch (parameterB._) {
        case "Int32": {
          const parameterAInt: number = parameterA.int32;
          const parameterBInt: number = parameterB.int32;
          return data.Result.Ok(
            data.EvaluatedExpr.Int32((parameterAInt - parameterBInt) | 0)
          );
        }
      }
  }
  return data.Result.Error([
    data.EvaluateExprError.TypeError({
      message: "int33Subで整数が渡されなかった",
    }),
  ]);
};

export const exprToDebugString = (expr: data.Expr): string => {
  switch (expr._) {
    case "Kernel":
      return kernelToString(expr.kernelExpr);
    case "Int32Literal":
      return expr.int32.toString();
    case "LocalPartReference":
      return "[local " + JSON.stringify(expr.localPartReference) + "]";
    case "PartReference":
      return "[part " + (expr.partId as string) + "]";
    case "TagReference":
      return "[tag " + JSON.stringify(expr.tagReference) + "]";
    case "FunctionCall":
      return (
        "(" +
        exprToDebugString(expr.functionCall.function) +
        " " +
        exprToDebugString(expr.functionCall.parameter)
      );
    case "Lambda":
      return (
        "λ( " + expr.lambdaBranchList.map(lambdaBranchToString).join(",") + ")"
      );
  }
};

const kernelToString = (kernelExpr: data.KernelExpr): string => {
  switch (kernelExpr) {
    case "Int32Add":
      return "+";
    case "Int32Sub":
      return "-";
    case "Int32Mul":
      return "*";
  }
};

const lambdaBranchToString = (lambdaBranch: data.LambdaBranch): string => {
  return (
    (lambdaBranch.description === ""
      ? ""
      : "{-" + lambdaBranch.description + "-}") +
    conditionToString(lambdaBranch.condition) +
    " → " +
    exprToDebugString(lambdaBranch.expr)
  );
};

const conditionToString = (condition: data.Condition): string => {
  switch (condition._) {
    case "ByTag":
      return (
        "#" +
        (condition.conditionTag.tag as string) +
        " " +
        util.maybeUnwrap(
          condition.conditionTag.parameter,
          conditionToString,
          ""
        ) +
        ")"
      );
    case "ByCapture": {
      const capturePartName: string = condition.conditionCapture.name;
      return (
        capturePartName +
        "(" +
        (condition.conditionCapture.localPartId as string) +
        ")"
      );
    }
    case "Any":
      return "_";
    case "Int32":
      return condition.int32.toString();
  }
};

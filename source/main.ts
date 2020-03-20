import * as data from "./data";
import * as util from "./util";

export { data };
export { util };

export const releaseOrigin = "https://definy.app";

export const clientModeToOriginUrl = (clientMode: data.ClientMode): URL => {
  switch (clientMode._) {
    case "DebugMode": {
      const originUrl = new URL("http://[::1]");
      originUrl.port = clientMode.int32.toString();
      return originUrl;
    }
    case "Release":
      return new URL(releaseOrigin);
  }
};

const languageQueryKey = "hl";
export const defaultLanguage: data.Language = "English";

export const urlDataToUrl = (urlData: data.UrlData): URL => {
  const url = clientModeToOriginUrl(urlData.clientMode);
  url.pathname = locationToPath(urlData.location);
  url.searchParams.append(
    languageQueryKey,
    languageToIdString(urlData.language)
  );
  if (urlData.accessToken._ === "Just") {
    url.hash = "access-token=" + (urlData.accessToken.value as string);
  }
  return url;
};

const locationToPath = (location: data.Location): string => {
  switch (location._) {
    case "Home":
      return "/";
    case "User":
      return "/user/" + (location.userId as string);
    case "Project":
      return "/project/" + (location.projectId as string);
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
export const urlDataFromUrl = (url: URL): data.UrlData => {
  const languageId = url.searchParams.get(languageQueryKey);
  const language: data.Language =
    languageId === null ? defaultLanguage : languageFromIdString(languageId);
  return {
    clientMode: clientModeFromUrl(url.hostname, url.port),
    location: locationFromUrl(url.pathname),
    language: language,
    accessToken: accessTokenFromUrl(url.hash)
  };
};

const clientModeFromUrl = (
  hostName: string,
  portAsString: string
): data.ClientMode => {
  if (hostName === "[::1]") {
    const portNumber = Number.parseInt(portAsString);
    return data.clientModeDebugMode(isNaN(portNumber) ? 443 : portNumber);
  }
  return data.clientModeRelease;
};

const locationFromUrl = (pathName: string): data.Location => {
  const projectResult = pathName.match(/^\/project\/([0-9a-f]{32})$/u);
  if (projectResult !== null) {
    return data.locationProject(projectResult[1] as data.ProjectId);
  }
  const userResult = pathName.match(/^\/user\/([0-9a-f]{32})$/u);
  if (userResult !== null) {
    return data.locationUser(userResult[1] as data.UserId);
  }
  return data.locationHome;
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
  const matchResult = hash.match(/access-token=([0-9a-f]{64})/u);
  if (matchResult === null) {
    return data.maybeNothing();
  }
  return data.maybeJust(matchResult[1] as data.AccessToken);
};

type SourceAndCache = {
  typeDefinitionMap: ReadonlyMap<data.TypeId, data.TypeDefinition>;
  partDefinitionMap: ReadonlyMap<data.PartId, data.PartDefinition>;
  optimizedPartMap: ReadonlyMap<data.PartId, data.Expr>;
  /** パーツ内に含まれるローカルパーツの式を格納する. キーはPartIdをLocalPartIdを結合したもの */
  optimizedLocalPart: ReadonlyMap<string, data.Expr>;
};

type EvaluationResult = {
  result: data.Result<data.Expr, ReadonlyArray<data.EvaluateExprError>>;
  optimizedPartMap: ReadonlyMap<data.PartId, data.Expr>;
  /** パーツ内に含まれるローカルパーツの式を格納する. キーはPartIdをLocalPartIdを結合したもの */
  optimizedLocalPart: ReadonlyMap<string, data.Expr>;
};

const getPartExpr = (
  source: SourceAndCache,
  partId: data.PartId
): data.Result<data.Expr, ReadonlyArray<data.EvaluateExprError>> => {
  const optimizedPart = source.optimizedPartMap.get(partId);
  if (optimizedPart !== undefined) {
    return data.resultOk(optimizedPart);
  }
  const part = source.partDefinitionMap.get(partId);
  if (part === undefined) {
    return data.resultError([data.evaluateExprErrorNeedPartDefinition(partId)]);
  }
  const expr = part.expr;
  switch (expr._) {
    case "Just":
      return data.resultOk(expr.value);
    case "Nothing":
      return data.resultError([
        data.evaluateExprErrorPartExprIsNothing(partId)
      ]);
  }
};

/** 正格評価  TODO 遅延評価バージョンも作る! */
export const evaluateExpr = (
  sourceAndCache: SourceAndCache,
  expr: data.Expr
): EvaluationResult => {
  switch (expr._) {
    case "Kernel":
      return {
        result: data.resultOk(expr),
        optimizedLocalPart: new Map(),
        optimizedPartMap: new Map()
      };

    case "Int32Literal":
      return {
        result: data.resultOk(expr),
        optimizedLocalPart: new Map(),
        optimizedPartMap: new Map()
      };

    case "PartReference":
      return evaluatePartReference(sourceAndCache, expr.partId);

    case "LocalPartReference":
      return evaluateLocalPartReference(
        sourceAndCache,
        expr.localPartReference
      );

    case "TagReference":
      return {
        result: data.resultOk(expr),
        optimizedLocalPart: sourceAndCache.optimizedLocalPart,
        optimizedPartMap: sourceAndCache.optimizedPartMap
      };

    case "FunctionCall":
      return evaluateFunctionCall(sourceAndCache, expr.functionCall);

    case "Lambda":
      return null;
  }
};

const partIdAndExpr = (
  partId: data.PartId,
  expr: data.Expr
): [data.PartId, data.Expr] => [partId, expr];

const evaluatePartReference = (
  sourceAndCache: SourceAndCache,
  partId: data.PartId
): EvaluationResult => {
  const exprResult = getPartExpr(sourceAndCache, partId);
  switch (exprResult._) {
    case "Ok": {
      const evaluatedResult = evaluateExpr(sourceAndCache, exprResult.ok);
      return {
        result: evaluatedResult.result,
        optimizedPartMap: new Map([
          ...evaluatedResult.optimizedPartMap,
          ...(evaluatedResult.result._ === "Ok"
            ? [partIdAndExpr(partId, evaluatedResult.result.ok)]
            : [])
        ]),
        optimizedLocalPart: evaluatedResult.optimizedLocalPart
      };
    }
    case "Error":
      return {
        result: exprResult,
        optimizedLocalPart: new Map(),
        optimizedPartMap: new Map()
      };
  }
};

const evaluateLocalPartReference = (
  sourceAndCache: SourceAndCache,
  localPartReference: data.LocalPartReference
): EvaluationResult => {
  const localPartInPart = localOptimizedPartGetLocalPart(
    sourceAndCache.optimizedLocalPart,
    localPartReference
  );
  if (localPartInPart === undefined) {
    return {
      result: data.resultError([
        data.evaluateExprErrorCannotFindLocalPartDefinition(localPartReference)
      ]),
      optimizedLocalPart: new Map(),
      optimizedPartMap: new Map()
    };
  }
  return evaluateExpr(sourceAndCache, localPartInPart);
};

const localOptimizedPartGetLocalPart = (
  optimizedLocalPart: ReadonlyMap<string, data.Expr>,
  localPartReference: data.LocalPartReference
): data.Expr | undefined => {
  return optimizedLocalPart.get(
    (localPartReference.partId as string) +
      (localPartReference.localPartId as string)
  );
};

const localOptimizedPartSetLocalPart = (
  optimizedLocalPart: ReadonlyMap<string, data.Expr>,
  localPartReference: data.LocalPartReference,
  expr: data.Expr
): ReadonlyMap<string, data.Expr> => {
  return new Map(optimizedLocalPart).set(
    (localPartReference.partId as string) +
      (localPartReference.localPartId as string),
    expr
  );
};

const evaluateFunctionCall = (
  sourceAndCache: SourceAndCache,
  functionCall: data.FunctionCall
): EvaluationResult => {
  const functionResult = evaluateExpr(sourceAndCache, functionCall.function);
  const newSourceAndCache = concatCache(sourceAndCache, functionResult);
  const parameterBResult = evaluateExpr(
    newSourceAndCache,
    functionCall.parameter
  );

  switch (functionResult.result._) {
    case "Ok":
      switch (parameterBResult.result._) {
        case "Ok":
          return evaluateFunctionCallResultOk(
            concatCache(newSourceAndCache, parameterBResult),
            functionResult.result.ok,
            parameterBResult.result.ok
          );
        case "Error":
          return parameterBResult;
      }
      break;

    case "Error":
      return {
        result: data.resultError(
          functionResult.result.error.concat(
            parameterBResult.result._ === "Error"
              ? parameterBResult.result.error
              : []
          )
        ),
        optimizedLocalPart: parameterBResult.optimizedLocalPart,
        optimizedPartMap: parameterBResult.optimizedPartMap
      };
  }
};

const evaluateFunctionCallResultOk = (
  sourceAndCache: SourceAndCache,
  functionExpr: data.Expr,
  parameter: data.Expr
): EvaluationResult => {
  if (functionExpr._ !== "FunctionCall") {
    return {
      result: data.resultOk(
        data.exprFunctionCall({
          function: functionExpr,
          parameter: parameter
        })
      ),
      optimizedLocalPart: new Map(),
      optimizedPartMap: new Map()
    };
  }
  switch (functionExpr.functionCall.function._) {
    case "Kernel":
      switch (functionExpr.functionCall.function.kernelExpr) {
        case "Int32Add":
          switch (parameter._) {
            case "Int32Literal":
              switch (functionExpr.functionCall.parameter._) {
                case "Int32Literal":
                  return {
                    result: data.resultOk(
                      data.exprInt32Literal(
                        functionExpr.functionCall.parameter.int32 +
                          parameter.int32
                      )
                    ),
                    optimizedLocalPart: new Map(),
                    optimizedPartMap: new Map()
                  };
              }
          }
      }
  }
};

/**
 * +
 * @param sourceAndCache
 * @param parameterA 評価をできるだけ進める?
 * @param parameterB 評価をできるだけ進める?
 */
const int32Add = (
  sourceAndCache: SourceAndCache,
  parameterA: data.Expr,
  parameterB: data.Expr
): EvaluationResult => {
  const parameterAResult = evaluateExpr(sourceAndCache, parameterA);
  const newSourceAndCache = concatCache(sourceAndCache, parameterAResult);
  const parameterBResult = evaluateExpr(newSourceAndCache, parameterB);
};

const concatCache = (
  sourceAndCache: SourceAndCache,
  result: EvaluationResult
): SourceAndCache => {
  return {
    typeDefinitionMap: sourceAndCache.typeDefinitionMap,
    partDefinitionMap: sourceAndCache.partDefinitionMap,
    optimizedPartMap: new Map([
      ...sourceAndCache.optimizedPartMap,
      ...result.optimizedPartMap
    ]),
    optimizedLocalPart: new Map([
      ...sourceAndCache.optimizedPartMap,
      ...result.optimizedLocalPart
    ])
  };
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
      return "[tag " + JSON.stringify(expr.tagReferenceIndex) + "]";
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
    util.maybeUnwrap(lambdaBranch.expr, exprToDebugString, "□")
  );
};

const conditionToString = (condition: data.Condition): string => {
  switch (condition._) {
    case "Tag":
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
    case "Capture":
      return (
        condition.conditionCapture.name +
        "(" +
        (condition.conditionCapture.localPartId as string) +
        ")"
      );
    case "Any":
      return "_";
    case "Int32":
      return condition.int32.toString();
  }
};

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
  /** パーツ内に含まれるローカルパーツの式を格納する. キーはPartIdをLocalPartIdを結合したもの */
  localPartMap: ReadonlyMap<string, data.Expr>;

  evaluatedPartMap: ReadonlyMap<data.PartId, data.EvaluatedExpr>;
  /** パーツ内に含まれるローカルパーツの式を格納する. キーはPartIdをLocalPartIdを結合したもの */
  evaluatedLocalPartMap: ReadonlyMap<string, data.EvaluatedExpr>;
};

type EvaluationResult = {
  result: data.Result<
    data.EvaluatedExpr,
    ReadonlyArray<data.EvaluateExprError>
  >;
  evaluatedPartMap: ReadonlyMap<data.PartId, data.EvaluatedExpr>;
  /** パーツ内に含まれるローカルパーツの式を格納する. キーはPartIdをLocalPartIdを結合したもの */
  evaluatedLocalPartMap: ReadonlyMap<string, data.EvaluatedExpr>;
};

/** 正格評価  TODO 遅延評価バージョンも作る! */
export const evaluateExpr = (
  sourceAndCache: SourceAndCache,
  expr: data.Expr
): EvaluationResult => {
  switch (expr._) {
    case "Kernel":
      return {
        result: data.resultOk(data.evaluatedExprKernel(expr.kernelExpr)),
        evaluatedLocalPartMap: new Map(),
        evaluatedPartMap: new Map()
      };

    case "Int32Literal":
      return {
        result: data.resultOk(data.evaluatedExprInt32(expr.int32)),
        evaluatedLocalPartMap: new Map(),
        evaluatedPartMap: new Map()
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
        evaluatedLocalPartMap: sourceAndCache.evaluatedLocalPartMap,
        evaluatedPartMap: sourceAndCache.evaluatedPartMap
      };

    case "FunctionCall":
      return evaluateFunctionCall(sourceAndCache, expr.functionCall);

    case "Lambda":
      return {
        result: data.resultError([data.evaluateExprErrorNotSupported]),
        evaluatedPartMap: new Map(),
        evaluatedLocalPartMap: new Map()
      };
  }
};

const partIdAndEvaluatedExpr = (
  partId: data.PartId,
  evaluatedExpr: data.EvaluatedExpr
): [data.PartId, data.EvaluatedExpr] => [partId, evaluatedExpr];

const localPartReferenceAndEvaluatedExpr = (
  localPartReference: data.LocalPartReference,
  evaluateExpr: data.EvaluatedExpr
): [string, data.EvaluatedExpr] => [
  (localPartReference.partId as string) +
    (localPartReference.localPartId as string),
  evaluateExpr
];

const evaluatePartReference = (
  sourceAndCache: SourceAndCache,
  partId: data.PartId
): EvaluationResult => {
  const evaluatedPart = sourceAndCache.evaluatedPartMap.get(partId);
  if (evaluatedPart !== undefined) {
    return {
      result: data.resultOk(evaluatedPart),
      evaluatedPartMap: new Map(),
      evaluatedLocalPartMap: new Map()
    };
  }
  const part = sourceAndCache.partDefinitionMap.get(partId);
  if (part !== undefined) {
    const expr = part.expr;
    switch (expr._) {
      case "Just": {
        const evaluatedResult = evaluateExpr(sourceAndCache, expr.value);
        return {
          result: evaluatedResult.result,
          evaluatedPartMap: new Map([
            ...evaluatedResult.evaluatedPartMap,
            ...(evaluatedResult.result._ === "Ok"
              ? [partIdAndEvaluatedExpr(partId, evaluatedResult.result.ok)]
              : [])
          ]),
          evaluatedLocalPartMap: evaluatedResult.evaluatedLocalPartMap
        };
      }
      case "Nothing":
        return {
          result: data.resultError([
            data.evaluateExprErrorNeedPartDefinition(partId)
          ]),
          evaluatedPartMap: new Map(),
          evaluatedLocalPartMap: new Map()
        };
    }
  }

  return {
    result: data.resultError([
      data.evaluateExprErrorNeedPartDefinition(partId)
    ]),
    evaluatedPartMap: new Map(),
    evaluatedLocalPartMap: new Map()
  };
};

const evaluateLocalPartReference = (
  sourceAndCache: SourceAndCache,
  localPartReference: data.LocalPartReference
): EvaluationResult => {
  const evaluatedExpr = localEvaluatedPartMapGetLocalPartExpr(
    sourceAndCache.evaluatedLocalPartMap,
    localPartReference
  );
  if (evaluatedExpr !== undefined) {
    return {
      result: data.resultOk(evaluatedExpr),
      evaluatedPartMap: new Map(),
      evaluatedLocalPartMap: new Map()
    };
  }
  const expr = localPartMapGetLocalPartExpr(
    sourceAndCache.localPartMap,
    localPartReference
  );
  if (expr !== undefined) {
    const result = evaluateExpr(sourceAndCache, expr);
    return {
      result: result.result,
      evaluatedPartMap: result.evaluatedPartMap,
      evaluatedLocalPartMap: new Map([
        ...result.evaluatedLocalPartMap,
        ...(result.result._ === "Ok"
          ? [
              localPartReferenceAndEvaluatedExpr(
                localPartReference,
                result.result.ok
              )
            ]
          : [])
      ])
    };
  }
  return {
    result: data.resultError([
      data.evaluateExprErrorCannotFindLocalPartDefinition(localPartReference)
    ]),
    evaluatedLocalPartMap: new Map(),
    evaluatedPartMap: new Map()
  };
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

const evaluateFunctionCall = (
  sourceAndCache: SourceAndCache,
  functionCall: data.FunctionCall
): EvaluationResult => {
  const functionResult = evaluateExpr(sourceAndCache, functionCall.function);
  const newSourceAndCache = concatCache(sourceAndCache, functionResult);
  const parameterResult = evaluateExpr(
    newSourceAndCache,
    functionCall.parameter
  );
  const evaluatedPartMap = new Map([
    ...functionResult.evaluatedPartMap,
    ...parameterResult.evaluatedPartMap
  ]);
  const evaluatedLocalPartMap = new Map([
    ...functionResult.evaluatedPartMap,
    ...parameterResult.evaluatedLocalPartMap
  ]);

  switch (functionResult.result._) {
    case "Ok":
      switch (parameterResult.result._) {
        case "Ok": {
          return {
            result: evaluateFunctionCallResultOk(
              functionResult.result.ok,
              parameterResult.result.ok
            ),
            evaluatedPartMap: evaluatedPartMap,
            evaluatedLocalPartMap: evaluatedLocalPartMap
          };
        }
        case "Error":
          return parameterResult;
      }
      break;

    case "Error":
      return {
        result: data.resultError(
          functionResult.result.error.concat(
            parameterResult.result._ === "Error"
              ? parameterResult.result.error
              : []
          )
        ),
        evaluatedPartMap: evaluatedPartMap,
        evaluatedLocalPartMap: evaluatedLocalPartMap
      };
  }
};

const evaluateFunctionCallResultOk = (
  functionExpr: data.EvaluatedExpr,
  parameter: data.EvaluatedExpr
): data.Result<data.EvaluatedExpr, ReadonlyArray<data.EvaluateExprError>> => {
  switch (functionExpr._) {
    case "Kernel": {
      return data.resultOk(
        data.evaluatedExprKernelCall({
          kernel: functionExpr.kernelExpr,
          expr: parameter
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
  return data.resultError([
    data.evaluateExprErrorTypeError({
      message: "関数のところにkernel,kernelCall以外が来てしまった"
    })
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
          return data.resultOk(
            data.evaluatedExprInt32((parameterAInt + parameterBInt) | 0)
          );
        }
      }
  }
  return data.resultError([
    data.evaluateExprErrorTypeError({
      message: "int32Addで整数が渡されなかった"
    })
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
          return data.resultOk(
            data.evaluatedExprInt32((parameterAInt * parameterBInt) | 0)
          );
        }
      }
  }
  return data.resultError([
    data.evaluateExprErrorTypeError({
      message: "int33Mulで整数が渡されなかった"
    })
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
          return data.resultOk(
            data.evaluatedExprInt32((parameterAInt - parameterBInt) | 0)
          );
        }
      }
  }
  return data.resultError([
    data.evaluateExprErrorTypeError({
      message: "int33Subで整数が渡されなかった"
    })
  ]);
};

const concatCache = (
  sourceAndCache: SourceAndCache,
  result: EvaluationResult
): SourceAndCache => {
  return {
    typeDefinitionMap: sourceAndCache.typeDefinitionMap,
    partDefinitionMap: sourceAndCache.partDefinitionMap,
    localPartMap: sourceAndCache.localPartMap,
    evaluatedPartMap: new Map([
      ...sourceAndCache.evaluatedPartMap,
      ...result.evaluatedPartMap
    ]),
    evaluatedLocalPartMap: new Map([
      ...sourceAndCache.evaluatedPartMap,
      ...result.evaluatedLocalPartMap
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

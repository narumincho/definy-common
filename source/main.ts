import * as data from "./data";
import * as elm from "elm-code-generator/data";
import * as elmCodeGenerator from "elm-code-generator";
import * as elmUtil from "elm-code-generator/util";
import * as hexString from "./kernelType/hexString";
import * as jsTsCodeGenerator from "js-ts-code-generator";
import * as ts from "js-ts-code-generator/source/data";
import * as typeAlias from "./typeAlias";
import * as util from "./util";
import * as variable from "./variable";

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

export const urlDataAndAccountTokenToUrl = (
  urlData: data.UrlData,
  accountToken: data.Maybe<data.AccountToken>
): URL => {
  const url = clientModeToOriginUrl(urlData.clientMode);
  url.pathname = locationToPath(urlData.location);
  url.searchParams.append(
    languageQueryKey,
    languageToIdString(urlData.language)
  );
  if (accountToken._ === "Just") {
    url.hash = "account-token=" + (accountToken.value as string);
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
    case "Commit":
      return "/commit/" + (location.commitId as string);
    case "Setting":
      return "/setting/";
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
export const urlDataAndAccountTokenFromUrl = (
  url: URL
): { urlData: data.UrlData; accountToken: data.Maybe<data.AccountToken> } => {
  const languageId = url.searchParams.get(languageQueryKey);
  const language: data.Language =
    languageId === null ? defaultLanguage : languageFromIdString(languageId);
  return {
    urlData: {
      clientMode: clientModeFromUrl(url.origin),
      location: locationFromUrl(url.pathname),
      language,
    },
    accountToken: accountTokenFromUrl(url.hash),
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
  if (pathName === "/setting") {
    return data.Location.Setting;
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
  const commitResult = pathName.match(/^\/commit\/(?<id>[0-9a-f]{32})$/u);
  if (commitResult !== null && commitResult.groups !== undefined) {
    return data.Location.Commit(commitResult.groups.id as data.CommitId);
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

const accountTokenFromUrl = (hash: string): data.Maybe<data.AccountToken> => {
  const matchResult = hash.match(/account-token=(?<token>[0-9a-f]{64})/u);
  if (matchResult === null || matchResult.groups === undefined) {
    return data.Maybe.Nothing();
  }
  return data.Maybe.Just(matchResult.groups.token as data.AccountToken);
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

export type EvaluationResult = data.Result<
  data.EvaluatedExpr,
  ReadonlyArray<data.EvaluateExprError>
>;

type SourceAndCache = {
  /** 型パーツ */
  typePartMap: ReadonlyMap<data.TypePartId, data.TypePart>;
  /** パーツ */
  partMap: ReadonlyMap<data.PartId, data.Part>;
  /** 評価されたパーツ (キャッシュ) */
  evaluatedPartMap: Map<data.PartId, data.EvaluatedExpr>;
  /** 評価されたSuggestion内での作ったパーツ (キャッシュ) */
  evaluatedSuggestionPartMap: Map<number, data.EvaluatedExpr>;
};

type EvalParameter = {
  typePartList: ReadonlyArray<data.IdAndData<data.TypePartId, data.TypePart>>;
  partList: ReadonlyArray<data.IdAndData<data.PartId, data.Part>>;
  expr: data.Expr;
};

/**
 * Elmから送られてきたデータを元にして式を評価する
 */
export const evalExpr = (evalParameter: EvalParameter): EvaluationResult =>
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
      evaluatedPartMap: new Map(),
      evaluatedSuggestionPartMap: new Map(),
    },
    evalParameter.expr
  );

export const evaluateSuggestionExpr = (
  sourceAndCache: SourceAndCache,
  expr: data.Expr
): EvaluationResult => {
  switch (expr._) {
    case "Kernel":
      return data.Result.Ok(data.EvaluatedExpr.Kernel(expr.kernelExpr));
    case "Int32Literal":
      return data.Result.Ok(data.EvaluatedExpr.Int32(expr.int32));
    case "PartReference":
      return evaluatePartReference(sourceAndCache, expr.partId);
    case "TagReference":
      return data.Result.Ok(data.EvaluatedExpr.TagReference(expr.tagReference));
    case "Lambda":
      return data.Result.Error([data.EvaluateExprError.NotSupported]);
    case "FunctionCall":
      return evaluateSuggestionFunctionCall(sourceAndCache, expr.functionCall);
  }
};

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
  const result = evaluateSuggestionExpr(sourceAndCache, part.expr);
  if (result._ === "Ok") {
    sourceAndCache.evaluatedPartMap.set(partId, result.ok);
  }
  return result;
};

const evaluateSuggestionFunctionCall = (
  sourceAndCache: SourceAndCache,
  functionCall: data.FunctionCall
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
        (condition.conditionCapture.partId as string) +
        ")"
      );
    }
    case "Any":
      return "_";
    case "Int32":
      return condition.int32.toString();
  }
};

export const generateTypeScriptCodeAsString = (
  typePartMap: ReadonlyMap<data.TypePartId, data.TypePart>
): string => {
  return jsTsCodeGenerator.generateCodeAsString(
    generateTypeScriptCode(typePartMap),
    "TypeScript"
  );
};

export const generateJavaScriptCodeAsString = (
  typePartMap: ReadonlyMap<data.TypePartId, data.TypePart>
): string => {
  return jsTsCodeGenerator.generateCodeAsString(
    generateTypeScriptCode(typePartMap),
    "JavaScript"
  );
};

export const generateTypeScriptCode = (
  typePartMap: ReadonlyMap<data.TypePartId, data.TypePart>
): ts.Code => {
  const allTypePartIdTypePartNameMap = checkTypePartListValidation(typePartMap);
  return {
    exportDefinitionList: [
      ts.ExportDefinition.Function(hexString.encodeIdFunction),
      ts.ExportDefinition.Function(hexString.idDecodeFunction),
      ts.ExportDefinition.Function(hexString.tokenEncodeFunction),
      ts.ExportDefinition.Function(hexString.decodeTokenFunction),
      ...typeAlias
        .typePartMapToTypeAlias(typePartMap, allTypePartIdTypePartNameMap)
        .map(ts.ExportDefinition.TypeAlias),
      ...variable
        .typePartMapToVariable(typePartMap, allTypePartIdTypePartNameMap)
        .map(ts.ExportDefinition.Variable),
    ],
    statementList: [],
  };
};

/**
 * 指定した型の定義が正しくできているか調べる
 * @throws 型の定義が正しくできていない場合
 * @returns 型パラメーターまで含めたTypePartの名前の辞書
 */
const checkTypePartListValidation = (
  typePartMap: ReadonlyMap<data.TypePartId, data.TypePart>
): ReadonlyMap<data.TypePartId, string> => {
  const typeNameSet = new Set<string>();
  const typePartIdSet = new Set<data.TypePartId>();
  const typePartIdTypeParameterSizeMap = new Map<data.TypePartId, number>();
  const allTypePartIdTypePartNameMap = new Map<data.TypePartId, string>();
  for (const [typePartId, typePart] of typePartMap) {
    if (typePartIdSet.has(typePartId)) {
      throw new Error(
        "duplicate type part id. typePartId = " +
          (typePartId as string) +
          " typePart = " +
          JSON.stringify(typePart)
      );
    }
    typePartIdSet.add(typePartId);
    if (util.isValidTypePartName(typePart.name)) {
      throw new Error("type part name is invalid. name = " + typePart.name);
    }
    if (typeNameSet.has(typePart.name)) {
      throw new Error("duplicate type part name. name =" + typePart.name);
    }
    typeNameSet.add(typePart.name);

    allTypePartIdTypePartNameMap.set(typePartId, typePart.name);

    const typeParameterNameSet: Set<string> = new Set();
    for (const typeParameter of typePart.typeParameterList) {
      if (typePartIdSet.has(typeParameter.typePartId)) {
        throw new Error(
          "duplicate type part id. (type parameter) typePartId = " +
            (typeParameter.typePartId as string)
        );
      }
      typePartIdSet.add(typeParameter.typePartId);
      if (typeParameterNameSet.has(typeParameter.name)) {
        throw new Error(
          "duplicate type parameter name. name =" + typeParameter.name
        );
      }
      typeParameterNameSet.add(typeParameter.name);
      if (!util.isFirstLowerCaseName(typeParameter.name)) {
        throw new Error(
          "type parameter name is invalid. name =" + typeParameter.name
        );
      }

      allTypePartIdTypePartNameMap.set(
        typeParameter.typePartId,
        typeParameter.name
      );
    }
    typePartIdTypeParameterSizeMap.set(
      typePartId,
      typePart.typeParameterList.length
    );
  }

  for (const typePart of typePartMap.values()) {
    checkTypePartBodyValidation(
      typePart.body,
      typePartIdTypeParameterSizeMap,
      new Set(
        typePart.typeParameterList.map((parameter) => parameter.typePartId)
      )
    );
  }
  return allTypePartIdTypePartNameMap;
};

const checkTypePartBodyValidation = (
  typePartBody: data.TypePartBody,
  typeIdTypeParameterSizeMap: ReadonlyMap<data.TypePartId, number>,
  typeParameterTypePartIdSet: ReadonlySet<data.TypePartId>
): void => {
  switch (typePartBody._) {
    case "Product":
      checkProductTypeValidation(
        typePartBody.memberList,
        typeIdTypeParameterSizeMap,
        typeParameterTypePartIdSet
      );
      return;
    case "Sum":
      checkSumTypeValidation(
        typePartBody.patternList,
        typeIdTypeParameterSizeMap,
        typeParameterTypePartIdSet
      );
  }
};

const checkProductTypeValidation = (
  memberList: ReadonlyArray<data.Member>,
  typeIdTypeParameterSizeMap: ReadonlyMap<data.TypePartId, number>,
  typeParameterTypePartIdSet: ReadonlySet<data.TypePartId>
): void => {
  const memberNameSet: Set<string> = new Set();
  for (const member of memberList) {
    if (memberNameSet.has(member.name)) {
      throw new Error("duplicate member name. name =" + member.name);
    }
    memberNameSet.add(member.name);

    if (!util.isFirstLowerCaseName(member.name)) {
      throw new Error("member name is invalid. name =" + member.name);
    }
    checkTypeValidation(
      member.type,
      typeIdTypeParameterSizeMap,
      typeParameterTypePartIdSet
    );
  }
};

const checkSumTypeValidation = (
  patternList: ReadonlyArray<data.Pattern>,
  typeIdTypeParameterSizeMap: ReadonlyMap<data.TypePartId, number>,
  typeParameterTypePartIdSet: ReadonlySet<data.TypePartId>
): void => {
  const tagNameSet: Set<string> = new Set();
  for (const pattern of patternList) {
    if (tagNameSet.has(pattern.name)) {
      throw new Error("duplicate tag name. name =" + pattern.name);
    }
    tagNameSet.add(pattern.name);

    if (!util.isFirstUpperCaseName(pattern.name)) {
      throw new Error("tag name is invalid. name =" + pattern.name);
    }
    if (pattern.parameter._ === "Just") {
      checkTypeValidation(
        pattern.parameter.value,
        typeIdTypeParameterSizeMap,
        typeParameterTypePartIdSet
      );
    }
  }
};

const checkTypeValidation = (
  type: data.Type,
  typeIdTypeParameterSizeMap: ReadonlyMap<data.TypePartId, number>,
  typeParameterTypePartIdSet: ReadonlySet<data.TypePartId>
): void => {
  const typeParameterSize = typeParamterCountFromTypePartId(
    type.typePartId,
    typeIdTypeParameterSizeMap,
    typeParameterTypePartIdSet
  );
  if (typeParameterSize !== type.parameter.length) {
    throw new Error(
      "type parameter size not match. type part need " +
        typeParameterSize.toString() +
        ". but use " +
        type.parameter.length.toString() +
        "parameter(s)"
    );
  }
};

const typeParamterCountFromTypePartId = (
  typePartId: data.TypePartId,
  typeIdTypeParameterSizeMap: ReadonlyMap<data.TypePartId, number>,
  typeParameterTypePartIdSet: ReadonlySet<data.TypePartId>
) => {
  const typeParameterSize = typeIdTypeParameterSizeMap.get(typePartId);
  if (typeParameterSize !== undefined) {
    return typeParameterSize;
  }
  const existTypeParamter = typeParameterTypePartIdSet.has(typePartId);
  if (existTypeParamter) {
    return 0;
  }
  throw new Error(
    "typePart (typePartId =" + (typePartId as string) + ") is not found"
  );
};

export const generateElmCodeAsString = (
  typePartMap: ReadonlyMap<data.TypePartId, data.TypePart>
): string => {
  return elmCodeGenerator.codeToString(generateElmCode(typePartMap));
};

export const generateElmCode = (
  typePartMap: ReadonlyMap<data.TypePartId, data.TypePart>
): elm.Code => {
  const allTypePartIdTypePartNameMap = checkTypePartListValidation(typePartMap);
  return {
    moduleName: "Data",
    typeDeclarationList: undefinedFlatMap([...typePartMap], ([_, typePart]) =>
      typePartToElmTypeDeclaration(typePart, allTypePartIdTypePartNameMap)
    ),
  };
};

const undefinedFlatMap = <Input, Output>(
  array: ReadonlyArray<Input>,
  func: (element: Input) => Output | undefined
) => {
  const out: Array<Output> = [];
  for (const element of array) {
    const outputElement = func(element);
    if (outputElement !== undefined) {
      out.push(outputElement);
    }
  }
  return out;
};

const typePartToElmTypeDeclaration = (
  typePart: data.TypePart,
  typePartNameMap: ReadonlyMap<data.TypePartId, string>
): elm.TypeDeclaration | undefined => {
  switch (typePart.body._) {
    case "Product":
      return elm.TypeDeclaration.TypeAlias({
        name: stringToElmTypeName(typePart.name),
        comment: typePart.description,
        export: true,
        parameter: typePart.typeParameterList.map(
          (typeParameter) => typeParameter.name
        ),
        type: elm.ElmType.Record(
          typePart.body.memberList.map(
            (member): elm.Field => ({
              name: stringToElmFiledName(member.name),
              type: definyTypeToElmType(member.type, typePartNameMap),
            })
          )
        ),
      });
    case "Sum":
      return elm.TypeDeclaration.CustomType({
        name: stringToElmTypeName(typePart.name),
        comment: typePart.description,
        export: elm.CustomTypeExportLevel.ExportTypeAndVariant,
        parameter: typePart.typeParameterList.map(
          (typeParameter) => typeParameter.name
        ),
        variantList: typePart.body.patternList.map(
          (pattern): elm.Variant => ({
            name: stringToVariantName(pattern.name),
            parameter:
              pattern.parameter._ === "Just"
                ? [
                    definyTypeToElmType(
                      pattern.parameter.value,
                      typePartNameMap
                    ),
                  ]
                : [],
          })
        ),
      });
    case "Kernel":
      return definyTypePartBodyKernelToElmType(
        typePart,
        typePart.body.typePartBodyKernel
      );
  }
};

const stringToElmTypeName = (name: string): elm.ElmTypeName => {
  const typeName = elmCodeGenerator.elmTypeNameFromString(name);
  switch (typeName._) {
    case "Just":
      return typeName.value;
    case "Nothing":
      return elmCodeGenerator.elmTypeNameFromStringOrThrow(name + "_");
  }
};

const stringToElmFiledName = (name: string): elm.FieldName => {
  const filedName = elmCodeGenerator.fieldNameFromString(name);
  switch (filedName._) {
    case "Just":
      return filedName.value;
    case "Nothing":
      return elmCodeGenerator.fieldNameFromStringOrThrow(name + "_");
  }
};

const stringToVariantName = (name: string): elm.VariantName => {
  const variantName = elmCodeGenerator.variantNameFormString(name);
  switch (variantName._) {
    case "Just":
      return variantName.value;
    case "Nothing":
      return elmCodeGenerator.variantNameFormStringOrThrow(name + "_");
  }
};

const definyTypePartBodyKernelToElmType = (
  typePart: data.TypePart,
  typePartBodyKernel: data.TypePartBodyKernel
): elm.TypeDeclaration | undefined => {
  switch (typePartBodyKernel) {
    case "Function":
    case "Int32":
    case "String":
    case "Binary":
      return;
    case "Id":
    case "Token":
      return elm.TypeDeclaration.CustomType({
        name: stringToElmTypeName(typePart.name),
        comment: typePart.description,
        export: elm.CustomTypeExportLevel.ExportTypeAndVariant,
        parameter: [],
        variantList: [
          {
            name: stringToVariantName(typePart.name),
            parameter: [elmUtil.String],
          },
        ],
      });
    case "List":
  }
};

const definyTypeToElmType = (
  type: data.Type,
  typePartNameMap: ReadonlyMap<data.TypePartId, string>
): elm.ElmType => {
  const typeName = typePartNameMap.get(type.typePartId);
  if (typeName === undefined) {
    throw new Error(
      "internal error: not found type part name in definyTypeToElmType. typePartId =" +
        (type.typePartId as string)
    );
  }

  return elm.ElmType.LocalType({
    typeName: stringToElmTypeName(typeName),
    parameter: type.parameter.map((parameter) =>
      definyTypeToElmType(parameter, typePartNameMap)
    ),
  });
};

import * as data from "../data";
import * as tag from "./tag";
import * as ts from "js-ts-code-generator/distribution/newData";
import * as typeDefinition from "./typeDefinition";
import * as util from "../util";

export const generateTypeScriptCode = (
  customTypeMap: ReadonlyMap<data.TypePartId, data.TypePart>
): ts.Code => {
  const allTypePartIdTypePartNameMap = checkTypePartListValidation(
    customTypeMap
  );
  return {
    exportDefinitionList: [
      ...typeDefinition
        .generateTypeDefinition(customTypeMap)
        .map(ts.ExportDefinition.TypeAlias),
      ...tag.generate(customTypeMap).map(ts.ExportDefinition.Variable),
    ],
    statementList: [],
  };
};

/**
 * 指定した型の定義が正しくできているか調べる
 * Elmの予約語判定はここではやらない
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
    if (!util.isValidTypePartName(typePart.name)) {
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
    checkCustomTypeBodyValidation(
      typePart.body,
      typePartIdTypeParameterSizeMap,
      new Set(
        typePart.typeParameterList.map((parameter) => parameter.typePartId)
      )
    );
  }
  return allTypePartIdTypePartNameMap;
};

const checkCustomTypeBodyValidation = (
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

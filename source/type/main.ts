import * as data from "../data";
import * as tag from "./tag";
import * as ts from "js-ts-code-generator/distribution/newData";
import * as typeDefinition from "./typeDefinition";
import * as util from "../util";
import { identifer } from "js-ts-code-generator";

export const generateTypeScriptCode = (
  customTypeMap: ReadonlyMap<data.TypePartId, data.TypePart>
): ts.Code => {
  checkTypePartListValidation(customTypeMap);
  const idOrTokenTypeNameSet = util.collectIdOrTokenTypeNameSet(customTypeMap);
  return {
    exportDefinitionList: [
      ...typeDefinition
        .generateTypeDefinition(customTypeMap, idOrTokenTypeNameSet)
        .map(ts.ExportDefinition.TypeAlias),
      ...tag
        .generate(customTypeMap, idOrTokenTypeNameSet)
        .map(ts.ExportDefinition.Variable),
    ],
    statementList: [],
  };
};

/**
 * 指定した型の定義が正しくできているか調べる
 * Elmの予約語判定はここではやらない
 * @throws 型の定義が正しくできていない場合
 */
const checkTypePartListValidation = (
  typePartMap: ReadonlyMap<data.TypePartId, data.TypePart>
): ReadonlyMap<data.TypePartId, ts.Type> => {
  const typeNameSet = new Set<string>();
  const typeIdTsTypeMap = new Map<data.TypePartId, ts.Type>();
  const typeIdTypeParameterSizeMap = new Map<data.TypePartId, number>();
  for (const [typePartId, typePart] of typePartMap) {
    if (!util.isValidTypePartName(typePart.name)) {
      throw new Error("custom type name is invalid. name = " + typePart.name);
    }
    if (typeNameSet.has(typePart.name)) {
      throw new Error("duplicate custom type name. name =" + typePart.name);
    }
    typeNameSet.add(typePart.name);

    const typeParameterNameSet: Set<string> = new Set();
    for (const typeParameter of typePart.typeParameterList) {
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
    }
    typeIdTsTypeMap.set(
      typePartId,
      ts.Type.ScopeInFile(identifer.fromString(typePart.name))
    );
    typeIdTypeParameterSizeMap.set(
      typePartId,
      typePart.typeParameterList.length
    );
  }

  for (const [typePartId, typePart] of typePartMap) {
    checkCustomTypeBodyValidation(typePart.body, typeIdTypeParameterSizeMap);
  }

  return typeIdTsTypeMap;
};

const checkCustomTypeBodyValidation = (
  typePartBody: data.TypePartBody,
  typeIdTypeParameterSizeMap: ReadonlyMap<data.TypePartId, number>
): void => {
  switch (typePartBody._) {
    case "Product":
      checkProductTypeValidation(
        typePartBody.memberList,
        typeIdTypeParameterSizeMap
      );
      return;
    case "Sum":
      checkSumTypeValidation(
        typePartBody.patternList,
        typeIdTypeParameterSizeMap
      );
  }
};

const checkProductTypeValidation = (
  memberList: ReadonlyArray<data.Member>,
  typeIdTypeParameterSizeMap: ReadonlyMap<data.TypePartId, number>
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
    checkTypeValidation(member.type, typeIdTypeParameterSizeMap);
  }
};

const checkSumTypeValidation = (
  patternList: ReadonlyArray<data.Pattern>,
  typeIdTypeParameterSizeMap: ReadonlyMap<data.TypePartId, number>
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
      checkTypeValidation(pattern.parameter.value, typeIdTypeParameterSizeMap);
    }
  }
};

const checkTypeValidation = (
  type: data.Type,
  typeIdTypeParameterSizeMap: ReadonlyMap<data.TypePartId, number>
): void => {
  const typeParameterSize = typeIdTypeParameterSizeMap.get(type.typePartId);
  if (typeParameterSize === undefined) {
    throw new Error(
      "typePart (typePartId =" + (type.typePartId as string) + ") is not found"
    );
  }
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

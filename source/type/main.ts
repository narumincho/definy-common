import * as data from "../data";
import * as tag from "./tag";
import * as ts from "js-ts-code-generator/distribution/newData";
import * as typeDefinition from "./typeDefinition";
import * as util from "./util";

export { data };

export const generateTypeScriptCode = (
  customTypeList: ReadonlyArray<data.TypePart>
): ts.Code => {
  checkTypePartListValidation(customTypeList);
  const idOrTokenTypeNameSet = util.collectIdOrTokenTypeNameSet(customTypeList);
  return {
    exportDefinitionList: [
      ...typeDefinition
        .generateTypeDefinition(customTypeList, idOrTokenTypeNameSet)
        .map(ts.ExportDefinition.TypeAlias),
      ...tag
        .generate(customTypeList, idOrTokenTypeNameSet)
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
  typePartList: ReadonlyArray<data.TypePart>
): void => {
  const typePartNameAndTypeParameterListMap: Map<
    string,
    Set<string>
  > = new Map();
  for (const typePart of typePartList) {
    if (!util.isFirstUpperCaseName(typePart.name)) {
      throw new Error("custom type name is invalid. name = " + typePart.name);
    }
    if (typePartNameAndTypeParameterListMap.has(typePart.name)) {
      throw new Error("duplicate custom type name. name =" + typePart.name);
    }

    const typeParameterSet: Set<string> = new Set();
    for (const typeParameter of typePart.typeParameterList) {
      if (typeParameterSet.has(typeParameter)) {
        throw new Error(
          "duplicate type parameter name. name =" + typeParameter
        );
      }
      typeParameterSet.add(typeParameter);
      if (!util.isFirstLowerCaseName(typeParameter)) {
        throw new Error(
          "type parameter name is invalid. name =" + typeParameter
        );
      }
    }
    typePartNameAndTypeParameterListMap.set(typePart.name, typeParameterSet);
  }

  for (const typePart of typePartList) {
    const scopedTypeParameterList = typePartNameAndTypeParameterListMap.get(
      typePart.name
    );
    if (scopedTypeParameterList === undefined) {
      throw new Error("internal error. fail collect custom type");
    }

    checkCustomTypeBodyValidation(
      typePart.body,
      typePartNameAndTypeParameterListMap,
      scopedTypeParameterList
    );
  }
};

const checkCustomTypeBodyValidation = (
  typePartBody: data.TypePartBody,
  customTypeNameAndTypeParameterListMap: Map<string, Set<string>>,
  scopedTypeParameterList: Set<string>
): void => {
  switch (typePartBody._) {
    case "Product":
      checkProductTypeValidation(
        typePartBody.memberList,
        customTypeNameAndTypeParameterListMap,
        scopedTypeParameterList
      );
      return;
    case "Sum":
      checkSumTypeValidation(
        typePartBody.patternList,
        customTypeNameAndTypeParameterListMap,
        scopedTypeParameterList
      );
  }
};

const checkProductTypeValidation = (
  memberList: ReadonlyArray<data.Member>,
  customTypeNameAndTypeParameterListMap: Map<string, Set<string>>,
  scopedTypeParameterList: Set<string>
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
      customTypeNameAndTypeParameterListMap,
      scopedTypeParameterList
    );
  }
};

const checkSumTypeValidation = (
  patternList: ReadonlyArray<data.Pattern>,
  customTypeNameAndTypeParameterListMap: Map<string, Set<string>>,
  scopedTypeParameterList: Set<string>
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
        customTypeNameAndTypeParameterListMap,
        scopedTypeParameterList
      );
    }
  }
};

const checkTypeValidation = (
  type_: data.Type,
  customTypeNameAndTypeParameterMap: Map<string, Set<string>>,
  scopedTypeParameterList: Set<string>
): void => {};

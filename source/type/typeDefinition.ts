import * as codec from "./kernel/codec";
import * as data from "../data";
import * as hexString from "./kernel/hexString";
import * as maybe from "./kernel/maybe";
import * as result from "./kernel/result";
import * as ts from "js-ts-code-generator/distribution/newData";
import * as util from "./util";
import { identifer } from "js-ts-code-generator";

export const generateTypeDefinition = (
  customTypeList: ReadonlyArray<data.NCustomTypeDefinition>,
  idOrTokenTypeNameSet: util.IdAndTokenNameSet
): ReadonlyArray<ts.TypeAlias> => {
  return [
    codec.codecTypeDefinition(),
    customTypeToDefinition(maybe.customTypeDefinition),
    customTypeToDefinition(result.customTypeDefinition),
    ...customTypeList.map(customTypeToDefinition),
    ...[...idOrTokenTypeNameSet.id, ...idOrTokenTypeNameSet.token].map(
      hexString.typeDefinition
    ),
  ];
};

/*
 * ========================================
 *             Custom Type
 * ========================================
 */

export const customTypeToDefinition = (
  customType: data.NCustomTypeDefinition
): ts.TypeAlias => ({
  name: identifer.fromString(customType.name),
  document: customType.description,
  typeParameterList: customType.typeParameterList.map(identifer.fromString),
  type: customTypeDefinitionBodyToTsType(customType.body),
});

const customTypeDefinitionBodyToTsType = (
  body: data.NCustomTypeDefinitionBody
): ts.Type => {
  switch (body._) {
    case "Sum":
      if (util.isTagTypeAllNoParameter(body.nPatternList)) {
        return ts.Type.Union(
          body.nPatternList.map((pattern) =>
            ts.Type.StringLiteral(pattern.name)
          )
        );
      }
      return ts.Type.Union(
        body.nPatternList.map((pattern) => patternListToObjectType(pattern))
      );
    case "Product":
      return ts.Type.Object(
        body.nMemberList.map((member) => ({
          name: member.name,
          required: true,
          type: util.typeToTypeScriptType(member.type),
          document: member.description,
        }))
      );
  }
};

const patternListToObjectType = (patternList: data.NPattern): ts.Type => {
  const tagField: ts.MemberType = {
    name: "_",
    required: true,
    document: "",
    type: ts.Type.StringLiteral(patternList.name),
  };

  switch (patternList.parameter._) {
    case "Just":
      return ts.Type.Object([
        tagField,
        {
          name: util.typeToMemberOrParameterName(patternList.parameter.value),
          required: true,
          document: "",
          type: util.typeToTypeScriptType(patternList.parameter.value),
        },
      ]);
    case "Nothing":
      return ts.Type.Object([tagField]);
  }
};

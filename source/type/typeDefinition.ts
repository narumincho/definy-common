import * as codec from "./kernel/codec";
import * as data from "../data";
import * as hexString from "./kernel/hexString";
import * as maybe from "./kernel/maybe";
import * as result from "./kernel/result";
import * as ts from "js-ts-code-generator/distribution/newData";
import * as util from "./util";
import { identifer } from "js-ts-code-generator";

export const generateTypeDefinition = (
  typePartList: ReadonlyArray<data.TypePart>,
  idOrTokenTypeNameSet: util.IdAndTokenNameSet
): ReadonlyArray<ts.TypeAlias> => {
  return [
    codec.codecTypeDefinition(),
    typePartToDefinition(maybe.customTypeDefinition),
    typePartToDefinition(result.customTypeDefinition),
    ...typePartList.map(typePartToDefinition),
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

export const typePartToDefinition = (
  typePart: data.TypePart
): ts.TypeAlias => ({
  name: identifer.fromString(typePart.name),
  document: typePart.description,
  typeParameterList: typePart.typeParameterList.map(identifer.fromString),
  type: customTypeDefinitionBodyToTsType(typePart.body),
});

const customTypeDefinitionBodyToTsType = (body: data.TypePartBody): ts.Type => {
  switch (body._) {
    case "Sum":
      if (util.isTagTypeAllNoParameter(body.patternList)) {
        return ts.Type.Union(
          body.patternList.map((pattern) => ts.Type.StringLiteral(pattern.name))
        );
      }
      return ts.Type.Union(
        body.patternList.map((pattern) => patternListToObjectType(pattern))
      );
    case "Product":
      return ts.Type.Object(
        body.memberList.map((member) => ({
          name: member.name,
          required: true,
          type: util.typeToTypeScriptType(member.type),
          document: member.description,
        }))
      );
  }
};

const patternListToObjectType = (patternList: data.Pattern): ts.Type => {
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

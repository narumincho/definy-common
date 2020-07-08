import * as codec from "./kernel/codec";
import * as data from "../data";
import * as hexString from "./kernel/hexString";
import * as maybe from "./kernel/maybe";
import * as result from "./kernel/result";
import * as ts from "js-ts-code-generator/distribution/newData";
import * as tsUtil from "js-ts-code-generator/distribution/data";
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
  typeParameterList: typePart.typeParameterList.map((typeParameter) =>
    identifer.fromString(typeParameter.name)
  ),
  type: customTypeDefinitionBodyToTsType(typePart),
});

const customTypeDefinitionBodyToTsType = (typePart: data.TypePart): ts.Type => {
  if (typePart.attribute._ === "Just") {
    typePartWIthAttributeToTsType(typePart, typePart.attribute.value);
  }
  switch (typePart.body._) {
    case "Sum":
      if (util.isTagTypeAllNoParameter(typePart.body.patternList)) {
        return ts.Type.Union(
          typePart.body.patternList.map((pattern) =>
            ts.Type.StringLiteral(pattern.name)
          )
        );
      }
      return ts.Type.Union(
        typePart.body.patternList.map((pattern) =>
          patternListToObjectType(pattern)
        )
      );
    case "Product":
      return ts.Type.Object(
        typePart.body.memberList.map((member) => ({
          name: member.name,
          required: true,
          type: util.typeToTypeScriptType(member.type),
          document: member.description,
        }))
      );
    case "Kernel":
      return typePartBodyKernelToTsType(
        typePart,
        typePart.body.typePartBodyKernel
      );
  }
};

/**
 * コンパイラに向けた属性付きのDefinyの型をTypeScriptの型に変換する
 * @param typeAttribute
 */
const typePartWIthAttributeToTsType = (
  typePart: data.TypePart,
  typeAttribute: data.TypeAttribute
): ts.Type => {
  switch (typeAttribute) {
    case "AsArray":
      if (typePart.typeParameterList.length !== 1) {
        throw new Error(
          "attribute == Just(AsArray) type part need one type parameter"
        );
      }
      return tsUtil.readonlyArrayType(
        ts.Type.ScopeInFile(
          identifer.fromString(typePart.typeParameterList[0].name)
        )
      );
    case "AsBoolean":
      if (typePart.body._ !== "Sum" || typePart.body.patternList.length !== 2) {
        throw new Error(
          "attribute == Just(AsBoolean) type part need sum and have 2 patterns"
        );
      }
      return ts.Type.Boolean;
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

const typePartBodyKernelToTsType = (
  typePart: data.TypePart,
  kernel: data.TypePartBodyKernel
): ts.Type => {
  switch (kernel) {
    case "Function":
      if (typePart.typeParameterList.length !== 2) {
        throw new Error("kernel function type need 2 type parameter");
      }
      return ts.Type.Function({
        parameterList: [
          ts.Type.ScopeInFile(
            identifer.fromString(typePart.typeParameterList[0].name)
          ),
        ],
        return: ts.Type.ScopeInFile(
          identifer.fromString(typePart.typeParameterList[1].name)
        ),
        typeParameterList: [],
      });
    case "Int32":
      return ts.Type.Intersection({
        left: ts.Type.Number,
        right: ts.Type.Object([
          { name: "_int32", required: true, type: ts.Type.Never, document: "" },
        ]),
      });
    case "String":
      return ts.Type.String;
    case "Binary":
      return tsUtil.uint8ArrayType;
    case "Id":
    case "Token":
      return ts.Type.Intersection({
        left: ts.Type.String,
        right: ts.Type.Object([
          {
            name: "_" + util.firstLowerCase(typePart.name),
            required: true,
            type: ts.Type.Never,
            document: "",
          },
        ]),
      });
  }
};

import * as binary from "./kernelType/binary";
import * as codec from "./kernelType/codec";
import * as d from "./data";
import * as dict from "./kernelType/dict";
import * as hexString from "./kernelType/hexString";
import * as identifer from "js-ts-code-generator/identifer";
import * as int32 from "./kernelType/int32";
import * as kernelString from "./kernelType/string";
import * as list from "./kernelType/list";

export const encodeDefinitionStatementList = (
  typeName: string,
  typeParameter: ReadonlyArray<d.TypeParameter>,
  kernel: d.TypePartBodyKernel,
  valueVar: d.TsExpr
): ReadonlyArray<d.Statement> => {};

export const decodeStatementList = (
  typeName: string,
  typeParameter: ReadonlyArray<d.TypeParameter>,
  typePartBodyKernel: d.TypePartBodyKernel,
  parameterIndex: d.Expr,
  parameterBinary: d.Expr
): ReadonlyArray<d.Statement> => {
  switch (typePartBodyKernel) {
    case "Function":
      throw new Error("cannot decode function");
    case "Int32":
      return int32.decodeDefinitionStatementList(
        parameterIndex,
        parameterBinary
      );
    case "String":
      return kernelString.decodeDefinitionStatementList(
        parameterIndex,
        parameterBinary
      );
    case "Binary":
      return binary.decodeDefinitionStatementList(
        parameterIndex,
        parameterBinary
      );
    case "Id":
      return hexString.idDecodeDefinitionStatementList(
        typePart.name,
        parameterIndex,
        parameterBinary
      );
    case "Token":
      return hexString.tokenDecodeDefinitionStatementList(
        typePart.name,
        parameterIndex,
        parameterBinary
      );
    case "List": {
      const [elementType] = typePart.typeParameterList;
      if (elementType === undefined) {
        throw new Error("List type need one type paramter");
      }
      return list.decodeDefinitionStatementList(
        elementType.name,
        parameterIndex,
        parameterBinary
      );
    }
    case "Dict": {
      const [key, value] = typePart.typeParameterList;
      if (key === undefined || value === undefined) {
        throw new Error("Dict need 2 type parameters");
      }
      return dict.decodeDefinitionStatementList(
        key.name,
        value.name,
        parameterIndex,
        parameterBinary
      );
    }
  }
};

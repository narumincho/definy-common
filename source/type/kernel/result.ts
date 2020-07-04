import * as ts from "js-ts-code-generator/distribution/newData";
import {
  Maybe,
  NCustomTypeDefinition,
  NCustomTypeDefinitionBody,
  NType,
} from "../../data";
import { identifer } from "js-ts-code-generator";

const name = "Result";

export const type = (okType: ts.Type, errorType: ts.Type): ts.Type =>
  ts.Type.WithTypeParameter({
    type: ts.Type.ScopeInFile(identifer.fromString(name)),
    typeParameterList: [okType, errorType],
  });

export const customTypeDefinition: NCustomTypeDefinition = {
  name,
  description:
    "成功と失敗を表す型. Elmに標準で定義されているものに変換をするためにデフォルトで用意した",
  typeParameterList: ["ok", "error"],
  body: NCustomTypeDefinitionBody.Sum([
    {
      name: "Ok",
      description: "成功",
      parameter: Maybe.Just(NType.Parameter("ok")),
    },
    {
      name: "Error",
      description: "失敗",
      parameter: Maybe.Just(NType.Parameter("error")),
    },
  ]),
};

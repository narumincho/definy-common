import * as c from "./codec";
import * as int32 from "./int32";
import * as ts from "js-ts-code-generator/distribution/newData";
import * as util from "../util";
import {
  Maybe,
  TypePart,
  TypePartBody,
  TypePartBodyKernel,
  TypePartId,
} from "../data";
import { identifer, data as tsUtil } from "js-ts-code-generator";

export const typePartId = "743d625544767e750c453fa344194599" as TypePartId;

export const typePart: TypePart = {
  name: "Binary",
  migrationPartId: Maybe.Nothing(),
  description:
    "バイナリ. JavaScriptのUint8Arrayで扱える. 最初にLED128でバイト数, その次にバイナリそのまま",
  projectId: util.definyCodeProjectId,
  createSuggestionId: util.codeSuggestionId,
  getTime: { day: 0, millisecond: 0 },
  attribute: Maybe.Nothing(),
  typeParameterList: [],
  body: TypePartBody.Kernel(TypePartBodyKernel.Binary),
};

export const encodeDefinitionStatementList = (
  valueVar: ts.Expr
): ReadonlyArray<ts.Statement> => [
  ts.Statement.Return(
    tsUtil.callMethod(int32.encode(tsUtil.get(valueVar, "length")), "concat", [
      ts.Expr.ArrayLiteral([{ expr: valueVar, spread: true }]),
    ])
  ),
];

export const decodeDefinitionStatementList = (
  parameterIndex: ts.Expr,
  parameterBinary: ts.Expr
): ReadonlyArray<ts.Statement> => {
  const lengthName = identifer.fromString("length");
  const lengthVar = ts.Expr.Variable(lengthName);
  const nextIndexName = identifer.fromString("nextIndex");
  const nextIndexVar = ts.Expr.Variable(nextIndexName);

  return [
    ts.Statement.VariableDefinition({
      isConst: true,
      name: lengthName,
      type: c.decodeReturnType(ts.Type.Number),
      expr: int32.decode(parameterIndex, parameterBinary),
    }),
    ts.Statement.VariableDefinition({
      isConst: true,
      name: nextIndexName,
      type: ts.Type.Number,
      expr: tsUtil.addition(c.getNextIndex(lengthVar), c.getResult(lengthVar)),
    }),
    c.returnStatement(
      tsUtil.callMethod(parameterBinary, "slice", [
        c.getNextIndex(lengthVar),
        nextIndexVar,
      ]),
      nextIndexVar
    ),
  ];
};

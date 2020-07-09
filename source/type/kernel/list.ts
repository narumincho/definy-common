import * as c from "./codec";
import * as int32 from "./int32";
import * as ts from "js-ts-code-generator/distribution/newData";
import * as util from "../../util";
import {
  Maybe,
  TypePart,
  TypePartBody,
  TypePartBodyKernel,
  TypePartId,
} from "../../data";
import { identifer, data as tsUtil } from "js-ts-code-generator";

const elementTypeName = "element";
const elementCodecName = identifer.fromString("elementCodec");
const elementCodecVar = ts.Expr.Variable(elementCodecName);

export const name = identifer.fromString("List");

export const typePartId = "d7a1efe440138793962eed5625de8196" as TypePartId;

export const typePart: TypePart = {
  name: "List",
  migrationPartId: Maybe.Nothing(),
  description: "リスト. JavaScriptのArrayで扱う",
  projectId: util.definyCodeProjectId,
  createSuggestionId: util.codeSuggestionId,
  getTime: { day: 0, millisecond: 0 },
  attribute: Maybe.Nothing(),
  typeParameterList: [
    {
      name: elementTypeName,
      typePartId: "cf95a75adf60a7eecabe7d0b4c3e68cd" as TypePartId,
    },
  ],
  body: TypePartBody.Kernel(TypePartBodyKernel.List),
};

export const type = (element: ts.Type): ts.Type =>
  tsUtil.readonlyArrayType(element);

export const encodeDefinitionStatementList = (
  valueVar: ts.Expr
): ReadonlyArray<ts.Statement> => {
  const resultName = identifer.fromString("result");
  const elementName = identifer.fromString("element");
  return [
    ts.Statement.VariableDefinition({
      isConst: false,
      name: resultName,
      type: tsUtil.arrayType(ts.Type.Number),
      expr: ts.Expr.TypeAssertion({
        expr: int32.encode(tsUtil.get(valueVar, "length")),
        type: tsUtil.arrayType(ts.Type.Number),
      }),
    }),
    ts.Statement.ForOf({
      elementVariableName: elementName,
      iterableExpr: valueVar,
      statementList: [
        ts.Statement.Set({
          target: ts.Expr.Variable(resultName),
          operatorMaybe: ts.Maybe.Nothing(),
          expr: tsUtil.callMethod(ts.Expr.Variable(resultName), "concat", [
            ts.Expr.Call({
              expr: tsUtil.get(elementCodecVar, util.encodePropertyName),
              parameterList: [ts.Expr.Variable(elementName)],
            }),
          ]),
        }),
      ],
    }),
    ts.Statement.Return(ts.Expr.Variable(resultName)),
  ];
};

export const decodeDefinitionStatementList = (
  parameterIndex: ts.Expr,
  parameterBinary: ts.Expr
): ReadonlyArray<ts.Statement> => {
  const elementTypeVar = ts.Type.ScopeInFile(
    identifer.fromString(elementTypeName)
  );
  const resultName = identifer.fromString("result");
  const resultVar = ts.Expr.Variable(resultName);
  const lengthResultName = identifer.fromString("lengthResult");
  const lengthResultVar = ts.Expr.Variable(lengthResultName);
  const resultAndNextIndexName = identifer.fromString("resultAndNextIndex");
  const resultAndNextIndexVar = ts.Expr.Variable(resultAndNextIndexName);
  const nextIndexName = identifer.fromString("nextIndex");
  const nextIndexVar = ts.Expr.Variable(nextIndexName);

  return [
    ts.Statement.VariableDefinition({
      isConst: true,
      name: lengthResultName,
      type: c.decodeReturnType(ts.Type.Number),
      expr: int32.decode(parameterIndex, parameterBinary),
    }),
    ts.Statement.VariableDefinition({
      isConst: false,
      name: nextIndexName,
      type: ts.Type.Number,
      expr: c.getNextIndex(lengthResultVar),
    }),
    ts.Statement.VariableDefinition({
      isConst: true,
      name: resultName,
      type: tsUtil.arrayType(elementTypeVar),
      expr: ts.Expr.ArrayLiteral([]),
    }),
    ts.Statement.For({
      counterVariableName: identifer.fromString("i"),
      untilExpr: c.getResult(lengthResultVar),
      statementList: [
        ts.Statement.VariableDefinition({
          isConst: true,
          name: resultAndNextIndexName,
          type: c.decodeReturnType(elementTypeVar),
          expr: ts.Expr.Call({
            expr: tsUtil.get(elementCodecVar, util.decodePropertyName),
            parameterList: [nextIndexVar, parameterBinary],
          }),
        }),
        ts.Statement.EvaluateExpr(
          tsUtil.callMethod(resultVar, "push", [
            c.getResult(resultAndNextIndexVar),
          ])
        ),
        ts.Statement.Set({
          target: nextIndexVar,
          operatorMaybe: ts.Maybe.Nothing(),
          expr: c.getNextIndex(resultAndNextIndexVar),
        }),
      ],
    }),
    c.returnStatement(resultVar, nextIndexVar),
  ];
};

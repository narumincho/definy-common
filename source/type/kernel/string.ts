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

export const name = identifer.fromString("String");

export const type = ts.Type.String;

export const codec = (): ts.Expr =>
  tsUtil.get(ts.Expr.Variable(name), util.codecPropertyName);

export const typePartId = "f1f830d23ffab8cec4d0191d157b9fc4" as TypePartId;

export const typePart: TypePart = {
  name: "String",
  migrationPartId: Maybe.Nothing(),
  description:
    "文字列. JavaScriptのstringで扱う. バイナリ形式はUTF-8. 不正な文字が入っている可能性がある",
  projectId: util.definyCodeProjectId,
  createSuggestionId: util.codeSuggestionId,
  getTime: { day: 0, millisecond: 0 },
  attribute: Maybe.Nothing(),
  typeParameterList: [],
  body: TypePartBody.Kernel(TypePartBodyKernel.String),
};

const globalProcess = ts.Expr.GlobalObjects(identifer.fromString("process"));

export const encodeDefinitionStatementList = (
  valueVar: ts.Expr
): ReadonlyArray<ts.Statement> => {
  const resultName = identifer.fromString("result");
  const resultVar = ts.Expr.Variable(resultName);

  return [
    ts.Statement.VariableDefinition({
      isConst: true,
      name: resultName,
      type: tsUtil.readonlyArrayType(ts.Type.Number),
      expr: ts.Expr.ArrayLiteral([
        {
          expr: tsUtil.callMethod(
            ts.Expr.New({
              expr: ts.Expr.ConditionalOperator({
                condition: tsUtil.logicalOr(
                  tsUtil.equal(globalProcess, ts.Expr.UndefinedLiteral),
                  tsUtil.equal(
                    tsUtil.get(globalProcess, "title"),
                    ts.Expr.StringLiteral("browser")
                  )
                ),
                thenExpr: ts.Expr.GlobalObjects(
                  identifer.fromString("TextEncoder")
                ),
                elseExpr: ts.Expr.ImportedVariable({
                  moduleName: "util",
                  name: identifer.fromString("TextEncoder"),
                }),
              }),
              parameterList: [],
            }),
            util.encodePropertyName,
            [valueVar]
          ),
          spread: true,
        },
      ]),
    }),
    ts.Statement.Return(
      tsUtil.callMethod(
        int32.encode(tsUtil.get(resultVar, "length")),
        "concat",
        [resultVar]
      )
    ),
  ];
};

export const decodeDefinitionStatementList = (
  parameterIndex: ts.Expr,
  parameterBinary: ts.Expr
): ReadonlyArray<ts.Statement> => {
  const lengthName = identifer.fromString("length");
  const lengthVar = ts.Expr.Variable(lengthName);
  const nextIndexName = identifer.fromString("nextIndex");
  const nextIndexVar = ts.Expr.Variable(nextIndexName);
  const textBinaryName = identifer.fromString("textBinary");
  const textBinaryVar = ts.Expr.Variable(textBinaryName);
  const isBrowserName = identifer.fromString("isBrowser");

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
    ts.Statement.VariableDefinition({
      isConst: true,
      name: textBinaryName,
      type: tsUtil.uint8ArrayType,
      expr: tsUtil.callMethod(parameterBinary, "slice", [
        c.getNextIndex(lengthVar),
        nextIndexVar,
      ]),
    }),
    ts.Statement.VariableDefinition({
      isConst: true,
      name: isBrowserName,
      type: ts.Type.Boolean,
      expr: tsUtil.logicalOr(
        tsUtil.equal(globalProcess, ts.Expr.UndefinedLiteral),
        tsUtil.equal(
          tsUtil.get(globalProcess, "title"),
          ts.Expr.StringLiteral("browser")
        )
      ),
    }),
    ts.Statement.If({
      condition: ts.Expr.Variable(isBrowserName),
      thenStatementList: [
        c.returnStatement(
          tsUtil.callMethod(
            ts.Expr.New({
              expr: ts.Expr.GlobalObjects(identifer.fromString("TextDecoder")),
              parameterList: [],
            }),
            "decode",
            [textBinaryVar]
          ),
          nextIndexVar
        ),
      ],
    }),
    c.returnStatement(
      tsUtil.callMethod(
        ts.Expr.New({
          expr: ts.Expr.ImportedVariable({
            moduleName: "util",
            name: identifer.fromString("TextDecoder"),
          }),
          parameterList: [],
        }),
        "decode",
        [textBinaryVar]
      ),
      nextIndexVar
    ),
  ];
};

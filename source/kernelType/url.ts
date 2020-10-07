import * as c from "./codec";
import * as data from "../data";
import * as identifer from "js-ts-code-generator/source/identifer";
import * as string from "./string";
import * as ts from "js-ts-code-generator/source/data";
import * as tsUtil from "js-ts-code-generator/source/util";
import * as util from "../util";

export const name = identifer.fromString("Url");

export const type = ts.Type.ScopeInGlobal(name);

export const encodeDefinitionStatementList = (
  valueVar: ts.Expr
): ReadonlyArray<ts.Statement> => {
  return [
    ts.Statement.Return(
      tsUtil.callMethod(string.codec(), util.encodePropertyName, [
        tsUtil.callMethod(valueVar, "toString", []),
      ])
    ),
  ];
};

export const decodeDefinitionStatementList = (
  parameterIndex: ts.Expr,
  parameterBinary: ts.Expr
): ReadonlyArray<ts.Statement> => {
  const resultAndNextIndexAsStringName = identifer.fromString(
    "resultAndNextIndexAsString"
  );
  const resultAndNextIndexAsStringVar = ts.Expr.Variable(
    resultAndNextIndexAsStringName
  );
  return [
    ts.Statement.VariableDefinition({
      isConst: true,
      name: resultAndNextIndexAsStringName,
      type: c.decodeReturnType(string.type),
      expr: tsUtil.callMethod(string.codec(), util.decodePropertyName, [
        parameterIndex,
        parameterBinary,
      ]),
    }),
    c.returnStatement(
      ts.Expr.New({
        expr: ts.Expr.GlobalObjects(identifer.fromString("URL")),
        parameterList: [c.getResult(resultAndNextIndexAsStringVar)],
      }),
      c.getNextIndex(resultAndNextIndexAsStringVar)
    ),
  ];
};

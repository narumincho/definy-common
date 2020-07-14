import * as codec from "./codec";
import * as ts from "js-ts-code-generator/distribution/newData";
import * as util from "../util";
import { identifer, data as tsUtil } from "js-ts-code-generator";

const encodeDefinition = (
  byteSize: number,
  functionName: ts.Identifer,
  document: string
): ts.Function => {
  const valueName = identifer.fromString("value");
  const valueVar = ts.Expr.Variable(valueName);
  const resultName = identifer.fromString("result");
  const resultVar = ts.Expr.Variable(resultName);
  const iName = identifer.fromString("i");
  const iVar = ts.Expr.Variable(iName);

  return {
    name: functionName,
    document,
    typeParameterList: [],
    returnType: codec.encodeReturnType,
    parameterList: [
      {
        name: valueName,
        document: "",
        type: ts.Type.String,
      },
    ],
    statementList: [
      ts.Statement.VariableDefinition({
        isConst: true,
        name: resultName,
        type: tsUtil.arrayType(ts.Type.Number),
        expr: ts.Expr.ArrayLiteral([]),
      }),
      ts.Statement.For({
        counterVariableName: iName,
        untilExpr: ts.Expr.NumberLiteral(byteSize),
        statementList: [
          ts.Statement.Set({
            target: ts.Expr.Get({ expr: resultVar, propertyExpr: iVar }),
            operatorMaybe: ts.Maybe.Nothing(),
            expr: tsUtil.callNumberMethod("parseInt", [
              tsUtil.callMethod(valueVar, "slice", [
                tsUtil.multiplication(iVar, ts.Expr.NumberLiteral(2)),
                tsUtil.addition(
                  tsUtil.multiplication(iVar, ts.Expr.NumberLiteral(2)),
                  ts.Expr.NumberLiteral(2)
                ),
              ]),
              ts.Expr.NumberLiteral(16),
            ]),
          }),
        ],
      }),
      ts.Statement.Return(resultVar),
    ],
  };
};

const decodeDefinition = (
  byteSize: number,
  functionName: ts.Identifer,
  document: string
): ts.Function => {
  const parameterIndex = ts.Expr.Variable(codec.indexIdentifer);
  const parameterBinary = ts.Expr.Variable(codec.binaryIdentifer);
  return {
    name: functionName,
    document,
    typeParameterList: [],
    returnType: codec.decodeReturnType(ts.Type.String),
    parameterList: codec.decodeParameterList,
    statementList: [
      codec.returnStatement(
        tsUtil.callMethod(
          tsUtil.callMethod(
            ts.Expr.ArrayLiteral([
              {
                expr: tsUtil.callMethod(parameterBinary, "slice", [
                  parameterIndex,
                  tsUtil.addition(
                    parameterIndex,
                    ts.Expr.NumberLiteral(byteSize)
                  ),
                ]),
                spread: true,
              },
            ]),
            "map",
            [
              ts.Expr.Lambda({
                typeParameterList: [],
                parameterList: [
                  {
                    name: identifer.fromString("n"),
                    type: ts.Type.Number,
                  },
                ],
                returnType: ts.Type.String,
                statementList: [
                  ts.Statement.Return(
                    tsUtil.callMethod(
                      tsUtil.callMethod(
                        ts.Expr.Variable(identifer.fromString("n")),
                        "toString",
                        [ts.Expr.NumberLiteral(16)]
                      ),
                      "padStart",
                      [ts.Expr.NumberLiteral(2), ts.Expr.StringLiteral("0")]
                    )
                  ),
                ],
              }),
            ]
          ),
          "join",
          [ts.Expr.StringLiteral("")]
        ),

        tsUtil.addition(parameterIndex, ts.Expr.NumberLiteral(byteSize))
      ),
    ],
  };
};

const idByteSize = 16;
const tokenByteSize = 32;

const encodeIdIdentifer = identifer.fromString("encodeId");
const encodeIdVariable = ts.Expr.Variable(encodeIdIdentifer);
export const encodeIdFunction: ts.Function = encodeDefinition(
  idByteSize,
  encodeIdIdentifer,
  "UserId, ProjectIdなどのIdをバイナリ形式にエンコードする"
);

const encodeTokenIdentifer = identifer.fromString("encodeToken");
const encodeTokenVariable = ts.Expr.Variable(encodeTokenIdentifer);
export const tokenEncodeFunction: ts.Function = encodeDefinition(
  tokenByteSize,
  encodeTokenIdentifer,
  "ImageTokenなどのTokenをバイナリ形式にエンコードする"
);

const decodeIdIdentifer = identifer.fromString("decodeId");
const decodeIdVariable = ts.Expr.Variable(decodeIdIdentifer);
export const idDecodeFunction: ts.Function = decodeDefinition(
  idByteSize,
  decodeIdIdentifer,
  "バイナリ形式をUserId, ProjectIdなどのIdにデコードする"
);

const decodeTokenIdentifer = identifer.fromString("decodeToken");
const decodeTokenVariable = ts.Expr.Variable(decodeTokenIdentifer);
export const decodeTokenFunction: ts.Function = decodeDefinition(
  tokenByteSize,
  decodeTokenIdentifer,
  "バイナリ形式をImageTokenなどのTokenにエンコードする"
);

export const idEncodeDefinitionStatementList = (
  valueVar: ts.Expr
): ReadonlyArray<ts.Statement> => [
  ts.Statement.Return(
    ts.Expr.Call({
      expr: encodeIdVariable,
      parameterList: [valueVar],
    })
  ),
];

export const idDecodeDefinitionStatementList = (
  typePartName: string,
  parameterIndex: ts.Expr,
  parameterBinary: ts.Expr
): ReadonlyArray<ts.Statement> => {
  const targetType = ts.Type.ScopeInFile(identifer.fromString(typePartName));
  return [
    ts.Statement.Return(
      ts.Expr.TypeAssertion({
        expr: ts.Expr.Call({
          expr: decodeIdVariable,
          parameterList: [parameterIndex, parameterBinary],
        }),
        type: codec.decodeReturnType(targetType),
      })
    ),
  ];
};

export const tokenEncodeDefinitionStatementList = (
  valueVar: ts.Expr
): ReadonlyArray<ts.Statement> => [
  ts.Statement.Return(
    ts.Expr.Call({
      expr: ts.Expr.Call({
        expr: encodeTokenVariable,
        parameterList: [valueVar],
      }),
      parameterList: [valueVar],
    })
  ),
];

export const tokenDecodeDefinitionStatementList = (
  typePartName: string,
  parameterIndex: ts.Expr,
  parameterBinary: ts.Expr
): ReadonlyArray<ts.Statement> => {
  const targetType = ts.Type.ScopeInFile(identifer.fromString(typePartName));
  return [
    ts.Statement.Return(
      ts.Expr.TypeAssertion({
        expr: ts.Expr.Call({
          expr: decodeTokenVariable,
          parameterList: [parameterIndex, parameterBinary],
        }),
        type: codec.decodeFunctionType(targetType),
      })
    ),
  ];
};

import * as binary from "./kernel/binary";
import * as bool from "./kernel/bool";
import * as codec from "./kernel/codec";
import * as data from "../data";
import * as hexString from "./kernel/hexString";
import * as int32 from "./kernel/int32";
import * as kernelString from "./kernel/string";
import * as list from "./kernel/list";
import * as ts from "js-ts-code-generator/distribution/newData";
import * as url from "./kernel/url";
import * as util from "../util";
import { identifer, data as tsUtil } from "js-ts-code-generator";

export const generate = (
  typePartMap: ReadonlyMap<data.TypePartId, data.TypePart>,
  allTypePartIdTypePartNameMap: ReadonlyMap<data.TypePartId, string>
): ReadonlyArray<ts.Variable> => {
  return [
    hexString.idKernelExprDefinition,
    hexString.tokenKernelExprDefinition,
    ...[...typePartMap].map(([typePartId, typePart]) =>
      typePartToVariable(typePartId, typePart, allTypePartIdTypePartNameMap)
    ),
  ];
};

const typePartToVariable = (
  typePartId: data.TypePartId,
  typePart: data.TypePart,
  allTypePartIdTypePartNameMap: ReadonlyMap<data.TypePartId, string>
): ts.Variable => {
  return {
    name: identifer.fromString(typePart.name),
    document: typePart.description + "\n@typePartId" + (typePartId as string),
    type: typePartToVariableType(typePart, allTypePartIdTypePartNameMap),
    expr: typePartToVariableExpr(typePart, allTypePartIdTypePartNameMap),
  };
};

const typePartToVariableType = (
  typePart: data.TypePart,
  allTypePartIdTypePartNameMap: ReadonlyMap<data.TypePartId, string>
): ts.Type => {
  const codecTsMemberType: ts.MemberType = {
    name: util.codecPropertyName,
    required: true,
    type: typePartToCodecType(typePart),
    document: "",
  };

  switch (typePart.body._) {
    case "Product":
    case "Kernel":
      return ts.Type.Object([codecTsMemberType]);
    case "Sum":
      return ts.Type.Object(
        typePart.body.patternList
          .map(
            (pattern): ts.MemberType => ({
              name: pattern.name,
              required: true,
              type: patternToTagType(
                identifer.fromString(typePart.name),
                typePart.typeParameterList,
                pattern,
                allTypePartIdTypePartNameMap
              ),
              document: pattern.description,
            })
          )
          .concat(codecTsMemberType)
      );
  }
};

const patternToTagType = (
  typeName: ts.Identifer,
  typeParameterList: ReadonlyArray<data.TypeParameter>,
  pattern: data.Pattern,
  allTypePartIdTypePartNameMap: ReadonlyMap<data.TypePartId, string>
) => {
  const typeParameterIdentiferList = typeParameterList.map((typeParameter) =>
    identifer.fromString(typeParameter.name)
  );
  const returnType = ts.Type.WithTypeParameter({
    type: ts.Type.ScopeInFile(typeName),
    typeParameterList: typeParameterIdentiferList.map(
      (typeParameterIdentifer) => ts.Type.ScopeInFile(typeParameterIdentifer)
    ),
  });

  switch (pattern.parameter._) {
    case "Just":
      return ts.Type.Function({
        typeParameterList: typeParameterIdentiferList,
        parameterList: [
          util.typeToTsType(
            pattern.parameter.value,
            allTypePartIdTypePartNameMap
          ),
        ],
        return: returnType,
      });

    case "Nothing":
      if (typeParameterList.length === 0) {
        return returnType;
      }
      return ts.Type.Function({
        typeParameterList: typeParameterIdentiferList,
        parameterList: [],
        return: returnType,
      });
  }
};

const typePartToVariableExpr = (
  typePart: data.TypePart,
  allTypePartIdTypePartNameMap: ReadonlyMap<data.TypePartId, string>
): ts.Expr => {
  switch (typePart.body._) {
    case "Product":
      return ts.Expr.ObjectLiteral(
        typePartToCodecMember(typePart, allTypePartIdTypePartNameMap)
      );

    case "Sum": {
      const { patternList } = typePart.body;
      return ts.Expr.ObjectLiteral(
        patternList
          .map((pattern) =>
            ts.Member.KeyValue({
              key: pattern.name,
              value: util.isTagTypeAllNoParameter(patternList)
                ? ts.Expr.StringLiteral(pattern.name)
                : patternToTagExpr(
                    identifer.fromString(typePart.name),
                    typePart.typeParameterList,
                    pattern,
                    allTypePartIdTypePartNameMap
                  ),
            })
          )
          .concat(typePartToCodecMember(typePart, allTypePartIdTypePartNameMap))
      );
    }
    case "Kernel":
      // TODO
      return ts.Expr.StringLiteral("Kernelの変数出力は調整中");
  }
};

const patternToTagExpr = (
  typeName: ts.Identifer,
  typeParameterList: ReadonlyArray<data.TypeParameter>,
  pattern: data.Pattern,
  allTypePartIdTypePartNameMap: ReadonlyMap<data.TypePartId, string>
): ts.Expr => {
  const tagField: ts.Member = ts.Member.KeyValue({
    key: "_",
    value: ts.Expr.StringLiteral(pattern.name),
  });
  const returnType = ts.Type.WithTypeParameter({
    type: ts.Type.ScopeInFile(typeName),
    typeParameterList: typeParameterList.map((typeParameter) =>
      ts.Type.ScopeInFile(identifer.fromString(typeParameter.name))
    ),
  });

  switch (pattern.parameter._) {
    case "Just": {
      const parameterIdentifer = identifer.fromString(
        util.typeToMemberOrParameterName(
          pattern.parameter.value,
          allTypePartIdTypePartNameMap
        )
      );
      return ts.Expr.Lambda({
        typeParameterList: typeParameterList.map((typeParameter) =>
          identifer.fromString(typeParameter.name)
        ),
        parameterList: [
          {
            name: parameterIdentifer,
            type: util.typeToTsType(
              pattern.parameter.value,
              allTypePartIdTypePartNameMap
            ),
          },
        ],
        returnType,
        statementList: [
          ts.Statement.Return(
            ts.Expr.ObjectLiteral([
              tagField,
              ts.Member.KeyValue({
                key: util.typeToMemberOrParameterName(
                  pattern.parameter.value,
                  allTypePartIdTypePartNameMap
                ),
                value: ts.Expr.Variable(parameterIdentifer),
              }),
            ])
          ),
        ],
      });
    }

    case "Nothing":
      if (typeParameterList.length === 0) {
        return ts.Expr.ObjectLiteral([tagField]);
      }
      return ts.Expr.Lambda({
        typeParameterList: typeParameterList.map((typeParameter) =>
          identifer.fromString(typeParameter.name)
        ),
        parameterList: [],
        returnType,
        statementList: [ts.Statement.Return(ts.Expr.ObjectLiteral([tagField]))],
      });
  }
};

/** カスタム型の式のcodecプロパティの型 */
const typePartToCodecType = (typePart: data.TypePart): ts.Type =>
  codec.codecTypeWithTypeParameter(
    ts.Type.ScopeInFile(identifer.fromString(typePart.name)),
    typePart.typeParameterList.map((typeParameter) => typeParameter.name)
  );

const typePartToCodecMember = (
  typePart: data.TypePart,
  allTypePartIdTypePartNameMap: ReadonlyMap<data.TypePartId, string>
): ReadonlyArray<ts.Member> => {
  return [
    ts.Member.KeyValue({
      key: util.codecPropertyName,
      value: codecExprDefinition(typePart, allTypePartIdTypePartNameMap),
    }),
  ];
};

const codecParameterName = (name: string): ts.Identifer =>
  identifer.fromString(name + "Codec");

const codecExprDefinition = (
  typePart: data.TypePart,
  allTypePartIdTypePartNameMap: ReadonlyMap<data.TypePartId, string>
): ts.Expr => {
  if (typePart.typeParameterList.length === 0) {
    return codecDefinitionBodyExpr(typePart, allTypePartIdTypePartNameMap);
  }
  return ts.Expr.Lambda({
    typeParameterList: typePart.typeParameterList.map((typeParameter) =>
      identifer.fromString(typeParameter.name)
    ),
    parameterList: typePart.typeParameterList.map((typeParameter) => ({
      name: codecParameterName(typeParameter.name),
      type: codec.codecType(
        ts.Type.ScopeInFile(identifer.fromString(typeParameter.name))
      ),
    })),
    returnType: codec.codecType(
      ts.Type.WithTypeParameter({
        type: ts.Type.ScopeInFile(identifer.fromString(typePart.name)),
        typeParameterList: typePart.typeParameterList.map((typeParameter) =>
          ts.Type.ScopeInFile(identifer.fromString(typeParameter.name))
        ),
      })
    ),
    statementList: [
      ts.Statement.Return(
        codecDefinitionBodyExpr(typePart, allTypePartIdTypePartNameMap)
      ),
    ],
  });
};

const codecDefinitionBodyExpr = (
  typePart: data.TypePart,
  allTypePartIdTypePartNameMap: ReadonlyMap<data.TypePartId, string>
): ts.Expr => {
  return ts.Expr.ObjectLiteral([
    ts.Member.KeyValue({
      key: util.encodePropertyName,
      value: encodeExprDefinition(typePart, allTypePartIdTypePartNameMap),
    }),
    ts.Member.KeyValue({
      key: util.decodePropertyName,
      value: decodeExprDefinition(typePart, allTypePartIdTypePartNameMap),
    }),
  ]);
};

/**
 * Encode Definition
 */
const encodeExprDefinition = (
  typePart: data.TypePart,
  allTypePartIdTypePartNameMap: ReadonlyMap<data.TypePartId, string>
): ts.Expr =>
  codec.encodeLambda(
    ts.Type.WithTypeParameter({
      type: ts.Type.ScopeInFile(identifer.fromString(typePart.name)),
      typeParameterList: typePart.typeParameterList.map((typeParameter) =>
        ts.Type.ScopeInFile(identifer.fromString(typeParameter.name))
      ),
    }),
    (valueVar): ReadonlyArray<ts.Statement> => {
      switch (typePart.body._) {
        case "Product":
          return productEncodeDefinitionStatementList(
            typePart.body.memberList,
            valueVar,
            allTypePartIdTypePartNameMap
          );
        case "Sum":
          return sumEncodeDefinitionStatementList(
            typePart.body.patternList,
            valueVar,
            allTypePartIdTypePartNameMap
          );
        case "Kernel":
          // TODO
          return [];
      }
    }
  );

const productEncodeDefinitionStatementList = (
  memberList: ReadonlyArray<data.Member>,
  parameter: ts.Expr,
  allTypePartIdTypePartNameMap: ReadonlyMap<data.TypePartId, string>
): ReadonlyArray<ts.Statement> => {
  if (memberList.length === 0) {
    return [ts.Statement.Return(ts.Expr.ArrayLiteral([]))];
  }
  let e = ts.Expr.Call({
    expr: tsUtil.get(
      codecExprUse(memberList[0].type, allTypePartIdTypePartNameMap),
      util.encodePropertyName
    ),
    parameterList: [tsUtil.get(parameter, memberList[0].name)],
  });
  for (const member of memberList.slice(1)) {
    e = tsUtil.callMethod(e, "concat", [
      ts.Expr.Call({
        expr: tsUtil.get(
          codecExprUse(member.type, allTypePartIdTypePartNameMap),
          util.encodePropertyName
        ),
        parameterList: [tsUtil.get(parameter, member.name)],
      }),
    ]);
  }
  return [ts.Statement.Return(e)];
};

const sumEncodeDefinitionStatementList = (
  patternList: ReadonlyArray<data.Pattern>,
  parameter: ts.Expr,
  allTypePartIdTypePartNameMap: ReadonlyMap<data.TypePartId, string>
): ReadonlyArray<ts.Statement> => [
  ts.Statement.Switch({
    expr: util.isTagTypeAllNoParameter(patternList)
      ? parameter
      : tsUtil.get(parameter, "_"),
    patternList: patternList.map((pattern, index) =>
      patternToSwitchPattern(
        pattern,
        index,
        parameter,
        allTypePartIdTypePartNameMap
      )
    ),
  }),
];

const patternToSwitchPattern = (
  patternList: data.Pattern,
  index: number,
  parameter: ts.Expr,
  allTypePartIdTypePartNameMap: ReadonlyMap<data.TypePartId, string>
): ts.Pattern => {
  const returnExpr = ((): ts.Expr => {
    switch (patternList.parameter._) {
      case "Just":
        return tsUtil.callMethod(
          ts.Expr.ArrayLiteral([
            { expr: ts.Expr.NumberLiteral(index), spread: false },
          ]),
          "concat",
          [
            encodeExprUse(
              patternList.parameter.value,
              tsUtil.get(
                parameter,
                util.typeToMemberOrParameterName(
                  patternList.parameter.value,
                  allTypePartIdTypePartNameMap
                )
              ),
              allTypePartIdTypePartNameMap
            ),
          ]
        );

      case "Nothing":
        return ts.Expr.ArrayLiteral([
          { expr: ts.Expr.NumberLiteral(index), spread: false },
        ]);
    }
  })();
  return {
    caseString: patternList.name,
    statementList: [ts.Statement.Return(returnExpr)],
  };
};

/**
 * Decode Definition
 */
const decodeExprDefinition = (
  typePart: data.TypePart,
  allTypePartIdTypePartNameMap: ReadonlyMap<data.TypePartId, string>
): ts.Expr => {
  return codec.decodeLambda(
    ts.Type.WithTypeParameter({
      type: ts.Type.ScopeInFile(identifer.fromString(typePart.name)),
      typeParameterList: typePart.typeParameterList.map((typeParameter) =>
        ts.Type.ScopeInFile(identifer.fromString(typeParameter.name))
      ),
    }),
    (parameterIndex, parameterBinary): ReadonlyArray<ts.Statement> => {
      switch (typePart.body._) {
        case "Product":
          return productDecodeDefinitionStatementList(
            typePart.body.memberList,
            parameterIndex,
            parameterBinary,
            allTypePartIdTypePartNameMap
          );
        case "Sum":
          return sumDecodeDefinitionStatementList(
            typePart.body.patternList,
            typePart.name,
            parameterIndex,
            parameterBinary,
            typePart.typeParameterList.length === 0,
            allTypePartIdTypePartNameMap
          );
        case "Kernel":
          // TODO
          return [];
      }
    }
  );
};

const productDecodeDefinitionStatementList = (
  memberList: ReadonlyArray<data.Member>,
  parameterIndex: ts.Expr,
  parameterBinary: ts.Expr,
  allTypePartIdTypePartNameMap: ReadonlyMap<data.TypePartId, string>
): ReadonlyArray<ts.Statement> => {
  const resultAndNextIndexNameIdentifer = (member: data.Member): ts.Identifer =>
    identifer.fromString(member.name + "AndNextIndex");

  const memberDecoderCode = memberList.reduce<{
    nextIndexExpr: ts.Expr;
    statementList: ReadonlyArray<ts.Statement>;
  }>(
    (statementAndNextIndexExpr, memberNameAndType) => {
      const resultAndNextIndexName = resultAndNextIndexNameIdentifer(
        memberNameAndType
      );
      const resultAndNextIndexVar = ts.Expr.Variable(resultAndNextIndexName);

      return {
        nextIndexExpr: codec.getNextIndex(resultAndNextIndexVar),
        statementList: statementAndNextIndexExpr.statementList.concat(
          ts.Statement.VariableDefinition({
            isConst: true,
            name: resultAndNextIndexName,
            type: codec.decodeReturnType(
              util.typeToTsType(
                memberNameAndType.type,
                allTypePartIdTypePartNameMap
              )
            ),
            expr: decodeExprUse(
              memberNameAndType.type,
              statementAndNextIndexExpr.nextIndexExpr,
              parameterBinary,
              allTypePartIdTypePartNameMap
            ),
          })
        ),
      };
    },
    { nextIndexExpr: parameterIndex, statementList: [] }
  );
  return memberDecoderCode.statementList.concat(
    codec.returnStatement(
      ts.Expr.ObjectLiteral(
        memberList.map(
          (memberNameAndType): ts.Member =>
            ts.Member.KeyValue({
              key: memberNameAndType.name,
              value: codec.getResult(
                ts.Expr.Variable(
                  resultAndNextIndexNameIdentifer(memberNameAndType)
                )
              ),
            })
        )
      ),
      memberDecoderCode.nextIndexExpr
    )
  );
};

const sumDecodeDefinitionStatementList = (
  patternList: ReadonlyArray<data.Pattern>,
  typePartName: string,
  parameterIndex: ts.Expr,
  parameterBinary: ts.Expr,
  noTypeParameter: boolean,
  allTypePartIdTypePartNameMap: ReadonlyMap<data.TypePartId, string>
): ReadonlyArray<ts.Statement> => {
  const patternIndexAndNextIndexName = identifer.fromString("patternIndex");
  const patternIndexAndNextIndexVar = ts.Expr.Variable(
    patternIndexAndNextIndexName
  );

  return [
    ts.Statement.VariableDefinition({
      isConst: true,
      name: patternIndexAndNextIndexName,
      type: codec.decodeReturnType(ts.Type.Number),
      expr: int32.decode(parameterIndex, parameterBinary),
    }),
    ...patternList.map((pattern, index) =>
      tagNameAndParameterCode(
        typePartName,
        pattern,
        index,
        patternIndexAndNextIndexVar,
        parameterBinary,
        noTypeParameter,
        allTypePartIdTypePartNameMap
      )
    ),
    ts.Statement.ThrowError(
      ts.Expr.StringLiteral(
        "存在しないパターンを指定された 型を更新してください"
      )
    ),
  ];
};

const tagNameAndParameterCode = (
  typePartName: string,
  pattern: data.Pattern,
  index: number,
  patternIndexAndNextIndexVar: ts.Expr,
  parameterBinary: ts.Expr,
  noTypeParameter: boolean,
  allTypePartIdTypePartNameMap: ReadonlyMap<data.TypePartId, string>
): ts.Statement => {
  switch (pattern.parameter._) {
    case "Just":
      return ts.Statement.If({
        condition: tsUtil.equal(
          codec.getResult(patternIndexAndNextIndexVar),
          ts.Expr.NumberLiteral(index)
        ),
        thenStatementList: [
          ts.Statement.VariableDefinition({
            isConst: true,
            name: identifer.fromString("result"),
            type: codec.decodeReturnType(
              util.typeToTsType(
                pattern.parameter.value,
                allTypePartIdTypePartNameMap
              )
            ),
            expr: decodeExprUse(
              pattern.parameter.value,
              codec.getNextIndex(patternIndexAndNextIndexVar),
              parameterBinary,
              allTypePartIdTypePartNameMap
            ),
          }),
          codec.returnStatement(
            patternUse(
              typePartName,
              noTypeParameter,
              pattern.name,
              data.Maybe.Just(
                codec.getResult(
                  ts.Expr.Variable(identifer.fromString("result"))
                )
              )
            ),
            codec.getNextIndex(ts.Expr.Variable(identifer.fromString("result")))
          ),
        ],
      });
    case "Nothing":
      return ts.Statement.If({
        condition: tsUtil.equal(
          codec.getResult(patternIndexAndNextIndexVar),
          ts.Expr.NumberLiteral(index)
        ),
        thenStatementList: [
          codec.returnStatement(
            patternUse(
              typePartName,
              noTypeParameter,
              pattern.name,
              data.Maybe.Nothing()
            ),
            codec.getNextIndex(patternIndexAndNextIndexVar)
          ),
        ],
      });
  }
};

const patternUse = (
  typePartName: string,
  noTypeParameter: boolean,
  tagName: string,
  parameter: data.Maybe<ts.Expr>
): ts.Expr => {
  const tagExpr = tsUtil.get(
    ts.Expr.Variable(identifer.fromString(typePartName)),
    tagName
  );
  switch (parameter._) {
    case "Just":
      return ts.Expr.Call({ expr: tagExpr, parameterList: [parameter.value] });
    case "Nothing":
      if (noTypeParameter) {
        return tagExpr;
      }
      return ts.Expr.Call({ expr: tagExpr, parameterList: [] });
  }
};

const encodeExprUse = (
  type_: data.Type,
  target: ts.Expr,
  allTypePartIdTypePartNameMap: ReadonlyMap<data.TypePartId, string>
): ts.Expr =>
  ts.Expr.Call({
    expr: tsUtil.get(
      codecExprUse(type_, allTypePartIdTypePartNameMap),
      util.encodePropertyName
    ),
    parameterList: [target],
  });

const decodeExprUse = (
  type_: data.Type,
  indexExpr: ts.Expr,
  binaryExpr: ts.Expr,
  allTypePartIdTypePartNameMap: ReadonlyMap<data.TypePartId, string>
) =>
  ts.Expr.Call({
    expr: tsUtil.get(
      codecExprUse(type_, allTypePartIdTypePartNameMap),
      util.decodePropertyName
    ),
    parameterList: [indexExpr, binaryExpr],
  });

const codecExprUse = (
  type: data.Type,
  allTypePartIdTypePartNameMap: ReadonlyMap<data.TypePartId, string>
): ts.Expr => {
  const typePartName = allTypePartIdTypePartNameMap.get(type.typePartId);
  if (typePartName === undefined) {
    throw new Error(
      "internal error not found type part name in codecExprUse. typePartId =" +
        (type.typePartId as string)
    );
  }
  if (type.parameter.length === 0) {
    return tsUtil.get(
      ts.Expr.Variable(identifer.fromString(typePartName)),
      util.codecPropertyName
    );
  }
  return ts.Expr.Call({
    expr: tsUtil.get(
      ts.Expr.Variable(identifer.fromString(typePartName)),
      util.codecPropertyName
    ),
    parameterList: type.parameter.map((parameter) =>
      codecExprUse(parameter, allTypePartIdTypePartNameMap)
    ),
  });
};

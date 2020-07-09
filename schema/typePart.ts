import * as type from "./type";
import * as util from "../source/util";
import {
  Maybe,
  TypeAttribute,
  TypePart,
  TypePartBody,
  TypePartBodyKernel,
  TypePartId,
} from "../source/data";

export const Int32: TypePart = {
  name: "Int32",
  migrationPartId: Maybe.Nothing(),
  description:
    "-2 147 483 648 ～ 2 147 483 647. 32bit 符号付き整数. JavaScriptのnumberとして扱える. numberの32bit符号あり整数をSigned Leb128のバイナリに変換する",
  projectId: util.definyCodeProjectId,
  createSuggestionId: util.codeSuggestionId,
  getTime: { day: 0, millisecond: 0 },
  attribute: Maybe.Nothing(),
  typeParameterList: [],
  body: TypePartBody.Kernel(TypePartBodyKernel.Int32),
};

export const Binary: TypePart = {
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

export const Bool: TypePart = {
  name: "Bool",
  migrationPartId: Maybe.Nothing(),
  description:
    "Bool. 真か偽. JavaScriptのbooleanで扱える. true: 1, false: 0. (1byte)としてバイナリに変換する",
  projectId: util.definyCodeProjectId,
  createSuggestionId: util.codeSuggestionId,
  getTime: { day: 0, millisecond: 0 },
  attribute: Maybe.Just(TypeAttribute.AsBoolean),
  typeParameterList: [],
  body: TypePartBody.Sum([
    {
      name: "True",
      description: "真",
      parameter: Maybe.Nothing(),
    },
    {
      name: "False",
      description: "偽",
      parameter: Maybe.Nothing(),
    },
  ]),
};

export const List: TypePart = {
  name: "List",
  migrationPartId: Maybe.Nothing(),
  description: "リスト. JavaScriptのArrayで扱う",
  projectId: util.definyCodeProjectId,
  createSuggestionId: util.codeSuggestionId,
  getTime: { day: 0, millisecond: 0 },
  attribute: Maybe.Nothing(),
  typeParameterList: [
    {
      name: "e",
      typePartId: "cf95a75adf60a7eecabe7d0b4c3e68cd" as TypePartId,
    },
  ],
  body: TypePartBody.Kernel(TypePartBodyKernel.List),
};

const valueTypePartId = "7340e6b552af43695335a64e057f4250" as TypePartId;

export const maybe: TypePart = {
  name: "Maybe",
  migrationPartId: Maybe.Nothing(),
  description:
    "Maybe. nullableのようなもの. 今後はRustのstd::Optionに出力するために属性をつける?",
  projectId: util.definyCodeProjectId,
  createSuggestionId: util.codeSuggestionId,
  getTime: { day: 0, millisecond: 0 },
  attribute: Maybe.Nothing(),
  typeParameterList: [
    {
      typePartId: valueTypePartId,
      name: "value",
    },
  ],
  body: TypePartBody.Sum([
    {
      name: "Just",
      description: "値があるということ",
      parameter: Maybe.Just({ typePartId: valueTypePartId, parameter: [] }),
    },
    {
      name: "Nothing",
      description: "値がないということ",
      parameter: Maybe.Nothing(),
    },
  ]),
};

const okTypePartId = "2163b3c97b382de8085973eff850c919" as TypePartId;
const errorTypePartId = "bd8be8409130f30f15c5c86c01de6dc5" as TypePartId;

export const Result: TypePart = {
  name: "Result",
  migrationPartId: Maybe.Nothing(),
  description:
    "成功と失敗を表す型. 今後はRustのstd::Resultに出力するために属性をつける?",
  projectId: util.definyCodeProjectId,
  createSuggestionId: util.codeSuggestionId,
  getTime: { day: 0, millisecond: 0 },
  attribute: Maybe.Nothing(),
  typeParameterList: [
    {
      typePartId: okTypePartId,
      name: "ok",
    },
    {
      typePartId: errorTypePartId,
      name: "error",
    },
  ],
  body: TypePartBody.Sum([
    {
      name: "Ok",
      description: "成功",
      parameter: Maybe.Just({ typePartId: okTypePartId, parameter: [] }),
    },
    {
      name: "Error",
      description: "失敗",
      parameter: Maybe.Just({ typePartId: errorTypePartId, parameter: [] }),
    },
  ]),
};

export const String: TypePart = {
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

export const Time: TypePart = {
  name: "Time",
  migrationPartId: Maybe.Nothing(),
  description:
    "日時. 0001-01-01T00:00:00.000Z to 9999-12-31T23:59:59.999Z 最小単位はミリ秒. ミリ秒の求め方は day*1000*60*60*24 + millisecond",
  projectId: util.definyCodeProjectId,
  createSuggestionId: util.codeSuggestionId,
  getTime: { day: 0, millisecond: 0 },
  typeParameterList: [],
  attribute: Maybe.Nothing(),
  body: TypePartBody.Product([
    {
      name: "day",
      description: "1970-01-01からの経過日数. マイナスになることもある",
      type: type.Int32,
    },
    {
      name: "millisecond",
      description: "日にちの中のミリ秒. 0 to 86399999 (=1000*60*60*24-1)",
      type: type.Int32,
    },
  ]),
};

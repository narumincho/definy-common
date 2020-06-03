import { data } from "@narumincho/type";

const timeName = "Time";

export const time: data.Type = data.Type.Custom({
  name: timeName,
  parameterList: [],
});

export const timeCustomType: data.CustomTypeDefinition = {
  name: timeName,
  description:
    "日時. 0001-01-01T00:00:00.000Z to 9999-12-31T23:59:59.999Z 最小単位はミリ秒. ミリ秒の求め方は day*1000*60*60*24 + millisecond",
  typeParameterList: [],
  body: data.CustomTypeDefinitionBody.Product([
    {
      name: "day",
      description: "1970-01-01からの経過日数. マイナスになることもある",
      type: data.Type.Int32,
    },
    {
      name: "millisecond",
      description: "日にちの中のミリ秒. 0 to 86399999 (=1000*60*60*24-1)",
      type: data.Type.Int32,
    },
  ]),
};

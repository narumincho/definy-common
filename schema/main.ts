import * as definyCore from "../source/main";
import * as definyCoreData from "../source/data";
import * as prettier from "prettier";
import * as typePartMap from "./typePartMap";
import { promises as fileSystem } from "fs";

const typeScriptPath = "source/data.ts";
const elmPath = "data.elm";

const typeScriptCode = definyCore.generateTypeScriptCodeAsString(
  typePartMap.typePartMap
);

const formattedTypeScriptCode = prettier.format(typeScriptCode, {
  parser: "typescript",
});

fileSystem.writeFile(typeScriptPath, formattedTypeScriptCode).then(() => {
  console.log("output TypeScript code!");
});

const elmCode = definyCore.generateElmCodeAsString(typePartMap.typePartMap);

fileSystem.writeFile(elmPath, elmCode).then(() => {
  console.log("output Elm code!");
});

const typePartMapAsIdAndDataList = [
  ...typePartMap.typePartMap,
].map(([id, typePart]) => ({ id, data: typePart }));

const typePartMapAsBinary = definyCoreData.List.codec(
  definyCoreData.IdAndData.codec(
    definyCoreData.TypePartId.codec,
    definyCoreData.TypePart.codec
  )
).encode(typePartMapAsIdAndDataList);

const typePartMapAsJson = JSON.stringify(typePartMapAsIdAndDataList);

fileSystem
  .writeFile("schemaBinary", new Uint8Array(typePartMapAsBinary))
  .then(() => {
    console.log("output as binary");
  });

fileSystem.writeFile("schema.json", typePartMapAsJson).then(() => {
  console.log("output as json");
});

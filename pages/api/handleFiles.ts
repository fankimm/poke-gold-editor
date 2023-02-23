import formidable from "formidable";
import fs from "fs";
import type { NextApiRequest, NextApiResponse } from "next";
import itemListJson from "../../public/item-list.json";
type Data = {
  money: number;
  trainerId: number;
  timePlayed: string;
  itemPocketItemList: {
    name: string;
    count: number;
  }[];
};

type ItemList = {
  [name: string]: string;
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const itemList: ItemList = itemListJson;
  const fileData = await new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm({
      maxFileSize: 5 * 1024 * 1024,
      keepExtensions: true,
    });

    form.parse(req, (err, _fields, files) => {
      if (err) return reject(err);
      return resolve(files);
    });
  });
  const file = fileData.file;
  let money = "";
  let trainerId = "";
  let timePlayed = "";
  let itemPocketItemList = [];
  const data = fs.readFileSync(file.filepath);
  money += data[0x23db].toString(16);
  money += data[0x23dc].toString(16);
  money += data[0x23dd].toString(16);

  trainerId += data[0x2009].toString(16);
  trainerId += data[0x200a].toString(16);

  timePlayed += data[0x2054];
  timePlayed += ":";
  timePlayed += data[0x2055];
  timePlayed += ":";
  timePlayed += data[0x2056];
  for (let i = 0x2420; i < 0x2420 + 38; i += 2) {
    let hex = "0x";
    const extract = data[i].toString(16).toUpperCase();
    if (extract.length === 1) {
      hex += "0";
      hex += extract;
    } else {
      hex += extract;
    }
    itemPocketItemList.push({
      name: itemList[hex],
      count: data[i + 1],
    });
  }
  res.status(200).json({
    money: parseInt(money, 16),
    trainerId: parseInt(trainerId, 16),
    timePlayed,
    itemPocketItemList,
  });
}


import fetch from "node-fetch";
import { parse } from "node-html-parser";
import fs from "fs";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const xslx = require("xlsx");
const puppeteer = require('puppeteer-core');
const axios = require('axios');
// function to get the raw data
const getRawData = (URL) => {
	return fetch(URL)
		.then((response) => response.text())
		.then((data) => {
			return data;
		});
};

const download_image = (url, image_path) =>
  axios({
    url,
    responseType: 'stream',
  }).then(
    response =>
      new Promise((resolve, reject) => {
        response.data
          .pipe(fs.createWriteStream(image_path))
          .on('finish', () => resolve())
          .on('error', e => reject(e));
      }),
);

// start of the program
const getData = async () => {
	const settingsFile = fs.readFileSync("./settings.json", "utf-8");
	const settings = JSON.parse(settingsFile);

	let globalCSV = "Handle,Title,Body (HTML),Vendor,Product Category,Type,Tags,Published,Option1 Name,Option1 Value,Option2 Name,Option2 Value,Option3 Name,Option3 Value,Variant SKU,Variant Grams,Variant Inventory Tracker,Variant Inventory Qty,Variant Inventory Policy,Variant Fulfillment Service,Variant Price,Variant Compare At Price,Variant Requires Shipping,Variant Taxable,Variant Barcode,Image Src,Image Position,Image Alt Text,Gift Card,SEO Title,SEO Description,Google Shopping / Google Product Category,Google Shopping / Gender,Google Shopping / Age Group,Google Shopping / MPN,Google Shopping / AdWords Grouping,Google Shopping / AdWords Labels,Google Shopping / Condition,Google Shopping / Custom Product,Google Shopping / Custom Label 0,Google Shopping / Custom Label 1,Google Shopping / Custom Label 2,Google Shopping / Custom Label 3,Google Shopping / Custom Label 4,Variant Image,Variant Weight Unit,Variant Tax Code,Cost per item,Price / International,Compare At Price / International,Status\n";
	
	
	
	let table1 = fs.readFileSync("./check24/tomspielzeug_new.csv", "utf-8").split("\n");

	for (let i = 1; i < table1.length - 1; i++) {
		globalCSV += `${table1[i]}\n`;	
	}
	
	let table2 = fs.readFileSync("./check24/volare_new.csv", "utf-8").split("\n");

	for (let i = 1; i < table2.length - 1; i++) {
		globalCSV += `${table2[i]}\n`;	
	}
	
	let table3 = fs.readFileSync("./check24/laniustoys_new.csv", "utf-8").split("\n");

	for (let i = 1; i < table3.length - 1; i++) {
		globalCSV += `${table3[i]}\n`;	
	}
	
	let table4 = fs.readFileSync("./check24/pcnotebook_new.csv", "utf-8").split("\n");

	for (let i = 1; i < table4.length - 1; i++) {
		globalCSV += `${table4[i]}\n`;	
	}
	
	let table5 = fs.readFileSync("./check24/wifishop_new.csv", "utf-8").split("\n");

	for (let i = 1; i < table5.length - 1; i++) {
		globalCSV += `${table5[i]}\n`;	
	}
	
	let table6 = fs.readFileSync("./check24/eeteuro_new.csv", "utf-8").split("\n");

	for (let i = 1; i < table6.length - 1; i++) {
		globalCSV += `${table6[i]}\n`;	
	}
	
	let table7 = fs.readFileSync("./check24/ecom_new.csv", "utf-8").split("\n");

	for (let i = 1; i < table7.length - 1; i++) {
		globalCSV += `${table7[i]}\n`;	
	}
	
	let table8 = fs.readFileSync("./check24/cars4kidstrading_new.csv", "utf-8").split("\n");

	for (let i = 1; i < table8.length - 1; i++) {
		globalCSV += `${table8[i]}\n`;	
	}
	
	let table9 = fs.readFileSync("./check24/cycletech_new.csv", "utf-8").split("\n");

	for (let i = 1; i < table9.length - 1; i++) {
		globalCSV += `${table9[i]}\n`;	
	}
	
	let table10 = fs.readFileSync("./check24/kosatec_new.csv", "utf-8").split("\n");

	for (let i = 1; i < table10.length - 1; i++) {
		globalCSV += `${table10[i]}\n`;	
	}
	
	let table11 = fs.readFileSync("./check24/TWM_new.csv", "utf-8").split("\n");

	for (let i = 1; i < table11.length - 1; i++) {
		globalCSV += `${table11[i]}\n`;	
	}
	
	let table12 = fs.readFileSync("./check24/TSPORSTSenLEISURE.csv", "utf-8").split("\n");

	for (let i = 1; i < table12.length - 1; i++) {
		globalCSV += `${table12[i]}\n`;	
	}
	
	let table13 = fs.readFileSync("./check24/TPARTSenACCE_new.csv", "utf-8").split("\n");

	for (let i = 1; i < table13.length - 1; i++) {
		globalCSV += `${table13[i]}\n`;	
	}
	
	let table14 = fs.readFileSync("./check24/TOutdoor_new.csv", "utf-8").split("\n");

	for (let i = 1; i < table14.length - 1; i++) {
		globalCSV += `${table14[i]}\n`;	
	}
	
	let table15 = fs.readFileSync("./check24/THouseEnGarten.csv", "utf-8").split("\n");

	for (let i = 1; i < table15.length - 1; i++) {
		globalCSV += `${table15[i]}\n`;	
	}
	
	let table16 = fs.readFileSync("./check24/bikebizz_new.csv", "utf-8").split("\n");

	for (let i = 1; i < table16.length - 1; i++) {
		globalCSV += `${table16[i]}\n`;	
	}
	
	fs.writeFileSync("g.csv", globalCSV);

	console.log("done-index");
	
	
};


// invoking the main function
getData();

setInterval(() => {
	getData();
},15 * 60 * 1000);

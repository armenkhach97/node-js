import fetch from "node-fetch";
import { parse } from "node-html-parser";
import fs from "fs";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const xslx = require("xlsx");

// function to get the raw data
const getRawData = (URL) => {
	return fetch(URL)
		.then((response) => response.text())
		.then((data) => {
			return data;
		});
};


// start of the program
const getData = async () => {
	const settingsWIFISHOPFile = fs.readFileSync("./urllist.json", "utf-8");
	const settingsWIFISHOP = JSON.parse(settingsWIFISHOPFile);
	const productsURL = []
	let WIFISHOPCsv =
		"Number;Brand;Description;EAN;Price;Quantity;Delivery Time;Delivery Cost\n";
	if (settingsWIFISHOP.GETWIFISHOPLIST !== undefined && settingsWIFISHOP.GETWIFISHOPLIST!= "0"){
		for (let i = 0; i < settingsWIFISHOP.SUBURLLIST.length; i++){
			const data = JSON.parse(await getRawData(settingsWIFISHOP.SUBURLLIST[i]));
			if (data.success === undefined) {
			} else {
				const pageCOUNT = parseInt(data.data.paging.pageCount);
				for (let j = 1; j < pageCOUNT; j++){
					const URL = settingsWIFISHOP.SUBURLLIST[i].replace("/.json", "/" + j + "/.json");
					const dataPAGE = JSON.parse(await getRawData(URL));
					if (dataPAGE.success === undefined) {
						continue;
					} else {
						for (let k = 0; k < dataPAGE.data.products.length; k++){
							let productdetail = dataPAGE.data.products[k];
							let urlexistflg = false;
							for (let iURL = 0; iURL < productsURL.length; iURL++){
								if (productsURL[iURL] == productdetail.url){
									urlexistflg = true;
									break;
								}
							}
							if (urlexistflg){
								continue;
							}
							productsURL.push(productdetail.url)
							if (settingsWIFISHOP.NOSTOCKTEXT.includes(productdetail.stock) || settingsWIFISHOP.NOSTOCKTEXT.includes(productdetail.deliveryText)) {
								continue;
							}
							const dataPERPRODUCT = await getRawData(settingsWIFISHOP.MAINURL + productdetail.url);
							const html = parse(dataPERPRODUCT);
							const table = html.querySelectorAll("#productSpecs table tr td");
							let EANFLG = false;
							let EANVALUE = "";
							let ARTICLENUMBERFLG = false;
							let ARTICLENUMBER = "";
							let BRANDFLG = false;
							let BRANDVALUE = "";
							//BRAND
							for (let irow = 0; irow < table.length; irow++) {
								if (BRANDFLG){
									BRANDVALUE = table[irow].childNodes[1].childNodes[0].rawText;
									break;
								}
								if (table[irow].innerHTML === settingsWIFISHOP.BRANDTEXT){
									BRANDFLG = true;
								}
							}
							//ARTICLENUMBER
							for (let irow = 0; irow < table.length; irow++) {
								if (ARTICLENUMBERFLG){
									ARTICLENUMBER = table[irow].innerHTML;
									break;
								}
								if (table[irow].innerHTML === settingsWIFISHOP.ARTICLENUMBERTEXT){
									ARTICLENUMBERFLG = true;
								}
							}
							//EANNUMBER
							for (let irow = 0; irow < table.length; irow++) {
								if (EANFLG){
									EANVALUE = table[irow].innerHTML;
									break;
								}
								if (table[irow].innerHTML === settingsWIFISHOP.EANTEXT){
									EANFLG = true;
								}
							}
							if (EANFLG){
							} else {
								EANVALUE = ARTICLENUMBER;
							}
							productdetail.name = productdetail.name.replace(","," ");
							if (isNaN(parseFloat(productdetail.price.priceVat)) || parseFloat((productdetail.price.priceVat.replace(".","")).replace(",", ".")) <= 0.00){
								continue;
							}
							productdetail.price.priceVat = ecomCalc(parseFloat((productdetail.price.priceVat.replace(".","")).replace(",", ".")));
							
							WIFISHOPCsv += `${productdetail.id};"${BRANDVALUE}";"${productdetail.name}";"${EANVALUE}";${productdetail.price.priceVat};2;1-3Tage;Versandkosten Frei;\n`;
							
						}
					}
				}
			}
		}
	}
	fs.writeFileSync("wifishop.csv", WIFISHOPCsv);
	console.log("done");
	
	function ecomCalc(num) {
		let price = parseFloat(
			(num + (5.49)).toFixed(2)
		);
		price = price.toFixed(2);
		return price;
	}
};


// invoking the main function
getData();

setInterval(() => {
	getData();
}, 60 * 60 * 1000);
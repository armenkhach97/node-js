import Shopify from 'shopify-api-node';


import fetch from "node-fetch";
import { parse } from "node-html-parser";
import fs from "fs";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const xslx = require("xlsx");
const axios = require('axios');
const puppeteer = require('puppeteer-core');
const translate = require('@iamtraction/google-translate');

let SHOPLIMITCALL = false;
const shopify = new Shopify({
  shopName: 'ejim-computer-village',
  accessToken: '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' ,
  autoLimit: true
});
	console.log("Starting ShopifyApp");
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

function delay(limits){
    console.log(limits);
	if(limits.remaining <= 10){
		SHOPLIMITCALL = true;
	} else {
		SHOPLIMITCALL = false;
	}
}
// URL for data

// start of the program
const getData = async () => {
	const settingsFile = fs.readFileSync("./settings.json", "utf-8");
	const settings = JSON.parse(settingsFile);
	
	const ECOMEANARRAY = [];
	const csvTableECOMEAN = fs
		.readFileSync("./preisliste_ecom.csv", "utf-8")
		.split("\n");
	for (let i = 1; i < csvTableECOMEAN.length;) {
		const product = csvTableECOMEAN[i];
		let productColumns = product.replaceAll('","', ";")
									.replaceAll(',"', ";")
									.replaceAll('",', ";")
									.replaceAll(';"', ";");
		let productDetails = productColumns.split(";");
		if (productDetails[3] == undefined || productDetails[3] == ""){
			continue;
		}
		ECOMEANARRAY.push(productDetails[3]);
	}
	
	const PCNOTEBOOKEANARRAY = [];
	const tablePCNOTEBOOKARR = xslx.readFile("./pc_notebook_preisliste.xlsx");
	xslx.writeFile(tablePCNOTEBOOKARR, "pc_notebook_preisliste.csv", { bookType: "csv" });
	const csvTablePCNOTEBOOKEAN = fs
		.readFileSync("./pc_notebook_preisliste.csv", "utf-8")
		.split("\n");
	for (let i = 1; i < csvTablePCNOTEBOOKEAN.length; i++) {
		const product = csvTablePCNOTEBOOKEAN[i];
		let productColumns = product.replace(/(?!(([^"]*"){2})*[^"]*$),/gm, " ");
		productColumns = productColumns.replace(/,/gm, ";");
		let productDetails = productColumns.split(";");

		if (productDetails[0] === "Art.-Nr. " || productDetails[0] === "0") {
			continue;
		}
		
		if (productDetails[1] == undefined || productDetails[1] == ""){
			continue;
		}
		
		PCNOTEBOOKEANARRAY.push(productDetails[1]);
	}
	
	const VOLAREANARRAY = [];
	const tableVolareARR = fs.readFileSync("./volare_products_de.csv", "utf-8").split("\n");
	for (let i = 1; i < tableVolareARR.length; i++) {
		let product = tableVolareARR[i];
		let productDetails = product.split('";"');
		if (productDetails[1] === undefined || productDetails[1] == "") {
			continue;
		}
		VOLAREANARRAY.push(productDetails[1]);
	}
	
	const URLCYCLETECHARR = "http://35.158.115.5:8000/";
	const CYCLETECHEANARRAY = [];
	let cycleproductARR = [];
	let CYCLETECHDATAFLGARR = false;
	try {
		const tableCYCLETECHARR = await getRawData(URLCYCLETECHARR + "data");
		cycleproductARR = tableCYCLETECHARR.split("\n");
		CYCLETECHDATAFLGARR = true;
	} catch(e){
	}
	for (let i = 0; i < cycleproductARR.length; i++) {
		let product = cycleproductARR[i];
		let productDetails = product.split(';');
		
		if (productDetails[2] === undefined || productDetails[2] == "") {
			continue;
		}
		CYCLETECHEANARRAY.push(productDetails[2]);
	}
	
	
	let counter = 0;
	const products = [];
	const productsShopifyListEETEURO = [];
	const productsShopifyListIDEETEURO = {};
	const productsShopifyListExistEETEURO = [];
	let gcsv = "Handle,Remarks\n";
	
	//LANIUSTOYS START
	let eeteurocsv = "Handle,Title,Body (HTML),Vendor,Product Category,Type,Tags,Published,Option1 Name,Option1 Value,Option2 Name,Option2 Value,Option3 Name,Option3 Value,Variant SKU,Variant Grams,Variant Inventory Tracker,Variant Inventory Qty,Variant Inventory Policy,Variant Fulfillment Service,Variant Price,Variant Compare At Price,Variant Requires Shipping,Variant Taxable,Variant Barcode,Image Src,Image Position,Image Alt Text,Gift Card,SEO Title,SEO Description,Google Shopping / Google Product Category,Google Shopping / Gender,Google Shopping / Age Group,Google Shopping / MPN,Google Shopping / AdWords Grouping,Google Shopping / AdWords Labels,Google Shopping / Condition,Google Shopping / Custom Product,Google Shopping / Custom Label 0,Google Shopping / Custom Label 1,Google Shopping / Custom Label 2,Google Shopping / Custom Label 3,Google Shopping / Custom Label 4,Variant Image,Variant Weight Unit,Variant Tax Code,Cost per item,Price / International,Compare At Price / International,Status\n";
	let params = { limit: 100 };
    shopify.on("callLimits", limits => delay(limits));
	let counterALLPRODUCTS = 0;
	do {
	    while (SHOPLIMITCALL) {
			console.log("limit reached : waiting 30 seconds");
			await new Promise(r => setTimeout(r, 60000));
			SHOPLIMITCALL = false;
		} 
		counterALLPRODUCTS += 1;
		console.log(counterALLPRODUCTS);
		const productsShopify = await shopify.product.list(params);
		for(var i in productsShopify) {
			productsShopify[i].variants[0].sku = (productsShopify[i].variants[0].sku).toLowerCase();
			if ((productsShopify[i].variants[0].sku).search("eet-") >= 0){
				productsShopifyListIDEETEURO[productsShopify[i].variants[0].sku] = productsShopify[i].id;
				productsShopifyListEETEURO.push(productsShopify[i].variants[0].sku);
			}
			
		}
		console.log(productsShopify.length);
		params = productsShopify.nextPageParameters;
	    await new Promise(r => setTimeout(r, 1150));
	} while (params !== undefined);
	
	const productswifishop = [];
	const productswifishopean = [];

	let tableWIFISHOPCHECK = fs.readFileSync("./wifishop.csv", "utf-8").split("\n");
	for (let i = 1; i < tableWIFISHOPCHECK.length - 1; i++) {
		let productUPDATEDetails = tableWIFISHOPCHECK[i];
		productswifishop.push(productUPDATEDetails);
		productswifishopean.push((productUPDATEDetails.split(";"))[3].replace(/"/g, ''));
	}
	const table8 = fs.readFileSync("./eeteuroparts_DE.csv", "utf-8").split("\n");
	for (let i = 1; i < table8.length; i++) {
	    while (SHOPLIMITCALL) {
			console.log("limit reached : waiting 30 seconds");
			await new Promise(r => setTimeout(r, 60000));
			SHOPLIMITCALL = false;
		} 
		let product = table8[i];
		let productDetails = product.split('";"');
		if (productDetails[1] === undefined) {
			continue;
		}
		
		if (
			settings.DELETED_PRODUCTS.includes(productDetails[1]) ||
			settings.DELETED_PRODUCTS.includes(parseInt(productDetails[1]))
		) {
			continue;
		}
		if (isNaN(parseFloat(productDetails[6])) || parseFloat(((productDetails[6]).replace(".","")).replace(",", ".")) <= 0.00){
			continue;
		}
		let wifiexistflg = false;
		let price = calculateCustomerPriceEETEURO(parseFloat(((productDetails[6]).replace(".","")).replace(",", ".")));
		for (let j = 1; j < productswifishopean.length; j++){
			if (isNaN(productswifishopean[j]) || productswifishopean[j] == ""){
				continue;
			} else {
				if (productswifishopean[j] == productDetails[9] ||
					productswifishopean[j] == parseInt(productDetails[9])){
					wifiexistflg = true;
					break;
				}
			}
		}
		if (wifiexistflg){
			continue;
		}
		let shippingtime = "3Tage";
		const updateTable = fs
				.readFileSync("./update.csv", "utf-8")
				.split("\n");
		productDetails[5] = (((productDetails[5]).replace(".","")).replace(",", "."));
		for (let j = 1; j < updateTable.length; j++) {
			const productUPDATE = updateTable[j];
			let productUPDATEColumns = productUPDATE.replace(/(?!(([^"]*"){2})*[^"]*$),/gm, " ");
			productUPDATEColumns = productUPDATEColumns.replace(/,/gm, ";");
			let productUPDATEDetails = productUPDATEColumns.split(";");
			if (productUPDATEDetails[0] === "EAN") {
				continue;
			}
			if (productUPDATEDetails[0] === productDetails[9]){
				productDetails[5] = productUPDATEDetails[1];
				shippingtime = productUPDATEDetails[2] + "Tage";
			}
			
		}
		productDetails[5] = parseInt(productDetails[5]);
		productDetails[0] = productDetails[0].slice(1,(productDetails[0]).length);
		if (parseInt(productDetails[5]) <= 0){
			continue;
		}
		if (
			PCNOTEBOOKEANARRAY.includes(productDetails[9]) ||
			ECOMEANARRAY.includes(productDetails[9])
		) {
			continue;
		}
		let imgflg = false;
		try {
			let imgdownload = await download_image(productDetails[7], "../storage/media/EetEuro-" + productDetails[0] + ".jpg");
			imgflg = true;
		} catch (e){
		}
		if (imgflg == false){
		    continue;
		}
	    eeteurocsv += `"EET-${productDetails[0]} ${productDetails[3]} ${productDetails[1]}","${productDetails[3]} ${productDetails[1]} - ${productDetails[0]}","${productDetails[3]} ${productDetails[1]}","${productDetails[3]}","Electronics","${productDetails[8]}","Electronics,${productDetails[8]},${productDetails[3]}",TRUE,,,,,,,"EET-${productDetails[0]}",,shopify,${productDetails[5]},deny,manual,${parseFloat(price).toFixed(2)},,TRUE,TRUE,${productDetails[9]},${productDetails[7]},1,,FALSE,"${productDetails[3]} ${productDetails[1]}","${productDetails[3]} ${productDetails[1]}","Electronics",,,,,,,FALSE,,,,,,,,,,,,active\n`;
		if (productsShopifyListEETEURO.includes((`eet-${productDetails[0]}`).toLowerCase())){
				productsShopifyListExistEETEURO.push((`eet-${productDetails[0]}`).toLowerCase());
				await shopify.products
					.updated(productsShopifyListIDEETEURO[(`eet-${productDetails[0]}`).toLowerCase()],{
						"body_html": `${productDetails[3]} ${productDetails[1]}`,
						"product_type": "Electronics",
						"handle": `eet-${productDetails[0]} ${productDetails[3]} ${productDetails[1]}`,
						"title": `${productDetails[3]} ${productDetails[1]} - ${productDetails[0]}`,
						"product_category":"Electronics",
						"variants": [
							{
								"barcode": `${productDetails[9]}`,
								"compare_at_price": null,
								"fulfillment_service": "manual",
								"weight_unit": "kg",
								"inventory_management": "shopify",
								"inventory_policy": "deny",
								"inventory_quantity": parseInt(productDetails[5]),
								"price": parseFloat(price).toFixed(2),
								"requires_shipping": true,
								"sku": `eet-${productDetails[0]}`,
								"taxable": true
							}
						],
						"vendor": `${productDetails[3]}`
					})
					.then((c) => {
						console.log(`eet-${productDetails[0]}   update`);
						gcsv += `eet-${productDetails[0]},updated\n`;
					})
					.catch((err) => {
						console.error(err);
						gcsv += `eet-${productDetails[0]},updating error\n`;
					});
			} else {
				await shopify.products
					.created({
						"body_html": `${productDetails[3]} ${productDetails[1]}`,
						"handle": `eet-${productDetails[0]} ${productDetails[3]} ${productDetails[1]}`,
						"id": 632910392,
						"images":[{"src":productDetails[7]}],
						"product_type": "Electronics",
						"published_scope": "global",
						"status": "active",
						"tags": `Electronics,${productDetails[8]},${productDetails[3]}`,
						"template_suffix": "special",
						"title": `${productDetails[3]} ${productDetails[1]} - ${productDetails[0]}`,
						"product_category":"Electronics",
						"variants": [
							{
								"barcode": `${productDetails[9]}`,
								"compare_at_price": null,
								"fulfillment_service": "manual",
								"weight_unit": "kg",
								"inventory_management": "shopify",
								"inventory_policy": "deny",
								"inventory_quantity": parseInt(productDetails[5]),
								"price": parseFloat(price).toFixed(2),
								"requires_shipping": true,
								"sku": `eet-${productDetails[0]}`,
								"taxable": true
							}
						],
						"vendor": `${productDetails[3]}`
					})
					.then((c) => {
						console.log(`eet-${productDetails[0]}   new`);
						gcsv += `eet-${productDetails[0]},added\n`;
					})
					.catch((err) => {
						console.error(err);
						gcsv += `eet-${productDetails[0]},adding error\n`;
					});
			}
			await new Promise(r => setTimeout(r, 1000));
	}
	
	for(var i in productsShopifyListEETEURO) {
		if (productsShopifyListExistEETEURO.includes(productsShopifyListEETEURO[i])){
		} else {
			await shopify.products
					.deleted(productsShopifyListIDEETEURO[productsShopifyListEETEURO[i]])
					.then((c) => {
						console.log(`${productsShopifyListEETEURO[i]}   no stock`);
						gcsv += `${productsShopifyListEETEURO[i]},no stock\n`;
					})
					.catch((err) => {
						console.error(err);
						gcsv += `${productsShopifyListEETEURO[i]},error no stock\n`;
					});
			await new Promise(r => setTimeout(r, 1000));
		}
	}
	
	fs.writeFileSync("check24/eeteuro_new.csv", eeteurocsv);

	console.log("done-eeteuro");


	fs.writeFileSync("check24/shopifyApp2logs.csv", gcsv);
	console.log("done-Shopify App 2");
	
	function calculateCustomerPriceEETEURO(num) {
		let price = (num + ((num / 100) * 41) + 10).toFixed(2);
		return doDiscount(price);
	}

	function doDiscount(num) {
		let price = num + (num / 100) * settings.DISCOUNT_ON_ALL_ARTICLES;
		return price;
	}
	
	
	
	

	function doDiscount(num) {
		let price = num + (num / 100) * settings.DISCOUNT_ON_ALL_ARTICLES;
		return price;
	}
};


// invoking the main function
getData();

setInterval(() => {
	getData();
}, 24 * 60 * 60 * 1000);



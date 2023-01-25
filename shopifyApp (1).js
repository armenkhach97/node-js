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
const LANIUSTOYSURL =
	"https://laniustoys.com/our_offer.php?offer_id=207D236E9D220D8FEEFD13E077C30E23&page_id=offer";
// URL for data
const BIKEBIZZURL =
	"https://www.bikebizz.nl/wp-load.php?security_token=ef071d48ada4502f&export_id=1&action=get_data";
	
const CYCLETECHURL =
	"http://3.71.100.109:8000/";

// start of the program
const getData = async () => {
    
	let gcsv = "Handle,Remarks\n";
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
	const productsShopifyListLANIUSTOYS = [];
	const productsShopifyListIDLANIUSTOYS = {};
	const productsShopifyListExistLANIUSTOYS = [];
	
	const productsShopifyListECOM = [];
	const productsShopifyListIDECOM = {};
	const productsShopifyListExistECOM = [];
	
	
	const productsShopifyListBIKEBIZZ = [];
	const productsShopifyListIDBIKEBIZZ = {};
	const productsShopifyListExistBIKEBIZZ = [];
	
	
	
	const productsShopifyListPCNOTEBOOK = [];
	const productsShopifyListIDPCNOTEBOOK = {};
	const productsShopifyListExistPCNOTEBOOK = [];
	
	
	
	const productsShopifyListCYCLETECH = [];
	const productsShopifyListIDCYCLETECH = {};
	const productsShopifyListExistCYCLETECH = [];
	
	
	const productsShopifyListVOLARE = [];
	const productsShopifyListIDVOLARE = {};
	const productsShopifyListExistVOLARE = [];
	
	
	const productsShopifyListCARS = [];
	const productsShopifyListIDCARS = {};
	const productsShopifyListExistCARS = [];
	
	
	
	const productsShopifyListWIFISHOP = [];
	const productsShopifyListIDWIFISHOP = {};
	const productsShopifyListExistWIFISHOP = [];
	
	
	const productsShopifyListKOSATEC = [];
	const productsShopifyListIDKOSATEC = {};
	const productsShopifyListExistKOSATEC = [];
	
	//LANIUSTOYS START
	let laniustoyscsv = "Handle,Title,Body (HTML),Vendor,Product Category,Type,Tags,Published,Option1 Name,Option1 Value,Option2 Name,Option2 Value,Option3 Name,Option3 Value,Variant SKU,Variant Grams,Variant Inventory Tracker,Variant Inventory Qty,Variant Inventory Policy,Variant Fulfillment Service,Variant Price,Variant Compare At Price,Variant Requires Shipping,Variant Taxable,Variant Barcode,Image Src,Image Position,Image Alt Text,Gift Card,SEO Title,SEO Description,Google Shopping / Google Product Category,Google Shopping / Gender,Google Shopping / Age Group,Google Shopping / MPN,Google Shopping / AdWords Grouping,Google Shopping / AdWords Labels,Google Shopping / Condition,Google Shopping / Custom Product,Google Shopping / Custom Label 0,Google Shopping / Custom Label 1,Google Shopping / Custom Label 2,Google Shopping / Custom Label 3,Google Shopping / Custom Label 4,Variant Image,Variant Weight Unit,Variant Tax Code,Cost per item,Price / International,Compare At Price / International,Status\n";
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
			if ((productsShopify[i].variants[0].sku).search("lntys-") >= 0){
				productsShopifyListIDLANIUSTOYS[productsShopify[i].variants[0].sku] = productsShopify[i].id;
				productsShopifyListLANIUSTOYS.push(productsShopify[i].variants[0].sku);
			
			}
			if ((productsShopify[i].variants[0].sku).search("ecom-") >= 0){
				productsShopifyListIDECOM[productsShopify[i].variants[0].sku] = productsShopify[i].id;
				productsShopifyListECOM.push(productsShopify[i].variants[0].sku);
			
			}
			
			if ((productsShopify[i].variants[0].sku).search("bikebizz-") >= 0){
				productsShopifyListIDBIKEBIZZ[productsShopify[i].variants[0].sku] = productsShopify[i].id;
				productsShopifyListBIKEBIZZ.push(productsShopify[i].variants[0].sku);
			
			}
			
			if ((productsShopify[i].variants[0].sku).search("pcnb-") >= 0){
				productsShopifyListIDPCNOTEBOOK[productsShopify[i].variants[0].sku] = productsShopify[i].id;
				productsShopifyListPCNOTEBOOK.push(productsShopify[i].variants[0].sku);
			
			}
			
			
			if ((productsShopify[i].variants[0].sku).search("cycletech-") >= 0){
				productsShopifyListIDCYCLETECH[productsShopify[i].variants[0].sku] = productsShopify[i].id;
				productsShopifyListCYCLETECH.push(productsShopify[i].variants[0].sku);
			
			}
			
			
			if ((productsShopify[i].variants[0].sku).search("vlre-") >= 0){
				productsShopifyListIDVOLARE[productsShopify[i].variants[0].sku] = productsShopify[i].id;
				productsShopifyListVOLARE.push(productsShopify[i].variants[0].sku);
			
			}
			
			if ((productsShopify[i].variants[0].sku).search("cars-") >= 0){
				productsShopifyListIDCARS[productsShopify[i].variants[0].sku] = productsShopify[i].id;
				productsShopifyListCARS.push(productsShopify[i].variants[0].sku);
			
			}
			
			if ((productsShopify[i].variants[0].sku).search("wfs-") >= 0){
				productsShopifyListIDWIFISHOP[productsShopify[i].variants[0].sku] = productsShopify[i].id;
				productsShopifyListWIFISHOP.push(productsShopify[i].variants[0].sku);
			
			}
			
			if ((productsShopify[i].variants[0].sku).search("kstc-") >= 0){
				productsShopifyListIDKOSATEC[productsShopify[i].variants[0].sku] = productsShopify[i].id;
				productsShopifyListKOSATEC.push(productsShopify[i].variants[0].sku);
			
			}
			
		}
		console.log(productsShopify.length);
		params = productsShopify.nextPageParameters;
	    await new Promise(r => setTimeout(r, 1150));
	} while (params !== undefined);


//VOLARE START
	let volarecsv = "Handle,Title,Body (HTML),Vendor,Product Category,Type,Tags,Published,Option1 Name,Option1 Value,Option2 Name,Option2 Value,Option3 Name,Option3 Value,Variant SKU,Variant Grams,Variant Inventory Tracker,Variant Inventory Qty,Variant Inventory Policy,Variant Fulfillment Service,Variant Price,Variant Compare At Price,Variant Requires Shipping,Variant Taxable,Variant Barcode,Image Src,Image Position,Image Alt Text,Gift Card,SEO Title,SEO Description,Google Shopping / Google Product Category,Google Shopping / Gender,Google Shopping / Age Group,Google Shopping / MPN,Google Shopping / AdWords Grouping,Google Shopping / AdWords Labels,Google Shopping / Condition,Google Shopping / Custom Product,Google Shopping / Custom Label 0,Google Shopping / Custom Label 1,Google Shopping / Custom Label 2,Google Shopping / Custom Label 3,Google Shopping / Custom Label 4,Variant Image,Variant Weight Unit,Variant Tax Code,Cost per item,Price / International,Compare At Price / International,Status\n";
	
	const tableVolare = fs.readFileSync("./volare_products_de.csv", "utf-8").split("\n");
	for (let i = 1; i < tableVolare.length; i++) {
		while (SHOPLIMITCALL) {
			console.log("limit reached : waiting 30 seconds");
			await new Promise(r => setTimeout(r, 60000));
			SHOPLIMITCALL = false;
		} 
		let product = tableVolare[i];
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
		let price = (parseFloat(productDetails[4]) + parseFloat(productDetails[32])).toFixed(2);
		let shippingtime = "3Tage";
		const updateTable = fs
				.readFileSync("./update.csv", "utf-8")
				.split("\n");
		for (let j = 1; j < updateTable.length; j++) {
			const productUPDATE = updateTable[j];
			let productUPDATEColumns = productUPDATE.replace(/(?!(([^"]*"){2})*[^"]*$),/gm, " ");
			productUPDATEColumns = productUPDATEColumns.replace(/,/gm, ";");
			let productUPDATEDetails = productUPDATEColumns.split(";");
			if (productUPDATEDetails[0] === "EAN") {
				continue;
			}
			if (productUPDATEDetails[0] === productDetails[1]){
				productDetails[5] = productUPDATEDetails[1];
				shippingtime = productUPDATEDetails[2] + "Tage";
			}
			
		}
		if (productDetails[5]  == "" || parseInt(productDetails[5]) <= 0){
		    continue;
		}
		let imgflg = false;
		try {
			console.log(productDetails[33]);
			console.log(productDetails[8]);
			let imgdownload = await download_image(productDetails[8], "../storage/media/Volare-" + productDetails[33] + ".jpg");
			imgflg = true;
		} catch (e) {
		}
		if (imgflg == false){
			continue;
		}
	
		productDetails[2] = productDetails[2].replace(/"/g, '\'');
		productDetails[7] = productDetails[7].replace(/"/g, '\'');
		productDetails[11] = productDetails[11].replace(/"/g, '\'');
		productDetails[3] = productDetails[3].replace(/"/g, '\'');
		productDetails[12] = productDetails[12].replace(/"/g, '\'');
		productDetails[1] = productDetails[1].replace(/"/g, '\'');
		productDetails[8] = productDetails[8].replace(/"/g, '\'');

		volarecsv += `"VLRE-${productDetails[33]} ${productDetails[11]} ${productDetails[2]}","${productDetails[11]} ${productDetails[2]}","${productDetails[7]}","${productDetails[11]}","Sporting Goods > Outdoor Recreation > Cycling > Bicycles","${productDetails[3]}","${productDetails[3]}",TRUE,,,,,,,"VLRE-${productDetails[33]}",,shopify,${productDetails[5]},deny,manual,${parseFloat(price).toFixed(2)},,TRUE,TRUE,${productDetails[1]},${productDetails[8]},1,,FALSE,"${productDetails[2]}","${productDetails[7]}","${productDetails[3]}",,,,,,,FALSE,,,,,,,,,,,,active\n`;
		console.log((`vlre-${productDetails[33]}`).toLowerCase());
			if (productsShopifyListVOLARE.includes((`vlre-${productDetails[33]}`).toLowerCase())){
				productsShopifyListExistVOLARE.push((`vlre-${productDetails[33]}`).toLowerCase());
				await shopify.products
					.updated(productsShopifyListIDVOLARE[(`vlre-${productDetails[33]}`).toLowerCase()],{
						"body_html": `${productDetails[7]}`,
						"handle": `vlre-${productDetails[33]} ${productDetails[2]}`,
						"product_type": "Sporting Goods > Outdoor Recreation > Cycling > Bicycles",
						"title": `${productDetails[2]}`,
						"product_category":"Sporting Goods > Outdoor Recreation > Cycling > Bicycles",
						"variants": [
							{
								"barcode": `${productDetails[1]}`,
								"compare_at_price": null,
								"fulfillment_service": "manual",
								"weight_unit": "kg",
								"inventory_management": "shopify",
								"inventory_policy": "deny",
								"inventory_quantity":  productDetails[5],
								"price": parseFloat(price).toFixed(2),
								"requires_shipping": true,
								"sku": `vlre-${productDetails[33]}`,
								"taxable": true
							}
						],
						"vendor": `${productDetails[11]}`
					})
					.then((c) => {
						console.log(`vlre-${productDetails[33]}   update`);
						gcsv += `vlre-${productDetails[33]},updated\n`;
					})
					.catch((err) => {
						console.error(err);
						gcsv += `vlre-${productDetails[33]},updating error\n`;
					});
			} else {
				await shopify.products
					.created({
						"body_html": `${productDetails[7]}`,
						"handle": `vlre-${productDetails[33]} ${productDetails[2]}`,
						"id": 632910392,
						"images":[{"src":productDetails[8]}],
						"product_type": "Sporting Goods > Outdoor Recreation > Cycling > Bicycles",
						"published_scope": "global",
						"status": "active",
						"tags": `Bicycles, ${productDetails[11]}`,
						"template_suffix": "special",
						"title": `${productDetails[2]}`,
						"product_category":"Sporting Goods > Outdoor Recreation > Cycling > Bicycles",
						"variants": [
							{
								"barcode": `${productDetails[1]}`,
								"compare_at_price": null,
								"fulfillment_service": "manual",
								"weight_unit": "kg",
								"inventory_management": "shopify",
								"inventory_policy": "deny",
								"inventory_quantity":  productDetails[5],
								"price": parseFloat(price).toFixed(2),
								"requires_shipping": true,
								"sku": `vlre-${productDetails[33]}`,
								"taxable": true
							}
						],
						"vendor": `${productDetails[11]}`
					})
					.then((c) => {
						console.log(`vlre-${productDetails[33]}   new`);
						gcsv += `vlre-${productDetails[33]},added\n`;
					})
					.catch((err) => {
						console.error(err);
						gcsv += `vlre-${productDetails[33]},adding error\n`;
					});
			}
			await new Promise(r => setTimeout(r, 1000));
	}
	
	
	for(var i in productsShopifyListVOLARE) {
		if (productsShopifyListExistVOLARE.includes(productsShopifyListVOLARE[i])){
		} else {
			await shopify.products
					.deleted(productsShopifyListIDVOLARE[productsShopifyListVOLARE[i]])
					.then((c) => {
						console.log(`${productsShopifyListVOLARE[i]}   no stock`);
						gcsv += `${productsShopifyListVOLARE[i]},no stock\n`;
					})
					.catch((err) => {
						console.error(err);
						gcsv += `${productsShopifyListVOLARE[i]},error no stock\n`;
					});
			await new Promise(r => setTimeout(r, 1000));
		}
	}
	
	
	fs.writeFileSync("check24/volare_new.csv", volarecsv);

	console.log("done-volare");
	
	
	
	//CYCLETECH START
	
	let cycletechcsv = "Handle,Title,Body (HTML),Vendor,Product Category,Type,Tags,Published,Option1 Name,Option1 Value,Option2 Name,Option2 Value,Option3 Name,Option3 Value,Variant SKU,Variant Grams,Variant Inventory Tracker,Variant Inventory Qty,Variant Inventory Policy,Variant Fulfillment Service,Variant Price,Variant Compare At Price,Variant Requires Shipping,Variant Taxable,Variant Barcode,Image Src,Image Position,Image Alt Text,Gift Card,SEO Title,SEO Description,Google Shopping / Google Product Category,Google Shopping / Gender,Google Shopping / Age Group,Google Shopping / MPN,Google Shopping / AdWords Grouping,Google Shopping / AdWords Labels,Google Shopping / Condition,Google Shopping / Custom Product,Google Shopping / Custom Label 0,Google Shopping / Custom Label 1,Google Shopping / Custom Label 2,Google Shopping / Custom Label 3,Google Shopping / Custom Label 4,Variant Image,Variant Weight Unit,Variant Tax Code,Cost per item,Price / International,Compare At Price / International,Status\n";
	let cycleproduct = [];
	const csvTableCYCLETECH = fs
		.readFileSync("./cycletech.csv", "utf-8")
		.split("\n");
	for (let i = 1; i < csvTableCYCLETECH.length; i++) {
		while (SHOPLIMITCALL) {
			console.log("limit reached : waiting 30 seconds");
			await new Promise(r => setTimeout(r, 60000));
			SHOPLIMITCALL = false;
		} 
		let product = csvTableCYCLETECH[i];
		let productDetails = product.split('	');
		if (productDetails[7] === undefined || productDetails[7] == "" ||
			productDetails[5] === undefined || productDetails[5] == "" ||
			productDetails[4] === undefined || parseInt(productDetails[4]) <= 0 ||
			productDetails[8] === undefined || parseInt(productDetails[8]) <= 0){
			continue;
		}
		
		if (
			settings.DELETED_PRODUCTS.includes(productDetails[2]) ||
			settings.DELETED_PRODUCTS.includes(parseInt(productDetails[2]))
		) {
			continue;
		}
		
		let shippingtime = "3Tage";
		let stocks = 0;
		if (productDetails[4] == "in stock"){
			stocks = 2;
		} else {
			stocks = parseInt(productDetails[4]);
		}
		const updateTable = fs
				.readFileSync("./update.csv", "utf-8")
				.split("\n");
		for (let j = 1; j < updateTable.length; j++) {
			const productUPDATE = updateTable[j];
			let productUPDATEColumns = productUPDATE.replace(/(?!(([^"]*"){2})*[^"]*$),/gm, " ");
			productUPDATEColumns = productUPDATEColumns.replace(/,/gm, ";");
			let productUPDATEDetails = productUPDATEColumns.split(";");
			if (productUPDATEDetails[0] === "EAN") {
				continue;
			}
			if (productUPDATEDetails[0] === productDetails[7]){
				stocks = productUPDATEDetails[1];
				shippingtime = productUPDATEDetails[2] + "Tage";
			}
			
		}
		
		try {
			let imgurl = productDetails[5];
			console.log(imgurl);
			console.log(productDetails[0]);
			if (productDetails[0] >= "F001"){
				productDetails[8] = parseFloat(calculateCycleTechPrice(productDetails[8], 80));
			} else {
				productDetails[8] = parseFloat(calculateCycleTechPrice(productDetails[8], 9));
			}
			let translatedTitle = "";
			for (let iTRANS = 0; iTRANS < productDetails[1].length; iTRANS+=1000){
				await translate(productDetails[1].substring(iTRANS, iTRANS + 1000), { from: 'nl', to: 'de' }).then(res => {
					translatedTitle += res.text; // OUTPUT: Je vous remercie
				 
				}).catch(err => {
				  
				});
			}
			productDetails[1] = translatedTitle;
			
			let translatedDescription = "";
			for (let iTRANS = 0; iTRANS < productDetails[2].length; iTRANS+=1000){
				await translate(productDetails[2].substring(iTRANS, iTRANS + 1000), { from: 'nl', to: 'de' }).then(res => {
					translatedDescription += res.text; // OUTPUT: Je vous remercie
				 
				}).catch(err => {
				  
				});
			}
			productDetails[2] = translatedDescription;

			
			cycletechcsv += `"CYCLETECH-${productDetails[0]} ${productDetails[1]}","${productDetails[1]}","${productDetails[2]}","Cycle Tech","Sporting Goods > Outdoor Recreation > Cycling > Bicycles","Bicycle","Sporting Goods > Outdoor Recreation > Cycling > Bicycles",TRUE,,,,,,,"CYCLETECH-${productDetails[0]}",,shopify,${stocks},deny,manual,${parseFloat(productDetails[8]).toFixed(2)},,TRUE,TRUE,${productDetails[7]},${imgurl},1,,FALSE,"${productDetails[1]}","${productDetails[1]}","Bicycle",,,,,,,FALSE,,,,,,,,,,,,active\n`;
			console.log((`cycletech-${productDetails[0]}`).toLowerCase());
			if (productsShopifyListCYCLETECH.includes((`cycletech-${productDetails[0]}`).toLowerCase())){
				productsShopifyListExistCYCLETECH.push((`cycletech-${productDetails[0]}`).toLowerCase());
				await shopify.products
					.updated(productsShopifyListIDCYCLETECH[(`cycletech-${productDetails[0]}`).toLowerCase()],{
						"body_html": `${productDetails[2]}`,
						"product_type": "Sporting Goods > Outdoor Recreation > Cycling > Bicycles",
						"handle": `cycletech-${productDetails[0]} ${productDetails[1]}`,
						"title": `${productDetails[1]}`,
						"product_category":"Sporting Goods > Outdoor Recreation > Cycling > Bicycles",
						"variants": [
							{
								"barcode": `${productDetails[7]}`,
								"compare_at_price": null,
								"fulfillment_service": "manual",
								"weight_unit": "kg",
								"inventory_management": "shopify",
								"inventory_policy": "deny",
								"inventory_quantity": stocks,
								"price": parseFloat(productDetails[8]).toFixed(2),
								"requires_shipping": true,
								"sku": `cycletech-${productDetails[0]}`,
								"taxable": true
							}
						],
						"vendor": `Cycle Tech`
					})
					.then((c) => {
						console.log(`cycletech-${productDetails[0]}   update`);
						gcsv += `cycletech-${productDetails[0]},updated\n`;
					})
					.catch((err) => {
						console.error(err);
						gcsv += `cycletech-${productDetails[0]},updating error\n`;
					});
			} else {
				await shopify.products
					.created({
						"body_html": `${productDetails[2]}`,
						"handle": `cycletech-${productDetails[0]} ${productDetails[1]}`,
						"id": 632910392,
						"images":[{"src":imgurl}],
						"product_type": "Sporting Goods > Outdoor Recreation > Cycling > Bicycles",
						"published_scope": "global",
						"status": "active",
						"tags": `Bicycles`,
						"template_suffix": "special",
						"title": `${productDetails[1]}`,
						"product_category":"Sporting Goods > Outdoor Recreation > Cycling > Bicycles",
						"variants": [
							{
								"barcode": `${productDetails[7]}`,
								"compare_at_price": null,
								"fulfillment_service": "manual",
								"weight_unit": "kg",
								"inventory_management": "shopify",
								"inventory_policy": "deny",
								"inventory_quantity": stocks,
								"price": parseFloat(productDetails[8]).toFixed(2),
								"requires_shipping": true,
								"sku": `cycletech-${productDetails[0]}`,
								"taxable": true
							}
						],
						"vendor": `Cycle Tech`
					})
					.then((c) => {
						console.log(`cycletech-${productDetails[0]}   new`);
						gcsv += `cycletech-${productDetails[0]},added\n`;
					})
					.catch((err) => {
						console.error(err);
						gcsv += `cycletech-${productDetails[0]},adding error\n`;
					});
			}
			await new Promise(r => setTimeout(r, 1000));
		} catch(e){
			
		}
	}
	

	for(var i in productsShopifyListCYCLETECH) {
		if (productsShopifyListExistCYCLETECH.includes(productsShopifyListCYCLETECH[i])){
		} else {
			await shopify.products
					.deleted(productsShopifyListIDCYCLETECH[productsShopifyListCYCLETECH[i]])
					.catch((err) => {
						console.error(err);
						gcsv += `c${productsShopifyListCYCLETECH[i]},error no stock\n`;
					});
			await new Promise(r => setTimeout(r, 1000));
		}
	}
	
	
	fs.writeFileSync("check24/cycletech_new.csv", cycletechcsv);
	console.log("done-cycletech");
	
    const dataLANIUSTOYS = await getRawData(LANIUSTOYSURL);
	const html = parse(dataLANIUSTOYS);
	const table = html.querySelectorAll("table td");
	const quantity = html.querySelectorAll("table td input.qty_input");
	let obj = {};
	for (let i = 9; i < table.length; i++) {
		if (counter != 8) {
			obj = {
				...obj,
				[getContentName(counter)]: table[i].innerHTML,
			};
		} else {
			obj = {
				...obj,
				qty: quantity[products.length]?.attributes?.value,
			};
			counter = 0;
			products.push(obj);
			obj = {};
			continue;
		}

		counter++;
	}
	let prevPARTNUMBER = "";
	for (const product of products) {
	    while (SHOPLIMITCALL) {
			console.log("limit reached : waiting 30 seconds");
			await new Promise(r => setTimeout(r, 60000));
			SHOPLIMITCALL = false;
		} 
		if (
			product.contition === "A" ||
			product.contition === "B" ||
			product.contition === "A+" ||
			settings.LANIUSTOYS_EAN_INCLUDE.includes(product.ean)
		) {
			if (prevPARTNUMBER == product.partNumber){
				continue;
			}
			product.img = product.img.replace(/.+?(?=<img)/gms, "");
			product.img = product.img.replace(/"/gms, "'");
			product.desc = product.desc.replace(/,/gms, " ");

			const price = product.price.split("&euro; ");
			let priceInNumber = calculatePrice(parseInt(price[1]), 3);
			let pn = product.desc.split("- ");
			let name = pn[0].split("");
			let desc;
			if (pn[1] === undefined) {
				pn = product.desc.split(" ");
				pn.unshift();
				desc = pn.join("").toString();
			} else {
				desc = pn[1];
			}

			desc = desc.split("");

			if (name[name.length - 1] === " ") {
				name.pop();
			}

			if (desc[desc.length - 1] === " ") {
				desc.pop();
			}

			name = name.join("");
			desc = desc.join("");

			product.price = `&euro; ${price[0]} ${priceInNumber}}`;

			if (product.partNumber === undefined) {
				continue;
			}

			if (settings.PRODUCT_PRICE[product.ean]) {
				priceInNumber = settings.PRODUCT_PRICE[product.ean];
			}

			if (
				settings.DELETED_PRODUCTS.includes(product.ean) ||
				settings.DELETED_PRODUCTS.includes(parseInt(product.ean))
			) {
				continue;
			}
			
			
			let shippingtime = "3Tage";
			const updateTable = fs
					.readFileSync("./update.csv", "utf-8")
					.split("\n");
			for (let j = 1; j < updateTable.length; j++) {
				const productUPDATE = updateTable[j];
				let productUPDATEColumns = productUPDATE.replace(/(?!(([^"]*"){2})*[^"]*$),/gm, " ");
				productUPDATEColumns = productUPDATEColumns.replace(/,/gm, ";");
				let productUPDATEDetails = productUPDATEColumns.split(";");
				if (productUPDATEDetails[0] === "EAN") {
					continue;
				}
				if (productUPDATEDetails[0] === product.ean){
					product.qty = productUPDATEDetails[1];
					shippingtime = productUPDATEDetails[2] + "Tage";
				}
				
			}
			let imgurl = product.img.substring(86, product.img.indexOf(">") - 24)
			console.log(imgurl);
			let imgflg = false;
			try {
				let imgdownload = await download_image(imgurl, "../storage/media/Laniustoys-" + product.partNumber + ".jpg");
				imgflg = true;
			} catch (e) {
			}
			if (imgflg == false){
				continue;
			}
			name = name.replace(/"/g, '\'');
			desc = desc.replace(/"/g, '\'');
			laniustoyscsv += `"LNTYS-${product.partNumber} ${name} ${desc}","${name} ${desc}","${desc}","${name}","Toys & Games > Toys","Toys","Toys,${name}",TRUE,,,,,,,"LNTYS-${product.partNumber}",,shopify,${product.qty},deny,manual,${parseFloat(priceInNumber).toFixed(2)},,TRUE,TRUE,${product.ean},${imgurl},1,,FALSE,"${name} ${desc}","${desc}","Toys",,,,,,,FALSE,,,,,,,,,,,,active\n`;
			console.log((`LNTYS-${product.partNumber}`).toLowerCase());
			if (productsShopifyListLANIUSTOYS.includes((`LNTYS-${product.partNumber}`).toLowerCase())){
				productsShopifyListExistLANIUSTOYS.push((`LNTYS-${product.partNumber}`).toLowerCase());
				await shopify.products
					.updated(productsShopifyListIDLANIUSTOYS[(`LNTYS-${product.partNumber}`).toLowerCase()],{
						"body_html": `${desc}`,
						"handle": `LNTYS-${product.partNumber} ${name} ${desc}`,
						"product_type": "Toys & Games > Toys",
						"title": `${name} ${desc}`,
						"product_category":"Toys & Games > Toys",
						"variants": [
							{
								"barcode": `${product.ean}`,
								"compare_at_price": null,
								"fulfillment_service": "manual",
								"weight_unit": "kg",
								"inventory_management": "shopify",
								"inventory_policy": "deny",
								"inventory_quantity": product.qty,
								"price": parseFloat(priceInNumber).toFixed(2),
								"requires_shipping": true,
								"sku": `LNTYS-${product.partNumber}`,
								"taxable": true
							}
						],
						"vendor": `${name}`
					})
					.then((c) => {
						console.log(`LNTYS-${product.partNumber}   update`);
						gcsv += `LNTYS-${product.partNumber},updated\n`;
					})
					.catch((err) => {
						console.error(err);
						gcsv += `LNTYS-${product.partNumber},updating error\n`;
					});
					
			} else {
				await shopify.products
					.created({
						"body_html": `${desc}`,
						"handle": `LNTYS-${product.partNumber} ${name} ${desc}`,
						"id": 632910392,
						"images":[{"src":imgurl}],
						"product_type": "Toys & Games > Toys",
						"published_scope": "global",
						"status": "active",
						"tags": "Toys, Kids",
						"template_suffix": "special",
						"title": `${name} ${desc}`,
						"product_category":"Toys & Games > Toys",
						"variants": [
							{
								"barcode": `${product.ean}`,
								"compare_at_price": null,
								"fulfillment_service": "manual",
								"weight_unit": "kg",
								"inventory_management": "shopify",
								"inventory_policy": "deny",
								"inventory_quantity": product.qty,
								"price": parseFloat(priceInNumber).toFixed(2),
								"requires_shipping": true,
								"sku": `LNTYS-${product.partNumber}`,
								"taxable": true
							}
						],
						"vendor": `${name}`
					})
					.then((c) => {
						console.log(`LNTYS-${product.partNumber}   new`);
						gcsv += `LNTYS-${product.partNumber},added\n`;
					})
					.catch((err) => {
						console.error(err);
						gcsv += `LNTYS-${product.partNumber},adding error\n`;
					});
			}

			
			prevPARTNUMBER = product.partNumber;
			await new Promise(r => setTimeout(r, 1000));
		}
	}
	
	for(var i in productsShopifyListLANIUSTOYS) {
		if (productsShopifyListExistLANIUSTOYS.includes(productsShopifyListLANIUSTOYS[i])){
		} else {
			await shopify.products
					.deleted(productsShopifyListIDLANIUSTOYS[productsShopifyListLANIUSTOYS[i]])
					.then((c) => {
						console.log(`${productsShopifyListLANIUSTOYS[i]}   no stock`);
						gcsv += `${productsShopifyListLANIUSTOYS[i]},no stock\n`;
					})
					.catch((err) => {
						console.error(err);
						gcsv += `${productsShopifyListLANIUSTOYS[i]},error no stock\n`;
					});
			await new Promise(r => setTimeout(r, 1000));
		}
	}
	
	fs.writeFileSync("check24/laniustoys_new.csv", laniustoyscsv);
	console.log("done-laniustoys");
	
	
	//WIFISHOP START
	
	const settingsWIFISHOPFile = fs.readFileSync("./urllist.json", "utf-8");
	const settingsWIFISHOP = JSON.parse(settingsWIFISHOPFile);
	const productsURL = []
	let wifishopcsv = "Handle,Title,Body (HTML),Vendor,Product Category,Type,Tags,Published,Option1 Name,Option1 Value,Option2 Name,Option2 Value,Option3 Name,Option3 Value,Variant SKU,Variant Grams,Variant Inventory Tracker,Variant Inventory Qty,Variant Inventory Policy,Variant Fulfillment Service,Variant Price,Variant Compare At Price,Variant Requires Shipping,Variant Taxable,Variant Barcode,Image Src,Image Position,Image Alt Text,Gift Card,SEO Title,SEO Description,Google Shopping / Google Product Category,Google Shopping / Gender,Google Shopping / Age Group,Google Shopping / MPN,Google Shopping / AdWords Grouping,Google Shopping / AdWords Labels,Google Shopping / Condition,Google Shopping / Custom Product,Google Shopping / Custom Label 0,Google Shopping / Custom Label 1,Google Shopping / Custom Label 2,Google Shopping / Custom Label 3,Google Shopping / Custom Label 4,Variant Image,Variant Weight Unit,Variant Tax Code,Cost per item,Price / International,Compare At Price / International,Status\n";
	
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
							while (SHOPLIMITCALL) {
								console.log("limit reached : waiting 30 seconds");
								await new Promise(r => setTimeout(r, 60000));
								SHOPLIMITCALL = false;
							} 
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
							const PRODUCTNAMESELECTOR = html.querySelector(".product-name");
							let prodName =  productdetail.name.replace(","," ").replace(/"/g, '');
							if (PRODUCTNAMESELECTOR !== null && PRODUCTNAMESELECTOR.innerText !== undefined){
								prodName = PRODUCTNAMESELECTOR.innerText.trim().replace(/(\r\n|\n|\r)/gm, " ").replace(/ +(?= )/g,'').replace(/"/g, "'");
							}
							
							const PRODUCTDESCRIPTIONSELECTOR = html.querySelector("#productInfo");
							let prodDescription = prodName;
							if (PRODUCTDESCRIPTIONSELECTOR !== null && PRODUCTDESCRIPTIONSELECTOR.innerText !== undefined){
								prodDescription = PRODUCTDESCRIPTIONSELECTOR.innerText.replace(/'/g, '').replace(/"/g, '\'');
							}
							productdetail.name = productdetail.name.replace(","," ");
							if (isNaN(parseFloat(productdetail.price.priceVat)) || parseFloat((productdetail.price.priceVat.replace(".","")).replace(",", ".")) <= 0.00){
								continue;
							}
							productdetail.price.priceVat = wifishopCalc(parseFloat((productdetail.price.priceVat.replace(".","")).replace(",", ".")));
							
							let translateddescription = "";
							for (let iTRANS = 0; iTRANS < prodDescription.length; iTRANS+=1000){
								await translate(prodDescription.substring(iTRANS, iTRANS + 1000), { from: 'nl', to: 'de' }).then(res => {
									translateddescription += res.text; // OUTPUT: Je vous remercie
								 
								}).catch(err => {
								  
								});
							}
							translateddescription = translateddescription.replace(/"/g, '\'').replace(/(\r\n|\n|\r)/gm, "<br/>");
							let imgflg = false;
							let IMGURL = "";
						
								
							try {
								imgflg = false;
								let imgdownload = await download_image("https://data.kommago.nl/img/products/large/" + productdetail.image, "../storage/media/WifiShop-" + productdetail.id + ".jpg");
								IMGURL = "https://data.kommago.nl/img/products/large/" + productdetail.image;
								console.log("https://data.kommago.nl/img/products/large/" + productdetail.image);
								imgflg = true;
							} catch (e) {
							
							}
							if (imgflg == false){
								continue;
							}
							let translatedprodName = "";
							for (let iTRANS = 0; iTRANS < prodName.length; iTRANS+=1000){
								await translate(prodName.substring(iTRANS, iTRANS + 1000), { from: 'nl', to: 'de' }).then(res => {
									translatedprodName += res.text; // OUTPUT: Je vous remercie
								 
								}).catch(err => {
								  
								});
							}
							prodName = translatedprodName;
							wifishopcsv += `"WFS-${productdetail.id} ${prodName}","${prodName}","${translateddescription}","${BRANDVALUE}","Electronics > Networking","Electronics","Electronics,Networking",TRUE,,,,,,,"WFS-${productdetail.id}",,shopify,2,deny,manual,${parseFloat(productdetail.price.priceVat).toFixed(2)},,TRUE,TRUE,${EANVALUE},${IMGURL},1,,FALSE,"${prodName}","${translateddescription}","Electronics > Networking",,,,,,,FALSE,,,,,,,,,,,,active\n`;
							console.log((`wfs-${productdetail.id}`).toLowerCase());
							if (productsShopifyListWIFISHOP.includes((`wfs-${productdetail.id}`).toLowerCase())){
								productsShopifyListExistWIFISHOP.push((`wfs-${productdetail.id}`).toLowerCase());
								await shopify.product
									.update(productsShopifyListIDWIFISHOP[(`wfs-${productdetail.id}`).toLowerCase()],{
										"body_html": `${translateddescription}`,
										"handle": `wfs-${productdetail.id} ${prodName}`,
										"product_type": "Electronics > Networking",
										"title": `${prodName}`,
										"product_category":"Electronics > Networking",
										"variants": [
											{
												"barcode": `${EANVALUE}`,
												"compare_at_price": null,
												"fulfillment_service": "manual",
												"weight_unit": "kg",
												"inventory_management": "shopify",
												"inventory_policy": "deny",
												"inventory_quantity": 2,
												"price": parseFloat(productdetail.price.priceVat).toFixed(2),
												"requires_shipping": true,
												"sku": `wfs-${productdetail.id}`,
												"taxable": true
											}
										],
										"vendor": `${BRANDVALUE}`
									})
									.then((c) => {
										console.log(`wfs-${productdetail.id}   update`);
										gcsv += `wfs-${productdetail.id},updated\n`;
									})
									.catch((err) => {
										console.error(err);
										gcsv += `wfs-${productdetail.id},updating error\n`;
									});
							} else {
								await shopify.product
									.create({
										"body_html": `${translateddescription}`,
										"handle": `wfs-${productdetail.id} ${prodName}`,
										"id": 632910392,
										"images":[{"src":IMGURL}],
										"product_type": "Electronics > Networking",
										"published_scope": "global",
										"status": "active",
										"tags": `Electronics,Networking`,
										"template_suffix": "special",
										"title": `${prodName}`,
										"product_category":"Electronics > Networking",
										"variants": [
											{
												"barcode": `${EANVALUE}`,
												"compare_at_price": null,
												"fulfillment_service": "manual",
												"weight_unit": "kg",
												"inventory_management": "shopify",
												"inventory_policy": "deny",
												"inventory_quantity": 2,
												"price": parseFloat(productdetail.price.priceVat).toFixed(2),
												"requires_shipping": true,
												"sku": `wfs-${productdetail.id}`,
												"taxable": true
											}
										],
										"vendor": `${BRANDVALUE}`
									})
									.then((c) => {
										console.log(`wfs-${productdetail.id}   new`);
										gcsv += `wfs-${productdetail.id},added\n`;
									})
									.catch((err) => {
										console.error(err);
										gcsv += `wfs-${productdetail.id},adding error\n`;
									});
							}
							await new Promise(r => setTimeout(r, 1000));
							
						}
					}
				}
			}
		}
	}
	
	for(var i in productsShopifyListWIFISHOP) {
		if (productsShopifyListExistWIFISHOP.includes(productsShopifyListWIFISHOP[i])){
		} else {
			await shopify.product
					.delete(productsShopifyListIDWIFISHOP[productsShopifyListWIFISHOP[i]])
					.then((c) => {
						console.log(`${productsShopifyListWIFISHOP[i]}   no stock`);
						gcsv += `${productsShopifyListWIFISHOP[i]},no stock\n`;
					})
					.catch((err) => {
						console.error(err);
						gcsv += `${productsShopifyListWIFISHOP[i]},error no stock\n`;
					});
			await new Promise(r => setTimeout(r, 1000));
		}
	}
	fs.writeFileSync("check24/wifishop_new.csv", wifishopcsv);
	console.log("done-wifishop");
	
	
	
		//CARS4KIDSTRADING START
	await download_image("https://www.cars4kidstrading.com/live/stock.csv", "cars4kidstrading.csv");
	
	let cars4kidstradingcsv = "Handle,Title,Body (HTML),Vendor,Product Category,Type,Tags,Published,Option1 Name,Option1 Value,Option2 Name,Option2 Value,Option3 Name,Option3 Value,Variant SKU,Variant Grams,Variant Inventory Tracker,Variant Inventory Qty,Variant Inventory Policy,Variant Fulfillment Service,Variant Price,Variant Compare At Price,Variant Requires Shipping,Variant Taxable,Variant Barcode,Image Src,Image Position,Image Alt Text,Gift Card,SEO Title,SEO Description,Google Shopping / Google Product Category,Google Shopping / Gender,Google Shopping / Age Group,Google Shopping / MPN,Google Shopping / AdWords Grouping,Google Shopping / AdWords Labels,Google Shopping / Condition,Google Shopping / Custom Product,Google Shopping / Custom Label 0,Google Shopping / Custom Label 1,Google Shopping / Custom Label 2,Google Shopping / Custom Label 3,Google Shopping / Custom Label 4,Variant Image,Variant Weight Unit,Variant Tax Code,Cost per item,Price / International,Compare At Price / International,Status\n";
	
	const browserCars4Kids = await puppeteer.launch({headless: true, args:['--no-sandbox']});
	//const browser = await puppeteer.launch({headless: false});
	const pagecars4Kids = await browserCars4Kids.newPage();
	//await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36');
	await pagecars4Kids.setViewport({ width: 1366, height: 768});
	await pagecars4Kids.setDefaultNavigationTimeout(0);
	await pagecars4Kids.goto("https://www.cars4kidstrading.com/my-account/", { waitUntil: 'networkidle0' }); // wait until page load
	await pagecars4Kids.type("#username", "info@ejimm.de");
	await pagecars4Kids.type("#password", "Samlondon36");
	await Promise.all([
		pagecars4Kids.click("#customer_login > div.u-column1.col-xs-12.col-sm-8 > form > p:nth-child(3) > button"),
		pagecars4Kids.waitForNavigation({ waitUntil: 'domcontentloaded' }),
	]);
	await pagecars4Kids.click("#gtranslate_wrapper > div.switcher.notranslate > div.selected > a");
	await pagecars4Kids.waitForTimeout(2000)
	await pagecars4Kids.click("#gtranslate_wrapper > div.switcher.notranslate > div.option > a:nth-child(4)");
	await pagecars4Kids.waitForNavigation();
	const csvTableCars4Kids = fs
		.readFileSync("./cars4kidstrading.csv", "utf-8")
		.split("\n");
	for (let i = 1; i < csvTableCars4Kids.length; i++) {
		while (SHOPLIMITCALL) {
			console.log("limit reached : waiting 30 seconds");
			await new Promise(r => setTimeout(r, 60000));
			SHOPLIMITCALL = false;
		} 
		let firstcomma = csvTableCars4Kids[i].indexOf(",");
		let lastcomma = csvTableCars4Kids[i].lastIndexOf(",");
		let productID = csvTableCars4Kids[i].substring(0,firstcomma);
		let productSKU = csvTableCars4Kids[i].substring(firstcomma + 1,lastcomma);
		let stock = csvTableCars4Kids[i].substring(lastcomma + 1,csvTableCars4Kids[i].length);
		if (stock == "0" || stock == ""){
			continue;
		}
		console.log(productSKU);
		await pagecars4Kids.goto("https://www.cars4kidstrading.com/?post_type=product&s=" + productSKU.replaceAll(' ', '+').replace(/"/g, ''), { waitUntil: 'networkidle0' }); // wait until page load
		try {
			let PRODUCTNAME = await pagecars4Kids.$eval(".product_title", (element) => {
									return element.innerText});
										
			let PRODUCTDESCRIPTION = await pagecars4Kids.$eval("#short-description", (element) => {
									return element.innerText}); 
			let PRODUCTPRICE = await pagecars4Kids.$eval("#seox-add-to-cart > p.price > ins > span > bdi > font > font", (element) => {
									return element.innerText}); 
			PRODUCTDESCRIPTION = PRODUCTDESCRIPTION.replace(/"/g, "").replace(/(\r\n|\n|\r)/gm, "<br/>");
			PRODUCTNAME = PRODUCTNAME.replace(/"/g, "").replace(/(\r\n|\n|\r)/gm, "<br/>");
			PRODUCTPRICE = calculateCustomerPriceCars4Kids(parseFloat((PRODUCTPRICE.replace(".","")).replace(",", ".")));
			const imgs = await pagecars4Kids.$eval('div.woocommerce-product-gallery__image.flex-active-slide > img', img => img.src);
			let imgdownload = await download_image(imgs, "../storage/media/" + productID + ".jpg");
			if (parseInt(stock) <= 0){
    		    continue;
    		}
			cars4kidstradingcsv += `"CARS-${productID} ${PRODUCTNAME}","${PRODUCTNAME}","${PRODUCTDESCRIPTION}","Ejimm Toys","Toys & Games > Toys > Play Vehicles","Cars","Toys & Games > Toys > Play Vehicles",TRUE,,,,,,,"CARS-${productID}",,shopify,${stock},deny,manual,${parseFloat(PRODUCTPRICE).toFixed(2)},,TRUE,TRUE,${productSKU.replace(/"/g, '')},${imgs},1,,FALSE,"${PRODUCTNAME}","${PRODUCTDESCRIPTION}","Toys",,,,,,,FALSE,,,,,,,,,,,,active\n`;
			console.log((`cars-${productID}`).toLowerCase());
			if (productsShopifyListCARS.includes((`cars-${productID}`).toLowerCase())){
				productsShopifyListExistCARS.push((`cars-${productID}`).toLowerCase());
				await shopify.product
					.update(productsShopifyListIDCARS[(`cars-${productID}`).toLowerCase()],{
						"body_html": `${PRODUCTDESCRIPTION}`,
						"handle": `cars-${productID} EJIMM ${PRODUCTNAME}`,
						"product_type": "Toys & Games > Toys > Play Vehicles",
						"title": `EJIMM ${PRODUCTNAME}`,
						"product_category":"Toys & Games > Toys > Play Vehicles",
						"variants": [
							{
								"barcode": `${productSKU.replace(/"/g, '')}`,
								"compare_at_price": null,
								"fulfillment_service": "manual",
								"weight_unit": "kg",
								"inventory_management": "shopify",
								"inventory_policy": "deny",
								"inventory_quantity": stock,
								"price": parseFloat(PRODUCTPRICE).toFixed(2),
								"requires_shipping": true,
								"sku": `cars-${productID}`,
								"taxable": true
							}
						],
						"vendor": `Ejimm Toys`
					})
					.then((c) => {
						console.log(`cars-${productID}   update`);
						gcsv += `cars-${productID},updated\n`;
					})
					.catch((err) => {
						console.error(err);
						gcsv += `cars-${productID},updating error\n`;
					});
			} else {
				await shopify.product
					.create({
						"body_html": `${PRODUCTDESCRIPTION}`,
						"handle": `cars-${productID} EJIMM ${PRODUCTNAME}`,
						"id": 632910392,
						"images":[{"src":imgs}],
						"product_type": "Toys & Games > Toys > Play Vehicles",
						"published_scope": "global",
						"status": "active",
						"tags": `Cars`,
						"template_suffix": "special",
						"title": `EJIMM ${PRODUCTNAME}`,
						"product_category":"Toys & Games > Toys > Play Vehicles",
						"variants": [
							{
								"barcode": `${productSKU.replace(/"/g, '')}`,
								"compare_at_price": null,
								"fulfillment_service": "manual",
								"weight_unit": "kg",
								"inventory_management": "shopify",
								"inventory_policy": "deny",
								"inventory_quantity": stock,
								"price": parseFloat(PRODUCTPRICE).toFixed(2),
								"requires_shipping": true,
								"sku": `cars-${productID}`,
								"taxable": true
							}
						],
						"vendor": `Ejimm Toys`
					})
					.then((c) => {
						console.log(`cars-${productID}   new`);
						gcsv += `cars-${productID},added\n`;
					})
					.catch((err) => {
						console.error(err);
						gcsv += `cars-${productID},adding error\n`;
					});
			}
			await new Promise(r => setTimeout(r, 1000));
			
		} catch(e){
			
		}
		
		
		
	}
	
	for(var i in productsShopifyListCARS) {
		if (productsShopifyListExistCARS.includes(productsShopifyListCARS[i])){
		} else {
			await shopify.product
					.delete(productsShopifyListIDCARS[productsShopifyListCARS[i]])
					.then((c) => {
						console.log(`${productsShopifyListCARS[i]}   no stock`);
						gcsv += `${productsShopifyListCARS[i]},no stock\n`;
					})
					.catch((err) => {
						console.error(err);
						gcsv += `${productsShopifyListCARS[i]},error no stock\n`;
					});
			await new Promise(r => setTimeout(r, 1000));
		}
	}
	fs.writeFileSync("check24/cars4kidstrading_new.csv", cars4kidstradingcsv);

	console.log("done-CARS");
	
	
	//BIKEBIZZ START
	let bikebizzcsv = "Handle,Title,Body (HTML),Vendor,Product Category,Type,Tags,Published,Option1 Name,Option1 Value,Option2 Name,Option2 Value,Option3 Name,Option3 Value,Variant SKU,Variant Grams,Variant Inventory Tracker,Variant Inventory Qty,Variant Inventory Policy,Variant Fulfillment Service,Variant Price,Variant Compare At Price,Variant Requires Shipping,Variant Taxable,Variant Barcode,Image Src,Image Position,Image Alt Text,Gift Card,SEO Title,SEO Description,Google Shopping / Google Product Category,Google Shopping / Gender,Google Shopping / Age Group,Google Shopping / MPN,Google Shopping / AdWords Grouping,Google Shopping / AdWords Labels,Google Shopping / Condition,Google Shopping / Custom Product,Google Shopping / Custom Label 0,Google Shopping / Custom Label 1,Google Shopping / Custom Label 2,Google Shopping / Custom Label 3,Google Shopping / Custom Label 4,Variant Image,Variant Weight Unit,Variant Tax Code,Cost per item,Price / International,Compare At Price / International,Status\n";
	
	const dataBIKEBIZZ = await getRawData(BIKEBIZZURL);
	const htmlBIKEBIZZ = parse(dataBIKEBIZZ);
	const tableBIKEBIZZ = htmlBIKEBIZZ.querySelectorAll("product");
	
	for (let i = 0; i < tableBIKEBIZZ.length; i++) {
	    while (SHOPLIMITCALL) {
			console.log("limit reached : waiting 30 seconds");
			await new Promise(r => setTimeout(r, 60000));
			SHOPLIMITCALL = false;
		} 
		let xml_id = tableBIKEBIZZ[i].getElementsByTagName("xml_id")[0].innerHTML.replace("<![CDATA[", "").replace("]]>","");
		let beacon_id = tableBIKEBIZZ[i].getElementsByTagName("beacon_id")[0].innerHTML.replace("<![CDATA[", "").replace("]]>","");
		let category = tableBIKEBIZZ[i].getElementsByTagName("categorie")[0].innerHTML.replace("<![CDATA[", "").replace("]]>","");
		let brand = tableBIKEBIZZ[i].getElementsByTagName("merk")[0].innerHTML.replace("<![CDATA[", "").replace("]]>","");
		let type = tableBIKEBIZZ[i].getElementsByTagName("type")[0].innerHTML.replace("<![CDATA[", "").replace("]]>","");
		let retailprice = tableBIKEBIZZ[i].getElementsByTagName("adviesprijs")[0].innerHTML.replace("<![CDATA[", "").replace("]]>","");
    	retailprice = retailprice.replace(/,/gm, ".");
		let purchaseprice = tableBIKEBIZZ[i].getElementsByTagName("inkkoopprijs")[0].innerHTML.replace("<![CDATA[", "").replace("]]>","");
		let shippingcost = tableBIKEBIZZ[i].getElementsByTagName("verzendkosten")[0].innerHTML.replace("<![CDATA[", "").replace("]]>","");
		shippingcost = shippingcost.replace(/,/gm, ".");
		let stock = tableBIKEBIZZ[i].getElementsByTagName("voorraad")[0].innerHTML.replace("<![CDATA[", "").replace("]]>","");
		let ean = tableBIKEBIZZ[i].getElementsByTagName("ean")[0].innerHTML.replace("<![CDATA[", "").replace("]]","");
		let description = tableBIKEBIZZ[i].getElementsByTagName("omschrijving")[0].innerHTML.replace("<![CDATA[", "").replace("]]>","");
		let color = tableBIKEBIZZ[i].getElementsByTagName("kleur")[0].innerHTML.replace("<![CDATA[", "").replace("]]>","");
	    let imgURL = tableBIKEBIZZ[i].getElementsByTagName("afbeelding")[0].innerHTML.split("|")[0];
        if (isNaN(parseFloat(shippingcost))){
			shippingcost = 0;
		}
		retailprice =calculateBikebizzCustomerPrice(parseFloat(retailprice), parseFloat(shippingcost));
		if (
			settings.DELETED_PRODUCTS.includes(ean) ||
			settings.DELETED_PRODUCTS.includes(parseInt(ean))
		) {
			continue;
		}
		
		let shippingtime = "3Tage";
		let stocks = stock;
		const updateTable = fs
				.readFileSync("./update.csv", "utf-8")
				.split("\n");
		for (let j = 1; j < updateTable.length; j++) {
			const productUPDATE = updateTable[j];
			let productUPDATEColumns = productUPDATE.replace(/(?!(([^"]*"){2})*[^"]*$),/gm, " ");
			productUPDATEColumns = productUPDATEColumns.replace(/,/gm, ";");
			let productUPDATEDetails = productUPDATEColumns.split(";");
			if (productUPDATEDetails[0] === "EAN") {
				continue;
			}
			if (productUPDATEDetails[0] === ean){
				stocks = productUPDATEDetails[1];
				shippingtime = productUPDATEDetails[2] + "Tage";
			}
			
		}
		if (stocks == "" || parseInt(stocks) <= 0){
		    continue;
		}	
		let translateddescription = "";
		for (let iTRANS = 0; iTRANS < description.length; iTRANS+=1000){
			await translate(description.substring(iTRANS, iTRANS + 1000), { from: 'nl', to: 'de' }).then(res => {
				translateddescription += res.text; // OUTPUT: Je vous remercie
			 
			}).catch(err => {
			  
			});
		}
		translateddescription = translateddescription.replace(/"/g, "'").replace(/(\r\n|\n|\r)/gm, "<br/>");
		try {
			let imgurl = imgURL;
			console.log(imgurl);
			
			let imgdownload = await download_image(imgurl, "../storage/media/BIKEBIZZ-" + beacon_id + ".jpg");
			
			brand = brand.replace(/"/g, "'");
			type = type.replace(/"/g, "'");
			let translatedtype = "";
			for (let iTRANS = 0; iTRANS < type.length; iTRANS+=1000){
    			await translate(type.substring(iTRANS, iTRANS + 1000), { from: 'nl', to: 'de' }).then(res => {
    				translatedtype += res.text; // OUTPUT: Je vous remercie
    			 
    			}).catch(err => {
    			  
    			});
    		}
    		type = translatedtype;
			bikebizzcsv += `"BIKEBIZZ-${beacon_id} ${brand} ${type}","${brand} ${type}","${translateddescription}","${brand}","Sporting Goods > Outdoor Recreation > Cycling > Bicycles","Bicycle","Sporting Goods > Outdoor Recreation > Cycling > Bicycles",TRUE,,,,,,,"BIKEBIZZ-${beacon_id}",,shopify,${stocks},deny,manual,${retailprice},,TRUE,TRUE,${ean},${imgurl},1,,FALSE,"${brand} ${type}","${translateddescription}","Bicycle",,,,,,,FALSE,,,,,,,,,,,,active\n`;
	        console.log((`bikebizz-${beacon_id}`).toLowerCase());
    		if (productsShopifyListBIKEBIZZ.includes((`bikebizz-${beacon_id}`).toLowerCase())){
    			productsShopifyListExistBIKEBIZZ.push((`bikebizz-${beacon_id}`).toLowerCase());
    			await shopify.product
    				.update(productsShopifyListIDBIKEBIZZ[(`bikebizz-${beacon_id}`).toLowerCase()],{
    					"body_html": `${translateddescription}`,
						"handle": `bikebizz-${beacon_id} ${type}`,
    					"product_type": "Sporting Goods > Outdoor Recreation > Cycling > Bicycles",
    					"title": `${type}`,
    					"product_category":"Sporting Goods > Outdoor Recreation > Cycling > Bicycles",
    					"variants": [
    						{
    							"barcode": `${ean}`,
    							"compare_at_price": null,
    							"fulfillment_service": "manual",
    							"weight_unit": "kg",
    							"inventory_management": "shopify",
    							"inventory_policy": "deny",
    							"inventory_quantity": parseInt(stocks),
    							"price": parseFloat(retailprice).toFixed(2),
    							"requires_shipping": true,
    							"sku": `bikebizz-${beacon_id}`,
    							"taxable": true
    						}
    					],
    					"vendor": `${brand}`
    				})
					.then((c) => {
						console.log(`bikebizz-${beacon_id}   update`);
						gcsv += `bikebizz-${beacon_id},updated\n`;
					})
					.catch((err) => {
						console.error(err);
						gcsv += `bikebizz-${beacon_id},updating error\n`;
					});
    		} else {
    			await shopify.product
    				.create({
    					"body_html": `${translateddescription}`,
    					"handle": `bikebizz-${beacon_id} ${brand} ${type}`,
    					"id": 632910392,
    					"images":[{"src":imgurl}],
    					"product_type": "Sporting Goods > Outdoor Recreation > Cycling > Bicycles",
    					"published_scope": "global",
    					"status": "active",
    					"tags": `Bicycle, ${brand}`,
    					"template_suffix": "special",
    					"title": `${type}`,
    					"product_category":"Sporting Goods > Outdoor Recreation > Cycling > Bicycles",
    					"variants": [
    						{
    							"barcode": `${ean}`,
    							"compare_at_price": null,
    							"fulfillment_service": "manual",
    							"weight_unit": "kg",
    							"inventory_management": "shopify",
    							"inventory_policy": "deny",
    							"inventory_quantity": parseInt(stocks),
    							"price": parseFloat(retailprice).toFixed(2),
    							"requires_shipping": true,
    							"sku": `bikebizz-${beacon_id}`,
    							"taxable": true
    						}
    					],
    					"vendor": `${brand}`
    				})
					.then((c) => {
						console.log(`bikebizz-${beacon_id}   new`);
						gcsv += `bikebizz-${beacon_id},added\n`;
					})
					.catch((err) => {
						console.error(err);
						gcsv += `bikebizz-${beacon_id},adding error\n`;
					});
    		}
    		await new Promise(r => setTimeout(r, 1000));
	
		} catch(e){
			
		}
		
		
	
	}
	
	
	for(var i in productsShopifyListBIKEBIZZ) {
		if (productsShopifyListExistBIKEBIZZ.includes(productsShopifyListBIKEBIZZ[i])){
		} else {
			await shopify.product
					.delete(productsShopifyListIDBIKEBIZZ[productsShopifyListBIKEBIZZ[i]])
					.then((c) => {
						console.log(`${productsShopifyListBIKEBIZZ[i]}   no stock`);
						gcsv += `${productsShopifyListBIKEBIZZ[i]},no stock\n`;
					})
					.catch((err) => {
						console.error(err);
						gcsv += `${productsShopifyListBIKEBIZZ[i]},error no stock\n`;
					});
			await new Promise(r => setTimeout(r, 1000));
		}
	}
	
	fs.writeFileSync("check24/bikebizz_new.csv", bikebizzcsv);
	console.log("done-bikebizz");
	

	//KOSATEC START
	
	
	let kosateccsv = "Handle,Title,Body (HTML),Vendor,Product Category,Type,Tags,Published,Option1 Name,Option1 Value,Option2 Name,Option2 Value,Option3 Name,Option3 Value,Variant SKU,Variant Grams,Variant Inventory Tracker,Variant Inventory Qty,Variant Inventory Policy,Variant Fulfillment Service,Variant Price,Variant Compare At Price,Variant Requires Shipping,Variant Taxable,Variant Barcode,Image Src,Image Position,Image Alt Text,Gift Card,SEO Title,SEO Description,Google Shopping / Google Product Category,Google Shopping / Gender,Google Shopping / Age Group,Google Shopping / MPN,Google Shopping / AdWords Grouping,Google Shopping / AdWords Labels,Google Shopping / Condition,Google Shopping / Custom Product,Google Shopping / Custom Label 0,Google Shopping / Custom Label 1,Google Shopping / Custom Label 2,Google Shopping / Custom Label 3,Google Shopping / Custom Label 4,Variant Image,Variant Weight Unit,Variant Tax Code,Cost per item,Price / International,Compare At Price / International,Status\n";
	const productswifishop = [];
	const productswifishopean = [];
	const productswifishopeanexist = [];
	
	let tableWIFISHOPCHECK = fs.readFileSync("./wifishop.csv", "utf-8").split("\n");
	for (let i = 1; i < tableWIFISHOPCHECK.length - 1; i++) {
		let productUPDATEDetails = tableWIFISHOPCHECK[i];
		productswifishop.push(productUPDATEDetails);
		productswifishopean.push((productUPDATEDetails.split(";"))[3].replace(/"/g, ''));
	}
	
	const browserKOSATEC = await puppeteer.launch({headless: true, args:['--no-sandbox']});
	const pageKOSATEC = await browserKOSATEC.newPage();
	await pageKOSATEC.setDefaultNavigationTimeout(0);
	await pageKOSATEC.goto("https://shop.kosatec.de" , { waitUntil: 'networkidle0' }); // wait until page load
	await pageKOSATEC.waitForTimeout(10000)
	await pageKOSATEC.setRequestInterception(true);
	pageKOSATEC.on('request', (request) => {
		if (['image', 'stylesheet', 'font', 'script'].indexOf(request.resourceType()) !== -1) {
			request.abort();
		} else {
			request.continue();
		}
	});
	const tableKOSATEC = fs.readFileSync("./Kosatec.csv", "utf-8").split("\n");
	
	for (let i = 1; i < tableKOSATEC.length; i++) {
		while (SHOPLIMITCALL) {
			console.log("limit reached : waiting 30 seconds");
			await new Promise(r => setTimeout(r, 60000));
			SHOPLIMITCALL = false;
		} 
		let product = tableKOSATEC[i];
		
		product = product
			.replace(/(?!(([^"]*"){2})*[^"]*$),/gm, " ")
			.replace(/(?<=\d),(?=\d)/gm, ".");
		let productDetails = product.split(";");
		if (productDetails[2] === undefined){
			continue;
		}
		let price = calculateCustomerPriceKOSATEC(parseFloat(productDetails[7]));

		if (
			settings.DELETED_PRODUCTS.includes(productDetails[5]) ||
			settings.DELETED_PRODUCTS.includes(parseInt(productDetails[5]))
		) {
			continue;
		}
		
		
		
		let wifishopexist = false;
		for (let j = 1; j < productswifishopean.length; j++){
			if (isNaN(productswifishopean[j]) || productswifishopean[j] == ""){
				continue;
			} else {
				if (productswifishopean[j] == productDetails[5] ||
					productswifishopean[j] == parseInt(productDetails[5])){
					wifishopexist = true;
					break;
				}
			}
		}
		if (wifishopexist){
			continue;
		}
		if (productDetails[5] == undefined || productDetails[5] == "" || parseInt(productDetails[9]) <= 0){
			continue;
		}
		
		if (
			PCNOTEBOOKEANARRAY.includes(productDetails[5]) ||
			ECOMEANARRAY.includes(productDetails[5])
		) {
			continue;
		}
		await pageKOSATEC.goto("https://shop.kosatec.de/search?sSearch=" + productDetails[1] , { waitUntil: 'networkidle0' }); // wait until page load
		let imgflg = false;
		let IMGURL = "";
		try {
			const imgs = await pageKOSATEC.$eval('body > div.page-wrap > section > div > div.content--wrapper > div.content.product--details > div.product--detail-upper.block-group > div.product--image-container.image-slider.product--image-zoom > div.image--thumbnails.image-slider--thumbnails > div > a.thumbnail--link.is--active', a => a.href);
			IMGURL = imgs;
			imgflg = true;
		} catch (e) {
		}
		try {
			if (imgflg == false){
				const imgs = await pageKOSATEC.$eval('body > div.page-wrap > section > div > div.content--wrapper > div.content.product--details > div.product--detail-upper.block-group > div.product--image-container.image-slider.product--image-zoom.no--thumbnails > div > div > div > span > span > img', img => img.src);
				IMGURL = imgs;
				imgflg = true;
			}
		} catch (e) {
			
		}
		
		try {
			if (imgflg == false){
				const imgs = await pageKOSATEC.$eval('body > div.page-wrap > section > div > div.content--wrapper > div.content.product--details > div.product--detail-upper.block-group > div.product--image-container.image-slider.product--image-zoom > div.image-slider--container > div > div:nth-child(1) > span > span > img', img => img.src);
				IMGURL = imgs;
				imgflg = true;
			}
		} catch (e) {
			
		}
		
		if (imgflg){
			console.log(IMGURL);
			try {
			    imgflg = false;
				let imgdownload = await download_image(IMGURL, "../storage/media/Kosatec-" + productDetails[0] + ".jpg");
				imgflg = true;
			} catch (e) {
			
		    }
		}
		if (imgflg == false){
		    continue;
		}
		productDetails[2] = productDetails[2].replace(/"/g, '');
		productDetails[3] = productDetails[3].replace(/"/g, '');
		productDetails[14] = productDetails[14].replace(/"/g, '');
		productDetails[15] = productDetails[15].replace(/"/g, '');
		console.log('KSTC-' + productDetails[0]);
		kosateccsv += `"KSTC-${productDetails[0]} ${productDetails[2]}","${productDetails[2]}","${productDetails[2]}","${productDetails[3]}","Electronics","${productDetails[14]}","${productDetails[14]},${productDetails[15]}",TRUE,,,,,,,"KSTC-${productDetails[0]}",,shopify,${productDetails[9]},deny,manual,${parseFloat(price).toFixed(2)},,TRUE,TRUE,${productDetails[5]},${IMGURL},1,,FALSE,"${productDetails[2]}","${productDetails[2]}","Electronics",,,,,,,FALSE,,,,,,,,,,,,active\n`;
		if (productsShopifyListKOSATEC.includes((`KSTC-${productDetails[0]}`).toLowerCase())){
			productsShopifyListExistKOSATEC.push((`KSTC-${productDetails[0]}`).toLowerCase());
			await shopify.product
				.update(productsShopifyListIDKOSATEC[(`KSTC-${productDetails[0]}`).toLowerCase()],{
					"body_html": `${productDetails[2]}`,
					"product_type": "Electronics",
					"handle": `KSTC-${productDetails[0]} ${productDetails[2]}`,
					"title": `${productDetails[2]}`,
					"product_category":"Electronics",
					"variants": [
						{
							"barcode": `${productDetails[5]}`,
							"compare_at_price": null,
							"fulfillment_service": "manual",
							"weight_unit": "kg",
							"inventory_management": "shopify",
							"inventory_policy": "deny",
							"inventory_quantity": parseInt(productDetails[9]),
							"price": parseFloat(price).toFixed(2),
							"requires_shipping": true,
							"sku": `KSTC-${productDetails[0]}`,
							"taxable": true
						}
					],
					"vendor": `${productDetails[3]}`
				})
				.then((c) => {
					console.log(`KSTC-${productDetails[0]}   update`);
					gcsv += `KSTC-${productDetails[0]},updated\n`;
				})
				.catch((err) => {
					console.error(err);
					gcsv += `KSTC-${productDetails[0]},updating error\n`;
				});
				
		} else {
			await shopify.product
				.create({
					"body_html": `${productDetails[2]}`,
					"handle": `KSTC-${productDetails[0]} ${productDetails[2]}`,
					"id": 632910392,
					"images":[{"src":IMGURL}],
					"product_type": "Electronics",
					"published_scope": "global",
					"status": "active",
					"tags": `${productDetails[14]}`,
					"template_suffix": "special",
					"title": `${productDetails[2]}`,
					"product_category":"Electronics",
					"variants": [
						{
							"barcode": `${productDetails[5]}`,
							"compare_at_price": null,
							"fulfillment_service": "manual",
							"weight_unit": "kg",
							"inventory_management": "shopify",
							"inventory_policy": "deny",
							"inventory_quantity": parseInt(productDetails[9]),
							"price": parseFloat(price).toFixed(2),
							"requires_shipping": true,
							"sku": `KSTC-${productDetails[0]}`,
							"taxable": true
						}
					],
					"vendor": `${productDetails[3]}`
				})
				.then((c) => {
					console.log(`KSTC-${productDetails[0]}   new`);
					gcsv += `KSTC-${productDetails[0]},added\n`;
				})
				.catch((err) => {
					console.error(err);
					gcsv += `KSTC-${productDetails[0]},adding error\n`;
				});
		}
    	await new Promise(r => setTimeout(r, 1000));
	    
	}
	
	
	for(var i in productsShopifyListKOSATEC) {
		if (productsShopifyListExistKOSATEC.includes(productsShopifyListKOSATEC[i])){
		} else {
			await shopify.product
					.delete(productsShopifyListIDKOSATEC[productsShopifyListKOSATEC[i]])
					.then((c) => {
						console.log(`${productsShopifyListKOSATEC[i]}   no stock`);
						gcsv += `${productsShopifyListKOSATEC[i]},no stock\n`;
					})
					.catch((err) => {
						console.error(err);
						gcsv += `${productsShopifyListKOSATEC[i]},error no stock\n`;
					});
			await new Promise(r => setTimeout(r, 1000));
		}
	}

	fs.writeFileSync("check24/kosatec_new.csv", kosateccsv);

	console.log("done-Kosatec");
	
	

	
	
	
	//ECOM START
	
	let ecomcsv = "Handle,Title,Body (HTML),Vendor,Product Category,Type,Tags,Published,Option1 Name,Option1 Value,Option2 Name,Option2 Value,Option3 Name,Option3 Value,Variant SKU,Variant Grams,Variant Inventory Tracker,Variant Inventory Qty,Variant Inventory Policy,Variant Fulfillment Service,Variant Price,Variant Compare At Price,Variant Requires Shipping,Variant Taxable,Variant Barcode,Image Src,Image Position,Image Alt Text,Gift Card,SEO Title,SEO Description,Google Shopping / Google Product Category,Google Shopping / Gender,Google Shopping / Age Group,Google Shopping / MPN,Google Shopping / AdWords Grouping,Google Shopping / AdWords Labels,Google Shopping / Condition,Google Shopping / Custom Product,Google Shopping / Custom Label 0,Google Shopping / Custom Label 1,Google Shopping / Custom Label 2,Google Shopping / Custom Label 3,Google Shopping / Custom Label 4,Variant Image,Variant Weight Unit,Variant Tax Code,Cost per item,Price / International,Compare At Price / International,Status\n";
	
	const csvTableECOM = fs
		.readFileSync("./preisliste_ecom.csv", "utf-8")
		.split("\n");
	for (let i = 1; i < csvTableECOM.length; i++) {
	    while (SHOPLIMITCALL) {
			console.log("limit reached : waiting 30 seconds");
			await new Promise(r => setTimeout(r, 60000));
			SHOPLIMITCALL = false;
		} 
		const product = csvTableECOM[i];
		let productColumns = product.replaceAll('","', ";")
									.replaceAll(',"', ";")
									.replaceAll('",', ";")
									.replaceAll(';"', ";");
		let productDetails = productColumns.split(";");


		const name = productDetails[1];
		const brand = productDetails[5];
		let price = productDetails[6];
		price = ecomCalc(parseFloat(price), 0);

		if (
			settings.DELETED_PRODUCTS.includes(productDetails[3]) ||
			settings.DELETED_PRODUCTS.includes(parseInt(productDetails[3]))
		) {
			continue;
		}
		if (parseInt(productDetails[7]) <= 0){
			continue;
		}
		const dataPAGE = await getRawData("https://www.nexoc-store.de/shop/search?sSearch=" + productDetails[0]);
		const html = parse(dataPAGE);
		let imgflg = false;
		let imgURL = "";
		const imagedata =  html.querySelectorAll("body > div.page-wrap > section > div > div.content--wrapper > div > div.product--detail-upper.block-group > div.product--image-container.image-slider.product--image-zoom > div.image-slider--container > div > div:nth-child(1) > span > span > img");
		
		if (imagedata[0] === undefined){
		    
		} else {
	    	try {
    			let imgdownload = await download_image(imagedata[0].getAttribute("src"), "../storage/media/Ecom-" + productDetails[0] + ".jpg");
    			imgURL = imagedata[0].getAttribute("src");
    			imgflg = true;
    		} catch (e) {
    		}
		}
	
		if (imgflg == false){
			try {
    			let imgdownload = await download_image("https://www.ejimm.de/storage/media/Ecom-" + productDetails[0] + ".jpg", "../storage/media/Ecom-" + productDetails[0] + ".jpg");
    			imgURL = "https://www.ejimm.de/storage/media/Ecom-" + productDetails[0] + ".jpg";
    		
    			imgflg = true;
    		} catch (e) {
    		}
		}
		if (imgflg == false){
			continue;
		}
		let shippingtime = "3Tage";
		const updateTable = fs
				.readFileSync("./update.csv", "utf-8")
				.split("\n");
		for (let j = 1; j < updateTable.length; j++) {
			const productUPDATE = updateTable[j];
			let productUPDATEColumns = productUPDATE.replace(/(?!(([^"]*"){2})*[^"]*$),/gm, " ");
			productUPDATEColumns = productUPDATEColumns.replace(/,/gm, ";");
			let productUPDATEDetails = productUPDATEColumns.split(";");
			if (productUPDATEDetails[0] === "EAN") {
				continue;
			}
			if (productUPDATEDetails[0] === productDetails[3]){
				productDetails[7] = productUPDATEDetails[1];
				shippingtime = productUPDATEDetails[2] + "Tage";
			}
			
		}
		if (productDetails[7] == "" || parseInt(productDetails[7]) <= 0){
		    continue;
		}
		ecomcsv += `"ECOM-${productDetails[0]} ${name}","${name}","${name}","${brand}","Electronics","${productDetails[2]}","Electronics,${productDetails[2]}",TRUE,,,,,,,"ECOM-${productDetails[0]}",,shopify,${productDetails[7]},deny,manual,${parseFloat(price).toFixed(2)},,TRUE,TRUE,${productDetails[3]},${imgURL},1,,FALSE,"${name}","${name}","Electronics",,,,,,,FALSE,,,,,,,,,,,,active\n`;
	
	    console.log((`ecom-${productDetails[0]}`).toLowerCase());
		if (productsShopifyListECOM.includes((`ecom-${productDetails[0]}`).toLowerCase())){
			productsShopifyListExistECOM.push((`ecom-${productDetails[0]}`).toLowerCase());
			await shopify.product
				.update(productsShopifyListIDECOM[(`ecom-${productDetails[0]}`).toLowerCase()],{
					"body_html": `${name}`,
					"handle": `ecom-${productDetails[0]} ${name}`,
					"product_type": "Electronics",
					"title": `${name}`,
					"product_category":"Electronics",
					"variants": [
						{
							"barcode": `${productDetails[3]}`,
							"compare_at_price": null,
							"fulfillment_service": "manual",
							"weight_unit": "kg",
							"inventory_management": "shopify",
							"inventory_policy": "deny",
							"inventory_quantity": productDetails[7],
							"price": parseFloat(price).toFixed(2),
							"requires_shipping": true,
							"sku": `ecom-${productDetails[0]}`,
							"taxable": true
						}
					],
					"vendor": `${brand}`
				})
				.then((c) => {
					console.log(`ecom-${productDetails[0]}   update`);
					gcsv += `ecom-${productDetails[0]},updated\n`;
				})
				.catch((err) => {
					console.error(err);
					gcsv += `ecom-${productDetails[0]},updating error\n`;
				});
		} else {
			await shopify.product
				.create({
					"body_html": `${name}`,
					"handle": `ecom-${productDetails[0]} ${name}`,
					"id": 632910392,
					"images":[{"src":imgURL}],
					"product_type": "Electronics",
					"published_scope": "global",
					"status": "active",
					"tags": `Electronics, ${brand}`,
					"template_suffix": "special",
					"title": `${name}`,
					"product_category":"Electronics",
					"variants": [
						{
							"barcode": `${productDetails[3]}`,
							"compare_at_price": null,
							"fulfillment_service": "manual",
							"weight_unit": "kg",
							"inventory_management": "shopify",
							"inventory_policy": "deny",
							"inventory_quantity": productDetails[7],
							"price": parseFloat(price).toFixed(2),
							"requires_shipping": true,
							"sku": `ecom-${productDetails[0]}`,
							"taxable": true
						}
					],
					"vendor": `${brand}`
				})
				.then((c) => {
					console.log(`ecom-${productDetails[0]}   new`);
					gcsv += `ecom-${productDetails[0]},added\n`;
				})
				.catch((err) => {
					console.error(err);
					gcsv += `ecom-${productDetails[0]},adding error\n`;
				});
		}
		await new Promise(r => setTimeout(r, 1000));
	}
	

	for(var i in productsShopifyListECOM) {
		if (productsShopifyListExistECOM.includes(productsShopifyListECOM[i])){
		} else {
			await shopify.product
					.delete(productsShopifyListIDECOM[productsShopifyListECOM[i]])
					.then((c) => {
						console.log(`${productsShopifyListECOM[i]}   no stock`);
						gcsv += `${productsShopifyListECOM[i]},no stock\n`;
					})
					.catch((err) => {
						console.error(err);
						gcsv += `${productsShopifyListECOM[i]},error no stock\n`;
					});
			await new Promise(r => setTimeout(r, 1000));
		}
	}
	
	fs.writeFileSync("check24/ecom_new.csv", ecomcsv);

	console.log("done-Ecom");
	
	
	
	
	
	
	
	//PCNOTEBOOK START
	let pcnotebookcsv = "Handle,Title,Body (HTML),Vendor,Product Category,Type,Tags,Published,Option1 Name,Option1 Value,Option2 Name,Option2 Value,Option3 Name,Option3 Value,Variant SKU,Variant Grams,Variant Inventory Tracker,Variant Inventory Qty,Variant Inventory Policy,Variant Fulfillment Service,Variant Price,Variant Compare At Price,Variant Requires Shipping,Variant Taxable,Variant Barcode,Image Src,Image Position,Image Alt Text,Gift Card,SEO Title,SEO Description,Google Shopping / Google Product Category,Google Shopping / Gender,Google Shopping / Age Group,Google Shopping / MPN,Google Shopping / AdWords Grouping,Google Shopping / AdWords Labels,Google Shopping / Condition,Google Shopping / Custom Product,Google Shopping / Custom Label 0,Google Shopping / Custom Label 1,Google Shopping / Custom Label 2,Google Shopping / Custom Label 3,Google Shopping / Custom Label 4,Variant Image,Variant Weight Unit,Variant Tax Code,Cost per item,Price / International,Compare At Price / International,Status\n";
	
	let header = ["Art.-Nr.","EAN","Name","Chassis","Power","CPU","Mainboard","RAM","Graphic","SSD","HDD","CPU Cooler","Cooler","Display/TFT","Periphery","OS","Type","Stock","Price"];
	const table3 = xslx.readFile("./pc_notebook_preisliste.xlsx");
	xslx.writeFile(table3, "pc_notebook_preisliste.csv", { bookType: "csv" });
	const csvTablePCNOTEBOOK = fs
		.readFileSync("./pc_notebook_preisliste.csv", "utf-8")
		.split("\n");
	for (let i = 1; i < csvTablePCNOTEBOOK.length; i++) {
	    while (SHOPLIMITCALL) {
			console.log("limit reached : waiting 30 seconds");
			await new Promise(r => setTimeout(r, 60000));
			SHOPLIMITCALL = false;
		} 
		const product = csvTablePCNOTEBOOK[i];
		let productColumns = product.replace(/(?!(([^"]*"){2})*[^"]*$),/gm, " ");
		productColumns = productColumns.replace(/,/gm, ";");
		let productDetails = productColumns.split(";");

		if (productDetails[0] === "Art.-Nr. " || productDetails[0] === "0") {
			continue;
		}

		const name = productDetails[5].split(" ");
		const brand = name[0];
		let price = productDetails[18]
			.replaceAll(" ", "")
			.replaceAll('"', "")
			.replace(",", "")
			.replace("€", "");

		price = price.replace(/ /gm, "");
		price = ecomCalcPCNOTEBOOK(parseFloat(price), 0);

		if (
			settings.DELETED_PRODUCTS.includes(productDetails[1]) ||
			settings.DELETED_PRODUCTS.includes(parseInt(productDetails[1]))
		) {
			continue;
		}
		let shippingtime = "3Tage";
		const updateTable = fs
				.readFileSync("./update.csv", "utf-8")
				.split("\n");
		for (let j = 1; j < updateTable.length; j++) {
			const productUPDATE = updateTable[j];
			let productUPDATEColumns = productUPDATE.replace(/(?!(([^"]*"){2})*[^"]*$),/gm, " ");
			productUPDATEColumns = productUPDATEColumns.replace(/,/gm, ";");
			let productUPDATEDetails = productUPDATEColumns.split(";");
			if (productUPDATEDetails[0] === "EAN") {
				continue;
			}
			if (productUPDATEDetails[0] === productDetails[1]){
				productDetails[17] = productUPDATEDetails[1];
				shippingtime = productUPDATEDetails[2] + "Tage";
			}
			
		}
		if (productDetails[17]  == "" || parseInt(productDetails[17]) <= 0){
		    continue;
		}
		const dataPAGE = await getRawData("https://www.nexoc-store.de/shop/search?sSearch=" + productDetails[0]);
		const html = parse(dataPAGE);
		let imgflg = false;
		let imgURL = "";
		const imagedata = html.querySelectorAll("body > div.page-wrap > section > div > div.content--wrapper > div > div.product--detail-upper.block-group > div.product--image-container.image-slider.product--image-zoom > div.image-slider--container > div > div:nth-child(1) > span > span > img");
		if (imagedata[0] === undefined){
		    
		} else {
	    	try {
    			let imgdownload = await download_image(imagedata[0].getAttribute("src"), "../storage/media/PCNotebook-" + productDetails[0] + ".jpg");
    			imgURL = imagedata[0].getAttribute("src");
    			imgflg = true;
    		} catch (e) {
    		}
		}
	
		if (imgflg == false){
			try {
			    try {
                    if (fs.existsSync("../storage/media/PCNotebook-" + productDetails[0] + ".jpg")) {
                       	imgURL = "https://www.ejimm.de/storage/media/PCNotebook-" + productDetails[0] + ".jpg";
                       	imgflg = true;
                    }
                } catch(err) {
                }
    			
    		
    			
    		} catch (e) {
    		}
		}
		if (imgflg == false){
			continue;
		}
		
		
		
		let ProductDescription = "";
		for (let x = 3; x < 17; x++){
			if (productDetails[x] !== "" && productDetails[x] !== "0"){
				ProductDescription = ProductDescription + header[x] + " : " + productDetails[x] + "<br>";
			}
		}
		
		let ProductName = productDetails[2].replace(/'/g, '').replace(/"/g, '\'');
		console.log(ProductName);
		ProductDescription = ProductDescription.replace(/'/g, '').replace(/"/g, '\'')
		pcnotebookcsv += `"PCNB-${productDetails[0]}","${productDetails[2]}","${ProductDescription}","${brand}","Electronics > Computers","Computer","Computer,${brand}",TRUE,,,,,,,"PCNB-${productDetails[0]}",,shopify,${productDetails[17]},deny,manual,${parseFloat(price).toFixed(2)},,TRUE,TRUE,${productDetails[1]},${imgURL},1,,FALSE,"${productDetails[2]}","${ProductDescription}","Computer",,,,,,,FALSE,,,,,,,,,,,,active\n`;
	
	    console.log((`pcnb-${productDetails[0]}`).toLowerCase());
		if (productsShopifyListPCNOTEBOOK.includes((`pcnb-${productDetails[0]}`).toLowerCase())){
			productsShopifyListExistPCNOTEBOOK.push((`pcnb-${productDetails[0]}`).toLowerCase());
			await shopify.product
				.update(productsShopifyListIDPCNOTEBOOK[(`pcnb-${productDetails[0]}`).toLowerCase()],{
					"body_html": `${ProductDescription}`,
					"product_type": "Electronics > Computers",
					"handle": `pcnb-${productDetails[0]} ${productDetails[2]}`,
					"title": `${productDetails[2]}`,
					"product_category":"Electronics > Computers",
					"variants": [
						{
							"barcode": `${productDetails[1]}`,
							"compare_at_price": null,
							"fulfillment_service": "manual",
							"weight_unit": "kg",
							"inventory_management": "shopify",
							"inventory_policy": "deny",
							"inventory_quantity": productDetails[17],
							"price": parseFloat(price).toFixed(2),
							"requires_shipping": true,
							"sku": `pcnb-${productDetails[0]}`,
							"taxable": true
						}
					],
					"vendor": `${brand}`
				})
				.then((c) => {
					console.log(`pcnb-${productDetails[0]}   update`);
					gcsv += `pcnb-${productDetails[0]},updated\n`;
				})
				.catch((err) => {
					console.error(err);
					gcsv += `pcnb-${productDetails[0]},updating error\n`;
				});
		} else {
			await shopify.product
				.create({
					"body_html": `${ProductDescription}`,
					"handle": `pcnb-${productDetails[0]} ${productDetails[2]}`,
					"id": 632910392,
					"images":[{"src":imgURL}],
					"product_type": "Electronics > Computers",
					"published_scope": "global",
					"status": "active",
					"tags": `Computers, ${brand}`,
					"template_suffix": "special",
					"title": `${productDetails[2]}`,
					"product_category":"Electronics > Computers",
					"variants": [
						{
							"barcode": `${productDetails[1]}`,
							"compare_at_price": null,
							"fulfillment_service": "manual",
							"weight_unit": "kg",
							"inventory_management": "shopify",
							"inventory_policy": "deny",
							"inventory_quantity": productDetails[17],
							"price": parseFloat(price).toFixed(2),
							"requires_shipping": true,
							"sku": `pcnb-${productDetails[0]}`,
							"taxable": true
						}
					],
					"vendor": `${name}`
				})
				.then((c) => {
					console.log(`pcnb-${productDetails[0]}   new`);
					gcsv += `pcnb-${productDetails[0]},added\n`;
				})
				.catch((err) => {
					console.error(err);
					gcsv += `pcnb-${productDetails[0]},adding error\n`;
				});
		}
		await new Promise(r => setTimeout(r, 1000));
	}
	
	for(var i in productsShopifyListPCNOTEBOOK) {
		if (productsShopifyListExistPCNOTEBOOK.includes(productsShopifyListPCNOTEBOOK[i])){
		} else {
			await shopify.product
					.delete(productsShopifyListIDPCNOTEBOOK[productsShopifyListPCNOTEBOOK[i]])
					.then((c) => {
						console.log(`${productsShopifyListPCNOTEBOOK[i]}   no stock`);
						gcsv += `${productsShopifyListPCNOTEBOOK[i]},no stock\n`;
					})
					.catch((err) => {
						console.error(err);
						gcsv += `${productsShopifyListPCNOTEBOOK[i]},error no stock\n`;
					});
	    	await new Promise(r => setTimeout(r, 1000));
		}
	}
	
	fs.writeFileSync("check24/pcnotebook_new.csv", pcnotebookcsv);

	console.log("done-PCNotebook");
	
	
	
	
	

	
	
	
	
	
	
	
	fs.writeFileSync("check24/shopifyApp1logs.csv", gcsv);
	console.log("done-Shopify App 1");
	
	function calculateCustomerPriceKOSATEC(num) {
		let price = (num + ((num / 100) * 41) + 10).toFixed(2);
		return doDiscount(price);
	}
	
	
	function wifishopCalc(num) {
		let price = parseFloat(
			(num + (5.49)).toFixed(2)
		);
		price = price.toFixed(2);
		return price;
	}
	
	
	function calculateCustomerPriceCars4Kids(num) {
		let price = (num + ((num / 100) * 41) + 40).toFixed(2);
		return price;
	}
	
	function ecomCalcPCNOTEBOOK(num, increse) {
		let price = parseFloat(
			(num + (5.49 + increse) + (num / 100) * 26).toFixed(2)
		);
		if (price <= 10) {
			price += 5;
		}
		price = price.toFixed(2);
		return doDiscount(price);
	}
	
	function calculateBikebizzCustomerPrice(num, shipcost) {
		let price = (num + ((num / 100) * 2) + shipcost).toFixed(2);
		return price;
	}
	
	function calculateCycleTechPrice(num, shipcost) {
		let price = parseFloat(parseFloat(num) + parseFloat(shipcost)).toFixed(2);
		return price;
	}
	
	
	function ecomCalc(num, increse) {
		let price = parseFloat(
			(num + (5.49 + increse) + (num / 100) * 26).toFixed(2)
		);
		if (price <= 10) {
			price += 5;
		}
		price = price.toFixed(2);
		return doDiscount(price);
	}
	
	function calculatePrice(num, increse) {
		let price = parseFloat(
			(num + (5.49 + increse) + (num / 100) * 27).toFixed(2)
		);
		if (price <= 10) {
			price += 5;
		}
		price = price.toFixed(2);
		return doDiscount(price);
	}



	function doDiscount(num) {
		let price = num + (num / 100) * settings.DISCOUNT_ON_ALL_ARTICLES;
		return price;
	}
};

function getContentName(id) {
	let str = "";
	switch (id) {
		case 0:
			str = "img";
			break;
		case 1:
			str = "partNumber";
			break;
		case 2:
			str = "ean";
			break;
		case 3:
			str = "desc";
			break;
		case 4:
			str = "contition";
			break;
		case 5:
			str = "qty";
			break;
		case 6:
			str = "price";
			break;
		case 7:
			str = "select";
			break;
	}

	return str;
}

// invoking the main function
getData();

setInterval(() => {
	getData();
}, 24 * 60 * 60 * 1000);



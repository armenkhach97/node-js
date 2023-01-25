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
	const productsShopifyListTOMSPIELZEUG = [];
	const productsShopifyListIDTOMSPIELZEUG = {};
	const productsShopifyListExistTOMSPIELZEUG = [];
	
	
	const productsShopifyListTWM = [];
	const productsShopifyListIDTWM = {};
	const productsShopifyListExistTWM = [];
	
	
	const productsShopifyListOUTDOOR = [];
	const productsShopifyListIDOUTDOOR = {};
	const productsShopifyListExistOUTDOOR = [];
	
	
	const productsShopifyListSPORTS = [];
	const productsShopifyListIDSPORTS = {};
	const productsShopifyListExistSPORTS = [];
	
	
	const productsShopifyListBIKEPARTS = [];
	const productsShopifyListIDBIKEPARTS = {};
	const productsShopifyListExistBIKEPARTS = [];
	
	
	const productsShopifyListHOUSE = [];
	const productsShopifyListIDHOUSE = {};
	const productsShopifyListExistHOUSE = [];
	
	
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
			if ((productsShopify[i].variants[0].sku).search("tspg-") >= 0){
				productsShopifyListIDTOMSPIELZEUG[productsShopify[i].variants[0].sku] = productsShopify[i].id;
				productsShopifyListTOMSPIELZEUG.push(productsShopify[i].variants[0].sku);
			
			}
			
			if ((productsShopify[i].variants[0].sku).search("twm-") >= 0){
				productsShopifyListIDTWM[productsShopify[i].variants[0].sku] = productsShopify[i].id;
				productsShopifyListTWM.push(productsShopify[i].variants[0].sku);
			
			}
			
			if ((productsShopify[i].variants[0].sku).search("tout-") >= 0){
				productsShopifyListIDOUTDOOR[productsShopify[i].variants[0].sku] = productsShopify[i].id;
				productsShopifyListOUTDOOR.push(productsShopify[i].variants[0].sku);
			
			}
			
			if ((productsShopify[i].variants[0].sku).search("tsnf-") >= 0){
				productsShopifyListIDSPORTS[productsShopify[i].variants[0].sku] = productsShopify[i].id;
				productsShopifyListSPORTS.push(productsShopify[i].variants[0].sku);
			
			}
			
			
			if ((productsShopify[i].variants[0].sku).search("tbanp-") >= 0){
				productsShopifyListIDBIKEPARTS[productsShopify[i].variants[0].sku] = productsShopify[i].id;
				productsShopifyListBIKEPARTS.push(productsShopify[i].variants[0].sku);
			
			}
			
			if ((productsShopify[i].variants[0].sku).search("thng-") >= 0){
				productsShopifyListIDHOUSE[productsShopify[i].variants[0].sku] = productsShopify[i].id;
				productsShopifyListHOUSE.push(productsShopify[i].variants[0].sku);
			
			}
			
		}
		console.log(productsShopify.length);
		params = productsShopify.nextPageParameters;
	    await new Promise(r => setTimeout(r, 1150));
	} while (params !== undefined);
	
	
	//TOMSPIELZEUG START
	
	
	let tomspielzeugcsv = "Handle,Title,Body (HTML),Vendor,Product Category,Type,Tags,Published,Option1 Name,Option1 Value,Option2 Name,Option2 Value,Option3 Name,Option3 Value,Variant SKU,Variant Grams,Variant Inventory Tracker,Variant Inventory Qty,Variant Inventory Policy,Variant Fulfillment Service,Variant Price,Variant Compare At Price,Variant Requires Shipping,Variant Taxable,Variant Barcode,Image Src,Image Position,Image Alt Text,Gift Card,SEO Title,SEO Description,Google Shopping / Google Product Category,Google Shopping / Gender,Google Shopping / Age Group,Google Shopping / MPN,Google Shopping / AdWords Grouping,Google Shopping / AdWords Labels,Google Shopping / Condition,Google Shopping / Custom Product,Google Shopping / Custom Label 0,Google Shopping / Custom Label 1,Google Shopping / Custom Label 2,Google Shopping / Custom Label 3,Google Shopping / Custom Label 4,Variant Image,Variant Weight Unit,Variant Tax Code,Cost per item,Price / International,Compare At Price / International,Status\n";
	
	let tableTOMSPIELZEUG = fs.readFileSync("./Tomspielzeug.csv", "utf-8").split("\n");
	
	
	for (let i = 1; i < tableTOMSPIELZEUG.length; i++) {
		while (SHOPLIMITCALL) {
			console.log("limit reached : waiting 30 seconds");
			await new Promise(r => setTimeout(r, 60000));
			SHOPLIMITCALL = false;
		} 
		let product = tableTOMSPIELZEUG[i];
		product = product
			.replace(/(?!(([^"]*"){2})*[^"]*$),/gm, " ")
			.replace(";", ":")
			.replaceAll(", ", " ")
			.replace(/,/gm, ";");
		let productDetails = product.split(";");
		let price = calculateCustomerPrice(parseFloat(productDetails[5]));

		if (
			settings.DELETED_PRODUCTS.includes(productDetails[3]) ||
			settings.DELETED_PRODUCTS.includes(parseInt(productDetails[3]))
		) {
			continue;
		}
	
	    if (
			VOLAREANARRAY.includes(productDetails[3])
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
			if (productUPDATEDetails[0] === productDetails[3]){
				productDetails[17] = productUPDATEDetails[1];
				shippingtime = productUPDATEDetails[2] + "Tage";
			}
			
		}
	
		let imgflg = false;
		if (productDetails[1] === undefined || isNaN(parseFloat(productDetails[5])) || isNaN(parseFloat(productDetails[17])) || parseInt(productDetails[17]) <= 0){
			continue;
		}
		if ( productDetails[1].toLowerCase().indexOf("birthday") >= 0 ||
		     productDetails[1].toLowerCase().indexOf("halloween") >= 0 ||
		     productDetails[1].toLowerCase().indexOf("carnival") >= 0 ||
		     productDetails[49].toLowerCase().indexOf("birthday") >= 0 ||
    	     productDetails[49].toLowerCase().indexOf("halloween") >= 0 ||
    	     productDetails[49].toLowerCase().indexOf("carnival") >= 0){
		    continue;
		}
		console.log(productDetails[0]);
		try {
			let imgdownload = await download_image(productDetails[9], "../storage/media/Tomspielzeug-" + productDetails[0] + ".jpg");
			imgflg = true;
		} catch (e) {
		}
	    productDetails[1] = productDetails[1].replace(/'/g, '').replace(/"/g, '');
		productDetails[8] = productDetails[8].replace(/'/g, '').replace(/"/g, '');
		productDetails[24] = productDetails[24].replace(/"/g, '');
		productDetails[18] = productDetails[18].replace(/"/g, '');
		productDetails[7] = productDetails[7].replace(/"/g, '');
		productDetails[3] = productDetails[3].replace(/"/g, '');
		productDetails[9] = productDetails[9].replace(/"/g, '');
		productDetails[8] = productDetails[8].replace(/"/g, '');
		productDetails[22] = productDetails[22].replace(/"/g, '');
		productDetails[23] = productDetails[23].replace(/"/g, '');
		productDetails[6] = productDetails[6].replace(/"/g, '');
		productDetails[2] = productDetails[2].replace(/"/g, '');
		if (imgflg == false){
			continue;
		}
		let ProductCategory = settings.TOMSPIELZEUG_CATEGORY[productDetails[6]];
		if (ProductCategory == undefined || ProductCategory == ""){
			continue;
		}
		if (productDetails[2] == "Non-Branded"){
			productDetails[2] = "EJIMM";
		}
		tomspielzeugcsv += `"TSPG-${productDetails[0]} ${productDetails[2]} ${productDetails[1]}","${productDetails[2]} ${productDetails[1]}","${productDetails[8]}","${productDetails[2]}","${ProductCategory}","${productDetails[18]}","${productDetails[7]}",TRUE,,,,,,,"TSPG-${productDetails[0]}",,shopify,${productDetails[17]},deny,manual,${parseFloat(price).toFixed(2)},,TRUE,TRUE,${productDetails[3]},${productDetails[9]},1,,FALSE,"${productDetails[1]}","${productDetails[8]}","${productDetails[6]}","${productDetails[23]}","${productDetails[22]}",,,,,FALSE,,,,,,,,,,,,active\n`;

		
		if (productsShopifyListTOMSPIELZEUG.includes((`tspg-${productDetails[0]}`).toLowerCase())){
			productsShopifyListExistTOMSPIELZEUG.push((`tspg-${productDetails[0]}`).toLowerCase());
			await shopify.products
				.updated(productsShopifyListIDTOMSPIELZEUG[(`tspg-${productDetails[0]}`).toLowerCase()],{
					"body_html": `${productDetails[8]}`,
					"product_type": `${ProductCategory}`,
					"handle": `tspg-${productDetails[0]} ${productDetails[2]} ${productDetails[1]}`,
					"title": `${productDetails[2]} ${productDetails[1]}`,
					"product_category":`${ProductCategory}`,
					"variants": [
						{
							"barcode": `${productDetails[3]}`,
							"compare_at_price": null,
							"fulfillment_service": "manual",
							"weight_unit": "kg",
							"inventory_management": "shopify",
							"inventory_policy": "deny",
							"inventory_quantity": parseInt(productDetails[17]),
							"price": parseFloat(price).toFixed(2),
							"requires_shipping": true,
							"sku": `tspg-${productDetails[0]}`,
							"taxable": true
						}
					],
					"vendor": `${productDetails[2]}`
				})
				.then((c) => {
					console.log(`tspg-${productDetails[0]}   update`);
					gcsv += `tspg-${productDetails[0]},updated\n`;
				})
				.catch((err) => {
					console.error(err);
					gcsv += `tspg-${productDetails[0]},updating error\n`;
				});
		} else {
			await shopify.products
				.created({
					"body_html": `${productDetails[8]}`,
					"handle": `tspg-${productDetails[0]} ${productDetails[2]} ${productDetails[1]}`,
					"id": 632910392,
					"images":[{"src":productDetails[9]}],
					"product_type": `${ProductCategory}`,
					"published_scope": "global",
					"status": "active",
					"tags": `${productDetails[2]},${productDetails[7]},${productDetails[18]}`,
					"template_suffix": "special",
					"title": `${productDetails[2]} ${productDetails[1]}`,
					"product_category":`${ProductCategory}`,
					"variants": [
						{
							"barcode": `${productDetails[3]}`,
							"compare_at_price": null,
							"fulfillment_service": "manual",
							"weight_unit": "kg",
							"inventory_management": "shopify",
							"inventory_policy": "deny",
							"inventory_quantity": parseInt(productDetails[17]),
							"price": parseFloat(price).toFixed(2),
							"requires_shipping": true,
							"sku": `tspg-${productDetails[0]}`,
							"taxable": true
						}
					],
					"vendor": `${productDetails[2]}`
				})
				.then((c) => {
					console.log(`tspg-${productDetails[0]}   new`);
					gcsv += `tspg-${productDetails[0]},added\n`;
				})
				.catch((err) => {
					console.error(err);
					gcsv += `tspg-${productDetails[0]},adding error\n`;
				});
		}
		await new Promise(r => setTimeout(r, 1000));
		
	}
	
	for(var i in productsShopifyListTOMSPIELZEUG) {
		if (productsShopifyListExistTOMSPIELZEUG.includes(productsShopifyListTOMSPIELZEUG[i])){
		} else {
			await shopify.products
					.deleted(productsShopifyListIDTOMSPIELZEUG[productsShopifyListTOMSPIELZEUG[i]])
					.then((c) => {
						console.log(`${productsShopifyListTOMSPIELZEUG[i]}   no stock`);
						gcsv += `${productsShopifyListTOMSPIELZEUG[i]},no stock\n`;
					})
					.catch((err) => {
						console.error(err);
						gcsv += `${productsShopifyListTOMSPIELZEUG[i]},error no stock\n`;
					});
			await new Promise(r => setTimeout(r, 1000));
		}
	}
	
	fs.writeFileSync("check24/tomspielzeug_new.csv", tomspielzeugcsv);

	console.log("done-Tomspielzeug");
	
	
	
	
	//START TWM
	let tomTWMcsv = "Handle,Title,Body (HTML),Vendor,Product Category,Type,Tags,Published,Option1 Name,Option1 Value,Option2 Name,Option2 Value,Option3 Name,Option3 Value,Variant SKU,Variant Grams,Variant Inventory Tracker,Variant Inventory Qty,Variant Inventory Policy,Variant Fulfillment Service,Variant Price,Variant Compare At Price,Variant Requires Shipping,Variant Taxable,Variant Barcode,Image Src,Image Position,Image Alt Text,Gift Card,SEO Title,SEO Description,Google Shopping / Google Product Category,Google Shopping / Gender,Google Shopping / Age Group,Google Shopping / MPN,Google Shopping / AdWords Grouping,Google Shopping / AdWords Labels,Google Shopping / Condition,Google Shopping / Custom Product,Google Shopping / Custom Label 0,Google Shopping / Custom Label 1,Google Shopping / Custom Label 2,Google Shopping / Custom Label 3,Google Shopping / Custom Label 4,Variant Image,Variant Weight Unit,Variant Tax Code,Cost per item,Price / International,Compare At Price / International,Status\n";
	
	
	let tabletomTWM = fs.readFileSync("./Fahrräder.csv", "utf-8").split("\n");

	for (let i = 1; i < tabletomTWM.length; i++) {
		while (SHOPLIMITCALL) {
			console.log("limit reached : waiting 30 seconds");
			await new Promise(r => setTimeout(r, 60000));
			SHOPLIMITCALL = false;
		} 
		let product = tabletomTWM[i];
		product = product
			.replace(/(?!(([^"]*"){2})*[^"]*$),/gm, " ")
			.replace(";", ":")
			.replaceAll(", ", " ")
			.replace(/,/gm, ";");
		let productDetails = product.split(";");
		let price = calculateCustomerPrice(parseFloat(productDetails[5]));

		if (
			settings.DELETED_PRODUCTS.includes(productDetails[3]) ||
			settings.DELETED_PRODUCTS.includes(parseInt(productDetails[3]))
		) {
			continue;
		}
		
	    if (
			VOLAREANARRAY.includes(productDetails[3]) || CYCLETECHEANARRAY.includes(productDetails[3])
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
			if (productUPDATEDetails[0] === productDetails[3]){
				productDetails[17] = productUPDATEDetails[1];
				shippingtime = productUPDATEDetails[2] + "Tage";
			}
			
		}
		let imgflg = false;
		if (productDetails[1] === undefined || isNaN(parseFloat(productDetails[5])) || isNaN(parseFloat(productDetails[17])) || parseInt(productDetails[17]) <= 0){
			continue;
		}
		console.log(productDetails[0]);
		try {
			let imgdownload = await download_image(productDetails[9], "../storage/media/TWM-" + productDetails[0] + ".jpg");
			imgflg = true;
		} catch (e) {
		}
	    productDetails[1] = productDetails[1].replace(/'/g, '').replace(/"/g, '');
		productDetails[8] = productDetails[8].replace(/'/g, '').replace(/"/g, '');
		productDetails[24] = productDetails[24].replace(/"/g, '');
		productDetails[18] = productDetails[18].replace(/"/g, '');
		productDetails[7] = productDetails[7].replace(/"/g, '');
		productDetails[3] = productDetails[3].replace(/"/g, '');
		productDetails[9] = productDetails[9].replace(/"/g, '');
		productDetails[8] = productDetails[8].replace(/"/g, '');
		productDetails[22] = productDetails[22].replace(/"/g, '');
		productDetails[23] = productDetails[23].replace(/"/g, '');
		productDetails[6] = productDetails[6].replace(/"/g, '');
		productDetails[2] = productDetails[2].replace(/"/g, '');
		if (imgflg == false){
			continue;
		}
		if (productDetails[2] == "Non-Branded"){
			productDetails[2] = "EJIMM";
		}
		tomTWMcsv += `"TWM-${productDetails[0]} ${productDetails[2]} ${productDetails[1]}","${productDetails[2]} ${productDetails[1]}","${productDetails[8]}","${productDetails[2]}","Sporting Goods > Outdoor Recreation > Cycling > Bicycles","${productDetails[18]}","${productDetails[7]}, Bicycles",TRUE,,,,,,,"TWM-${productDetails[0]}",,shopify,${productDetails[17]},deny,manual,${parseFloat(price).toFixed(2)},,TRUE,TRUE,${productDetails[3]},${productDetails[9]},1,,FALSE,"${productDetails[1]}","${productDetails[8]}","${productDetails[6]}",,,,,,,FALSE,,,,,,,,,,,,active\n`;
		
		if (productsShopifyListTWM.includes((`twm-${productDetails[0]}`).toLowerCase())){
			productsShopifyListExistTWM.push((`twm-${productDetails[0]}`).toLowerCase());
			await shopify.products
				.updated(productsShopifyListIDTWM[(`twm-${productDetails[0]}`).toLowerCase()],{
					"body_html": `${productDetails[8]}`,
					"handle": `twm-${productDetails[0]} ${productDetails[2]} ${productDetails[1]}`,
					"product_type": `Sporting Goods > Outdoor Recreation > Cycling > Bicycles`,
					"title": `${productDetails[2]} ${productDetails[1]}`,
					"product_category":`Sporting Goods > Outdoor Recreation > Cycling > Bicycles`,
					"variants": [
						{
							"barcode": `${productDetails[3]}`,
							"compare_at_price": null,
							"fulfillment_service": "manual",
							"weight_unit": "kg",
							"inventory_management": "shopify",
							"inventory_policy": "deny",
							"inventory_quantity": parseInt(productDetails[17]),
							"price": parseFloat(price).toFixed(2),
							"requires_shipping": true,
							"sku": `twm-${productDetails[0]}`,
							"taxable": true
						}
					],
					"vendor": `${productDetails[2]}`
				})
				.then((c) => {
					console.log(`twm-${productDetails[0]}   update`);
					gcsv += `twm-${productDetails[0]},updated\n`;
				})
				.catch((err) => {
					console.error(err);
					gcsv += `twm-${productDetails[0]},updating error\n`;
				});
		} else {
			await shopify.products
				.created({
					"body_html": `${productDetails[8]}`,
					"handle": `twm-${productDetails[0]} ${productDetails[2]} ${productDetails[1]}`,
					"id": 632910392,
					"images":[{"src":productDetails[9]}],
					"product_type": `Sporting Goods > Outdoor Recreation > Cycling > Bicycles`,
					"published_scope": "global",
					"status": "active",
					"tags": `${productDetails[2]},${productDetails[7]},${productDetails[18]}`,
					"template_suffix": "special",
					"title": `${productDetails[2]} ${productDetails[1]}`,
					"product_category":`Sporting Goods > Outdoor Recreation > Cycling > Bicycles`,
					"variants": [
						{
							"barcode": `${productDetails[3]}`,
							"compare_at_price": null,
							"fulfillment_service": "manual",
							"weight_unit": "kg",
							"inventory_management": "shopify",
							"inventory_policy": "deny",
							"inventory_quantity": parseInt(productDetails[17]),
							"price": parseFloat(price).toFixed(2),
							"requires_shipping": true,
							"sku": `twm-${productDetails[0]}`,
							"taxable": true
						}
					],
					"vendor": `${productDetails[2]}`
				})
				.then((c) => {
					console.log(`twm-${productDetails[0]}   new`);
					gcsv += `twm-${productDetails[0]},added\n`;
				})
				.catch((err) => {
					console.error(err);
					gcsv += `twm-${productDetails[0]},adding error\n`;
				});
		}
		await new Promise(r => setTimeout(r, 1000));
	}
	
	for(var i in productsShopifyListTWM) {
		if (productsShopifyListExistTWM.includes(productsShopifyListTWM[i])){
		} else {
			await shopify.productd
					.deletes(productsShopifyListIDTWM[productsShopifyListTWM[i]])
					.then((c) => {
						console.log(`${productsShopifyListTWM[i]}   no stock`);
						gcsv += `${productsShopifyListTWM[i]},no stock\n`;
					})
					.catch((err) => {
						console.error(err);
						gcsv += `${productsShopifyListTWM[i]},error no stock\n`;
					});
			await new Promise(r => setTimeout(r, 1000));
		}
	}
	
	fs.writeFileSync("check24/TWM_new.csv", tomTWMcsv);

	console.log("done-TWM");
	
	
	
	
	
	//START TOM OUTDOOR
	let tomOutdoorcsv = "Handle,Title,Body (HTML),Vendor,Product Category,Type,Tags,Published,Option1 Name,Option1 Value,Option2 Name,Option2 Value,Option3 Name,Option3 Value,Variant SKU,Variant Grams,Variant Inventory Tracker,Variant Inventory Qty,Variant Inventory Policy,Variant Fulfillment Service,Variant Price,Variant Compare At Price,Variant Requires Shipping,Variant Taxable,Variant Barcode,Image Src,Image Position,Image Alt Text,Gift Card,SEO Title,SEO Description,Google Shopping / Google Product Category,Google Shopping / Gender,Google Shopping / Age Group,Google Shopping / MPN,Google Shopping / AdWords Grouping,Google Shopping / AdWords Labels,Google Shopping / Condition,Google Shopping / Custom Product,Google Shopping / Custom Label 0,Google Shopping / Custom Label 1,Google Shopping / Custom Label 2,Google Shopping / Custom Label 3,Google Shopping / Custom Label 4,Variant Image,Variant Weight Unit,Variant Tax Code,Cost per item,Price / International,Compare At Price / International,Status\n";
	
	let tableOutdoor = fs.readFileSync("./Outdoor.csv", "utf-8").split("\n");
	
	for (let i = 1; i < tableOutdoor.length; i++) {
		while (SHOPLIMITCALL) {
			console.log("limit reached : waiting 30 seconds");
			await new Promise(r => setTimeout(r, 60000));
			SHOPLIMITCALL = false;
		} 
		let product = tableOutdoor[i];
		product = product
			.replace(/(?!(([^"]*"){2})*[^"]*$),/gm, " ")
			.replace(";", ":")
			.replaceAll(", ", " ")
			.replace(/,/gm, ";");
		let productDetails = product.split(";");
		let price = calculateCustomerPrice(parseFloat(productDetails[5]));

		if (
			settings.DELETED_PRODUCTS.includes(productDetails[3]) ||
			settings.DELETED_PRODUCTS.includes(parseInt(productDetails[3]))
		) {
			continue;
		}
		
	    if (
			VOLAREANARRAY.includes(productDetails[3])
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
			if (productUPDATEDetails[0] === productDetails[3]){
				productDetails[17] = productUPDATEDetails[1];
				shippingtime = productUPDATEDetails[2] + "Tage";
			}
			
		}
		
		let imgflg = false;
		if (productDetails[1] === undefined || isNaN(parseFloat(productDetails[5])) || isNaN(parseFloat(productDetails[17])) || parseInt(productDetails[17]) <= 0){
			continue;
		}
		console.log(productDetails[0]);
		try {
			let imgdownload = await download_image(productDetails[9], "../storage/media/TOUT-" + productDetails[0] + ".jpg");
			imgflg = true;
		} catch (e) {
		}
	    productDetails[1] = productDetails[1].replace(/'/g, '').replace(/"/g, '');
		productDetails[8] = productDetails[8].replace(/'/g, '').replace(/"/g, '');
		productDetails[24] = productDetails[24].replace(/"/g, '');
		productDetails[18] = productDetails[18].replace(/"/g, '');
		productDetails[7] = productDetails[7].replace(/"/g, '');
		productDetails[3] = productDetails[3].replace(/"/g, '');
		productDetails[9] = productDetails[9].replace(/"/g, '');
		productDetails[8] = productDetails[8].replace(/"/g, '');
		productDetails[22] = productDetails[22].replace(/"/g, '');
		productDetails[23] = productDetails[23].replace(/"/g, '');
		productDetails[6] = productDetails[6].replace(/"/g, '');
		productDetails[2] = productDetails[2].replace(/"/g, '');
		if (imgflg == false){
			continue;
		}
		if (productDetails[2] == "Non-Branded"){
			productDetails[2] = "EJIMM";
		}
		tomOutdoorcsv += `"TOUT-${productDetails[0]} ${productDetails[2]} ${productDetails[1]}","${productDetails[2]} ${productDetails[1]}","${productDetails[8]}","${productDetails[2]}","Sporting Goods > Outdoor Recreation","${productDetails[18]}","${productDetails[7]}, Outdoor",TRUE,,,,,,,"TOUT-${productDetails[0]}",,shopify,${productDetails[17]},deny,manual,${parseFloat(price).toFixed(2)},,TRUE,TRUE,${productDetails[3]},${productDetails[9]},1,,FALSE,"${productDetails[1]}","${productDetails[8]}","${productDetails[6]}",,,,,,,FALSE,,,,,,,,,,,,active\n`;
		
		if (productsShopifyListOUTDOOR.includes((`tout-${productDetails[0]}`).toLowerCase())){
			productsShopifyListExistOUTDOOR.push((`tout-${productDetails[0]}`).toLowerCase());
			await shopify.productd
				.updates(productsShopifyListIDOUTDOOR[(`tout-${productDetails[0]}`).toLowerCase()],{
					"body_html": `${productDetails[8]}`,
					"product_type": `SSporting Goods > Outdoor Recreation`,
					"handle": `tout-${productDetails[0]} ${productDetails[2]} ${productDetails[1]}`,
					"title": `${productDetails[2]} ${productDetails[1]}`,
					"product_category":`Sporting Goods > Outdoor Recreation`,
					"variants": [
						{
							"barcode": `${productDetails[3]}`,
							"compare_at_price": null,
							"fulfillment_service": "manual",
							"weight_unit": "kg",
							"inventory_management": "shopify",
							"inventory_policy": "deny",
							"inventory_quantity": parseInt(productDetails[17]),
							"price": parseFloat(price).toFixed(2),
							"requires_shipping": true,
							"sku": `tout-${productDetails[0]}`,
							"taxable": true
						}
					],
					"vendor": `${productDetails[2]}`
				})
				.then((c) => {
					console.log(`tout-${productDetails[0]}   update`);
					gcsv += `tout-${productDetails[0]},updated\n`;
				})
				.catch((err) => {
					console.error(err);
					gcsv += `tout-${productDetails[0]},updating error\n`;
				});
		} else {
			await shopify.productd
				.creates({
					"body_html": `${productDetails[8]}`,
					"handle": `tout-${productDetails[0]} ${productDetails[2]} ${productDetails[1]}`,
					"id": 632910392,
					"images":[{"src":productDetails[9]}],
					"product_type": `Sporting Goods > Outdoor Recreation > Cycling > Bicycles`,
					"published_scope": "global",
					"status": "active",
					"tags": `${productDetails[2]},${productDetails[7]},${productDetails[18]}`,
					"template_suffix": "special",
					"title": `${productDetails[2]} ${productDetails[1]}`,
					"product_category":`Sporting Goods > Outdoor Recreation > Cycling > Bicycles`,
					"variants": [
						{
							"barcode": `${productDetails[3]}`,
							"compare_at_price": null,
							"fulfillment_service": "manual",
							"weight_unit": "kg",
							"inventory_management": "shopify",
							"inventory_policy": "deny",
							"inventory_quantity": parseInt(productDetails[17]),
							"price": parseFloat(price).toFixed(2),
							"requires_shipping": true,
							"sku": `tout-${productDetails[0]}`,
							"taxable": true
						}
					],
					"vendor": `${productDetails[2]}`
				})
				.then((c) => {
					console.log(`tout-${productDetails[0]}   new`);
					gcsv += `tout-${productDetails[0]},added\n`;
				})
				.catch((err) => {
					console.error(err);
					gcsv += `tout-${productDetails[0]},adding error\n`;
				});
		}
		await new Promise(r => setTimeout(r, 1000));
	}
	
	
	for(var i in productsShopifyListOUTDOOR) {
		if (productsShopifyListExistOUTDOOR.includes(productsShopifyListOUTDOOR[i])){
		} else {
			await shopify.productd
					.deletes(productsShopifyListIDOUTDOOR[productsShopifyListOUTDOOR[i]])
					.then((c) => {
						console.log(`${productsShopifyListOUTDOOR[i]}   no stock`);
						gcsv += `${productsShopifyListOUTDOOR[i]},no stock\n`;
					})
					.catch((err) => {
						console.error(err);
						gcsv += `${productsShopifyListOUTDOOR[i]},error no stock\n`;
					});
			await new Promise(r => setTimeout(r, 1000));
		}
	}
	
	
	fs.writeFileSync("check24/TOutdoor_new.csv", tomOutdoorcsv);

	console.log("done-TOutdoor");
	
	
	
	
	//START TOM SPORTS
	
	let tomSPORTScsv = "Handle,Title,Body (HTML),Vendor,Product Category,Type,Tags,Published,Option1 Name,Option1 Value,Option2 Name,Option2 Value,Option3 Name,Option3 Value,Variant SKU,Variant Grams,Variant Inventory Tracker,Variant Inventory Qty,Variant Inventory Policy,Variant Fulfillment Service,Variant Price,Variant Compare At Price,Variant Requires Shipping,Variant Taxable,Variant Barcode,Image Src,Image Position,Image Alt Text,Gift Card,SEO Title,SEO Description,Google Shopping / Google Product Category,Google Shopping / Gender,Google Shopping / Age Group,Google Shopping / MPN,Google Shopping / AdWords Grouping,Google Shopping / AdWords Labels,Google Shopping / Condition,Google Shopping / Custom Product,Google Shopping / Custom Label 0,Google Shopping / Custom Label 1,Google Shopping / Custom Label 2,Google Shopping / Custom Label 3,Google Shopping / Custom Label 4,Variant Image,Variant Weight Unit,Variant Tax Code,Cost per item,Price / International,Compare At Price / International,Status\n";

	
	let tableSPORTS = fs.readFileSync("./Sport & Freizeit.csv", "utf-8").split("\n");

	for (let i = 1; i < tableSPORTS.length; i++) {
		while (SHOPLIMITCALL) {
			console.log("limit reached : waiting 30 seconds");
			await new Promise(r => setTimeout(r, 60000));
			SHOPLIMITCALL = false;
		} 
		let product = tableSPORTS[i];
		product = product
			.replace(/(?!(([^"]*"){2})*[^"]*$),/gm, " ")
			.replace(";", ":")
			.replaceAll(", ", " ")
			.replace(/,/gm, ";");
		let productDetails = product.split(";");
		let price = calculateCustomerPrice(parseFloat(productDetails[5]));

		if (
			settings.DELETED_PRODUCTS.includes(productDetails[3]) ||
			settings.DELETED_PRODUCTS.includes(parseInt(productDetails[3]))
		) {
			continue;
		}
		
	    if (
			VOLAREANARRAY.includes(productDetails[3])
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
			if (productUPDATEDetails[0] === productDetails[3]){
				productDetails[17] = productUPDATEDetails[1];
				shippingtime = productUPDATEDetails[2] + "Tage";
			}
			
		}
		
		let imgflg = false;
		if (productDetails[1] === undefined || isNaN(parseFloat(productDetails[5])) || isNaN(parseFloat(productDetails[17])) || parseInt(productDetails[17]) <= 0){
			continue;
		}
		console.log(productDetails[0]);
		try {
			let imgdownload = await download_image(productDetails[9], "../storage/media/TSNF-" + productDetails[0] + ".jpg");
			imgflg = true;
		} catch (e) {
		}
	    productDetails[1] = productDetails[1].replace(/'/g, '').replace(/"/g, '');
		productDetails[8] = productDetails[8].replace(/'/g, '').replace(/"/g, '');
		productDetails[24] = productDetails[24].replace(/"/g, '');
		productDetails[18] = productDetails[18].replace(/"/g, '');
		productDetails[7] = productDetails[7].replace(/"/g, '');
		productDetails[3] = productDetails[3].replace(/"/g, '');
		productDetails[9] = productDetails[9].replace(/"/g, '');
		productDetails[8] = productDetails[8].replace(/"/g, '');
		productDetails[22] = productDetails[22].replace(/"/g, '');
		productDetails[23] = productDetails[23].replace(/"/g, '');
		productDetails[6] = productDetails[6].replace(/"/g, '');
		productDetails[2] = productDetails[2].replace(/"/g, '');
		if (imgflg == false){
			continue;
		}
		if (productDetails[2] == "Non-Branded"){
			productDetails[2] = "EJIMM";
		}
		tomSPORTScsv += `"TSNF-${productDetails[0]} ${productDetails[2]} ${productDetails[1]}","${productDetails[2]} ${productDetails[1]}","${productDetails[8]}","${productDetails[2]}","Sporting Goods","${productDetails[18]}","${productDetails[7]}, Sports, Leisure",TRUE,,,,,,,"TSNF-${productDetails[0]}",,shopify,${productDetails[17]},deny,manual,${parseFloat(price).toFixed(2)},,TRUE,TRUE,${productDetails[3]},${productDetails[9]},1,,FALSE,"${productDetails[1]}","${productDetails[8]}","${productDetails[6]}",,,,,,,FALSE,,,,,,,,,,,,active\n`;
		
		if (productsShopifyListSPORTS.includes((`tsnf-${productDetails[0]}`).toLowerCase())){
			productsShopifyListExistSPORTS.push((`tsnf-${productDetails[0]}`).toLowerCase());
			await shopify.products
				.updated(productsShopifyListIDSPORTS[(`tsnf-${productDetails[0]}`).toLowerCase()],{
					"body_html": `${productDetails[8]}`,
					"handle": `tsnf-${productDetails[0]} ${productDetails[2]} ${productDetails[1]}`,
					"product_type": `Sporting Goods`,
					"title": `${productDetails[2]} ${productDetails[1]}`,
					"product_category":`Sporting Goods`,
					"variants": [
						{
							"barcode": `${productDetails[3]}`,
							"compare_at_price": null,
							"fulfillment_service": "manual",
							"weight_unit": "kg",
							"inventory_management": "shopify",
							"inventory_policy": "deny",
							"inventory_quantity": parseInt(productDetails[17]),
							"price": parseFloat(price).toFixed(2),
							"requires_shipping": true,
							"sku": `tsnf-${productDetails[0]}`,
							"taxable": true
						}
					],
					"vendor": `${productDetails[2]}`
				})
				.then((c) => {
					console.log(`tsnf-${productDetails[0]}   update`);
					gcsv += `tsnf-${productDetails[0]},updated\n`;
				})
				.catch((err) => {
					console.error(err);
					gcsv += `tsnf-${productDetails[0]},updating error\n`;
				});
		} else {
			await shopify.products
				.created({
					"body_html": `${productDetails[8]}`,
					"handle": `tsnf-${productDetails[0]} ${productDetails[2]} ${productDetails[1]}`,
					"id": 632910392,
					"images":[{"src":productDetails[9]}],
					"product_type": `Sporting Goods`,
					"published_scope": "global",
					"status": "active",
					"tags": `${productDetails[2]},${productDetails[7]},${productDetails[18]}`,
					"template_suffix": "special",
					"title": `${productDetails[2]} ${productDetails[1]}`,
					"product_category":`Sporting Goods`,
					"variants": [
						{
							"barcode": `${productDetails[3]}`,
							"compare_at_price": null,
							"fulfillment_service": "manual",
							"weight_unit": "kg",
							"inventory_management": "shopify",
							"inventory_policy": "deny",
							"inventory_quantity": parseInt(productDetails[17]),
							"price": parseFloat(price).toFixed(2),
							"requires_shipping": true,
							"sku": `tsnf-${productDetails[0]}`,
							"taxable": true
						}
					],
					"vendor": `${productDetails[2]}`
				})
				.then((c) => {
					console.log(`tsnf-${productDetails[0]}   new`);
					gcsv += `tsnf-${productDetails[0]},added\n`;
				})
				.catch((err) => {
					console.error(err);
					gcsv += `tsnf-${productDetails[0]},adding error\n`;
				});
		}
		await new Promise(r => setTimeout(r, 1000));
	}
	
	
	for(var i in productsShopifyListSPORTS) {
		if (productsShopifyListExistSPORTS.includes(productsShopifyListSPORTS[i])){
		} else {
			await shopify.products
					.deleted(productsShopifyListIDSPORTS[productsShopifyListSPORTS[i]])
					.then((c) => {
						console.log(`${productsShopifyListSPORTS[i]}   no stock`);
						gcsv += `${productsShopifyListSPORTS[i]},no stock\n`;
					})
					.catch((err) => {
						console.error(err);
						gcsv += `${productsShopifyListSPORTS[i]},error no stock\n`;
					});
			await new Promise(r => setTimeout(r, 1000));
		}
	}
	
	fs.writeFileSync("check24/TSPORSTSenLEISURE.csv", tomSPORTScsv);

	console.log("done-TSPORSTSenLEISURE");
	
	
	
	
	//START TOM BIKEPARTS 
	let tomBIKEPARTScsv = "Handle,Title,Body (HTML),Vendor,Product Category,Type,Tags,Published,Option1 Name,Option1 Value,Option2 Name,Option2 Value,Option3 Name,Option3 Value,Variant SKU,Variant Grams,Variant Inventory Tracker,Variant Inventory Qty,Variant Inventory Policy,Variant Fulfillment Service,Variant Price,Variant Compare At Price,Variant Requires Shipping,Variant Taxable,Variant Barcode,Image Src,Image Position,Image Alt Text,Gift Card,SEO Title,SEO Description,Google Shopping / Google Product Category,Google Shopping / Gender,Google Shopping / Age Group,Google Shopping / MPN,Google Shopping / AdWords Grouping,Google Shopping / AdWords Labels,Google Shopping / Condition,Google Shopping / Custom Product,Google Shopping / Custom Label 0,Google Shopping / Custom Label 1,Google Shopping / Custom Label 2,Google Shopping / Custom Label 3,Google Shopping / Custom Label 4,Variant Image,Variant Weight Unit,Variant Tax Code,Cost per item,Price / International,Compare At Price / International,Status\n";
	
	let tableBIKEPARTS = fs.readFileSync("./Fahrräder Teile & Zubehör.csv", "utf-8").split("\n");
	
	for (let i = 1; i < tableBIKEPARTS.length; i++) {
		while (SHOPLIMITCALL) {
			console.log("limit reached : waiting 30 seconds");
			await new Promise(r => setTimeout(r, 60000));
			SHOPLIMITCALL = false;
		} 
		let product = tableBIKEPARTS[i];
		product = product
			.replace(/(?!(([^"]*"){2})*[^"]*$),/gm, " ")
			.replace(";", ":")
			.replaceAll(", ", " ")
			.replace(/,/gm, ";");
		let productDetails = product.split(";");
		let price = calculateCustomerPrice(parseFloat(productDetails[5]));

		if (
			settings.DELETED_PRODUCTS.includes(productDetails[3]) ||
			settings.DELETED_PRODUCTS.includes(parseInt(productDetails[3]))
		) {
			continue;
		}
		
	    if (
			VOLAREANARRAY.includes(productDetails[3]) || CYCLETECHEANARRAY.includes(productDetails[3])
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
			if (productUPDATEDetails[0] === productDetails[3]){
				productDetails[17] = productUPDATEDetails[1];
				shippingtime = productUPDATEDetails[2] + "Tage";
			}
			
		}
		
		let imgflg = false;
		if (productDetails[1] === undefined || isNaN(parseFloat(productDetails[5])) || isNaN(parseFloat(productDetails[17])) || parseInt(productDetails[17]) <= 0){
			continue;
		}
		console.log(productDetails[0]);
		try {
			let imgdownload = await download_image(productDetails[9], "../storage/media/TBANP-" + productDetails[0] + ".jpg");
			imgflg = true;
		} catch (e) {
		}
	    productDetails[1] = productDetails[1].replace(/'/g, '').replace(/"/g, '');
		productDetails[8] = productDetails[8].replace(/'/g, '').replace(/"/g, '');
		productDetails[24] = productDetails[24].replace(/"/g, '');
		productDetails[18] = productDetails[18].replace(/"/g, '');
		productDetails[7] = productDetails[7].replace(/"/g, '');
		productDetails[3] = productDetails[3].replace(/"/g, '');
		productDetails[9] = productDetails[9].replace(/"/g, '');
		productDetails[8] = productDetails[8].replace(/"/g, '');
		productDetails[22] = productDetails[22].replace(/"/g, '');
		productDetails[23] = productDetails[23].replace(/"/g, '');
		productDetails[6] = productDetails[6].replace(/"/g, '');
		productDetails[2] = productDetails[2].replace(/"/g, '');
		if (imgflg == false){
			continue;
		}
		if (productDetails[2] == "Non-Branded"){
			productDetails[2] = "EJIMM";
		}
		tomBIKEPARTScsv += `"TBANP-${productDetails[0]} ${productDetails[2]} ${productDetails[1]}","${productDetails[2]} ${productDetails[1]}","${productDetails[8]}","${productDetails[2]}","Sporting Goods > Outdoor Recreation > Cycling > Bicycle Parts","${productDetails[18]}","${productDetails[7]}, Bicycles",TRUE,,,,,,,"TBANP-${productDetails[0]}",,shopify,${productDetails[17]},deny,manual,${parseFloat(price).toFixed(2)},,TRUE,TRUE,${productDetails[3]},${productDetails[9]},1,,FALSE,"${productDetails[1]}","${productDetails[8]}","${productDetails[6]}",,,,,,,FALSE,,,,,,,,,,,,active\n`;
		
		if (productsShopifyListBIKEPARTS.includes((`tbanp-${productDetails[0]}`).toLowerCase())){
			productsShopifyListExistBIKEPARTS.push((`tbanp-${productDetails[0]}`).toLowerCase());
			await shopify.products
				.updated(productsShopifyListIDBIKEPARTS[(`tbanp-${productDetails[0]}`).toLowerCase()],{
					"body_html": `${productDetails[8]}`,
					"handle": `tbanp-${productDetails[0]} ${productDetails[2]} ${productDetails[1]}`,
					"product_type": `Sporting Goods > Outdoor Recreation > Cycling > Bicycle Parts`,
					"title": `${productDetails[2]} ${productDetails[1]}`,
					"product_category":`Sporting Goods > Outdoor Recreation > Cycling > Bicycle Parts`,
					"variants": [
						{
							"barcode": `${productDetails[3]}`,
							"compare_at_price": null,
							"fulfillment_service": "manual",
							"weight_unit": "kg",
							"inventory_management": "shopify",
							"inventory_policy": "deny",
							"inventory_quantity": parseInt(productDetails[17]),
							"price": parseFloat(price).toFixed(2),
							"requires_shipping": true,
							"sku": `tbanp-${productDetails[0]}`,
							"taxable": true
						}
					],
					"vendor": `${productDetails[2]}`
				})
				.then((c) => {
					console.log(`tbanp-${productDetails[0]}   update`);
					gcsv += `tbanp-${productDetails[0]},updated\n`;
				})
				.catch((err) => {
					console.error(err);
					gcsv += `tbanp-${productDetails[0]},updating error\n`;
				});
		} else {
			await shopify.products
				.created({
					"body_html": `${productDetails[8]}`,
					"handle": `tbanp-${productDetails[0]} ${productDetails[2]} ${productDetails[1]}`,
					"id": 632910392,
					"images":[{"src":productDetails[9]}],
					"product_type": `Sporting Goods > Outdoor Recreation > Cycling > Bicycle Parts`,
					"published_scope": "global",
					"status": "active",
					"tags": `${productDetails[2]},${productDetails[7]},${productDetails[18]}`,
					"template_suffix": "special",
					"title": `${productDetails[2]} ${productDetails[1]}`,
					"product_category":`Sporting Goods > Outdoor Recreation > Cycling > Bicycle Parts`,
					"variants": [
						{
							"barcode": `${productDetails[3]}`,
							"compare_at_price": null,
							"fulfillment_service": "manual",
							"weight_unit": "kg",
							"inventory_management": "shopify",
							"inventory_policy": "deny",
							"inventory_quantity": parseInt(productDetails[17]),
							"price": parseFloat(price).toFixed(2),
							"requires_shipping": true,
							"sku": `tbanp-${productDetails[0]}`,
							"taxable": true
						}
					],
					"vendor": `${productDetails[2]}`
				})
				.then((c) => {
					console.log(`tbanp-${productDetails[0]}   new`);
					gcsv += `tbanp-${productDetails[0]},added\n`;
				})
				.catch((err) => {
					console.error(err);
					gcsv += `tbanp-${productDetails[0]},adding error\n`;
				});
		}
		await new Promise(r => setTimeout(r, 1000));
	}
	
	
	for(var i in productsShopifyListBIKEPARTS) {
		if (productsShopifyListExistBIKEPARTS.includes(productsShopifyListBIKEPARTS[i])){
		} else {
			await shopify.products
					.deleted(productsShopifyListIDBIKEPARTS[productsShopifyListBIKEPARTS[i]])
					.then((c) => {
						console.log(`${productsShopifyListBIKEPARTS[i]}   no stock`);
						gcsv += `${productsShopifyListBIKEPARTS[i]},no stock\n`;
					})
					.catch((err) => {
						console.error(err);
						gcsv += `${productsShopifyListBIKEPARTS[i]},error no stock\n`;
					});
			await new Promise(r => setTimeout(r, 1000));
		}
	}
	
	fs.writeFileSync("check24/TPARTSenACCE_new.csv", tomBIKEPARTScsv);

	console.log("done-TPARTSenACCE");
	
	
	
	
	
	// START TOM HOUSE
	
	
	let tomHOUSEcsv = "Handle,Title,Body (HTML),Vendor,Product Category,Type,Tags,Published,Option1 Name,Option1 Value,Option2 Name,Option2 Value,Option3 Name,Option3 Value,Variant SKU,Variant Grams,Variant Inventory Tracker,Variant Inventory Qty,Variant Inventory Policy,Variant Fulfillment Service,Variant Price,Variant Compare At Price,Variant Requires Shipping,Variant Taxable,Variant Barcode,Image Src,Image Position,Image Alt Text,Gift Card,SEO Title,SEO Description,Google Shopping / Google Product Category,Google Shopping / Gender,Google Shopping / Age Group,Google Shopping / MPN,Google Shopping / AdWords Grouping,Google Shopping / AdWords Labels,Google Shopping / Condition,Google Shopping / Custom Product,Google Shopping / Custom Label 0,Google Shopping / Custom Label 1,Google Shopping / Custom Label 2,Google Shopping / Custom Label 3,Google Shopping / Custom Label 4,Variant Image,Variant Weight Unit,Variant Tax Code,Cost per item,Price / International,Compare At Price / International,Status\n";
	
	
	
	let tableHOUSE = fs.readFileSync("./Haus & Garten.csv", "utf-8").split("\n");
	
	
	for (let i = 1; i < tableHOUSE.length; i++) {
		while (SHOPLIMITCALL) {
			console.log("limit reached : waiting 30 seconds");
			await new Promise(r => setTimeout(r, 60000));
			SHOPLIMITCALL = false;
		} 
		let product = tableHOUSE[i];
		product = product
			.replace(/(?!(([^"]*"){2})*[^"]*$),/gm, " ")
			.replace(";", ":")
			.replaceAll(", ", " ")
			.replace(/,/gm, ";");
		let productDetails = product.split(";");
		let price = calculateCustomerPrice(parseFloat(productDetails[5]));

		if (
			settings.DELETED_PRODUCTS.includes(productDetails[3]) ||
			settings.DELETED_PRODUCTS.includes(parseInt(productDetails[3]))
		) {
			continue;
		}
		
	    if (
			VOLAREANARRAY.includes(productDetails[3])
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
			if (productUPDATEDetails[0] === productDetails[3]){
				productDetails[17] = productUPDATEDetails[1];
				shippingtime = productUPDATEDetails[2] + "Tage";
			}
			
		}
		
		let imgflg = false;
		if (productDetails[1] === undefined || isNaN(parseFloat(productDetails[5])) || isNaN(parseFloat(productDetails[17])) || parseInt(productDetails[17]) <= 0){
			continue;
		}
		console.log(productDetails[0]);
		try {
			let imgdownload = await download_image(productDetails[9], "../storage/media/THNG-" + productDetails[0] + ".jpg");
			imgflg = true;
		} catch (e) {
		}
	    productDetails[1] = productDetails[1].replace(/'/g, '').replace(/"/g, '');
		productDetails[8] = productDetails[8].replace(/'/g, '').replace(/"/g, '');
		productDetails[24] = productDetails[24].replace(/"/g, '');
		productDetails[18] = productDetails[18].replace(/"/g, '');
		productDetails[7] = productDetails[7].replace(/"/g, '');
		productDetails[3] = productDetails[3].replace(/"/g, '');
		productDetails[9] = productDetails[9].replace(/"/g, '');
		productDetails[8] = productDetails[8].replace(/"/g, '');
		productDetails[22] = productDetails[22].replace(/"/g, '');
		productDetails[23] = productDetails[23].replace(/"/g, '');
		productDetails[6] = productDetails[6].replace(/"/g, '');
		productDetails[2] = productDetails[2].replace(/"/g, '');
		if (imgflg == false){
			continue;
		}
		if (productDetails[2] == "Non-Branded"){
			productDetails[2] = "EJIMM";
		}
		tomHOUSEcsv += `"THNG-${productDetails[0]} ${productDetails[2]} ${productDetails[1]}","${productDetails[2]} ${productDetails[1]}","${productDetails[8]}","${productDetails[2]}","Home & Garden","${productDetails[18]}","${productDetails[7]}, House,Garden",TRUE,,,,,,,"THNG-${productDetails[0]}",,shopify,${productDetails[17]},deny,manual,${parseFloat(price).toFixed(2)},,TRUE,TRUE,${productDetails[3]},${productDetails[9]},1,,FALSE,"${productDetails[1]}","${productDetails[8]}","${productDetails[6]}",,,,,,,FALSE,,,,,,,,,,,,active\n`;
		
		if (productsShopifyListHOUSE.includes((`thng-${productDetails[0]}`).toLowerCase())){
			productsShopifyListExistHOUSE.push((`thng-${productDetails[0]}`).toLowerCase());
			await shopify.products
				.updated(productsShopifyListIDHOUSE[(`thng-${productDetails[0]}`).toLowerCase()],{
					"body_html": `${productDetails[8]}`,
					"handle": `thng-${productDetails[0]} ${productDetails[2]} ${productDetails[1]}`,
					"product_type": `Home & Garden`,
					"title": `${productDetails[2]} ${productDetails[1]}`,
					"product_category":`Home & Garden`,
					"variants": [
						{
							"barcode": `${productDetails[3]}`,
							"compare_at_price": null,
							"fulfillment_service": "manual",
							"weight_unit": "kg",
							"inventory_management": "shopify",
							"inventory_policy": "deny",
							"inventory_quantity": parseInt(productDetails[17]),
							"price": parseFloat(price).toFixed(2),
							"requires_shipping": true,
							"sku": `thng-${productDetails[0]}`,
							"taxable": true
						}
					],
					"vendor": `${productDetails[2]}`
				})
				.then((c) => {
					console.log(`thng-${productDetails[0]}   update`);
					gcsv += `thng-${productDetails[0]},updated\n`;
				})
				.catch((err) => {
					console.error(err);
					gcsv += `thng-${productDetails[0]},updating error\n`;
				});
		} else {
			await shopify.products
				.created({
					"body_html": `${productDetails[8]}`,
					"handle": `thng-${productDetails[0]} ${productDetails[2]} ${productDetails[1]}`,
					"id": 632910392,
					"images":[{"src":productDetails[9]}],
					"product_type": `Home & Garden`,
					"published_scope": "global",
					"status": "active",
					"tags": `${productDetails[2]},${productDetails[7]},${productDetails[18]}`,
					"template_suffix": "special",
					"title": `${productDetails[2]} ${productDetails[1]}`,
					"product_category":`Home & Garden`,
					"variants": [
						{
							"barcode": `${productDetails[3]}`,
							"compare_at_price": null,
							"fulfillment_service": "manual",
							"weight_unit": "kg",
							"inventory_management": "shopify",
							"inventory_policy": "deny",
							"inventory_quantity": parseInt(productDetails[17]),
							"price": parseFloat(price).toFixed(2),
							"requires_shipping": true,
							"sku": `thng-${productDetails[0]}`,
							"taxable": true
						}
					],
					"vendor": `${productDetails[2]}`
				})
				.then((c) => {
					console.log(`thng-${productDetails[0]}   new`);
					gcsv += `thng-${productDetails[0]},added\n`;
				})
				.catch((err) => {
					console.error(err);
					gcsv += `thng-${productDetails[0]},adding error\n`;
				});
		}
		await new Promise(r => setTimeout(r, 1000));
	}
	
	
	for(var i in productsShopifyListHOUSE) {
		if (productsShopifyListExistHOUSE.includes(productsShopifyListHOUSE[i])){
		} else {
			await shopify.products
					.deleted(productsShopifyListIDHOUSE[productsShopifyListHOUSE[i]])
					.then((c) => {
						console.log(`${productsShopifyListHOUSE[i]}   no stock`);
						gcsv += `${productsShopifyListHOUSE[i]},no stock\n`;
					})
					.catch((err) => {
						console.error(err);
						gcsv += `${productsShopifyListHOUSE[i]},error no stock\n`;
					});
			await new Promise(r => setTimeout(r, 1000));
		}
	}
	
	fs.writeFileSync("check24/THouseEnGarten.csv", tomHOUSEcsv);

	console.log("done-THouseEnGarten");
	
	
	
	
	
	function calculateCustomerPrice(num) {
		let price = parseFloat((num + (num / 100) * 15 + 6.99).toFixed(2));
		if (price <= 10) {
			price += 5;
		}
		price = price.toFixed(2);
		return doDiscount(price);
	}
	
	
	
	
	
	

	
	
	
	fs.writeFileSync("check24/shopifyApp3logs.csv", gcsv);
	console.log("done-Shopify App 3");
	
	

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



/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

 //globale Variable 
var oIDMenu = document.getElementById("idMenu");
var oIDMenuListe = document.getElementById("idMenuListe");
var oIDList = document.getElementById("idListe");
var oIDHier = document.getElementById("idSieSindHier");

var oEinmal = false;
function menuOn() {
	oIDMenuListe.style.display = 'block';
	oEinmal = true;
}
function menuOff() {
	if(oEinmal == false) {
		oIDMenuListe.style.display = 'none';
	}
	oEinmal = false;
}
		
		
function sendAjax(nKatalog, nArtikel, strTitel) {
	
	var strSend = 'http://app.kanzleilife.de/php/dbjson.php';
	var strPara = '';
	
	if(nArtikel !== 0) {
		strPara = 'p=' + nArtikel;
	} else if(nKatalog !== 0) {
		strPara = 'c=' + nKatalog;
	} else if(strTitel !== '') {
		strPara = 'n=' + strTitel;
	}
	
	var xmlHttp = null;
	if (window.XMLHttpRequest) {
		xmlHttp = new XMLHttpRequest();
	} else {
		try {
			xmlHttp = new ActiveXObject("Msxml2.XMLHTTP.3.0");
		} catch(ex) {
			alert('Die Schnittstelle ist nicht von Ihrem Browser unterstützt!');
			return false;
		}
	}
	
	//alert(strSend + "?" + strPara);
	
	
	if(xmlHttp !== null) {
		xmlHttp.open("POST", strSend + "?" + strPara, true);
		xmlHttp.onreadystatechange = function() {
			if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
				//alert("ResponseText:\n" + xmlHttp.responseText);
				
				menuOff(); 
				
				var node1;
				var jsonData = JSON.parse(xmlHttp.responseText);
				//alert("Data: " + jsonData.length);
				
				var strHTML = '';
				var strArtikelname = '';

				while( oIDList.firstChild) {oIDList.removeChild(oIDList.firstChild);}
				while( oIDMenu.firstChild) {oIDMenu.removeChild(oIDMenu.firstChild);}
				while( oIDHier.firstChild) {oIDHier.removeChild(oIDHier.firstChild);}
				
				for (var i=0; i < jsonData.length; i++) {
					var oRow = jsonData[i];

					if((oRow.ArtikelID) == 0 && (oRow.KatalogID !== 0)) {
						// Liste alle Katalogs
						node1 = document.createElement("div");
						node1.setAttribute("class","rahmen");
						node1.katalogID = oRow.KatalogID;
						node1.artikelID = oRow.ArtikelID;
						node1.name = oRow.name;
						node1.innerHTML = oRow.Inhalt + '<br/>' + oRow.name;
						node1.addEventListener("click", function() {sendAjax(parseInt(this.katalogID), 0, this.name);});
						oIDList.appendChild(node1);
					} else if((oRow.ArtikelID !== 0) && (oRow.KatalogID == 0)) {
						// nur Artikel
						node1 = document.createElement("div");
						if(oRow.beitragsbild !== '') {
							node1.innerHTML = '<img src="' + oRow.beitragsbild + '" /><br/>';
						}
						node1.innerHTML += '<h1>' + oRow.Titel + '</h1>' + oRow.Inhalt;
						oIDList.appendChild(node1);
						strArtikelname = oRow.Titel;
					} else if((oRow.ArtikelID !== 0) && (oRow.KatalogID !== 0)) {
						// gewählte Katalog und Artikeln auflisten, oder News
						node1 = document.createElement("div");
						node1.setAttribute("class","rahmen");
						node1.katalogID = oRow.KatalogID;
						node1.artikelID = oRow.ArtikelID;
						node1.name = strTitel;
						if(oRow.beitragsbild !== '') {
							node1.innerHTML = '<img src="' + oRow.beitragsbild + '" />';
						}
						node1.innerHTML += '<br/>';
						if(oRow.Datum !== '') {
							node1.innerHTML += '<i>' + oRow.Datum + '</i> - ';
						}
						node1.innerHTML += oRow.Titel;
						node1.addEventListener("click", function() {sendAjax(parseInt(this.katalogID), parseInt(this.artikelID), this.name);});
						oIDList.appendChild(node1);
					}
					
				}

				node1 = document.createElement("span");
				node1.innerHTML = 'Home';
				node1.addEventListener("click", function() {sendAjax(0, 0, 'Home');});
				oIDHier.appendChild(node1);
				
				if(nKatalog !== 0) {
					node1 = document.createElement("span");
					node1.innerHTML = ' | ' + strTitel;
					if(strTitel=='News') {
						node1.addEventListener("click", function() {sendAjax(0, 0, 'News');});
					} else {
						node1.addEventListener("click", function() {sendAjax(nKatalog, 0, strTitel);});
					}
					oIDHier.appendChild(node1);
				}
				
				if(nArtikel !== 0) {
					node1 = document.createElement("span");
					node1.innerHTML = ' | ' + strArtikelname;
					oIDHier.appendChild(node1);
					
					node1 = document.createElement("img");
					node1.setAttribute("src", "img/backw.png");
					node1.addEventListener("click", function() {sendAjax(nKatalog, 0, strTitel);});
					oIDMenu.appendChild(node1);
				} else if(nKatalog == 0) {
					if(strTitel=='News') {
						node1 = document.createElement("span");
						node1.innerHTML = ' | News';
						oIDHier.appendChild(node1);
						
						node1 = document.createElement("img");
						node1.setAttribute("src", "img/backw.png");
						node1.addEventListener("click", function() {sendAjax(0, 0, 'Home');});
					} else {
						node1 = document.createElement("img");
						node1.setAttribute("src", "img/menu.png");
						node1.addEventListener("click", menuOn);
					}
					oIDMenu.appendChild(node1);

				} else {
					node1 = document.createElement("img");
					node1.setAttribute("src", "img/backw.png");
					node1.addEventListener("click", function() {sendAjax(0, 0, strTitel);});
					oIDMenu.appendChild(node1);
				}
			}
		};

		xmlHttp.send(null);

		//console.log("\nErfolgreich abgeschickt");
		return true;
	}
	return false;
}

var node1 = document.createElement("img");
node1.setAttribute("src", "img/menu.png");
node1.addEventListener("click", menuOn);
oIDMenu.appendChild(node1);

document.getElementById("idMenuHome").addEventListener("click", function() {sendAjax(0,0,'Home');});
document.getElementById("idMenuNews").addEventListener("click", function() {sendAjax(0,0,'News');});
//document.getElementById("idMenuMost").addEventListener("click", function() {sendAjax(0,0,'Most');});
document.getElementById("idMenuData").addEventListener("click", function() {sendAjax(0,0,'Datenschutz');});
document.getElementById("idMenuImpr").addEventListener("click", function() {sendAjax(0,0,'Impressum');});

document.addEventListener("click", menuOff);
menuOff();
app.initialize();
		
//alert('idList.height:' + oIDList.clientHeight);
sendAjax(0,0,'');

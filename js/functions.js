let helper_methods = {
	synonyms: function() {
		let input = document.createElement("input");
		input.setAttribute("type", "file");
		input.setAttribute("id", "fileUpload");

		let custom_input = create_element("label", "custom-file-upload");
		custom_input.setAttribute("for", "fileUpload");
		custom_input.innerHTML = "Choose File";
		custom_input.addEventListener("click", function() {
			var edit_btn = document.querySelector(".page-header .btn");
			if(edit_btn.textContent.trim() == "Edit") {
				edit_btn.click();
			}
		});

		let buttonInput = document.createElement("input");
		buttonInput.setAttribute("type", "button");
		buttonInput.setAttribute("id", "upload");
		buttonInput.setAttribute("value", "Upload");
		buttonInput.addEventListener("click", Upload);

		content.append(input, custom_input, buttonInput);

		let arrayInner = [];
		let arrayOuter = [];

		function Upload() {
			var fileUpload = document.getElementById("fileUpload");
			var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/;
			if (regex.test(fileUpload.value.toLowerCase())) {
				if (typeof (FileReader) != "undefined") {
					var reader = new FileReader();
					reader.onload = function (e) {
						var table = document.createElement("table");
						var rows = e.target.result.split("\n");
						var split_sign = ",";
						for (var i = 0; i < rows.length; i++) {
							if (rows[i].indexOf(",") == -1) {
								split_sign = ";";
							}
							var cells = rows[i].split(split_sign);
							if (cells.length > 1) {
								var row = table.insertRow(-1);
								for (var j = 0; j < cells.length; j++) {
									var cell = row.insertCell(-1);
									cell.innerHTML = cells[j];
								}
							}
						}
						let csvFile = table.querySelectorAll("table> tbody > tr");
						csvFile.forEach((csvItem, idx, array) => {
							let td = csvItem.querySelectorAll("td");
							td.forEach(tdItem => {
								arrayInner.push(tdItem.textContent.replace(/\"/g, ""));
							});
							if (idx === array.length - 1){ 
								alert("Finished uploading your CSV file -> You can press Start now"); 
							}
							arrayOuter.push(arrayInner);
							arrayInner = [];
						});
					}
					reader.readAsText(fileUpload.files[0]);
				} else {
					alert("This browser does not support HTML5.");
				}
			} else {
				alert("Please upload a valid CSV file.");
			}
		}

		let button = document.createElement("button");
		button.innerHTML="Start";
		button.classList.add("start");

		content.append(button);

		var event = new Event('input');

		button.addEventListener("click", () => {
			for(let i = 0; i < arrayOuter.length; i++) {
				let addBtn = document.querySelector(".form-container .btn.btn-danger:not(:disabled):first-child");
				addBtn.click();
			}
			setTimeout(() => {
				let length = document.querySelectorAll(".form-container > .form-row").length;
				arrayOuter.forEach((listItem, i) => {
					let row = document.querySelector(`.form-container > .form-row:nth-child(${length-i})`);
					let inputWord = row.querySelector("input[placeholder='Insert word']");
					let inputSynonym = row.querySelector("input[placeholder='Insert synonym']");
					inputSynonym.value = listItem[1];
					inputSynonym.dispatchEvent(event)
					inputWord.value = listItem[0];
					inputWord.dispatchEvent(event);
				});
			}, 1000);
		});

		// Delete all
		let delete_all_btn = create_element("div", "helper-delete-all");
		delete_all_btn.textContent = "Remove all";
		content.append(delete_all_btn);
		delete_all_btn.addEventListener("click", () => {
			let delete_btns = document.querySelectorAll(".btn.btn-danger:not(:disabled):last-child");
			delete_btns.forEach(() => {
				document.querySelector(".form-container .btn.btn-danger:not(:disabled):last-child").click();
			});
		});
	},
	search_edit: function() {
		// Versions -> language
		const versions = {
			desktop: {
				en: {
					title: "Popular products",
					subtitle: "Top {{ totalResults }} most popular products",
					text_type_to_search: 'Search among 10,000 products...',
					text_sorting_title: 'Sort by',
					text_go_directly_to: 'Go to: ',
					text_products_search_title: 'search results',
					text_products_title: 'Products',
					text_filters_selected_clear_button: 'Clear all filters',
					text_products: 'products.',
					text_category_no_content_before: 'No',
					text_category_no_content_after: 'were found.',
					result_subtitle: 'The search <strong> "$query$"</strong> matches <strong>$totalResults$</strong> $contentType$'
				},
				da: {
					title: "Populære produkter",
					subtitle: "De {{ totalResults }} mest populære produktene",
					text_type_to_search: 'Søg blandt produkter...',
					text_sorting_title: 'Sorter efter',
					text_go_directly_to: 'Gå til: ',
					text_products_search_title: 'søge resultater',
					text_products_title: 'Produkter',
					text_filters_selected_clear_button: 'Fjern alle filtre',
					text_products: 'produkter.',
					text_category_no_content_before: 'Ingen',
					text_category_no_content_after: 'blev fundet.',
					result_subtitle: 'Søgningen <strong> "$query$"</strong> gav <strong>$totalResults$</strong> $contentType$'
				},
				se: {
					title: "Populära produkter",
					subtitle: "De {{ totalResults }} mest populära produkterna",
					text_type_to_search: 'Sök bland produkter...',
					text_sorting_title: 'Sorter efter',
					text_go_directly_to: 'Gå till: ',
					text_products_search_title: 'sökresultat',
					text_products_title: 'Produkter',
					text_filters_selected_clear_button: 'Rensa alla filter',
					text_products: 'produkter.',
					text_category_no_content_before: 'Inga',
					text_category_no_content_after: 'hittades.',
					result_subtitle: 'Söket <strong> "$query$"</strong> matchar <strong>$totalResults$</strong> $contentType$'
				},
				nl: {
					title: "Populaire producten",
					subtitle: "De {{ totalResults }} meest populaire producten",
					text_type_to_search: 'Zoeken producten...',
					text_sorting_title: 'Sorteer op',
					text_go_directly_to: 'Ga naar: ',
					text_products_search_title: 'zoekresultaten',
					text_products_title: 'Producten',
					text_filters_selected_clear_button: 'Alle filters wissen',
					text_products: 'producten.',
					text_category_no_content_before: 'Geen',
					text_category_no_content_after: 'zijn gevonden.',
					result_subtitle: 'De zoektocht <strong> "$query$"</strong> gaf <strong>$totalResults$</strong> $contentType$'
				},
				no: {
					title: "Populære produkter",
					subtitle: "De {{ totalResults }} mest populære produktene",
					text_type_to_search: 'Søk produkter...',
					text_sorting_title: 'Sortere etter',
					text_go_directly_to: 'Gå til: ',
					text_products_search_title: 'søkeresultater',
					text_products_title: 'Produkter',
					text_filters_selected_clear_button: 'Fjern alle filter',
					text_products: 'produkter.',
					text_category_no_content_before: 'Ingen',
					text_category_no_content_after: 'ble funnet.',
					result_subtitle: 'Søket <strong> "$query$"</strong> matcher <strong>$totalResults$</strong> $contentType$'
				},
				fi: {
					title: "Suosittuja tuotteita",
					subtitle: "{{ totalResults }} suosituinta tuotetta",
					text_type_to_search: 'Etsiä tuotteita...',
					text_sorting_title: 'Järjestä',
					text_go_directly_to: 'Mene: ',
					text_products_search_title: 'hakutulokset',
					text_products_title: 'Tuotteet',
					text_filters_selected_clear_button: 'Tyhjennä kaikki suodattimet',
					text_products: 'tuotteet.',
					text_category_no_content_before: 'Ei',
					text_category_no_content_after: 'havaittiin.',
					result_subtitle: 'Etsintä <strong> "$query$"</strong> ottelut <strong>$totalResults$</strong> $contentType$'
				},
				de: {
					title: "Beliebte produkte",
					subtitle: "Die {{ totalResults }} beliebtesten Produkte",
					text_type_to_search: 'Suche produkten...',
					text_sorting_title: 'Sortieren nach',
					text_go_directly_to: 'Gehe zu: ',
					text_products_search_title: 'suchergebnisse',
					text_products_title: 'Produkte',
					text_filters_selected_clear_button: 'Alle Filter löschen',
					text_products: 'produkte.',
					text_category_no_content_before: 'Nein',
					text_category_no_content_after: 'wurde gefunden.',
					result_subtitle: 'Die Suche <strong> "$query$"</strong> streichhölzer <strong>$totalResults$</strong> $contentType$'
				},
				fr: {
					title: "Produits populaires",
					subtitle: "Les {{ totalResults }} produits les plus populaires",
					text_type_to_search: 'Rechercher parmi les produits...',
					text_sorting_title: 'Trier par',
					text_go_directly_to: 'Aller à: ',
					text_products_search_title: 'résultats de recherche',
					text_products_title: 'Des produits',
					text_filters_selected_clear_button: 'Effacer tous les filtres',
					text_products: 'des produits.',
					text_category_no_content_before: 'Non',
					text_category_no_content_after: 'a été trouvé.',
					result_subtitle: 'La recherche <strong> "$query$"</strong> allumettes <strong>$totalResults$</strong> $contentType$'
				}
			},
			mobile: {
				en: {
					title: "Popular products",
					subtitle: "Top {{ totalResults }} most popular products",
					text_type_to_search: 'Search among products...',
					text_sorting_title: 'Sortering',
					text_go_directly_to: 'Go directly to:',
					text_products_title: 'Products',
					text_show_results: 'Show Results',
					text_products: 'produkter',
					text_filter_title: 'Filters',
					result_subtitle: 'The search <strong> "$query$"</strong> matches <strong>$totalResults$</strong> $contentType$',
					result_filters_subtitle: 'Your choices gave <strong class="hr-highlight">$totalResults$</strong> $contentType$'
				},
				da: {
					title: "Populære produkter",
					subtitle: "De {{ totalResults }} mest populære produktene",
					text_type_to_search: 'Søg blandt produkter...',
					text_sorting_title: 'Sortering',
					text_go_directly_to: 'Gå direkte til:',
					text_products_title: 'Produkter',
					text_show_results: 'Vis resultater',
					text_products: 'produkter',
					text_filter_title: 'Filtre',
					result_subtitle: 'Søgningen <strong> "$query$"</strong> gav <strong>$totalResults$</strong> $contentType$',
					result_filters_subtitle: 'Dine valg gav <strong class="hr-highlight">$totalResults$</strong> $contentType$'
				},
				se: {
					title: "Populära produkter",
					subtitle: "De {{ totalResults }} mest populära produkterna",
					text_type_to_search: 'Sök bland produkter...',
					text_sorting_title: 'Sortering',
					text_go_directly_to: 'Gå direkt till:',
					text_products_title: 'Produkter',
					text_show_results: 'Visa resultat',
					text_products: 'products',
					text_filter_title: 'Filter',
					result_subtitle: 'Söket <strong> "$query$"</strong> gav <strong>$totalResults$</strong> $contentType$',
					result_filters_subtitle: 'Dina val gav <strong class="hr-highlight">$totalResults$</strong> $contentType$'
				},
				nl: {
					title: "Populaire producten",
					subtitle: "De {{ totalResults }} meest populaire producten",
					text_type_to_search: 'Zoeken producten...',
					text_sorting_title: 'Sorteren',
					text_go_directly_to: 'Ga direct naar:',
					text_products_title: 'Producten',
					text_show_results: 'Toon resultaten',
					text_products: 'producten',
					text_filter_title: 'Filters',
					result_subtitle: 'De zoektocht <strong> "$query$"</strong> gaf <strong>$totalResults$</strong> $contentType$',
					result_filters_subtitle: 'Jouw keuzes gaven <strong class="hr-highlight">$totalResults$</strong> $contentType$'
				},
				no: {
					title: "Populære produkter",
					subtitle: "De {{ totalResults }} mest populære produktene",
					text_type_to_search: 'Søk produkter...',
					text_sorting_title: 'Sortere etter',
					text_go_directly_to: 'Gå til: ',
					text_products_title: 'Produkter',
					text_show_results: 'Vis resultater',
					text_products: 'produkter',
					text_filter_title: 'Filter',
					result_subtitle: 'Søket <strong> "$query$"</strong> matcher <strong>$totalResults$</strong> $contentType$',
					result_filters_subtitle: 'Dine valg ga <strong class="hr-highlight">$totalResults$</strong> $contentType$'
				},
				fi: {
					title: "Suosittuja tuotteita",
					subtitle: "{{ totalResults }} suosituinta tuotetta",
					text_type_to_search: 'Etsiä tuotteita...',
					text_sorting_title: 'Järjestä',
					text_go_directly_to: 'Mene: ',
					text_products_title: 'tuotteet',
					text_show_results: 'Näytä tulos',
					text_products: 'tuotteet',
					text_filter_title: 'Suodattaa',
					result_subtitle: 'Etsintä <strong> "$query$"</strong> ottelut <strong>$totalResults$</strong> $contentType$',
					result_filters_subtitle: 'Valintasi antoivat <strong class="hr-highlight">$totalResults$</strong> $contentType$'
				},
				de: {
					title: "Beliebte produkte",
					subtitle: "Die {{ totalResults }} beliebtesten Produkte",
					text_type_to_search: 'Suche produkten...',
					text_sorting_title: 'Sortieren nach',
					text_go_directly_to: 'Gehe zu: ',
					text_products_title: 'produkte',
					text_show_results: 'Zeige Ergebnis',
					text_products: 'produkte',
					text_filter_title: 'Filter',
					result_subtitle: 'Die Suche <strong> "$query$"</strong> streichhölzer <strong>$totalResults$</strong> $contentType$',
					result_filters_subtitle: 'Ihre Entscheidungen gaben <strong class="hr-highlight">$totalResults$</strong> $contentType$'
				},
				fr: {
					title: "Produits populaires",
					subtitle: "Les {{ totalResults }} produits les plus populaires",
					text_type_to_search: 'Rechercher parmi les produits...',
					text_sorting_title: 'Trier par',
					text_go_directly_to: 'Aller à: ',
					text_products_title: 'des produits',
					text_show_results: 'Afficher le résultat',
					text_products: 'des produits',
					text_filter_title: 'Filtre',
					result_subtitle: 'La recherche <strong> "$query$"</strong> allumettes <strong>$totalResults$</strong> $contentType$',
					result_filters_subtitle: 'Vos choix ont donné <strong class="hr-highlight">$totalResults$</strong> $contentType$'
				}
			},
			embedded: {
				en: {
					title: "Popular products",
					subtitle: "Top {{ totalResults }} most popular products",
					text_sorting_title: 'Sort by',
					text_go_directly_to: 'Go to: ',
					text_products_search_title: 'search results',
					text_products_title: 'Products',
					text_filters_selected_clear_button: 'Clear all filters',
					text_products: 'products.',
					text_category_no_content_before: 'No',
					text_category_no_content_after: 'were found.',
					result_subtitle: 'The search <strong> "$query$"</strong> matches <strong>$totalResults$</strong> $contentType$'
				},
				da: {
					title: "Populære produkter",
					subtitle: "De {{ totalResults }} mest populære produktene",
					text_sorting_title: 'Sorter efter',
					text_go_directly_to: 'Gå til: ',
					text_products_search_title: 'søge resultater',
					text_products_title: 'Produkter',
					text_filters_selected_clear_button: 'Fjern alle filtre',
					text_products: 'produkter.',
					text_category_no_content_before: 'Ingen',
					text_category_no_content_after: 'blev fundet.',
					result_subtitle: 'Søgningen <strong> "$query$"</strong> gav <strong>$totalResults$</strong> $contentType$'
				},
				se: {
					title: "Populära produkter",
					subtitle: "De {{ totalResults }} mest populära produkterna",
					text_sorting_title: 'Sorter efter',
					text_go_directly_to: 'Gå till: ',
					text_products_search_title: 'sökresultat',
					text_products_title: 'Produkter',
					text_filters_selected_clear_button: 'Rensa alla filter',
					text_products: 'produkter.',
					text_category_no_content_before: 'Inga',
					text_category_no_content_after: 'hittades.',
					result_subtitle: 'Söket <strong> "$query$"</strong> matchar <strong>$totalResults$</strong> $contentType$'
				},
				nl: {
					title: "Populaire producten",
					subtitle: "De {{ totalResults }} meest populaire producten",
					text_sorting_title: 'Sorteer op',
					text_go_directly_to: 'Ga naar: ',
					text_products_search_title: 'zoekresultaten',
					text_products_title: 'Producten',
					text_filters_selected_clear_button: 'Alle filters wissen',
					text_products: 'producten.',
					text_category_no_content_before: 'Geen',
					text_category_no_content_after: 'zijn gevonden.',
					result_subtitle: 'De zoektocht <strong> "$query$"</strong> gaf <strong>$totalResults$</strong> $contentType$'
				},
				no: {
					title: "Populære produkter",
					subtitle: "De {{ totalResults }} mest populære produktene",
					text_sorting_title: 'Sortere etter',
					text_go_directly_to: 'Gå til: ',
					text_products_search_title: 'søkeresultater',
					text_products_title: 'Produkter',
					text_filters_selected_clear_button: 'Fjern alle filter',
					text_products: 'produkter.',
					text_category_no_content_before: 'Ingen',
					text_category_no_content_after: 'ble funnet.',
					result_subtitle: 'Søket <strong> "$query$"</strong> matcher <strong>$totalResults$</strong> $contentType$'
				},
				fi: {
					title: "Suosittuja tuotteita",
					subtitle: "{{ totalResults }} suosituinta tuotetta",
					text_sorting_title: 'Järjestä',
					text_go_directly_to: 'Mene: ',
					text_products_search_title: 'hakutulokset',
					text_products_title: 'Tuotteet',
					text_filters_selected_clear_button: 'Tyhjennä kaikki suodattimet',
					text_products: 'tuotteet.',
					text_category_no_content_before: 'Ei',
					text_category_no_content_after: 'havaittiin.',
					result_subtitle: 'Etsintä <strong> "$query$"</strong> ottelut <strong>$totalResults$</strong> $contentType$'
				},
				de: {
					title: "Beliebte produkte",
					subtitle: "Die {{ totalResults }} beliebtesten Produkte",
					text_sorting_title: 'Sortieren nach',
					text_go_directly_to: 'Gehe zu: ',
					text_products_search_title: 'suchergebnisse',
					text_products_title: 'Produkte',
					text_filters_selected_clear_button: 'Alle Filter löschen',
					text_products: 'produkte.',
					text_category_no_content_before: 'Nein',
					text_category_no_content_after: 'wurde gefunden.',
					result_subtitle: 'Die Suche <strong> "$query$"</strong> streichhölzer <strong>$totalResults$</strong> $contentType$'
				},
				fr: {
					title: "Produits populaires",
					subtitle: "Les {{ totalResults }} produits les plus populaires",
					text_sorting_title: 'Trier par',
					text_go_directly_to: 'Aller à: ',
					text_products_search_title: 'résultats de recherche',
					text_products_title: 'Des produits',
					text_filters_selected_clear_button: 'Effacer tous les filtres',
					text_products: 'des produits.',
					text_category_no_content_before: 'Non',
					text_category_no_content_after: 'a été trouvé.',
					result_subtitle: 'La recherche <strong> "$query$"</strong> allumettes <strong>$totalResults$</strong> $contentType$'
				}
			}
		}

		// Create menu
		function get_menu(obj, menu) {
			Object.keys(obj).forEach(item => {
				let option = document.createElement("option");
				option.textContent = item;
				menu.append(option);
			});
		}

		let version_menu = create_element("select", "select");
		get_menu(versions, version_menu);
		version_menu.dispatchEvent(new Event('input', {bubbles:true}));

		let lang_menu = create_element("select", "select");
		lang_menu.classList.add("upper");
		get_menu(versions[version_menu.value], lang_menu);

		version_menu.addEventListener("input", () => {
			lang_menu.innerHTML = "";
			get_menu(versions[version_menu.value], lang_menu);
		});
		
		let translateBtn = create_element("button", "start");
		translateBtn.textContent = "Translate";
		translateBtn.addEventListener("click", () => {
			// Changes search inputs
			let vers = versions[version_menu.value][lang_menu.value];
			for (let [key, value] of Object.entries(vers)) {
				if (key != "title" && key != "subtitle") {
					let input = document.querySelector(`input[name='${key}']`);
					console.log(value, key);
					input.value = value;
					input.dispatchEvent(new Event('input', {bubbles:true}));
				}
			}

			// For changing init visuals
			let init_container = document.querySelector(".card.panel-default");
			init_container.querySelector(".form-group:nth-child(3) input").value = vers.title;
			init_container.querySelector(".form-group:nth-child(4) input").value = vers.subtitle;

			// For changing init values
			let init_content = document.querySelector("input[name='partnerSearchConfigViewModel.initialContentJson']");
			if (init_content) {
				let initJSON = JSON.parse(init_content.value);
				initJSON[0].title = vers.title;
				initJSON[0].subtitle = vers.subtitle;
				init_content.value = JSON.stringify(initJSON);
			}
		});

		let save = create_element("button", "start")
		save.textContent = "Save";
		save.addEventListener("click", function() {
			document.querySelector(".btn.btn-success.btn-icon-text").click();
		});

		content.append(version_menu, lang_menu, translateBtn, save);
	},
	no_helper: function() {
		let placeholder = create_element("h4", "helper-header")
		placeholder.textContent = "No helper for this site";
		content.append(placeholder);
	}
}

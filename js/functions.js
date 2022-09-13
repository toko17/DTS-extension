let helper_methods = {
	synonyms: function() {
		let input = document.createElement("input");
		input.setAttribute("type", "file");
		input.setAttribute("id", "fileUpload");

		let custom_input = create_element("label", "custom-file-upload");
		custom_input.setAttribute("for", "fileUpload");
		custom_input.innerHTML = "Choose File";
		custom_input.addEventListener("click", function() {
			let edit_btn = document.querySelector(".page-header .btn");
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
			let fileUpload = document.getElementById("fileUpload");
			let regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/;
			if (regex.test(fileUpload.value.toLowerCase())) {
				if (typeof (FileReader) != "undefined") {
					let reader = new FileReader();
					reader.onload = function (e) {
						let table = document.createElement("table");
						let rows = e.target.result.split("\n");
						let split_sign = ",";
						for (let i = 0; i < rows.length; i++) {
							if (rows[i].indexOf(",") == -1) {
								split_sign = ";";
							}
							let cells = rows[i].split(split_sign);
							if (cells.length > 1) {
								let row = table.insertRow(-1);
								for (let j = 0; j < cells.length; j++) {
									let cell = row.insertCell(-1);
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

		let button = document.createElement("button", "start");
		button.innerHTML="Start";

		content.append(button);

		let event = new Event('input');

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
	search_edit: function(versions) {
		// For saving selected options
		let saved_ver = null,
		saved_lan = null;

		// Create menu
		function get_menu(obj, menu) {
			Object.keys(obj).forEach(item => {
				let option = document.createElement("option");
				option.value = item;
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

		let auto_select_version = document.querySelector(".card-title");
		if (auto_select_version) {
			auto_select_version = auto_select_version.textContent.toLowerCase();
		}
		let search_version = function() {
			if (auto_select_version.includes("embedded")) {
				return "embedded";
			} else if (auto_select_version.includes("desktop")) {
				return "desktop";
			} else if (auto_select_version.includes("mobile")) {
				return "mobile";
			} else {
				return false;
			}
		}

		saved_ver = sessionStorage.getItem("version_menu");
		saved_lan = sessionStorage.getItem("lang_menu");
		let input_event = new Event('input', {bubbles:true});

		if (saved_ver && saved_lan) {
			version_menu.options[Number(saved_ver)].selected = true;
			version_menu.dispatchEvent(input_event);
			lang_menu.options.selectedIndex = Number(saved_lan);
		}

		if (search_version() && !saved_ver && !saved_lan) {
			version_menu.querySelector(`option[value=${search_version()}]`).selected = true;
			version_menu.dispatchEvent(input_event);
		}
		
		let translateBtn = create_element("button", "start");
		translateBtn.textContent = "Translate";
		translateBtn.addEventListener("click", () => {
			// Changes search inputs
			let vers = versions[version_menu.value][lang_menu.value];
			for (let [key, value] of Object.entries(vers)) {
				if (key != "title" && key != "subtitle") {
					let input = document.querySelector(`input[name='${key}']`);
					if (input) {
						input.value = value;
						input.dispatchEvent(input_event);
					} else {
						console.log("Skipped: '" + key + "' as it does not exist in this template.");
					}				
				}
			}

			// Changing domain input to shop name
			let domain_url = document.querySelector(".company-url");
			if (domain_url) {
				let input = document.querySelector("input[name='webshop_name']");
				input.value = domain_url.textContent.trim();
				input.dispatchEvent(input_event);
			}

			// For changing init visuals
			let init_container = document.querySelector("#initialContentEditor");
			if (init_container) {
				init_container.querySelector(".form-group:nth-child(3) input").value = vers.title;
				init_container.querySelector(".form-group:nth-child(4) input").value = vers.subtitle;
			}

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
			saved_ver = sessionStorage.setItem("version_menu", version_menu.options.selectedIndex);
			saved_lan = sessionStorage.setItem("lang_menu", lang_menu.options.selectedIndex);
		});

		content.append(version_menu, lang_menu, translateBtn, save);
	},
	no_helper: function() {
		let placeholder = create_element("h4", "helper-header")
		placeholder.textContent = "No helper for this site";
		content.append(placeholder);
	},
	copy_triggers: function() {
		let trigger_algo = null;
		if (sessionStorage.getItem("trigger_algo")) {
			trigger_algo = sessionStorage.getItem("trigger_algo");
		}
		let copy = create_element("button", "start")
		copy.textContent = "Copy Algorithm";
		copy.addEventListener("click", function() {
			let algorithm = document.querySelector("#product-sources input[name='productSourcesAsJson']");
			if (algorithm) {
				trigger_algo = algorithm.value;
			}
			if (trigger_algo) {
				sessionStorage.setItem("trigger_algo", trigger_algo);
				alert("Algorithm copied");
			}
		});
		let preview = create_element("button", "start");
		preview.textContent = "Preview Algorithm";
		preview.addEventListener("click", function() {
			if (trigger_algo) {
				alert("Preview: " + trigger_algo);
				console.log(JSON.parse(trigger_algo));
			} else {
				alert("No algorithm found.");
			}
		});
		let paste = create_element("button", "start");
		paste.textContent = "Paste Algorithm";
		paste.addEventListener("click", function() {
			let algorithm = document.querySelector("#product-sources input[name='productSourcesAsJson']");
			if (algorithm && trigger_algo) {
				algorithm.value = trigger_algo;
			}
			document.querySelector("button[type='submit']").click();
		});
		let clear_saved = create_element("button", "start");
		clear_saved.textContent = "Clear Saved Algorithm";
		clear_saved.addEventListener("click", function() {
			if (trigger_algo) {
				trigger_algo = null;
				sessionStorage.removeItem("trigger_algo");
				alert("Saved algorithm cleared.");
			} else {
				alert("No saved algorithm to clear.");
			}
		});
		content.append(copy, preview, paste, clear_saved);
	}
}

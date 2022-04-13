let synonyms = function() {
	let input = document.createElement("input");
	input.setAttribute("type", "file");
	input.setAttribute("id", "fileUpload");

	let custom_input = create_element("label", "custom-file-upload");
	custom_input.setAttribute("for", "fileUpload");
	custom_input.innerHTML = "Choose File";

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
			let inputWord = document.querySelector(".form-container > .form-row:first-child > div:first-child input");
			inputWord.dispatchEvent(event);
		}
		setTimeout(() => {
			arrayOuter.forEach((listItem, i) => {
				let row = document.querySelector(`.form-container > .form-row:nth-child(${i+2})`);
				let inputWord = row.querySelector(`input[placeholder='Insert word']`);
				let inputSynonym = row.querySelector(`input[placeholder='Insert synonym']`);
				inputSynonym.value = listItem[1];
				inputWord.value = listItem[0];
			});
		}, 100);
	});

	// Delete all
	let delete_all_btn = create_element("div", "helper-delete-all");
	delete_all_btn.textContent = "Remove all";
	content.append(delete_all_btn);
	delete_all_btn.addEventListener("click", () => {
		let delete_btns = document.querySelectorAll(".btn.btn-danger:not(:disabled)");
		delete_btns.forEach(() => {
			document.querySelector(".form-container .btn.btn-danger:not(:disabled)").click();
		});
	});
}

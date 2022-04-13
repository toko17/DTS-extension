const company = document.querySelector(".company");
let title = company.querySelector("h1");

let helper = create_element("div", "helper");
let helper_fun = create_element("div", "helper-fun");
let header = create_element("h2", "helper-header");
let content = create_element("div", "helper-content");

helper.classList.add("helper")
helper.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather scam feather-settings link-icon"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>'
helper.addEventListener("click", toggle_helper);

helper_fun.classList.add("helper-fun");
if (title) {
	header.textContent = title.textContent;
}
setInterval(() => {
	title = company.querySelector("h1");
	if (title) {
		header.textContent = title.textContent;
	}
}, 100);

helper_fun.append(header);
helper_fun.append(content);

company.append(helper, helper_fun);

if (localStorage.getItem("DTS-extension") == "visible") {
	toggle_helper();
}

function toggle_helper() {
	helper.classList.toggle("slide");
	helper_fun.classList.toggle("fun-slide");
	if (helper.classList.contains("slide")) {
		localStorage.setItem("DTS-extension", "visible");
	} else {
		localStorage.setItem("DTS-extension", "hidden");
	}
}

function create_element(element, classes) {
	element = document.createElement(element);
	element.classList.add(classes);
	return element;
}
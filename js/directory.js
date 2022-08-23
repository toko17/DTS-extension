document.querySelectorAll(".nav-item").forEach((item) => {
	item.addEventListener("click", () => {
		content.innerHTML = "";
		select_helper();
	});
}); 

function select_helper() {
	if (window.location.pathname.match(/.*(search-synonyms)$/g)) {
		helper_methods.synonyms();
	} else if (window.location.pathname.match(/.*(search\/edit\.html).*/g)) {
		helper_methods.search_edit();
	} else {
		helper_methods.no_helper();
	}
}
select_helper();
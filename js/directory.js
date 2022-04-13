const regex = /.*(search-synonyms)$/g;
if (window.location.pathname.match(regex)) {
	synonyms();
}
document.querySelectorAll(".nav-item").forEach((item) => {
	item.addEventListener("click", () => {
		content.innerHTML = "";
		if (window.location.pathname.match(regex)) {
			synonyms();
		}
	});
}); 


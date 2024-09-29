function setCookie(name, value, days) {
	const date = new Date();
	date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
	const expires = "expires=" + date.toUTCString();
	document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function getCookie(name) {
	const nameEQ = name + "=";
	const ca = document.cookie.split(";");
	for (let i = 0; i < ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) == " ") c = c.substring(1, c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
	}
	return null;
}

$(document).ready(function () {
	let translations = {};
	let wallpaperLinks = {};

	function loadTranslations() {
		$.getJSON("configs/translations.json", function (data) {
			translations = data;
			const savedLang = getCookie("language") || "ru";
			switchLanguage(savedLang);
		}).fail(function (error) {
			console.error("Ошибка при загрузке переводов:", error);
		});
	}

	function initLinks() {
		$.getJSON("configs/wallpaper_links.json", function (data) {
			wallpaperLinks = data;
			updateWallpaperLinks();
		}).fail(function (error) {
			console.error("Ошибка при загрузке ссылок:", error);
		});
	}

	function updateWallpaperLinks() {
		/*
		const isLargeScreen = window.matchMedia("(min-width: 768px)").matches;
		const { landscape, portrait } = wallpaperLinks;
		const upscaleLink = isLargeScreen ? landscape.upscale : portrait.upscale;
		const originalLink = isLargeScreen ? landscape.original : portrait.original;

		$("#download-wallpaper-upscale").attr("href", upscaleLink);
		$("#download-wallpaper-original").attr("href", originalLink);
		*/
	}

	function switchLanguage(lang) {
		const {
			aboutMe, links, wallpaper, language,
			aboutMeContent, linksContent
		} = translations[lang];
		$("#about-me-link").text(aboutMe);
		$("#links-link").text(links);
		$("#wallpaper-link").text(wallpaper);
		$("#change_lang").text(language);
		$("#about-me").html(aboutMeContent);
		$("#links").html(linksContent);
		// $("#download-wallpaper-upscale").text(downloadUpscale);
		// $("#download-wallpaper-original").text(downloadOriginal);
		currentLang = lang;
	}

	function setActivePage($activeLink) {
		$(".menu p").removeClass("active");
		$activeLink.addClass("active");
	}

	function handleNavLinkClick(event) {
		event.preventDefault();
		const targetSectionId = $(this).attr("id").replace("-link", "");

		if (targetSectionId === "change_lang") {
			return;
		}

		const targetIndex = $(".menu p").index(this);
		navigateToSlide(targetIndex);
	}

	function navigateToSlide(index) {
		const $navLinks = $(".menu p");
		const nextPage = $navLinks.eq(index).attr("id");

		if (nextPage === "change_lang") {
			return;
		}
		
		const translateValue = -100 * index;

		$("main").css("transform", `translateX(${translateValue}vw)`);
		setActivePage($navLinks.eq(index));

		if (nextPage === "wallpaper-link") {
			$(".background").addClass("no-blur");
			$("#wallpaper, .download").addClass("active");
		} else {
			$(".background").removeClass("no-blur");
			$("#wallpaper, .download").removeClass("active");
		}
	}

	function handleChangeLangClick() {
		currentLang = currentLang === "ru" ? "en" : "ru";
		setCookie("language", currentLang, 30);
		location.reload();
	}

	function handleKeyDown(event) {
		const $navLinks = $(".menu p");
		const currentIndex = $navLinks.index($(".menu p.active"));
		if (event.key === "ArrowLeft" && currentIndex > 0) {
			navigateToSlide(currentIndex - 1);
		} else if (event.key === "ArrowRight" && currentIndex < $navLinks.length - 1) {
			navigateToSlide(currentIndex + 1);
		}
	}

	function handleWindowResize() {
		updateWallpaperLinks();
	}

	$(window).on("resize", handleWindowResize);

	loadTranslations();
	initLinks();

	$(".menu p").on("click", handleNavLinkClick);
	$("#change_lang").on("click", handleChangeLangClick);
	$(document).on("keydown", handleKeyDown);
});

$(window).on("load", function () {
	$("#preloader").fadeOut("slow", function () {
		$(this).remove();
	});
});

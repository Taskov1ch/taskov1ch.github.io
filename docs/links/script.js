window.addEventListener("DOMContentLoaded", function() {
	var videos = [
		// "GenshinImpact_Lumine",
		"Forever7thCapital_Kaito",
		"BlueArchive_Mina"
	];
	var mobile_videos = [
		"MurderAngel",
		"YourName_480p"
	];

	function getRandomVideo(videosArray) {
		var video = "../assets/videos/" + videosArray[Math.floor(Math.random() * videosArray.length)] + ".mp4";
		return video;
	}

	var videoElement = document.querySelector(".background");
	var preloaderElement = document.querySelector(".preloader");

	if(videoElement) {
		var selectedVideos = videos;

		if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
			selectedVideos = selectedVideos.concat(mobile_videos);
		}

		videoElement.setAttribute("src", getRandomVideo(selectedVideos));
		videoElement.load();
		videoElement.onloadeddata = function() {
			preloaderElement.classList.add("hidden");
		}
	}
});

// Я не е** джава скрипт, в инете мини туториалов насмотрелся и всё
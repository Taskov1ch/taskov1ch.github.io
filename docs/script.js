document.addEventListener("DOMContentLoaded", function() {
	var popup = document.getElementById("popup");
	popup.style.display = "block";
	var blockContainer = document.querySelector(".block-container");
	var currentBlock = document.querySelector(".block.active");
	var startY;
	blockContainer.addEventListener("touchstart", function(e) {
		startY = e.touches[0].clientY;
	});
	blockContainer.addEventListener("touchend", function(e) {
		var endY = e.changedTouches[0].clientY;
		var deltaY = startY - endY;
		if(deltaY > 50 && currentBlock.nextElementSibling) {
			changeSlide(currentBlock.nextElementSibling, "down");
		} else if(deltaY < -50 && currentBlock.previousElementSibling) {
			changeSlide(currentBlock.previousElementSibling, "up");
		}
	});
	
	document.addEventListener("keydown", function(e) {
		// console.log(e.key);
		if(e.key === "ArrowDown" && currentBlock.nextElementSibling) {
			changeSlide(currentBlock.nextElementSibling, "down");
		} else if(e.key === "ArrowUp" && currentBlock.previousElementSibling) {
			changeSlide(currentBlock.previousElementSibling, "up");
		// } else if(e.key === "Escape" && popup.style.display !== "none") {
		// 	popup.style.display = "none";
		}
	});

	document.addEventListener("wheel", function(e) {
		if(e.deltaY > 70 && currentBlock.nextElementSibling) {
			changeSlide(currentBlock.nextElementSibling, "down");
		} else if(e.deltaY < -70 && currentBlock.previousElementSibling) {
			changeSlide(currentBlock.previousElementSibling, "up");
		}
	});
	
	function changeSlide(nextBlock, direction) {
		currentBlock.classList.remove("active");
		if(direction === "down") {
			currentBlock.classList.add("hidden-bottom");
		} else {
			currentBlock.classList.add("hidden-top");
		}
		currentBlock = nextBlock;
		currentBlock.classList.remove("hidden-" + (direction === "down" ? "top" : "bottom"));
		setTimeout(function() {
			currentBlock.classList.add("active");
		}, 50);
	}

	// popup.addEventListener("click", function(e) {
	// 	if(e.target === popup) {
	// 		popup.style.display = "none";
	// 	}
	// });

});
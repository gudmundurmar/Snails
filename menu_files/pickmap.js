$(document).ready(function() {
	$("#Level1").on("click", function() {
		localStorage.setItem("g_landNum", '');
	});
	$("#Level2").on("click", function() {
		localStorage.setItem("g_landNum", '2');
	});
	$("#Level3").on("click", function() {
		localStorage.setItem("g_landNum", '3');
	});
	$("#Level4").on("click", function() {
		localStorage.setItem("g_landNum", '4');
	});
});
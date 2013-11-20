
$(document).ready(function() {
	if(localStorage.getItem("g_landNum") !== undefined && localStorage.getItem("g_landNum") !== null) 
		$("#worms").prepend('<img src="img/background'+localStorage.getItem("g_landNum")+'.jpg" alt="background"/>');
	else 
		$("#worms").prepend('<img src="img/background1.jpg" alt="background"/>');
});

$(document).ready(function() {
	if(localStorage.getItem("g_landNum") !== undefined) 
		$("#worms").prepend('<img src="img/background'+localStorage.getItem("g_landNum")+'.jpg" alt="background"/>');
	else 
		$("#worms").prepend('<img src="img/background.jpg" alt="background"/>');
});
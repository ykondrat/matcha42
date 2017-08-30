function sendLike(item) {
	var data = {}
	data.who = item.dataset.id;
	data.whom = item.getAttribute("value"); 
	
	$.ajax({
		type: 'POST',
		url: 'http://localhost:8000/set-likes',
		dataType: 'json',
		data: data
	});
}

function sendDislike(item) {
	var data = {}
	data.who = item.dataset.id;
	data.whom = item.getAttribute("value"); 
	
	$.ajax({
		type: 'POST',
		url: 'http://localhost:8000/set-dislike',
		dataType: 'json',
		data: data
	});
}
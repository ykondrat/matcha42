function sendLike(item) {
	var data = {
		who : item.dataset.id,
		whom : item.getAttribute("value")
	};

	$.ajax({
		type: 'POST',
		url: 'http://localhost:8000/set-likes',
		dataType: 'json',
		data: data,
		success: function(response) {
			if (response.msg == 'SET') {
				$.ajax({
					type: 'POST',
					url: 'http://localhost:8000/notification-like',
					dataType: 'json',
					data: data
				});
			}
		}
	});
}

function sendDislike(item) {
	var data = {
		who : item.dataset.id,
		whom : item.getAttribute("value")
	}; 
	
	$.ajax({
		type: 'POST',
		url: 'http://localhost:8000/set-dislike',
		dataType: 'json',
		data: data,
		success: function(response) {
			if (response.msg == 'SET') {
				$.ajax({
					type: 'POST',
					url: 'http://localhost:8000/notification-dislike',
					dataType: 'json',
					data: data
				});
			}
		}
	});
}

function blockUser(item) {
	var data = {
		who : item.dataset.id,
		whom : item.getAttribute("value")
	};

	$.ajax({
		type: 'POST',
		url: 'http://localhost:8000/block-user',
		dataType: 'json',
		data: data
	});
	$(item).parents()[1].remove();
}

function reportUser(item) {
	var data = {
		who : item.dataset.id,
		whom : item.getAttribute("value")
	};
	$.ajax({
		type: 'POST',
		url: 'http://localhost:8000/report-user',
		dataType: 'json',
		data: data
	});
}

function openProfile(item) {
	var data = {
		id: item.getAttribute("value"),
		from: item.dataset.id
	}

	$.ajax({
		type: 'POST',
		url: 'http://localhost:8000/notification-view',
		dataType: 'json',
		data: data
	});

	$.ajax({
		type: 'POST',
		url: 'http://localhost:8000/get-user-profile',
		dataType: 'json',
		data: data,
		success: function(user) {
			if (user.local.email) {
				var age = 'unknown';
				if (user.local.birthDate) {
					var today = new Date();
				    var birthDate = new Date(user.local.birthDate);
				    age = today.getFullYear() - birthDate.getFullYear();
				    var m = today.getMonth() - birthDate.getMonth();
				    
				    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
				        age--;
				    }
				}
				$(`
					<div id="modal" class="modal_window">
						<div class="user-search-profile modal_form">
    						<h3> ${user.local.firstName} ${user.local.lastName} </h3>
    						<img src="${user.local.avatar}" class="user-search-photo">
    						<p> Sexual orientation: ${user.local.sexual}</p>
    						<p> Gender: ${user.local.gender} </p>
    						<p> Age: ${age} </p>
    						<p> Interests: ${user.local.interests}</p>
    						<p> About: ${user.local.biography}</p>
							<hr >
						</div>
					</div>
					`).appendTo("#content");
				if (user.local.photos) {
					if (user.local.photos.photo1) {
						$(`<img src="${user.local.photos.photo1}" class="user-search-photos">`).appendTo(".modal_form");
					}
					if (user.local.photos.photo2) {
						$(`<img src="${user.local.photos.photo2}" class="user-search-photos">`).appendTo(".modal_form");
					}
					if (user.local.photos.photo3) {
						$(`<img src="${user.local.photos.photo3}" class="user-search-photos">`).appendTo(".modal_form");
					}
					if (user.local.photos.photo4) {
						$(`<img src="${user.local.photos.photo4}" class="user-search-photos">`).appendTo(".modal_form");
					}
				}
			} else if (user.facebook.email) {
				var age = 'unknown';
				if (user.facebook.birthDate) {
					var today = new Date();
				    var birthDate = new Date(user.facebook.birthDate);
				    age = today.getFullYear() - birthDate.getFullYear();
				    var m = today.getMonth() - birthDate.getMonth();
				    
				    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
				        age--;
				    }
				}
				$(`
					<div id="modal" class="modal_window">
						<div class="user-search-profile modal_form">
    						<h3> ${user.facebook.firstName} ${user.facebook.lastName} </h3>
    						<img src="${user.facebook.avatar}" class="user-search-photo">
    						<p> Sexual orientation: ${user.facebook.sexual}</p>
    						<p> Gender: ${user.facebook.gender} </p>
    						<p> Age: ${age} </p>
    						<p> Interests: ${user.facebook.interests}</p>
    						<p> About: ${user.facebook.biography}</p>
							<hr >
						</div>
					</div>
					`).appendTo("#content");
				if (user.facebook.photos) {
					if (user.facebook.photos.photo1) {
						$(`<img src="${user.facebook.photos.photo1}" class="user-search-photos">`).appendTo(".modal_form");
					}
					if (user.facebook.photos.photo2) {
						$(`<img src="${user.facebook.photos.photo2}" class="user-search-photos">`).appendTo(".modal_form");
					}
					if (user.facebook.photos.photo3) {
						$(`<img src="${user.facebook.photos.photo3}" class="user-search-photos">`).appendTo(".modal_form");
					}
					if (user.facebook.photos.photo4) {
						$(`<img src="${user.facebook.photos.photo4}" class="user-search-photos">`).appendTo(".modal_form");
					}
				}
			} else {
				var age = 'unknown';
				if (user.google.birthDate) {
					var today = new Date();
				    var birthDate = new Date(user.google.birthDate);
				    age = today.getFullYear() - birthDate.getFullYear();
				    var m = today.getMonth() - birthDate.getMonth();
				    
				    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
				        age--;
				    }
				}
				$(`
					<div id="modal" class="modal_window">
						<div class="user-search-profile modal_form">
    						<h3> ${user.google.firstName} ${user.google.lastName} </h3>
    						<img src="${user.google.avatar}" class="user-search-photo">
    						<p> Sexual orientation: ${user.google.sexual}</p>
    						<p> Gender: ${user.google.gender} </p>
    						<p> Age: ${age} </p>
    						<p> Interests: ${user.google.interests}</p>
    						<p> About: ${user.google.biography}</p>
							<hr >
						</div>
					</div>
					`).appendTo("#content");
				if (user.google.photos) {
					if (user.google.photos.photo1) {
						$(`<img src="${user.google.photos.photo1}" class="user-search-photos">`).appendTo(".modal_form");
					}
					if (user.google.photos.photo2) {
						$(`<img src="${user.google.photos.photo2}" class="user-search-photos">`).appendTo(".modal_form");
					}
					if (user.google.photos.photo3) {
						$(`<img src="${user.google.photos.photo3}" class="user-search-photos">`).appendTo(".modal_form");
					}
					if (user.google.photos.photo4) {
						$(`<img src="${user.google.photos.photo4}" class="user-search-photos">`).appendTo(".modal_form");
					}
				}
			}
		}
	});
}

window.onclick = function(event) {
    var modalForm = document.getElementById('modal');
    if (event.target == modalForm) {
    	$('#modal').remove();
    }
};

function addMessage(elem) {
	$(`<p><img src="${elem.dataset.img}" style="width: 4vmin; margin-right: 10px">${$(`#text${elem.dataset.index}`).val()}</p>`).appendTo($(`#collapse${elem.dataset.index} .messages`));
	var data = elem.dataset;
	data.message = `<p><img src="${elem.dataset.img}" style="width: 4vmin; margin-right: 10px">${$(`#text${elem.dataset.index}`).val()}</p>`;
	$.ajax({
		type: 'POST',
		url: 'http://localhost:8000/set-message',
		dataType: 'json',
		data: data
	});
}




















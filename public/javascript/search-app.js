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
	};
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
			var currentUser;
			if (user.local.email) {
				currentUser = user.local;
			} else if (user.facebook.email) {
				currentUser = user.facebook;
			} else {
				currentUser = user.google;
			}

			var age = 'unknown';
			if (currentUser.birthDate) {
				var today = new Date();
			    var birthDate = new Date(currentUser.birthDate);
			    age = today.getFullYear() - birthDate.getFullYear();
			    var m = today.getMonth() - birthDate.getMonth();
			    
			    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
			        age--;
			    }
			}
			$(`
				<div id="modal" class="modal_window">
					<div class="user-search-profile modal_form">
						<h3> ${currentUser.firstName} ${currentUser.lastName} </h3>
						<img src="${currentUser.avatar}" class="user-search-photo">
						<p> Sexual orientation: ${currentUser.sexual}</p>
						<p> Gender: ${currentUser.gender} </p>
						<p> Age: ${age} </p>
						<p> Interests: ${currentUser.interests}</p>
						<p> About: ${currentUser.biography}</p>
						<p> Rating: ${currentUser.fameRating}</p>
						<hr >
					</div>
				</div>
				`).appendTo("#content");
			if (currentUser.photos) {
				if (currentUser.photos.photo1) {
					$(`<img src="${currentUser.photos.photo1}" class="user-search-photos">`).appendTo(".modal_form");
				}
				if (currentUser.photos.photo2) {
					$(`<img src="${currentUser.photos.photo2}" class="user-search-photos">`).appendTo(".modal_form");
				}
				if (currentUser.photos.photo3) {
					$(`<img src="${currentUser.photos.photo3}" class="user-search-photos">`).appendTo(".modal_form");
				}
				if (currentUser.photo4) {
					$(`<img src="${currentUser.photos.photo4}" class="user-search-photos">`).appendTo(".modal_form");
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
	$(`#text${elem.dataset.index}`).val('');
}
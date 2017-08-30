var User = JSON.parse(document.getElementById('dialog_wrapper').dataset.text);
var UserID = User._id;
var limit = 0;
var dataSearch = {};

$(document).ready(function() {
	$(window).scroll(function() {
		if ($(document).height() - $(window).height() == $(window).scrollTop()) {
			$('#loading').show();

			/*
            $.ajax({
                url: 'get-post.php',
                dataType: 'html',
                success: function(html) {
                    $('#posts').append(html);
                    $('#loading').hide();
                }
            });
            */

			// $('#posts').append(randomPost()); Add new users
            $('#loading').hide();
		}
	});
});

if (User.local.email) {
	User = User.local;
} else if (User.facebook.email) {
	User = User.facebook;
} else {
	User = User.google;
}

var ProfileHeader = React.createClass({
	
	handleNotification() {
		console.log('click');	
	},

	handleLogout() {
		window.location.href = "http://localhost:8000/logout"
	},
	
	handleSettings() {
		let profile 				= document.querySelector('.profile-main');
		let profileSettings 		= document.querySelector('.profile-settings');
		let profileSettingsPhoto 	= document.querySelector('.profile-settings-photo');
		let profileModify 			= document.querySelector('.profile-modify');
		let profileSearch 			= document.querySelector('.profile-search');

		profileSettings.style.display = 'block';
		profileSettingsPhoto.style.display = 'none';
		profile.style.display = 'none';
		profileModify.style.display = 'none';
		profileSearch.style.display = 'none';
	},
	handleModify() {
		let profile 				= document.querySelector('.profile-main');
		let profileSettings 		= document.querySelector('.profile-settings');
		let profileSettingsPhoto 	= document.querySelector('.profile-settings-photo');
		let profileModify 			= document.querySelector('.profile-modify');
		let profileSearch 			= document.querySelector('.profile-search');
		
		profileSettings.style.display = 'none';
		profileSettingsPhoto.style.display = 'none';
		profile.style.display = 'none';
		profileModify.style.display = 'block';
		profileSearch.style.display = 'none';
	},
	
	handleProfile() {
		let profile 				= document.querySelector('.profile-main');
		let profileSettings 		= document.querySelector('.profile-settings');
		let profileSettingsPhoto 	= document.querySelector('.profile-settings-photo');
		let profileModify 			= document.querySelector('.profile-modify');
		let profileSearch 			= document.querySelector('.profile-search');
		
		profileSettings.style.display = 'none';
		profileSettingsPhoto.style.display = 'none';
		profile.style.display = 'block';
		profileModify.style.display = 'none';
		profileSearch.style.display = 'none';
	},

	handlePhotos() {
		let profile 				= document.querySelector('.profile-main');
		let profileSettings 		= document.querySelector('.profile-settings');
		let profileSettingsPhoto 	= document.querySelector('.profile-settings-photo');
		let profileModify 			= document.querySelector('.profile-modify');
		let profileSearch 			= document.querySelector('.profile-search');

		profileSettings.style.display = 'none';
		profileSettingsPhoto.style.display = 'block';
		profile.style.display = 'none';
		profileModify.style.display = 'none';
		profileSearch.style.display = 'none';
	},

	handleSearch() {
		let profile 				= document.querySelector('.profile-main');
		let profileSettings 		= document.querySelector('.profile-settings');
		let profileSettingsPhoto 	= document.querySelector('.profile-settings-photo');
		let profileModify 			= document.querySelector('.profile-modify');
		let profileSearch 			= document.querySelector('.profile-search');

		profileSettings.style.display = 'none';
		profileSettingsPhoto.style.display = 'none';
		profile.style.display = 'none';
		profileModify.style.display = 'none';
		profileSearch.style.display = 'block';
	},

	render() {
		var imgStyle = {
			width: '50px',
			height: '50px',
			borderRadius: '50%'
		};
        return (
        	<div className="fix-header">
	            <nav className="navbar navbar-toggleable-md navbar-inverse bg-inverse">
					<div className="container">
						<button className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navigation" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="navigation">
							<span className="navbar-toggler-icon"></span>
						</button>
		  				<div className="navbar-brand user-info" href="http://localhost:8000/profile">
		  					<div className="user-info" onClick={this.handleProfile}>matcha</div>
		  					<div className="user-info profile">
		  						<img src={this.props.user.avatar} style={imgStyle} onClick={this.handleProfile}/>
		  						
		  						<span className="badge badge-important">0</span><i className="fa fa-bell-o fa-lg" aria-hidden="true" onClick={this.handleNotification}></i>
		  						
		  						<span className="user-name" onClick={this.handleProfile}>{this.props.user.firstName}</span>	
		  					</div>
		  				</div>
						<div className="collapse navbar-collapse" id="navigation">
							<ul className="navbar-nav mr-auto mt-2 mt-md-0">
						    	<li className="nav-item">
						    		<button className="btn nav-link nav-btn" onClick={this.handleSettings}>Settings</button>
						    	</li>
						    	<li className="nav-item">
						    		<button className="btn nav-link nav-btn" onClick={this.handleModify}>Modify</button>
						    	</li>
						    	<li className="nav-item">
						    		<button className="btn nav-link nav-btn" onClick={this.handlePhotos}>Photos</button>
						    	</li>
						    	<li className="nav-item">
						     		<button className="btn nav-link nav-btn" onClick={this.handleMesages}>Messages</button>
						    	</li>
						    	<li className="nav-item">
						    		<button className="btn nav-link nav-btn" onClick={this.handleSearch}>Search</button>
						    	</li>
						    	<li className="nav-item">
						    		<button className="btn nav-link nav-btn" onClick={this.handleLogout}>Logout</button>
						    	</li>
						    </ul>
						</div>
					</div>
				</nav>
			</div>
        );
    }
});

var ProfileInfo = React.createClass({
	
	render() {
		let activeMsg = null;
    	let birthday = null;
    	let gender = null;
    	let sexual = null;
    	let interests = null;
    	let biography = null;

	    if (this.props.user.active == 0) {
	    	activeMsg = <p className="errorActive">To make your profile active go to settings and add one photo</p>;
	    }
	    if (this.props.user.gender) {
			gender = <p className="user-gender-profile">Gender: {this.props.user.gender}</p>;
		}
		if (this.props.user.birthDate) {
			var today = new Date();
		    var birthDate = new Date(this.props.user.birthDate);
		    var age = today.getFullYear() - birthDate.getFullYear();
		    var m = today.getMonth() - birthDate.getMonth();
		    
		    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
		        age--;
		    }

			birthday = <p className="user-age-profile">Age: {age}</p>;
		}
		if (this.props.user.sexual) {
			sexual = <p className="user-sexual-profile">Sexual orientation: { this.props.user.sexual }</p>;
		}
		if (this.props.user.interests) {
			interests = <p className="user-sexual-profile">Interests: { this.props.user.interests }</p>;
		}
		if (this.props.user.interests) {
			biography = <p className="user-biography-profile">About: { this.props.user.biography }</p>;
		}
        return (
        	<div className="container profile-main">
        		<div className="profile-view">
	        		<div>
	        			<img src={this.props.user.avatar} className="profile-img" />
	        		</div>
	        		<div>
	        			{ activeMsg }
	        			<p className="userfullname">{this.props.user.firstName} {this.props.user.lastName}</p>
	        			<p className="user-location">From: {this.props.user.city} {this.props.user.country}</p>
	        		</div>
	        		<div>
	        			{ gender }
	        		</div>
	        		<div>
	        			{ birthday }
	        		</div>
	        		<div>
	        			{ sexual }
	        			{ interests }
	        			{ biography }
	        		</div>
	        		<div>
	        			<p className="user-email">{this.props.user.email}</p>
	        		</div>
	        		<div>
						<p className="user-rating">Rating: {this.props.user.fameRating}</p>
						<div className="ldBar" data-preset="energy" data-value= {this.props.user.fameRating} ></div>
					</div>
        		</div>
        	</div>    
        );
    }
});

var ProfileModify = React.createClass({
	
	getInitialState() {
        return {
            firstName: this.props.user.firstName,
            lastName: this.props.user.lastName,
            email: this.props.user.email,
            password: ''
        };
    },

    handleFirstName(event) {
    	this.setState({ firstName: event.target.value });
    },
    
    handleLastName(event) {
    	this.setState({ lastName: event.target.value });
    },
    
    handleEmail(event) {
    	this.setState({ email: event.target.value });
    },
    
    handlePassword(event) {
		this.setState({ password: event.target.value });
    },
       
    handleSave(event) {
    	$('.error-settings').remove();
    	var nameFilter = /^[A-Za-z]+$/;
	    var emailFilter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	    let sender = true;

	    if (!(this.state.firstName.length >= 2 && nameFilter.test(this.state.firstName) && this.state.firstName.length <= 16)) {
	    	$("<p class='error-settings'>Please provide valid first name</p>").insertAfter("#modify-header");
	    	sender = false;
	    }
	    if (!(this.state.lastName.length >= 2 && nameFilter.test(this.state.lastName) && this.state.lastName.length <= 16)) {
	    	$("<p class='error-settings'>Please provide valid last name</p>").insertAfter("#modify-header");
	    	sender = false;
	    }
	    if (this.props.user.password) {
	    	if (!emailFilter.test(this.state.email)) {
	    		$("<p class='error-settings'>Please provide valid email</p>").insertAfter("#modify-header");
	    		sender = false;
	    	}
	    	if (!(this.state.password.length >= 6 && this.state.password.length <= 40)) {
	    		$("<p class='error-settings'>Password more then 6 characters</p>").insertAfter("#modify-header");
	    		sender = false;
	    	}
	    }
	    if (sender) {
	    	var data = {
    			id: UserID,
    			firstName: this.state.firstName,
            	lastName: this.state.lastName,
            	email: this.state.email,
            	password: this.state.password
    		}

    		$.ajax({
    			type: 'POST',
        		url: 'http://localhost:8000/user-modify',
        		dataType: 'json',
        		data: data
    		});
    		window.location.href = 'http://localhost:8000/profile';
	    }
    },

	render() {
		let localUser = null;

		if (this.props.user.password) {
			localUser = <div>
							<div className="form-control">
			        			<label htmlFor="user-email">Email: </label>
			        			<input type="email" name="email" id="user-email" onChange={this.handleEmail} value={this.state.email} />
		        			</div>
		        			<div className="form-control">
			        			<label htmlFor="user-password">Password: </label>
			        			<input type="password" name="password" id="user-password" onChange={this.handlePassword} value={this.state.password} />
		        			</div>
	        			</div>
		}

        return (
        	<div className="container profile-modify">
        		<div className="profile-view">
        			<h1 id="modify-header">Modify</h1>
        			<div className="form-settings">
	        			<div className="form-control">
		        			<label htmlFor="user-firstName">First name: </label>
		        			<input type="text" name="firstName" id="user-firstName" onChange={this.handleFirstName} value={this.state.firstName} />
	        			</div>
	        			<div className="form-control">
		        			<label htmlFor="user-lastName">Last name: </label>
		        			<input type="text" name="lastName" id="user-lastName" onChange={this.handleLastName} value={this.state.lastName} />
	        			</div>
	        			{ localUser }
	        			<div className="form-btn">
	        				<button className="btn btn-success" onClick={this.handleSave}>Save</button>
	        			</div>
        			</div>
        		</div>
        	</div>    
        );
    }
});

var ProfileSettings = React.createClass({
	
	getInitialState() {
        return {
            gender: this.props.user.gender || 'male',
            sexual: this.props.user.sexual || 'heterosexual',
            birthday: this.props.user.birthDate || '',
            interests: this.props.user.interests || '',
            about: this.props.user.biography || ''
        };
    },

    handleGender(event) {
    	this.setState({ gender: event.target.value });
    },
    
    handleSexual(event) {
    	this.setState({ sexual: event.target.value });
    },
    
    handleBirthday(event) {
    	this.setState({ birthday: event.target.value });
    },
    
    handleInterest(event) {
		this.setState({ interests: event.target.value });
    },
    
    handleAbout(event) {
    	this.setState({ about: event.target.value });	
    },
    
    handleSave(event) {
    	$('.error-settings').remove();
    	var interests = this.state.interests.split(' ');
    	var regexp = /\B#\w*[a-zA-Z0-9]+\w*/;
    	var senderInterest = true;
    	var senderAbout = true;

    	interests.forEach(interest => {
    		if (regexp.test(interest)) {
    			interest = interest.substring(1);
    			if (interest.indexOf("#") !== -1) {
    				senderInterest = false;	
    			}
    		} else {
    			senderInterest = false;
    		}
    	});
       	if (this.state.about.length < 1) {
       		senderAbout = false;
    	}
    	if (this.state.birthday == '') {
    		$("<p class='error-settings'>Please provide your birhday</p>").insertAfter("#settings-header");
    	}
    	if (!senderInterest) {
    		$("<p class='error-settings'>Please provide your interest</p>").insertAfter("#settings-header");
    	}
    	if (!senderAbout) {
    		$("<p class='error-settings'>Please provide your biography</p>").insertAfter("#settings-header");
    	}
    	if (senderAbout && senderInterest && this.state.birthday != '') {
    		var data = {
    			id: UserID,
    			gender: this.state.gender,
            	sexual: this.state.sexual,
            	birthday: this.state.birthday,
            	interests: this.state.interests,
            	about: this.state.about
    		}

    		$.ajax({
    			type: 'POST',
        		url: 'http://localhost:8000/user-info',
        		dataType: 'json',
        		data: data
    		});
    		window.location.href = 'http://localhost:8000/profile';
    	}
    },

	render() {
        return (
        	<div className="container profile-settings">
        		<div className="profile-view">
        			<h1 id="settings-header">Settings</h1>
        			<div className="form-settings">
	        			<div className="form-control">
		        			<label htmlFor="user-gender">Gender: </label>
		        			<select name="gender" id="user-gender" onChange={this.handleGender} value={this.state.gender} >
		        				<option value="male">male</option>
		        				<option value="female">female</option>
		        			</select>
	        			</div>
	        			<div className="form-control">
		        			<label htmlFor="user-sexual">Orientation: </label>
		        			<select name="sexual" id="user-sexual" onChange={this.handleSexual} value={this.state.sexual} >
		        				<option value="heterosexual">heterosexual</option>
		        				<option value="homosexual">homosexual</option>
		        				<option value="bisexual">bisexual</option>
		        			</select>
	        			</div>
	        			<div className="form-control">
		        			<label htmlFor="user-birthday">Birthday: </label>
		        			<input type="date" name="birthDate" id="user-birthday" onChange={this.handleBirthday} value={this.state.birthday}/>
	        			</div>
	        			<div className="form-control">
		        			<label htmlFor="user-interests">Interests: </label>
		        			<textarea name="interests" id="user-interests" placeholder="#sport #javascript" onChange={this.handleInterest} value={this.state.interests}></textarea>
	        			</div>
	        			<div className="form-control">
		        			<label htmlFor="user-biography">About: </label>
		        			<textarea name="interests" id="user-biography" onChange={this.handleAbout} value={this.state.about}></textarea>
	        			</div>
	        			<div className="form-btn">
	        				<button className="btn btn-success" onClick={this.handleSave}>Save</button>
	        			</div>
        			</div>
        		</div>
        	</div>    
        );
    }
});

var ProfilePhoto = React.createClass({
	
	handlePhoto(event) {
		var reader  = new FileReader();

		reader.onloadend = function () {
			document.querySelector(`.${event.target.name}`).src = reader.result;
		}
		if (event.target.files[0]) {
			reader.readAsDataURL(event.target.files[0]);
		} else {
			document.querySelector(`.${event.target.name}`).src = "";
		}
	},

	handleDeletePhoto(event) {	
		if (document.querySelector(`.${event.target.attributes.name.value}`).src != 'https://upload.wikimedia.org/wikipedia/commons/d/d3/User_Circle.png') {
			var data = {
				id: UserID,
				photo: event.target.attributes.name.value
			}
			document.querySelector(`.${event.target.attributes.name.value}`).src = 'https://upload.wikimedia.org/wikipedia/commons/d/d3/User_Circle.png';
			let rating = parseInt(document.querySelector('.user-rating span:nth-child(2)').innerHTML) - 10;
			document.querySelector('.user-rating span:nth-child(2)').innerHTML = rating;
			$.ajax({
	    			type: 'POST',
	        		url: 'http://localhost:8000/delete-photo',
	        		dataType: 'json',
	        		data: data
	    		});
		}
	},

	handleSetAvatar(event) {
		if (document.querySelector(`.${event.target.attributes.name.value}`).src != 'https://upload.wikimedia.org/wikipedia/commons/d/d3/User_Circle.png') {
			let checker = document.querySelector(`.${event.target.attributes.name.value}`).src.slice(0,4);
			
			if (checker != 'data') {
				var data = {
					id: UserID,
					photo: event.target.attributes.name.value
				}
				let tmp = document.querySelector(`.${event.target.attributes.name.value}`).src;
				
				document.querySelector(`.${event.target.attributes.name.value}`).src = document.querySelector('.avatar').src;
				document.querySelector('.avatar').src = tmp;
				document.querySelector('.user-info img').src = tmp;
				document.querySelector('.profile-img').src = tmp;

				$.ajax({
	    			type: 'POST',
	        		url: 'http://localhost:8000/set-avatar',
	        		dataType: 'json',
	        		data: data
		    	});
			}
		}
	},

	render() {
		let avatar = this.props.user.avatar;
		let photos = {
			photo1: 'https://upload.wikimedia.org/wikipedia/commons/d/d3/User_Circle.png',
            photo2: 'https://upload.wikimedia.org/wikipedia/commons/d/d3/User_Circle.png',
            photo3: 'https://upload.wikimedia.org/wikipedia/commons/d/d3/User_Circle.png',
            photo4: 'https://upload.wikimedia.org/wikipedia/commons/d/d3/User_Circle.png'
		}
		let userPhoto = null;

		if (this.props.user.photos) {
			if (this.props.user.photos.photo1) {
				photos.photo1 = this.props.user.photos.photo1;	
			}
			if (this.props.user.photos.photo2) {
				photos.photo2 = this.props.user.photos.photo2;	
			}
			if (this.props.user.photos.photo3) {
				photos.photo3 = this.props.user.photos.photo3;	
			}
			if (this.props.user.photos.photo4) {
				photos.photo4 = this.props.user.photos.photo4;	
			}
		}
		userPhoto = <div>
						<div className="photo-user">
							<img src={ avatar } alt="" className="avatar upload-photo" />
							<input type="file" name="avatar" accept="image/*,image/jpeg,image/png" onChange={this.handlePhoto}/>
						</div>
						<div className="photo-user">
							<img src={photos.photo1} alt="" className="photo1 upload-photo" />
							<input type="file" name="photo1" accept="image/*,image/jpeg,image/png" onChange={this.handlePhoto}/>
							<div className="photo-btn">
								<p className="btn btn-danger" name="photo1" onClick={ this.handleDeletePhoto }><i className="fa fa-trash-o" name="photo1" aria-hidden="true"></i></p>
								<p className="btn btn-primary" name="photo1" onClick={ this.handleSetAvatar }><i className="fa fa-user-circle-o" name="photo1" aria-hidden="true"></i></p>
							</div>
						</div>
						<div  className="photo-user">
							<img src={photos.photo2} alt="" className="photo2 upload-photo" />
							<input type="file" name="photo2" accept="image/*,image/jpeg,image/png" onChange={this.handlePhoto}/>
							<div className="photo-btn">
								<p className="btn btn-danger" name="photo2" onClick={ this.handleDeletePhoto }><i className="fa fa-trash-o" name="photo2" aria-hidden="true"></i></p>
								<p className="btn btn-primary" name="photo2" onClick={ this.handleSetAvatar }><i className="fa fa-user-circle-o" name="photo2" aria-hidden="true"></i></p>
							</div>
						</div>
						<div className="photo-user">
							<img src={photos.photo3} alt="" className="photo3 upload-photo" />
							<input type="file" name="photo3" accept="image/*,image/jpeg,image/png" onChange={this.handlePhoto}/>
							<div className="photo-btn">
								<p className="btn btn-danger" name="photo3" onClick={ this.handleDeletePhoto }><i className="fa fa-trash-o" name="photo3" aria-hidden="true"></i></p>
								<p className="btn btn-primary" name="photo3" onClick={ this.handleSetAvatar }><i className="fa fa-user-circle-o" name="photo3" aria-hidden="true"></i></p>
							</div>
						</div>
						<div className="photo-user">
							<img src={photos.photo4} alt="" className="photo4 upload-photo" />	
							<input type="file" name="photo4" accept="image/*,image/jpeg,image/png" onChange={this.handlePhoto}/>
							<div className="photo-btn">
								<p className="btn btn-danger" name="photo4" onClick={ this.handleDeletePhoto }><i className="fa fa-trash-o"  name="photo4" aria-hidden="true"></i></p>
								<p className="btn btn-primary" name="photo4" onClick={ this.handleSetAvatar }><i className="fa fa-user-circle-o" name="photo4" aria-hidden="true"></i></p>
							</div>
						</div>
					</div>

		return (
			<div className="container profile-settings-photo">
        		<div className="profile-view">
        			<h1 className="photo-header">User photo</h1>
    				<form action="/photo" method="post" encType="multipart/form-data" >
    					<input type="hidden" name="id" value={ UserID }/>
	    				{ userPhoto }
	    				<div className="form-photo-btn">
	        				<button type="submit" className="btn btn-success">Save</button>
	        			</div>
	        		</form>
        		</div>
        	</div>
		);		
	}
});

var ProfileSearch = React.createClass({
	
	getInitialState() {
        return {
            gender: this.props.user.gender ==  'male' ? 'female' : 'male',
            sexual: this.props.user.sexual || 'heterosexual',
            age: 18
        };
    },

    handleGender(event) {
    	this.setState({ gender: event.target.value });
    },
    
    handleSexual(event) {
    	this.setState({ sexual: event.target.value });
    },

    handleAge(event) {
    	this.setState({ age: event.target.value });
    },

    handleSearch() {
    	$('.user-search-profile').remove();
    	dataSearch.gender = '';
    	dataSearch.sexual = '';
    	dataSearch.age = '';

    	if ($('input[name="gender-check"]').is(':checked')) {
    		dataSearch.gender = this.state.gender;
    	} 	
    	if ($('input[name="sexual-check"]').is(':checked')) {
    		dataSearch.sexual = this.state.sexual;
    	}
    	if ($('input[name="age-check"]').is(':checked')) {
    		dataSearch.age = this.state.age;
    	}
    	if (dataSearch.gender || dataSearch.sexual || dataSearch.age) {
    		dataSearch.limit = limit;
    		dataSearch.id = UserID;
    		$.ajax({
    			type: 'POST',
        		url: 'http://localhost:8000/search/' + limit,
        		dataType: 'json',
        		data: dataSearch,
        		success: function(response) {
        			response.forEach((user) => {
        				if (user.local.email) {
        					$(`
        						<div class="user-search-profile">
	        						<h3> ${user.local.firstName} ${user.local.lastName} </h3>
	        						<img src="${user.local.avatar}" class="user-search-photo">
	        						<p> Sexual orientation: ${user.local.sexual}</p>
	        						<p> About: ${user.local.biography}</p>
	        						<p> Interests: ${user.local.interests}</p>
	        						<p>
	        							<i class="fa fa-2x fa-thumbs-o-up" aria-hidden="true" value="${user._id}" data-id="${UserID}" onclick="sendLike(this)"></i>
										<i class="fa fa-2x fa-thumbs-o-down" aria-hidden="true" value="${user._id}" data-id="${UserID}" onclick="sendDislike(this)"></i>
	        						</p>
	        						<button class="btn btn-success btn-view" value="${user._id}">View profile</button>
        							<hr >
        						</div>
        						`).appendTo(".profile-search .profile-view");
        				} else if (user.facebook.email) {
        					$(`
        						<div class="user-search-profile">
	        						<h3> ${user.facebook.firstName} ${user.facebook.lastName} </h3>
	        						<img src="${user.facebook.avatar}" class="user-search-photo">
	        						<p> Sexual orientation: ${user.facebook.sexual}</p>
	        						<p> About: ${user.facebook.biography}</p>
	        						<p> Interests: ${user.facebook.interests}</p>
	        						<p>
	        							<i class="fa fa-2x fa-thumbs-o-up" aria-hidden="true" value="${user._id}" data-id="${UserID}" onclick="sendLike(this)"></i>
										<i class="fa fa-2x fa-thumbs-o-down" aria-hidden="true" value="${user._id}" data-id="${UserID}" onclick="sendDislike(this)"></i>
	        						</p>
	        						<button class="btn btn-success btn-view" value="${user._id}">View profile</button>
        							<hr >
        						</div>
        						`).appendTo(".profile-search .profile-view");
        				} else {
        					$(`
        						<div class="user-search-profile">
	        						<h3> ${user.google.firstName} ${user.google.lastName} </h3>
	        						<img src="${user.google.avatar}" class="user-search-photo">
	        						<p> Sexual orientation: ${user.google.sexual}</p>
	        						<p> About: ${user.google.biography}</p>
	        						<p> Interests: ${user.google.interests}</p>
	        						<p>
	        							<i class="fa fa-2x fa-thumbs-o-up" aria-hidden="true" value="${user._id}" data-id="${UserID}" onclick="sendLike(this)"></i>
										<i class="fa fa-2x fa-thumbs-o-down" aria-hidden="true" value="${user._id}" data-id="${UserID}" onclick="sendDislike(this)"></i>
	        						</p>
	        						<button class="btn btn-success btn-view" value="${user._id}">View profile</button>
        							<hr >
        						</div>
        						`).appendTo(".profile-search .profile-view");
        				}
        			});
        			
        		}
    		});
    	}
    },

	render() {
		return (
			<div className="container profile-search">
        		<div className="profile-view">
        			<h1 id="search-header">Search module</h1>
    				<div className="search-module">
    					
    					<div className="form-control">
		        			<label htmlFor="user-gender-search"><input type="checkbox" name="gender-check" />Gender: </label>
		        			<select name="gender" id="user-gender-search" onChange={this.handleGender} value={this.state.gender} >
		        				<option value="male">male</option>
		        				<option value="female">female</option>
		        			</select>
		        			
	        			</div>
	        			
	        			<div className="form-control">
		        			<label htmlFor="user-sexual-search"><input type="checkbox" name="sexual-check" />Orientation: </label>
		        			<select name="sexual" id="user-sexual-search" onChange={this.handleSexual} value={this.state.sexual} >
		        				<option value="heterosexual">heterosexual</option>
		        				<option value="homosexual">homosexual</option>
		        				<option value="bisexual">bisexual</option>
		        			</select>
		        			
	        			</div>

	        			<div className="form-control">
		        			<label htmlFor="user-age-search"><input type="checkbox" name="age-check" />Age: </label>
		        			<input type="number" name="age" id="user-age-search" value={this.state.age} onChange={this.handleAge}/>

	        			</div>

	        			<div className="form-btn">
		        			<button className="btn btn-success" onClick={this.handleSearch}>Search</button>
	        			</div>
    				</div>
        		</div>
        		<p id="loading"><i className="fa fa-refresh fa-spin fa-fw" aria-hidden="true"></i></p>
        	</div>
		);		
	}
});

ReactDOM.render(
	<div>
    	<ProfileHeader user={User} />
    	<ProfileInfo user={User} />
    	<ProfileSettings user={User} />
    	<ProfileModify user={User} />
    	<ProfilePhoto user={User} />
    	<ProfileSearch user={User} />	
    </div>,
    document.getElementById('content')
);
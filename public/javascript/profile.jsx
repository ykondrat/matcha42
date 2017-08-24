var User = JSON.parse(JSON.parse(document.getElementById('dialog_wrapper').dataset.text));
var UserID = User._id;

if (User.local.email) {
	User = User.local;
} else if (User.facebook.email) {
	User = User.facebook;
} else {
	User = User.google;
}

var ProfileHeader = React.createClass({
	handleNotification: function () {
		console.log('click');	
	},
	handleLogout: function() {
		window.location.href = "http://localhost:8000/logout"
	},
	handleSettings: function() {
		let profile = document.querySelector('.profile-main');
		let profileSettings = document.querySelector('.profile-settings');
		let profileSettingsPhoto = document.querySelector('.profile-settings-photo');

		profileSettings.style.display = 'block';
		profileSettingsPhoto.style.display = 'none';
		profile.style.display = 'none';
	},
	handleProfile: function() {
		let profile = document.querySelector('.profile-main');
		let profileSettings = document.querySelector('.profile-settings');
		let profileSettingsPhoto = document.querySelector('.profile-settings-photo');

		profileSettings.style.display = 'none';
		profileSettingsPhoto.style.display = 'none';
		profile.style.display = 'block';
	},
	handlePhotos: function() {
		let profile = document.querySelector('.profile-main');
		let profileSettings = document.querySelector('.profile-settings');
		let profileSettingsPhoto = document.querySelector('.profile-settings-photo');

		profileSettings.style.display = 'none';
		profileSettingsPhoto.style.display = 'block';
		profile.style.display = 'none';
	},
	render: function() {
		var imgStyle = {
			width: '50px',
			height: '50px',
			borderRadius: '50%'
		};
        return (
        	<div className="fix-header">
            <nav className="navbar navbar-toggleable-md navbar-inverse bg-inverse">
					<button className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navigation" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="navigation">
						<span className="navbar-toggler-icon"></span>
					</button>
  				<div className="navbar-brand user-info" href="http://localhost:8000/profile">
  					<div className="user-info" onClick={this.handleProfile}>matcha</div>
  					<div className="user-info profile">
  						<img src={this.props.user.avatar} style={imgStyle} onClick={this.handleProfile}/>
  						
  						<span className="badge badge-important">0</span><i className="fa fa-bell-o fa-lg" aria-hidden="true" onClick={this.handleNotification}></i>
  						
  						<span className="user-name">{this.props.user.firstName}</span>	
  					</div>
  				</div>
  				
				<div className="collapse navbar-collapse" id="navigation">
					<ul className="navbar-nav mr-auto mt-2 mt-md-0">
				    	<li className="nav-item">
				    		<button className="btn nav-link nav-btn" onClick={this.handleSettings}>Settings</button>
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
			</nav>
			</div>
        );
    }
});

var ProfileInfo = React.createClass({
	render: function() {
		let activeMsg = null;
    	let birthday = null;
    	let gender = null;
    	let sexual = null;
    	let interests = null;
    	let biography = null;

	    if (this.props.user.active == 0) {
	    	activeMsg = <p className="errorActive">To make your profile active go to settings</p>;
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
    handleSave() {
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
    		$( "<p class='error-settings'>Please provide your birhday</p>" ).insertAfter( "#settings-header" );
    	}
    	if (!senderInterest) {
    		$( "<p class='error-settings'>Please provide your interest</p>" ).insertAfter( "#settings-header" );
    	}
    	if (!senderAbout) {
    		$( "<p class='error-settings'>Please provide your biography</p>" ).insertAfter( "#settings-header" );
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
	render: function() {
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
	        			<div>
	        				<button className="btn btn-success" onClick={this.handleSave}>Save</button>
	        			</div>
        			</div>
        		</div>
        	</div>    
        );
    }
});

var ProfilePhoto = React.createClass({
	handlePhoto(event){
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
	handleSave() {
		console.log('click');
	}, 
	render() {
		let avatar = this.props.user.avatar;
		let photos = {
			photo1: '',
            photo2: '',
            photo3: '',
            photo4: ''
		}
		let userPhoto = null;

		if (this.props.user.photos) {
			photos.photo1 = this.props.user.photos.photo1;
			photos.photo2 = this.props.user.photos.photo2;
			photos.photo3 = this.props.user.photos.photo3;
			photos.photo4 = this.props.user.photos.photo4;
		}
		userPhoto = <div>
						<div>
							<img src={photos.photo1} alt="" className="photo1 upload-photo" />
							<input type="file" name="photo1" accept="image/*,image/jpeg,image/png" onChange={this.handlePhoto}/>
							<div>
								<button className="btn btn-danger">Delete <i className="fa fa-trash-o" aria-hidden="true"></i></button>
								<button className="btn btn-primary">On Avatar <i className="fa fa-user-circle-o" aria-hidden="true"></i></button>
							</div>
						</div>
						<div>
							<img src={photos.photo2} alt="" className="photo2 upload-photo" />
							<input type="file" name="photo2" accept="image/*,image/jpeg,image/png" onChange={this.handlePhoto}/>
							<div>
								<button className="btn btn-danger">Delete <i className="fa fa-trash-o" aria-hidden="true"></i></button>
								<button className="btn btn-primary">On Avatar <i className="fa fa-user-circle-o" aria-hidden="true"></i></button>
							</div>
						</div>
						<div>
							<img src={photos.photo3} alt="" className="photo3 upload-photo" />
							<input type="file" name="photo3" accept="image/*,image/jpeg,image/png" onChange={this.handlePhoto}/>
							<div>
								<button className="btn btn-danger">Delete <i className="fa fa-trash-o" aria-hidden="true"></i></button>
								<button className="btn btn-primary">On Avatar <i className="fa fa-user-circle-o" aria-hidden="true"></i></button>
							</div>
						</div>
						<div>
							<img src={photos.photo4} alt="" className="photo4 upload-photo" />	
							<input type="file" name="photo4" accept="image/*,image/jpeg,image/png" onChange={this.handlePhoto}/>
							<div>
								<button className="btn btn-danger">Delete <i className="fa fa-trash-o" aria-hidden="true"></i></button>
								<button className="btn btn-primary">On Avatar <i className="fa fa-user-circle-o" aria-hidden="true"></i></button>
							</div>
						</div>
					</div>

		return (
			<div className="container profile-settings-photo">
        		<div className="profile-view">
        			<h1>User photo</h1>
    				<form action="/photo" method="post" encType="multipart/form-data" >
    					<input type="hidden" name="id" value={ UserID }/>
	    				<div>
	    					<h5>Avatar</h5>
	    					<img src={this.props.user.avatar} className="avatar upload-photo" alt={this.props.user.lastName} />
	    					<input type="file" name="avatar" accept="image/*,image/jpeg,image/png" onChange={this.handlePhoto}/>
	    				</div>
	    				{ userPhoto }
	    				<div>
	        				<button type="submit" className="btn btn-success" onClick={this.handleSave}>Save</button>
	        			</div>
	        		</form>
        		</div>
        	</div>
		);		
	}
});

ReactDOM.render(
	<div>
    	<ProfileHeader user={User} />
    	<ProfileInfo user={User} />
    	<ProfileSettings user={User} />
    	<ProfilePhoto user={User} />
    </div>,
    document.getElementById('content')
);
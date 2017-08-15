function ready() {
    const errSignUp = document.querySelector('.error-msg-signup').innerText;
    const errSignIn = document.querySelector('.error-msg-signin').innerText;
    
    if (errSignUp === "Email already exists") {
        document.querySelector('.panel3').classList.add('open');
    }
    if (errSignIn === "No user found" || errSignIn === "Incorrect password") {
        document.querySelector('.panel2').classList.add('open');
    }
}

document.addEventListener("DOMContentLoaded", ready);

const panels = document.querySelectorAll('.panel');

function removeOpen() {

    if (this.classList.contains('panel3')) {
        panels.forEach(panel => panel.classList.remove('open'));
        this.classList.add('open');
        
        return ;
    }
    if (this.classList.contains('panel2')) {
        panels.forEach(panel => panel.classList.remove('open'));
        this.classList.add('open');
        
        return ;
    }
    
    if (this.classList.contains('open')) {
        this.classList.remove('open');        
    } else {
        panels.forEach(panel => panel.classList.remove('open'));
        this.classList.add('open');
    }
}

panels.forEach(panel => panel.addEventListener('click', removeOpen));

function validForm() {
    var nameFilter = /^[A-Za-z]+$/;
    var emailFilter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    var msg = "";
    
    if (!($('#nameSignup').val().length >= 2 && nameFilter.test($('#nameSignup').val()) && $('#nameSignup').val().length <= 16)) {
        msg = 'Provide your name';
        $('.error-msg-signup').text(msg);
        return (false);
    }
    if (!($('#surnameSignup').val().length >= 2 && nameFilter.test($('#surnameSignup').val()) && $('#surnameSignup').val().length <= 16)) {
        msg = 'Provide your surname';
        $('.error-msg-signup').text(msg);
        return (false);
    }
    if (!emailFilter.test($('#emailSignup').val())) {
        msg = 'Provide valid email';
        $('.error-msg-signup').text(msg);
        return (false);
    }
    if (!($('#passwordSignup').val().length >= 6 && $(this).val().length <= 40)) {
        msg = 'Password more then 6 characters';
        $('.error-msg-signup').text(msg);
        return (false);
    }
    
    return (false);
}

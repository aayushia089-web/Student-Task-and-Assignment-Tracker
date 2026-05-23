function login(){

    var username = document.getElementById("username").value.trim();
    var password = document.getElementById("password").value.trim();

    if(username === "" || password === ""){
        alert("Please fill all fields");
        return;
    }

    // password must be exactly 6 digits
    var pattern = /^[0-9]{6}$/;

    if(!pattern.test(password)){
        alert("Password must be 6 digits");
        return;
    }

    // allowed users
    var users = {

        "S101": {password:"123456", role:"student"},
        "S102": {password:"234567", role:"student"},

        "F201": {password:"345678", role:"faculty"},
        "F202": {password:"456789", role:"faculty"},

        "A301": {password:"111111", role:"admin"}

    };

    if(!users[username]){
        alert("Invalid ID");
        return;
    }

    if(users[username].password !== password){
        alert("Wrong Password");
        return;
    }

    // store login info
    localStorage.setItem("userId", username);
    localStorage.setItem("role", users[username].role);

    alert("Login Successful");

    window.location.href = "index.html";
}
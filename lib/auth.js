module.exports = {
    isLogin : function (request,response){
        if(request.user){
            return true;
        } else {
            return false;
        }
    },

    statusUI : function (request,response){
        let authStateUI = `<a href="/auth/login">Log-in</a> | <a href="/auth/register">Register</a>`;
        if(this.isLogin(request,response)){
            console.log("request.user", request.user);
            authStateUI = ` ${request.user.displayName} | <a href="/auth/logout">Log-Out</a>`
        }
        return authStateUI;
    }
}
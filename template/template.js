const { request } = require("express");

module.exports = {
    html: function (title,description,list,control,authStateUI = `<a href="/auth/login">Log-in</a> | <a href="/auth/register">register</a>`){
        return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
        </head>
        <body>
            ${authStateUI}
            <h1><a href="/">web</a></h1>
            <ol>
                ${list}
            </ol>
            <h2>${title}</h2>
            <p>${description}</p>
            ${control}
        </body>
        </html>`;
    },

    list: function(filelist){
        let list =``;
        // console.log(filelist);
        for(let i=0;i<filelist.length;i++){
            list +=`<li><a href="/topic/${filelist[i].id}">${filelist[i].title}</a></li>`;
        }
        return list;
    }
}
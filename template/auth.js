const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const shortid = require('shortid');
const template = require('./template');
const db = require('../lib/db');
const bcrypt = require('bcrypt');

module.exports = function(passport){
    router.get('/login',(request,response)=>{
        const fmsg = request.flash();
        let feedback = '';
        if(fmsg.error){
            feedback = fmsg.error
        }
            const title = 'Log-in';
            const description = ``;
            const list = template.list(request.list);
            const html = template.html(title,description,list,
            `
            <div style="color:red;">${feedback}</div>
            <form action="/auth/login_process" method="post">
            <p><input type="email" name="email" placeholder="email"></p>
            <p><input type="password" name="pwd" placeholder="password"></p>
            <p><input type="submit" value="login"></p>
            </form>
            `
            );
            response.send(html);
    });

    router.post('/login_process', passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/auth/login',
        failureFlash: true
        }));

    router.get('/register', (request,response)=>{
        const fmsg = request.flash();
        let feedback = '';
        if(fmsg.error){
            feedback = fsmg.error;
        }
        const title = 'Register';
        const description = ``;
        const list = template.list(request.list);
        const html = template.html(title,description,list,
        `
        <div style="color:red;">${feedback}</div>
        <form action="/auth/register_process" method="post">
        <p><input type="email" name="email" placeholder="email"></p>
        <p><input type="password" name="pwd" placeholder="password"></p>
        <p><input type="password" name="pwd2" placeholder="password confirm"></p>
        <p><input type="text" name="displayName" placeholder="displayName"></p>
        <p><input type="submit" value="register"></p>
        </form>
        `, ''
        );
        response.send(html);
    });

    router.post('/register_process', (request,response)=>{
        const post = request.body;
        // console.log(post);
        const email = post.email;
        const pwd = post.pwd;
        const pwd2 = post.pwd2;
        const displayName = post.displayName;
        if(pwd !== pwd2){
            request.flash('error', 'pwd is not same!!');
            return response.redirect('/auth/register');
        } else {
            bcrypt.hash(pwd, 10, (err,hash)=>{
                const user = {
                    id:shortid.generate(),
                    email: email,
                    pwd:hash,
                    displayName:displayName
                }
                db.get('users').push(user).write();
                request.login(user, err=>{
                    response.redirect('/');
                });
            });
        }
    });

    router.get('/logout',(request,response,next)=>{
        request.logout(err=>{
            if(err){
                next(err);
            } else {
                return response.redirect('/');
            }
        })
    });

    return router;
}
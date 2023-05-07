const express = require('express');
const session = require('express-session');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const template = require('../template/template');
const auth = require('../lib/auth');
const db = require('../lib/db');
const shortid = require('shortid');

router.get('/create',(request,response)=>{
    if(!auth.isLogin(request,response)){
        response.redirect('/auth/login');
        return false;
    }
        const title = 'Create';
        const description = ``;
        const list = template.list(request.list);
        const html = template.html(title,description,list,
        `
        <form action="/topic/create" method="post">
        <p><input type="text" name="title" placeholder="title"></p>
        <p><textarea name="description" placeholder="description"></textarea></p>
        <p><input type="submit" value="Create"></p>
        </form>
        `, auth.statusUI(request,response)
        );
        response.send(html);
});

router.post('/create', (request,response)=>{
    if(!auth.isLogin(request,response)){
        response.redirect('/auth/login');
        return false;
    }
    const post = request.body;
    // console.log(post);
    const title = post.title;
    const description =post.description;
    const id = shortid.generate();
    db.get('topics').push({
        id:id,
        title:title,
        description:description,
        user_id:request.user.id
    }).write();
    response.redirect(`/topic/${id}`);
});

router.get(`/update/:pageId`,(request,response)=>{
    if(!auth.isLogin(request,response)){
        response.redirect('/auth/login');
        return false;
    }
    const topic = db.get('topics').find({
        id:request.params.pageId
    }).value();
    if(topic.user_id !== request.user.id){
        request.flash('error', 'not yours');
        return response.redirect('/');
    }
    const title = 'Update';
    const list = template.list(request.list);
    const html = template.html(title,'',list,
    `
    <form action="/topic/update" method="post">
        <input type="hidden" name="id" value="${topic.id}">
        <p><input type="text" name="title" placeholder="title" value="${topic.title}"></p>
        <p><textarea name="description" placeholder="description">${topic.description}</textarea></p>
        <p><input type="submit" value="Update"></p>
    </form>
    `, auth.statusUI(request,response)
    );
    response.send(html);
});

router.post('/update', (request,response)=>{
    if(!auth.isLogin(request,response)){
        response.redirect('/auth/login');
        return false;
    }
    const post = request.body;
    // console.log(post);
    const id = post.id;
    const title = post.title;
    const description =post.description;
    const topic = db.get('topics').find({id:id}).value();
    if(topic.user_id !== request.user.id){
        request.flash('error', 'not yours');
        return response.redirect('/');
    }
    db.get('topics').find({id:id}).assign({
        title:title,
        description:description
    }).write();
    response.redirect(`/topic/${id}`);
});

router.post('/delete', (request,response)=>{
    if(!auth.isLogin(request,response)){
        response.redirect('/auth/login');
        return false;
    }
    const post = request.body;
    // console.log(post);
    const id = post.id;
    const topic = db.get('topics').find({id:id}).value();
    if(topic.user_id !== request.user.id){
        request.flash('error', 'not yours');
        return response.redirect('/');
    }
    db.get('topics').remove({
        id:id
    }).write();
    response.redirect(`/`);
});

router.get('/:pageId', (request,response,next)=>{
    // console.log(request.list);
    const topic = db.get('topics').find({id:request.params.pageId}).value();
    const user = db.get('users').find({id:topic.user_id}).value();
    const list = template.list(request.list);
    const html = template.html(topic.title,topic.description,list,
    `<p>by ${user.displayName}</p>
    <a href="/topic/create">Create</a>
    <a href="/topic/update/${topic.id}">Update</a>
    <form action="/topic/delete" method="post">
        <input type="hidden" name="id" value="${topic.id}">
        <p><input type="submit" value="Delete"></p>
    </form>
    `, auth.statusUI(request,response)    
    );
    response.send(html);
});
module.exports = router;
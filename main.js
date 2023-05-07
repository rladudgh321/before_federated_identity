const compression = require('compression');
const express = require('express');
const fs = require('fs');
const flash = require('connect-flash');
const db = require('./lib/db');
const app = express();
app.use(compression());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use((request,response,next)=>{
    const topics = db.get('topics').value();
        request.list = topics;
        next();
});


const session = require('express-session');
const FileStore = require('session-file-store')(session);

app.use(session({
    store: new FileStore(),
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));

app.use(flash());





const passport = require('./lib/passport')(app);
const indexRouter = require('./template/index');
const topicRouter = require('./template/topic');
const authRouter = require('./template/auth')(passport);
app.get('/', indexRouter);
app.use('/topic',topicRouter);
app.use('/auth', authRouter);





app.use((request,response,next)=>{
    response.status(404).send('404 Not Found');
});

app.use((err,request,response,next)=>{
    console.error("err", err.stack);
    response.status(500).send('500 server error');
});

app.listen(3000);
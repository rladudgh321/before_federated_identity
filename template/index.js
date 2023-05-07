const express = require('express');
const template = require('../template/template');
const auth = require('../lib/auth');
const router = express.Router();

router.get('/',(request,response)=>{
        const title = 'welcome';
        const description = `hello world
        <img src="images/1.jpg">
        `;
        const list = template.list(request.list);
        const html = template.html(title,description,list,
        `<a href="/topic/create">Create</a>`, auth.statusUI(request,response)    
        );
        response.send(html);
});

module.exports = router;
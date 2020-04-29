const express = require("express");
const fs = require("fs");
const router = express.Router();
const articlePath = './data/articles.json';

router.use(express.urlencoded({extended: false}));

const readFile = (callback, returnJson = false, encoding = 'utf8') => {
    fs.readFile(articlePath, encoding, (err, data) => {
        if (err) {
            throw err;
        }

        callback(returnJson ? JSON.parse(data) : data);
    });
};

const writeFile = (fileData, callback, encoding = 'utf8') => {

    fs.writeFile(articlePath, fileData, encoding, (err) => {
        if (err) {
            throw err;
        }

        callback();
    });
};

router.post("/", (req, res) => {
    const article = {
        id: req.body.id,
        title: req.body.title,
        description: req.body.description,
        markdown: req.body.markdown
    };
    try {
        readFile(data => {
            let articleId;
            if(article.id) {
                data[article.id] = article;
            } else {
                articleId = Object.keys(data).length + 1;
                article.id = articleId;
                data[articleId] = article;
            }
            writeFile(JSON.stringify(data, null, 2), () => {
                res.redirect("/");
            });
        },
            true);
    } catch (error) {
        console.error(error);
        res.render("articles/new", { article: article });
    }
})

router.get("/new", (req, res)=> {
    const article = { title: '', description: '',  markdown: '', id: null };
    res.render("articles/new", { article: article });
})

router.get("/:id", (req, res)=> {
    readFile(data => {
        const article = data[req.params.id];
        if(!article) {
            res.send("Article Not Found") ;
        } else {
            res.render("articles/edit", { article: article });
        }        
    }, true);

})

module.exports =  router

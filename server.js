const express = require("express");
const articleRouter = require("./routes/article");
const bodyParser = require('body-parser');
const fs = require("fs");
const app = express();
const articlePath = './data/articles.json';

app.set("view engine",'ejs');
app.use("/articles", articleRouter);

app.use(bodyParser.json());

app.get("/", (req, res) => {

    fs.readFile(articlePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            throw err;
        }
        const articles = Object.values(JSON.parse(data));
        res.render("articles/index", { articles: articles });
    });
})

app.listen("5000");
const express = require("express");
const path = require("path");
const fs = require('fs');

var app = express();
var PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname,'public',)));


app.get("/", function (_req, res) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get("/notes", function (_req, res) {
    res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

app.get("/api/notes", function (req, res) {

    fs.readFile("public/db/db.json", function (error, data) {
        if (error) {
            throw error;
        };
        let notes = JSON.parse(data);
        return res.json(notes);
    });

});

app.post('/api/notes', (req, res) => {

    fs.readFile("public/db/db.json", function (error, data) {
        if (error) {
            throw error;
        };
        let notes = JSON.parse(data);

        let newNote = {
            title: req.body.title,
            text: req.body.text,
            id: shortid.generate()
        }

        notes.push(newNote);

        fs.appendFile("public/db/db.json", JSON.stringify(notes, null, 2), (error) => {
            if (error) {
                throw error;
            };
            res.send('200');
        });

    });

});


app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});
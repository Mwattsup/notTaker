const express = require("express");
const path = require("path");
const fs = require('fs');

var app = express();
var PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'index.html')));


app.get("*", function (_req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get("/notes", function (_req, res) {
    res.sendFile(path.join(__dirname, 'notes.html'));
});

app.get("/api/notes", function (req, res) {

    fs.readFile("db/db.json", function (error, data) {
        if (error) {
            throw error;
        };
        let notes = JSON.parse(data);
        return res.json(notes);
    });

});

app.post('/api/notes', (req, res) => {

    fs.readFile("db/db.json", function (error, data) {
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

        fs.appendFile("db/db.json", JSON.stringify(notes, null, 2), (error) => {
            if (error) {
                throw error;
            };
            res.send('200');
        });

    });

});

app.delete('/api/notes/:id', (req, res) => {
    let chosen = req.params.id;

    fs.readFile("db/db.json", function (err, data) {
        if (err) throw err;
        let notes = JSON.parse(data);

        function searchChosen(chosen, notes) {
            for (var i = 0; i < notes.length; i++) {
                if (notes[i].id === chosen) {
                    notes.splice(i, 1);
                }
            }
        }

        searchChosen(chosen, notes);

        fs.writeFile("db/db.json", JSON.stringify(notes, null, 2), (err) => {
            if (err) throw err;
            res.send('200');
        });

    });

});




app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});
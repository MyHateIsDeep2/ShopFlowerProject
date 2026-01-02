const express = require('express');
const bodyParser = require('body-parser');
const mysql = require("mysql");
const cors = require('cors');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({origin: '*'}))

const connection = {
    host:"ucka.veleri.hr",
    database:"djakopicek",
    user:"djakopicek",
    password:"11"
}
conn = mysql.createConnection(connection);

app.get('/getBiljke', (request, response) => {
    conn.query("SELECT * FROM bBiljke", (error, results) => {
    if (error) {
        console.log(error)
    }
    return response.send(results);
    })
});

app.post('/addtocart/:id_biljke/:id_korisnika', (req, res) => {
    const id_biljke = req.params.id_biljke;
    const id_korisnika = req.params.id_korisnika;
    const { kolicina } = req.body; // quantity sent from frontend

    conn.query(
        "INSERT INTO `Cart`(`korisnik_id`, `produkt_id`, `kolicina`) VALUES (?,?,?)",
        [id_korisnika, id_biljke, kolicina],
        (error, results) => {
            if (error) console.log(error);
            return res.send(results);
        }
    );
});


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

app.post('/addtocart/:biljka_id/:korisnik_id', (req, res) => {
    const id_biljke = req.params.biljka_id;
    const id_korisnika = req.params.korisnik_id;
    const kolicina = 1;

    conn.query("INSERT INTO `bCart`(`korisnik_id`, `biljka_id`, `kolicina`) VALUES (?,?,1)", [id_korisnika, id_biljke],
        (error, results) => {
            if (error) console.log(error);
            return res.send(results);
        }
    );
});
app.post('/login', (request, response) => {
    const data = request.body;
    console.log(data.Email);
    console.log(data.Lozinka);
    Korisnik = [data.ID, data.Email, data.Lozinka]
    conn.query("INSERT INTO bKorisnici (korisnik_id, email, korisnik_password) VALUES (?, ?, ?)", Korisnik, (error, results ) => {
        if (error) {
            console.log(error)
        }
        return response.send(results);
    })
})
app.get('/hello', (request, response) => {
    return response.send('Hello world');
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});


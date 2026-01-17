const express = require('express');
const bodyParser = require('body-parser');
const mysql = require("mysql");
const cors = require('cors');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json())
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
app.post('/registracija', (request, response) => {
    const data = request.body;
    const Korisnik = [data.Email, data.Lozinka];

    conn.query(
        "INSERT INTO bKorisnici (email, korisnik_password) VALUES (?, ?)", 
        Korisnik, 
        (error, results) => {
            if (error) {
                console.log(error);
                return response.status(500).send({ error: "Database error" });
            }
        }
    );
});
app.post('/login', (request, response) => {
    const { Email, Lozinka } = request.body;

    conn.query(
        "SELECT korisnik_id FROM bKorisnici WHERE email = ? AND korisnik_password = ?",
        [Email, Lozinka],
        (error, results) => {
            if (error) {
                console.log(error);
                return response.status(500).send({ error: "Database error" });
            }

            if (results.length === 0) {
                return response.status(401).send({ error: "Neispravan email ili lozinka" });
            }

            return response.send({
                korisnik_id: results[0].korisnik_id
            });
        }
    );
});

//app.get('/getCart/:korisnik_id', (request, response) => {
  //  const korisnik_id = request.params.korisnik_id;
    //conn.query("SELECT bCart.produkt_id, bCart.id_korisnik, bCart.kolicina, bBiljke.biljka_ime, bBiljke.cijena, bBiljke.slika, bBiljke.opis, (bBiljke.cijena * bCart.kolicina) AS Ukupno FROM bCart JOIN bBiljke ON bCart.produkt_id = bBiljke.biljka_id WHERE bCart.id_korisnik = ?"), [korisnik_id], (error, results) => {
      //  if (error) {
        //    console.log(error)
        //}
        //return response.send(results);
    //}
//});
app.get('/getCart/:korisnik_id', (request, response) => {
    const korisnik_id = request.params.korisnik_id;

    conn.query(
        "SELECT bCart.produkt_id, bCart.id_korisnik, bCart.kolicina, " +
        "bBiljke.biljka_ime, bBiljke.cijena, bBiljke.slika, bBiljke.opis, " +
        "(bBiljke.cijena * bCart.kolicina) AS Ukupno " +
        "FROM bCart " +
        "JOIN bBiljke ON bCart.produkt_id = bBiljke.biljka_id " +
        "WHERE bCart.id_korisnik = ?",
        [korisnik_id],
        (error, results) => {
            if (error) {
                console.log(error);
                return response.status(500).send(error);
            }
            response.send(results);
        }
    );
});

app.post('/addtocart/:korisnik_id/:biljka_id', (request, response) => {
    const id_biljke = request.params.biljka_id;
    const id_korisnika = request.params.korisnik_id;
    const kolicina = 1;

    conn.query("INSERT INTO `bCart`(`id_korisnik`, `produkt_id`, `kolicina`) VALUES (?,?,1)", [id_korisnika, id_biljke],
        (error, results) => {
            if (error) console.log(error);
            return response.send(results);
        }
    );
});
app.post('/updateCart/:korisnik_id/:produkt_id', (request, response) => {
    const { korisnik_id, produkt_id } = request.params;
    const { kolicina } = request.body;
    conn.query(
        "UPDATE bCart SET kolicina = ? WHERE id_korisnik = ? AND produkt_id = ?",
        [kolicina, korisnik_id, produkt_id],
        (err, results) => {
            if(err) console.log(err);
            response.send(results);
        }
    );
});
app.delete('/removeCart/:korisnik_id/:produkt_id', (request, response) => {
    const { korisnik_id, produkt_id } = request.params;
    conn.query(
        "DELETE FROM bCart WHERE id_korisnik = ? AND produkt_id = ?",
        [korisnik_id, produkt_id],
        (err, results) => {
            if(err) console.log(err);
            response.send(results);
        }
    );
});

app.get('/hello', (request, response) => {
    return response.send('Hello world');
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});


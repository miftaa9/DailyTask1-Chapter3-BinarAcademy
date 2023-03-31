// import atau panggil package yg kita mau pake di aplikasi kita
const express = require('express')
const fs = require("fs")
const app = express();
const PORT = 3000;

// middlewere
app.use(express.json());

// proses baca file json nya dg FS module, dan json nya dibantu dibaca dg JSON.parse
const persons = JSON.parse(fs.readFileSync(`${__dirname}/person.json`))

app.get('/person', (req, res) => {
    res.status(200).json({
        status: "success",
        data: {
            persons: persons
        }
    })
})

// get person by id (data satuan)
// ":id" = jadi url parameter
// req itu object
app.get('/person/:id', (req, res) => {
    // console.log(req);
    console.log(req.params);

    const id = req.params.id * 1;
    // find = array method, person = method
    const person = persons.find(el => el.id === id);

    res.status(200).json({
        status: "success",
        data: {
            person
        }
    })
})

// 1) bikin proses put/edit data sukses sampai data nya teredit di file json nya
// 2) bikin validasi jika id tidak ditemukan dari params id nya di api get data by id, delete dan put
// 3) bikin validasi di create/edit API utk request body

// Methode GET Data Person
app.get("/person/:id", (req, res) => {
    console.log(req.params);
    const id = req.params.id * 1;
    const person = persons.find((el) => el.id === id);

    if (person !== -1) {
        res.status(200).json({
            status: "success",
            data: {
                person,
            },
        });

    } else {
        res.status(404).json({
            status: "fail",
            message: `Data dengan id ${id} tidak ditemukan`,
        });
    }
});

// Methode PUT Data Person
app.put("/person/:id", (req, res) => {
    const id = req.params.id * 1;
    const personIndex = persons.findIndex((el) => el.id === id);

    // Membuat validasi jika data yang akan diedit adalah data guru, maka data tidak bisa dirubah
    const editable = persons[personIndex].editable === "enable"

    if (personIndex !== -1) {
        if (editable) {
            persons[personIndex] = {
                ...persons[personIndex],
                ...req.body
            };
            res.status(200).json({
                status: "success",
                message: `Data dengan id ${id} berhasil diubah`,
                data: persons[personIndex],
            });
            fs.writeFile(
                `${__dirname}/person.json`,
                JSON.stringify(persons),
                (errr) => {
                    res.status(200).json({
                        status: "success",
                        message: `data dari id ${id} berhasil berubah`,
                    });
                }
            );
        } else {
            res.status(404).json({
                status: "fail",
                message: `Data dengan id ${id} merupakan data guru, ANDA TIDAK BISA MELAKUKAN PERUBAHAN`,
            });
        }
    } else {
        res.status(404).json({
            status: "fail",
            message: `Data dengan id ${id} tidak ditemukan`,
        });
    }
});

// Methode DELETE Data Person
app.delete("/person/:id", (req, res) => {
    const id = req.params.id * 1;

    const index = persons.findIndex((element) => element.id === id);
    // const person = persons.find((el) => el.id === id);

    // Membuat validasi jika data yang akan dihapus adalah data guru, maka data tidak bisa dihapus
    const editable = persons[index].editable === "enable"

    if (index !== -1) {
        if (editable) {
            persons.splice(index, 1);

            fs.writeFile(
                `${__dirname}/person.json`,
                JSON.stringify(persons),
                (errr) => {
                    res.status(200).json({
                        status: "success",
                        message: `data dari id ${id} nya berhasil dihapus`,
                    });
                }
            );
        } else {
            res.status(404).json({
                status: "fail",
                message: `Data dengan id ${id} merupakan data guru, ANDA TIDAK BISA MELAKUKAN PERUBAHAN`,
            });
        }
    } else {
        res.status(400).json({
            status: "failed",
            message: `person dengan id ${id} tersebut invalid/gak ada`,
        });
    }
});

app.post("/person", (req, res) => {
    console.log(persons.length - 1);
    const newId = persons.length - 1 + 10;
    const newPerson = Object.assign({
        id: newId
    }, req.body);

    persons.push(newPerson);
    fs.writeFile(`${__dirname}/person.json`, JSON.stringify(persons), (errr) => {
        res.status(201).json({
            status: "success",
            data: {
                person: newPerson,
            },
        });
    });
});

// memulai server nya
app.listen(PORT, () => {
    console.log(`App running on Localhost: ${PORT}`)
})
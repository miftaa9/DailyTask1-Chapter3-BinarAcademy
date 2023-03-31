// import atau panggil package yg kita mau pake di aplikasi kita
const express = require('express')
const fs = require("fs")
const app = express();
const PORT = 3000;

// middlewere
app.use(express.json());

// proses baca file json nya dg FS module, dan json nya dibantu dibaca dg JSON.parse
const persons = JSON.parse(fs.readFileSync(`${__dirname}/person.json`))

// daily task
// 1) bikin proses put/edit data sukses sampai data nya teredit di file json nya
// 2) bikin validasi jika id tidak ditemukan dari params id nya di api get data by id, delete dan put
// 3) bikin validasi di create/edit API utk request body

// REQUEST METHOD GET
app.get('/person', (req, res) => {
    res.status(200).json({
        status: "success",
        data: {
            persons: persons
        }
    })
})

// REQUEST METHOD GET DATA PERSON BY ID
app.get("/person/:id", (req, res) => {
    const id = req.params.id * 1;
    const person = persons.find((el) => el.id === id);

    // VALIDASI ID HARUS BERUPA ANGKA
    if (isNaN(id)) {
        res.status(400).json({
            status: 'failed',
            message: 'ID harus berupa angka'
        });
    }

    // VALIDASI ID TIDAK DITEMUKAN
    else if (!person) {
        res.status(404).json({
            status: "fail",
            message: `Person dengan id ${id} tidak ditemukan`,
        })
    } else if (person !== -1) {
        res.status(200).json({
            status: "success",
            data: {
                person,
            },
        });
    }
});

// REQUEST METHOD PUT DATA PERSON
app.put("/person/:id", (req, res) => {
    const id = req.params.id * 1;
    const personIndex = persons.findIndex((el) => el.id === id);
    const editable = persons[personIndex].editable === "enable"

    if (personIndex !== -1) {
        if (editable) {
            persons[personIndex] = {
                ...persons[personIndex],
                ...req.body.eyeColor
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
        }

        // VALIDASI DATA DISABLE, TIDAK DPT MELAKUKAN PERUBAHAN
        else {
            res.status(404).json({
                status: "fail",
                message: `Data dengan id ${id} disable, tidak dapat melakukan perubahan`,
            });
        }
    }

    // VALIDASI ID TIDAK DITEMUKAN
    else {
        res.status(404).json({
            status: "fail",
            message: `Data dengan id ${id} tidak ditemukan`,
        });
    }
});

// REQUEST METHOD DELETE DATA PERSON
app.delete("/person/:id", (req, res) => {
    const id = req.params.id * 1;
    const index = persons.findIndex((element) => element.id === id);
    // const person = persons.find((el) => el.id === id);
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
        }

        // VALIDASI DATA DISABLE, TIDAK DPT MELAKUKAN PERUBAHAN
        else {
            res.status(404).json({
                status: "fail",
                message: `Data dengan id ${id} disable, tidak dapat melakukan perubahan`,
            });
        }
    }

    // VALIDASI ID TIDAK DITEMUKAN
    else {
        res.status(400).json({
            status: "failed",
            message: `Person dengan id ${id} tersebut invalid/tidak ada`,
        });
    }
});

// REQUEST METHOD POST
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
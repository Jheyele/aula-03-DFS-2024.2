// ***************************************** DEMO COM MODULO HTTP *****************************************

// const http = require('http')

// const server = http.createServer((request, response) => {
//     response.end("Hello world")
// })

// server.listen(3000, () => {
//     console.log("Running server")
// })

// ***************************************** DEMO COM MODULO EXPRESS *****************************************
// const express = require('express')

// const app = express();

// app.use(express.json());

// const usuarios = [
//     {id: 1, nome: "Jheyele", email: "jheyele@gmail.com"}, 
//     {id: 2, nome: "Francis", email: "francis@gmail.com"}, 
//     {id: 3, nome: "Geyse", email: "geyse@gmail.com"}
// ]

// app.get(("/usuarios"), (request, response) => {
//     response.status(200).json(usuarios)
// })

// app.post(("/usuario"), (request, response) => {
//     const { nome, email } = request.body;
//     usuarios.push({nome: nome, email: email});
//     response.status(201).json({nome: nome, email: email})
// })

// app.put(("/usuario/:id"), (request, response) => {
//     const { nome, email } = request.body;
//     const { id } = request.params;

//     const usuario = usuarios.find(u => u.id == id)

//     if(usuario){
//         usuario.nome = nome;
//         usuario.email = email;
//         response.status(200).json(usuario)
//     } else {
//         response.status(404).json("Usuario não encontrado")
//     }
// })

// app.delete(("/usuario/:id"), (request, response) => {
//     const { id } = request.params;

//     const index = usuarios.findIndex(u => u.id == id)

//     if(index !== -1){
//         usuarios.splice(index, 1)
//         response.status(204).send()
//     } else {
//         response.status(404).json("Usuario não encontrado")
//     }
// })


// app.listen(3000, () => {
//     console.log("Running server")
// })

// ***************************************** DEMO COM MODULOS EXPRESS E PG *****************************************

const express = require('express')
const pg = require('pg')

const app = express();

app.use(express.json());

const { Pool } = pg;

const pool = new Pool({
    user: "postgres",
    password: "",
    database: "postgres",
    port: 5432
})

app.get(("/pacientes"), async (request, response) => {
    const pacientes = await pool.query('SELECT * FROM pacientes')
    response.status(200).json(pacientes.rows)
})

app.post(("/paciente"), async (request, response) => {
    const { nome, email, data_nascimento } = request.body;
    const pacientes = await pool.query('INSERT INTO pacientes (nome, email, data_nascimento) VALUES ($1, $2, $3)',[nome, email, data_nascimento]);
    response.status(201).json({nome: nome, email: email, data_nascimento: data_nascimento})
})

app.put(("/paciente/:id"), async (request, response) => {
    const { nome, email, data_nascimento} = request.body;
    const { id } = request.params;

    const paciente = await pool.query('SELECT * FROM pacientes WHERE id = $1',[id])

    if(paciente){
        const paciente = await pool.query('UPDATE pacientes SET nome = $1, email = $2, data_nascimento = $3 WHERE id = $4',[nome, email, data_nascimento,id])
        response.status(200).json("")
    } else {
        response.status(404).json("Usuario não encontrado")
    }
})

app.delete(("/paciente/:id"), async (request, response) => {
    const { id } = request.params;

    const paciente = await pool.query('SELECT * FROM pacientes WHERE id = $1',[id])

    if(paciente.rows.length > 0 ){
        await pool.query('DELETE FROM pacientes WHERE id = $1',[id])
        response.status(200).json("")
    } else {
        response.status(404).json("Usuario não encontrado")
    }
})


app.listen(3000, () => {
    console.log("Running server")
})

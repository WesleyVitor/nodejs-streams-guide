import axios from "axios";
import { Transform, Writable } from "stream";
const url = "http://localhost:3000";

async function consume() {
    const response = await axios({
        url,
        method: "GET",
        responseType: "stream", //Não precisa esperar a requisição completa, chegou algo? manda
    });

    return response.data;
}

const stream = await consume();

stream
    .pipe(
        new Transform({
            transform(chunk, enc, cb) {
                const item = JSON.parse(chunk); //Cuidado! Eu sei que o chunk que vem é JSON
                const myNumber = /\d+/.exec(item.name)[0]; // Pegar o número dentro de item.name
                let name = item.name;

                if (myNumber % 2 === 0) {
                    name = name.concat("é par!");
                } else {
                    name = name.concat("é impar!");
                }
                item.name = name;

                cb(null, JSON.stringify(item));
            },
        })
    )
    .pipe(
        new Writable({
            write(chunk, enc, cb) {
                console.log("Chegou:", chunk.toString());
                cb();
            },
        })
    );

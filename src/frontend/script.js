const now = new Date();
const year = now.getFullYear();
const month = now.getMonth() + 1; // FIX
const daysInMonth = new Date(year, month, 0).getDate();
const currentDay = now.getDate();

const relevante = document.getElementById("relevante");

const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
relevante.innerHTML = `
<h2>Hechos relevantes de ${months[month - 1]} ${year}</h2>
<div id="days"></div>
`;

const daysContainer = document.getElementById("days");

for (let i = 1; i <= daysInMonth; i++) {
    const div = document.createElement("div");

    if (i === currentDay) {
        div.innerHTML = `
            <strong>${i}/${month}/${year}</strong>
            <input type="text" id="input-${i}">
            <button onclick="newRelevante()">Guardar</button>
        `;
    } else {
        div.innerHTML = `
            <strong>${i}/${month}/${year}</strong>
            <span id="day-${i}"></span>
        `;
    }

    daysContainer.appendChild(div);
}

const logros = document.getElementById("logros");

async function addLogros() {
    try {
        let Ldata = [];
        for (let i = 1; i <= 5; i++) {
            const input = document.getElementById(`logro-${i}`);
            Ldata[i - 1] = input ? input.value : ""; // evita error si no existe
        }

        await fetch("/addLogros", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                l1: Ldata[0],
                l2: Ldata[1],
                l3: Ldata[2],
                l4: Ldata[3],
                l5: Ldata[4]
            })
        });
        playAudio("alert")
        genLogrosCBtn()
    } catch (error) {
        playAudio("error")
        alert(error);
    }
}

function genLogrosI() {
    for (let i = 1; i <= 5; i++) {
        logros.innerHTML += `<label>Logro ${i}</label><input type="text" id="logro-${i}">`;
    }
    logros.innerHTML += `<button onclick="addLogros()">Guardar</button>`
}

async function sendThisDay() {
    try {
        const payload = {
            day: currentDay,
            l1: document.getElementById("lcbox-0").checked,
            l2: document.getElementById("lcbox-1").checked,
            l3: document.getElementById("lcbox-2").checked,
            l4: document.getElementById("lcbox-3").checked,
            l5: document.getElementById("lcbox-4").checked
        };

        await fetch("/sendDayLogros", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        playAudio("alert");
    } catch (error) {
        playAudio("error");
        alert("Error al enviar logros del día: " + error);
    }
}

fetch("/getLogros")
.then(res => res.json())
.then(data => {
    function genLogrosCBtn() {
        logros.innerHTML = ``
        for (let i = 0; i <= 4; i++) {
            logros.innerHTML += `
            <div style="display: flex; margin: auto;">
                <label>${data[i]}</label>
                <input type="checkbox" id='lcbox-${i}' style="width: 30px; height: 20px;">
            </div>
            `
        }
        logros.innerHTML += `<button onclick="sendThisDay()">Enviar Este Dia</button>`
    }
    if (!data || data.length === 0) {
        genLogrosI()
    } else {
        genLogrosCBtn()
    }
}).catch(err => console.error("Error al cargar logros:", err));

if (currentDay === 1) {
    fetch("/resetMonth", { method: "POST" });
}

function playAudio(audio) {
    const audioElement = document.getElementById(audio);
    audioElement.play();
}

async function newRelevante() {
    try {
        playAudio("alert");
        const input = document.getElementById(`input-${currentDay}`);
        const text = input.value;

        if (!text) return;

        await fetch("/newRelevante", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ relevante: text })
        });

        const container = input.parentElement;
        container.innerHTML = `
            <strong>${currentDay}/${month}/${year}</strong><br>
            <label>${text}</label>
        `;
    } catch (error) {
        playAudio("error")
        alert(error);
    }
}

async function getHechos() {
    const response = await fetch("/getRelevante");
    const data = await response.json();

    data.forEach(([day, text]) => {
        const span = document.getElementById(`day-${day}`);
        if (span) span.textContent = text;
    });
}

getHechos();

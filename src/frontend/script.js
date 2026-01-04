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

fetch("/getLogros")
.then(res => res.json())
.then(data => {
if (!data || data.length === 0) {
for (let i = 1; i <= 5; i++) {
    logros.innerHTML += `<label>Logro ${i}</label><input type="text" id="logro-${i}">`;
}
} else {
console.log("Logros recibidos:", data);
}
})
.catch(err => console.error("Error al cargar logros:", err));

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

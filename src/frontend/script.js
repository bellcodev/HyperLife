
const now = new Date();
const year = now.getFullYear();
const month = now.getMonth() + 1;
const daysInMonth = new Date(year, month, 0).getDate();
const currentDay = now.getDate();
const current = `${currentDay}, ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`

function detectEndpoint() {
    const path = window.location.pathname;
    const content = document.getElementById("container")
    if (path == "/") {
        content.innerHTML = `
            <div id="relevante"></div>
            <div id="logrosDiv">
                <h2>Metas Diarias</h2>
                <div id="logros"></div>
            </div>
        `
        fetch("/getLogros")
        .then(res => res.json())
        .then(data => {
            if (!data || data.length === 0) {
                genLogrosI()
            } else {
                checkThisDay()
            }
        }).catch(err => console.error("Error al cargar logros:", err));
        const relevante = document.getElementById("relevante");

        const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        relevante.innerHTML = `
        <h2>Hechos relevantes de ${months[month - 1]} ${year}</h2>
        <div id="days"></div>
        `;
        genRelevanteI()
    } else if (path == "/trofeos") {
        content.innerHTML = `
            <h2 style="text-decoration: underline;">Sala de Trofeos</h2>
            <div id="insignias">
                <h2>Insignias</h2>
                <div id="insignias-pts"></div>
            </div>

            <h2>Racha Hechos Relevantes</h2>
            <div id="racha"></div>
        `
        getInsignias()
        checkRacha()
    }
}
detectEndpoint()


async function genRelevanteI() {
    const daysContainer = document.getElementById("days");
    daysContainer.innerHTML = ``
    const response = await fetch("/getRelevante");
    const data = await response.json();
    let relText = []
    data.forEach(([day, text]) => {
        if (!text) {text = ""}
        relText[day] = text

    });
    for (let i = 1; i <= daysInMonth; i++) {
        const div = document.createElement("div");

        if (i === currentDay) {
            if (localStorage.getItem("lastRelevante") != currentDay) {
                div.innerHTML = `
                    <strong>${i}/${month}/${year}</strong>
                    <input type="text" id="input-${i}">
                    <button onclick="newRelevante()">Guardar</button>
                `;
            } else {
                div.innerHTML = `
                    <strong>${i}/${month}/${year}</strong>
                    <label id="day-${i}">${relText[i] || ""}</label> <button onclick="editRelevante()" class="editBtn" style="width: 50px;"><img style="width: 35px;" src="/assets/edit.svg"></button>
                `;
            }
        } else {
            div.innerHTML = `
                <strong>${i}/${month}/${year}</strong>
                <label id="day-${i}">${relText[i] || ""}</label>
            `;
            if (i < currentDay && relText[i] || "") {
                div.innerHTML += `<button onclick="delRelevante(${i})" class="delBtn" bottom: 0; style="width: 50px;"><img style="width: 35px;" src="/assets/delete.svg"></button>`
            }
        }

        daysContainer.appendChild(div);
    }
}

const logros = document.getElementById("logros");

function genLogrosI() {
    fetch('/resetLogros', { method: 'POST' })
    logros.innerHTML = ``
    for (let i = 1; i <= 5; i++) {
        logros.innerHTML += `<label>Logro ${i}</label><input type="text" id="logro-${i}">`;
    }
    logros.innerHTML += `<button onclick="addLogros()">Guardar</button>`
}

function checkThisDay() {
    const lastDay = localStorage.getItem("logroDay")
    const content = document.getElementById("logros")
    if (lastDay === `${currentDay}`) {
        content.innerHTML = `<p>Ya registraste las metas cumplidas hoy</p><br><button onclick="fetch('/stats', {method: 'GET'});">Ver estadisticas</button>`
    } else {
        genLogrosCBtn()
    }
}

async function sendThisDay() {
    try {
        let lcbox = []
        for (let i = 0; i < 5; i++) {
            lcbox[i] = document.getElementById(`lcbox-${i}`).checked
        }

        let totalLogros = 0
        for (let i = 0; i < 5; i++) {
            if (lcbox[i] == 1) {
                totalLogros += 1
            }
        }

        const payload = {
            day: currentDay,
            total: totalLogros
        };

        await fetch("/sendDayLogros", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        localStorage.setItem('logroDay', currentDay)
        localStorage.setItem('rachaDay', currentDay)
        checkThisDay()

        playAudio("alert");
    } catch (error) {
        playAudio("error");
        alert("Error al enviar logros del día: " + error);
    }
}

async function genLogrosCBtn() {
    fetch("/getLogros").then(res => res.json()).then(data => {
        logros.innerHTML = `<button onclick="genLogrosI()" style="width: 50px;"><img style="width: 35px;" src="/assets/edit.svg"></button>`
        for (let i = 0; i <= 4; i++) {
            logros.innerHTML += `
            <div style="display: flex; margin: auto;">
                <label>${data[i]}</label>
                <input type="checkbox" id='lcbox-${i}' style="width: 30px; height: 20px;">
            </div>
            `
        }
        logros.innerHTML += `<button onclick="sendThisDay()">Enviar Este Dia</button>`
    })

}

async function addLogros() {
    try {
        let Ldata = [];
        for (let i = 1; i <= 5; i++) {
            const input = document.getElementById(`logro-${i}`);
            Ldata[i - 1] = input ? input.value : "";
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

if (current === "1, 12:0:0") {
    fetch("/resetMonth", { method: "POST" });
}

function playAudio(audio) {
    const audioElement = document.getElementById(audio);
    if (document.getElementById("vol").src.includes("alert")) {
        audioElement.play();
    }
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
            <label>${text}</label> <button onclick="editRelevante()" style="width: 50px;"><img style="width: 35px;" src="/assets/edit.svg"> </button>
        `;
        localStorage.setItem("lastRelevante", currentDay)
        localStorage.setItem("rachaDay", currentDay)
    } catch (error) {
        playAudio("error")
        alert(error);
    }
}

setInterval(() => {
    if (navigator.onLine) {
        document.getElementById("conn").src = "/assets/offline.svg";
    } else {
        document.getElementById("conn").src = "/assets/offline.svg";
    }
})

async function editRelevante() {
    await fetch("/delCurrentRel", {method: "DELETE"})
    localStorage.setItem("lastRelevante", "")
    genRelevanteI()
}

async function delRelevante(day) {
    await fetch("/delRelevante", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ d: day })
    })
    genRelevanteI()
}

async function sonido() {
    let preference = localStorage.getItem("sonidoPreference")
    if (document.getElementById("vol").src.includes("alert")) {
        document.getElementById("vol").src = "/assets/silence.svg"
        localStorage.setItem("sonidoPreference", "silence")
    } else if (document.getElementById("vol").src.includes("silence")) {
        document.getElementById("vol").src = "/assets/alert.svg"
        localStorage.setItem("sonidoPreference", "alert")
    }
}


const body = document.body;
let preferenceSound = localStorage.getItem("sonidoPreference")
if (preferenceSound == "silence") {
    document.getElementById("vol").src = "/assets/silence.svg"
} else if (preferenceSound == "alert") {
    document.getElementById("vol").src = "/assets/alert.svg"
}

let preferenceTheme = localStorage.getItem("preferenceTheme")
if (preferenceTheme == "dark") {
    document.getElementById("theme").src = "/assets/moon.svg"
    body.classList.toggle("dark-theme");
}

async function getInsignias() {
    const response = await fetch("/getInsignias");
    const data = await response.json();
    const total = data * 5;
    const content = document.getElementById("insignias-pts");

    if (total >= 100) {
        content.innerHTML += '<img class="insignia" id="bronce" title="Bronce - 100pts" src="/assets/bronce.png">';
    } else {
        content.innerHTML += '<label>No tienes ninguna insignia, Consigue tu primera insignia acumulando 100 puntos</label>';
    }
    if (total >= 300) {
        content.innerHTML += '<img class="insignia" id="plata" title="Plata - 300pts" src="/assets/plata.png">';
    }
    if (total >= 500) {
        content.innerHTML += '<img class="insignia" id="oro" title="Oro - 500pts" src="/assets/oro.png">';
    }
    if (total >= 1000) {
        content.innerHTML += '<img class="insignia" id="diamante" title="Diamante - 1000pts" src="/assets/diamante.png">';
    }
    if (total >= 2000) {
        content.innerHTML += '<img class="insignia" id="platino" title="Platino - 2000pts" src="/assets/platino.png">';
    }
    content.innerHTML += `<p>Tienes un total de ${total} puntos acumulados ¡Sigue asi!</p>`
}

function checkRacha() {
    const lastDay = parseInt(localStorage.getItem("rachaDay")) || 0;
    const racha = parseInt(localStorage.getItem("racha")) || 0;

    if (lastDay === currentDay - 1) {
        const newRacha = racha + 1;
        localStorage.setItem("racha", newRacha);
    } else if (lastDay === currentDay) {
        localStorage.setItem("racha", racha);
    } else {
        localStorage.setItem("racha", 1);
    }

    localStorage.setItem("rachaDay", currentDay);
    document.getElementById("racha").innerHTML = `

<svg id="logoRacha" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <defs>
    <linearGradient id="gradDiamond" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#8abbffff"/>
      <stop offset="50%" stop-color="#286cb9ff"/>
      <stop offset="100%" stop-color="#2600ffff"/>
    </linearGradient>
  </defs>
  <polygon points="100,20 180,100 100,180 20,100"
           fill="url(#gradDiamond)" stroke="#006affff" stroke-width="6"
           filter="drop-shadow(0 0 5px #006affff)" />
  <text id="rachaText" x="100" y="115"
        font-size="46"
        text-anchor="middle"
        dominant-baseline="middle">
    0
  </text>
</svg>`;
document.getElementById("rachaText").textContent = racha;
}

const toggleBtn = document.getElementById("theme-toggle");

toggleBtn.addEventListener("click", () => {
    const theme = document.getElementById("theme");
    if (theme.src.includes("sun")) {
        theme.src = "/assets/moon.svg";
        localStorage.setItem("preferenceTheme", "dark")
    } else {
        theme.src = "/assets/sun.svg";
        localStorage.setItem("preferenceTheme", "light")
    }
    body.classList.toggle("dark-theme");
});

document.getElementById("hamburger").addEventListener("click", function() {
    document.getElementById("menu").classList.toggle("show");
});


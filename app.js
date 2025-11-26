let problems = [];

// --- CARREGA PROBLEMES ---
fetch("problems.json")
  .then(r => r.json())
  .then(p => {
    problems = p;
    home();
  });

// ---- STICKERS: llista fixa (120 emojis) ----
const stickers = [
  "??","??","??","??","??","??","??","??","??","??",
  "??","??","??","??","??","??","??","??","??","??",
  "??","??","??","??","??","??","??","??","??","??",
  "??","??","??","??","??","??","??","??","??","??",
  "??","??","??","??","??","??","??","??","??","??",
  "??","??","??","??","??","??","??","??","??","??",
  "??","??","??","??","??","??","??","??","??","??",
  "??","??","??","??","??","??","??","??","??","??",
  "??","??","??","??","??","??","?","??","??","??",
  "??","??","??","??","??","???","??","??","??","??",
  "??","??","??","??","??","??","??","??","??","??",
  "??","??","??","??","??","???","???","???","??","??"
];

// ---- LLEGIR localStorage (amb migraci車 i validaci車) ----
let obtained = [];

try {
  const raw = JSON.parse(localStorage.getItem("stickers"));

  if (Array.isArray(raw)) {

    // 1) Valors num豕rics v角lids
    const numeric = raw.filter(v => Number.isInteger(v) && v >= 0 && v < stickers.length);

    // 2) Si hi ha strings (emoji antics), els convertim a 赤ndexs
    const emojiStrings = raw.filter(v => typeof v === "string");
    const fromEmoji = emojiStrings
      .map(e => stickers.indexOf(e))
      .filter(i => i >= 0);

    // 3) Unim i eliminem duplicats
    obtained = Array.from(new Set([...numeric, ...fromEmoji]));
  }
} catch (e) {
  obtained = [];
}

// Guardem dades netes per assegurar coher豕ncia
localStorage.setItem("stickers", JSON.stringify(obtained));

// ---- FUNCIONS AUXILIARS ----
function save() {
  localStorage.setItem("stickers", JSON.stringify(obtained));
}

function rand(n) {
  return Math.floor(Math.random() * n);
}

// --- SONS ---
const sndCorrect = new Audio("https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg");
const sndWrong   = new Audio("https://actions.google.com/sounds/v1/cartoon/wood_plank_flicks.ogg");

// --- INICI PARTIDA ---
function startGame() {
  const chosen = [];

  // Sempre tria 5 problemes 迆NICS
  while (chosen.length < 5) {
    const p = problems[rand(problems.length)];
    if (!chosen.includes(p)) chosen.push(p);
  }

  let idx = 0;
  let score = 0;
  const app = document.getElementById("app");

  function showProblem() {
    if (idx >= 5) {
      end();
      return;
    }

    const p = chosen[idx];
    const correct = p.result;

    // Opcions de resposta
    const opts = new Set([correct]);
    while (opts.size < 4) {
      let v = correct + Math.floor(Math.random() * 15) - 7;
      if (v < 1) v = 1;
      opts.add(v);
    }

    const optArr = [...opts].sort(() => Math.random() - 0.5);

    app.innerHTML =
      `<h2>${p.text}</h2>` +
      optArr.map(o => `<div class='option' data-v='${o}'>${o}</div>`).join("");

    document.querySelectorAll(".option").forEach(el => {
      el.onclick = () => {
        if (+el.dataset.v === correct) {
          sndCorrect.play();
          el.classList.add("correct");
          score++;
          setTimeout(() => { idx++; showProblem(); }, 1200);

        } else {
          sndWrong.play();
          el.classList.add("wrong");
          app.innerHTML += `<p><strong>Resposta correcta:</strong> ${correct}</p>`;
          setTimeout(() => { idx++; showProblem(); }, 2200);
        }
      };
    });
  }

  function end() {
    let newSticker = null;

    if (score === 5) {
      // Llista de stickers NO desbloquejats
      const remaining = [...Array(stickers.length).keys()]
        .filter(i => !obtained.includes(i));

      if (remaining.length > 0) {
        const s = remaining[rand(remaining.length)];
        obtained.push(s);
        save();
        newSticker = stickers[s];
      }
    }

    app.innerHTML = `
      <h2>Partida acabada</h2>
      <p>Puntuaci車: ${score}/5</p>
      ${newSticker ? `<p>Has guanyat un sticker: <span style="font-size:40px">${newSticker}</span></p>` : ""}
      <button id='home'>Inici</button>
    `;

    document.getElementById("home").onclick = home;
  }

  showProblem();
}

// --- COL﹞LECCI車 ---
function showCollection() {
  const app = document.getElementById("app");

  let html = "<h2>Col﹞lecci車</h2><div class='grid'>";
  for (let i = 0; i < stickers.length; i++) {
    html += `<div class='cell'>${obtained.includes(i) ? stickers[i] : i + 1}</div>`;
  }
  html += "</div><button id='home'>Inici</button>";

  app.innerHTML = html;

  document.getElementById("home").onclick = home;
}

// --- PANTALLA INICI ---
function home() {
  document.getElementById("app").innerHTML = `
    <h1>Quiz Multiplicacions</h1>
    <button id='play'>Jugar</button>
    <button id='col'>Col﹞lecci車</button>
  `;

  document.getElementById("play").onclick = startGame;
  document.getElementById("col").onclick = showCollection;
}


let problems=[];
fetch("problems.json").then(r=>r.json()).then(p=>{problems=p; home();});

const stickers = Array.from({length:120},(_,i)=>"🌟"+String(i+1).padStart(3,"0"));
let obtained = JSON.parse(localStorage.getItem("stickers")||"[]");
function save(){ localStorage.setItem("stickers",JSON.stringify(obtained)); }
function rand(n){ return Math.floor(Math.random()*n); }

const sndCorrect=new Audio("https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg");
const sndWrong=new Audio("https://actions.google.com/sounds/v1/cartoon/wood_plank_flicks.ogg");

function startGame(){
  const chosen = [];
  while(chosen.length<5){
    let p=problems[rand(problems.length)];
    if(!chosen.includes(p)) chosen.push(p);
  }
  let idx=0;
  let score=0;
  const app=document.getElementById("app");

  function showProblem(){
    if(idx>=5){ end(); return; }
    const p=chosen[idx];
    const correct=p.result;
    const opts=new Set([correct]);
    while(opts.size<4){
      let v = correct + Math.floor(Math.random()*15)-7;
      if(v<1) v=1;
      opts.add(v);
    }
    const optArr=[...opts].sort(()=>Math.random()-0.5);
    app.innerHTML = `<h2>${p.text}</h2>` +
      optArr.map(o=>`<div class='option' data-v='${o}'>${o}</div>`).join("");

    document.querySelectorAll('.option').forEach(el=>{
      el.onclick=()=>{
        if(+el.dataset.v===correct){
          sndCorrect.play();
          el.classList.add("correct");
          score++;
          setTimeout(()=>{ idx++; showProblem(); },1300);
        } else {
          sndWrong.play();
          el.classList.add("wrong");
          app.innerHTML += `<p><strong>Resposta correcta:</strong> ${correct}</p>`;
          setTimeout(()=>{ idx++; showProblem(); },2200);
        }
      };
    });
  }

  function end(){
    let newSticker=null;
    if(score===5){
      const remaining=[...Array(120).keys()].filter(i=>!obtained.includes(i));
      if(remaining.length>0){
        const s=remaining[rand(remaining.length)];
        obtained.push(s); save();
        newSticker=stickers[s];
      }
    }
    app.innerHTML = `
      <h2>Partida acabada</h2>
      <p>Puntuació: ${score}/5</p>
      ${newSticker?`<p>Has guanyat un sticker: ${newSticker}</p>`:""}
      <button id='home'>Inici</button>`;
    document.getElementById("home").onclick=home;
  }

  showProblem();
}

function showCollection(){
  const app=document.getElementById("app");
  let html="<h2>Col·lecció</h2><div class='grid'>";
  for(let i=0;i<120;i++){
    html += `<div class='cell'>${obtained.includes(i)?stickers[i]:i+1}</div>`;
  }
  html+="</div><button id='home'>Inici</button>";
  app.innerHTML=html;
  document.getElementById("home").onclick=home;
}

function home(){
  document.getElementById("app").innerHTML=`
    <h1>Quiz Multiplicacions</h1>
    <button id='play'>Jugar</button>
    <button id='col'>Col·lecció</button>`;
  document.getElementById("play").onclick=startGame;
  document.getElementById("col").onclick=showCollection;
}

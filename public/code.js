const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 900;
canvas.height = 400;
canvas.setAttribute(
  "style",
  "display:block;margin:auto;background-color: #ffffff"
);
var hWid = 100;
var canMove = true;
var tensuu;
var review;
var canStart = false;
var moreEnter = 1;
var fin = 0;
var country = "france";
var avg;
var kari;
var italyCo = 0;
var gameStart = document.querySelector("#gameStart");
var flagStop = document.querySelector("#flagStop");
var game = document.querySelector("#game");
var how = document.querySelector("#howTo");
var worldaverage = document.getElementById("worldaverage");
if (!localStorage.name){
  alert();
}
fetch("/api/average")
.then(x => x.json()).then(x => worldaverage.innerText = x.point);
gameStart.addEventListener("click", (e) => {
  e.preventDefault();
  run();
});
game.addEventListener("click", (e) => {
  whenStop();
});
how.addEventListener("click", (e) => {
  Swal.fire({
    html: `
    <div style="color:black">
    <h2>操作方法</h2>
    <p>Sを押すと国旗がストップします</p>
    <p>出来上がったものが実際の国旗に近いほど高得点です</p>
    </div>
    `,
    showConfirmButton: true,
    confirmButtonText: "おっけー！",
    width: "40rem",
    background:
      "linear-gradient(90deg, #002780 0%, #002780 33.3%, #ffffff 33.3%, #ffffff 66.6%, #f31931 66.6%, #f31931 100%)",
    showClass: {
      popup: "animate__animated animate__zoomInDown animate__fast",
    },
    hideClass: {
      popup: "animate__animated animate__zoomOut",
    },
  });
});
if (isNaN(localStorage.countpoint)) {
  localStorage.countpoint = 0;
  localStorage.counttime = 0;
  localStorage.name = 0;
}
const spx2 = document.diff.spx2;
const ita = document.diff.ita;
const inv = document.diff.inv;

const mikio = {
  x: null,
  y: null,
  height: 200,
  width: hWid,
  speed: 10,
  draw: function () {
    if (country == "france") {
      ctx.fillStyle = "#002780";
    } else if (country == "italy") {
      ctx.fillStyle = "#009246";
    } else if (country == "invisible") {
      ctx.fillStyle = "#ffffff";
    }

    ctx.fillRect(this.x, this.y, this.width, this.height);
    if (canMove && this.x + 100 < nomoto.x) {
      this.x += this.speed;
    }
  },
};

const nomoto = {
  x: null,
  y: null,
  height: 200,
  width: hWid,
  draw: function () {
    if (country == "france") {
      ctx.fillStyle = "#f31931";
    } else if (country == "italy") {
      ctx.fillStyle = "#ce2b37";
    } else if (country == "invisible") {
      ctx.fillStyle = "#ffffff";
    }

    ctx.fillRect(this.x, this.y, this.width, this.height);
  },
};

const loop = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  mikio.draw();
  nomoto.draw();
  window.requestAnimationFrame(loop);
};

const init = () => {
  mikio.x = 0;
  mikio.y = canvas.height - mikio.height;
  nomoto.x = (canvas.width + hWid) / 2;
  nomoto.y = canvas.height - nomoto.height;
};
const Italy = () => {
  country = "italy";
};

const Invisible = () => {
  country = "invisible";
};

const run = () => {
  game.insertBefore(canvas, flagStop);
  if (spx2.checked) {
    mikio.speed = 15;
  }
  if (ita.checked) {
    Italy();
  }
  if (inv.checked) {
    Invisible();
  }
  moreEnter--;
  document.getElementById("start").style.display = "none";
  document.getElementById("game").style.display = "inline-block";

  document.body.addEventListener("keydown", (e) => {
    if (e.key === "s") {
      whenStop();
    }
  });

  init();
  loop();
};

const whenStop = () => {
  tensuu = 100 - Math.abs(nomoto.x - mikio.x - 200);
  if (tensuu < 0) {
    tensuu = 0;
  }
  localStorage.countpoint = localStorage.countpoint - 0 + (tensuu - 0);
  localStorage.counttime++;
  avg =
    Math.floor((localStorage.countpoint / localStorage.counttime) * 10) / 10;

  fetch("/api/average", { method: "POST", body: JSON.stringify({ point: tensuu }), headers: { "content-type": "application/json" } }).then(x => x.text()).then(x => console.log(x));

  switch (tensuu) {
    case 100:
    case 90:
    case 80:
      review = "無駄な才能が一つ見つかったねwwwwwwwww";
      break;

    case 70:
      review = "普通だねwwwwwwwwww";
      break;

    default:
      review = "ざっこwwwwwwww";
  }
  canMove = !canMove;
  Swal.fire({
    title: tensuu + "点!!!" + review,
    text: "平均点:" + avg,
    confirmButtonText: "もう一回遊べるドン！",
    confirmButtonColor: "#f31931",
    showClass: {
      popup: "animate__animated animate__zoomIn",
    },
    hideClass: {
      popup: "animate__animated animate__zoomOut",
    },
  }).then((result) => {
    location.reload();
  });
};

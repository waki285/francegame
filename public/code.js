const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 900;
canvas.height = 400;
canvas.setAttribute(
  "style",
  "display:block;margin:auto;background-color: #ffffff"
);

const waitWhile = (condition) => {
  console.log(bothStopped);
  console.log(enemyPoint)
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      if (condition()) {
        clearInterval(interval);
        resolve();
      }
    }, 100);
  });
};

var hWid = 100;
var canMove = true;
var tensuu;
var review;
let heartbeat;
let enemyPoint;
let enemyname;
let bothStopped = false;
let meStopped = false;
let gameRoomId;
var canStart = false;
var moreEnter = 1;
var fin = 0;
let InvisibleStyle = "#ffffff";
var country = "france";
var avg;
var kari;
var italyCo = 0;
var gameStart = document.querySelector("#gameStart");
var flagStop = document.querySelector("#flagStop");
var game = document.querySelector("#game");
var how = document.querySelector("#howTo");
const battleStart = document.querySelector("#battleStart");
const createRoom = document.querySelector("#createRoom");
const joinRoom = document.querySelector("#joinRoom");
var worldaverage = document.getElementById("worldaverage");
if (!localStorage.username) {
  let name;
  while (!name) {
    name = prompt("あなたの名前を入力してください(入力しない場合「匿名」)", "匿名");
  }
  localStorage.username = name;
}
if (location.href.includes("github") && !location.href.includes("preview")) location.href = "https://francegame.vercel.app";
fetch("/api/average")
  .then(x => x.json()).then(x => worldaverage.innerText = Math.round(x.average));
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
    <p>Sを押す(スマホの場合画面タップ)と国旗がストップします</p>
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
battleStart.addEventListener("click", (e) => {
  e.preventDefault();
  battleStart.setAttribute("disabled", "disabled");
  Swal.fire({
    html: `
    <div style="color:black">
    <h2 id="finding">相手を探しています。</h2>
    <p id="findingtext">お待ちください...</p>
    </div>
    `,
    showConfirmButton: false,
    showCancelButton: true,
    cancelButtonText: "キャンセル",
    width: "40rem",
    allowOutsideClick: false,
    background:
      "linear-gradient(90deg, #002780 0%, #002780 33.3%, #ffffff 33.3%, #ffffff 66.6%, #f31931 66.6%, #f31931 100%)",
    showClass: {
      popup: "animate__animated animate__zoomInUp animate__fast",
    },
    hideClass: {
      popup: "animate__animated animate__zoomOutDown animate__fast",
    },
  })
  .then((result) => {
    if (result.dismiss === Swal.DismissReason.cancel) {
      ws.close();
      battleStart.removeAttribute("disabled");
    }
  });
  const ws = new WebSocket(`ws${location.protocol.includes("https") ? "s" : ""}://${location.hostname}:5001`);
  ws.addEventListener("open", (e) => {
    ws.send(JSON.stringify({ type: "join", username: localStorage.username, pid: localStorage.pid }));
    heartbeat = setInterval(() => {
      try {
        ws.send(JSON.stringify({ type: "heartbeat" }));
      } catch (e) {
        console.error(e);
        alert("エラーが発生しました。");
      }
    }, 10000);
  });
  ws.addEventListener("message", (e) => {
    const data = JSON.parse(e.data);
    if (data.type === "ready") {
      gameRoomId = data.gameRoomId;
      document.querySelector(".swal2-cancel").disabled = true
      document.getElementById("finding").innerText = "相手が見つかりました！";
      document.getElementById("findingtext").innerText = "3";
      setTimeout(() => {
        document.getElementById("findingtext").innerText = "2";
      }, 1000);
      setTimeout(() => {
        document.getElementById("findingtext").innerText = "1";
      }, 2000);
      setTimeout(() => {
        document.getElementById("findingtext").innerText = "スタート！";
        bStart();
      }, 3000);
    } else if (data.type === "enemyPoint") {
      if (meStopped) {
        bothStopped = true;
      }
      enemyPoint = data.point;
      enemyname = data.username;
    }
  });
  function bStart() {
    Swal.close();
    setTimeout(() => {
      run(ws);
    }, 1000)
  }
});
if (isNaN(localStorage.countpoint)) {
  localStorage.countpoint = 0;
  localStorage.counttime = 0;
}
if (!localStorage.pid) {
  localStorage.pid = Math.random().toString(36).slice(-8);
}
const spx2 = document.diff.spx2;
const ita = document.diff.ita;
const inv = document.diff.inv;

if (localStorage.getItem("1.5") === "true") spx2.checked = true;
if (localStorage.getItem("world")) [...ita].find(x => x.value === localStorage.getItem("world")).selected = true;
if (localStorage.getItem("invisible") === "true") inv.checked = true;

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
    } else if (country === "cote") {
      ctx.fillStyle = "#f77f00";
    } else if (country == "invisible") {
      ctx.fillStyle = InvisibleStyle;
    } else if (country === "romania") {
      ctx.fillStyle = "#002b7f";
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
    } else if (country === "cote") {
      ctx.fillStyle = "#009e60";
    } else if (country == "invisible") {
      ctx.fillStyle = InvisibleStyle;
    } else if (country === "romania") {
      ctx.fillStyle = "#ce1126";
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
const France = () => {
  country = "france";
}
const Italy = () => {
  country = "italy";
};
const Cote = () => country = "cote";
const Romania = () => {
  country = "romania";
  canvas.style.backgroundColor = "#fcd116";
  InvisibleStyle = "#fcd116";
}
const countries = [France, Italy, Cote, Romania];


const Invisible = () => {
  country = "invisible";
};

let isAllowed = true;

const run = (socket) => {
  game.insertBefore(canvas, flagStop);
  localStorage.setItem("1.5", spx2.checked);
  localStorage.setItem("world", ita.value);
  localStorage.setItem("invisible", inv.checked);
  if (spx2.checked) {
    mikio.speed = 15;
  }
  if (ita.value === "italy") {
    Italy();
  } else if (ita.value === "random") {
    countries[Math.floor(Math.random() * countries.length)]();
  } else if (ita.value === "cote") {
    Cote();
  } else if (ita.value === "romania") {
    Romania();
  }
  if (inv.checked) {
    Invisible();
  }
  moreEnter--;
  document.getElementById("start").style.display = "none";
  document.getElementById("game").style.display = "inline-block";

  document.body.addEventListener("keydown", (e) => {
    if (!isAllowed) return;
    if (e.key === "s") {
      isAllowed = false;
      whenStop(socket);
    }
  });
  document.body.addEventListener("touchstart", (e) => {
    if (!isAllowed) return;
    isAllowed = false;
    whenStop(socket);
  })

  init();
  loop();
};

/** @param {WebSocket} socket */
const whenStop = async (socket) => {
  tensuu = 100 - Math.abs(nomoto.x - mikio.x - 200);
  if (tensuu < 0) {
    tensuu = 0;
  }
  localStorage.countpoint = localStorage.countpoint - 0 + (tensuu - 0);
  localStorage.counttime++;
  avg =
    Math.floor((localStorage.countpoint / localStorage.counttime) * 10) / 10;

  fetch("/api/average", { method: "POST", body: JSON.stringify({ point: tensuu, username: localStorage.username }), headers: { "content-type": "application/json" } }).then(x => x.text()).then(x => console.log(x));

  if (tensuu === 70) review = "普通だねwwwwwwwwww";
  else if (tensuu > 70) review = "無駄な才能が一つ見つかったねwwwwwwwww";
  else review = "ざっこwwwwwwww";
  canMove = !canMove;
  if (!socket) {
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
      allowOutsideClick: () => false
    }).then((result) => {
      isAllowed = false;
      location.reload();
    });
  } else {
    meStopped = true;
    socket.send(JSON.stringify({ type: "stop", point: tensuu, gameRoomId, pid: localStorage.pid }));
    if (bothStopped) {
      socket.close();
      Swal.fire({
        title: tensuu + "点!!!" + review,
        text: "相手: " + enemyPoint + "点\n\n" + (tensuu > enemyPoint ? "勝ち" : tensuu === enemyPoint ? "引き分け" : "負け"),
        confirmButtonText: "もう一回遊べるドン！",
        confirmButtonColor: "#f31931",
        showClass: {
          popup: "animate__animated animate__zoomIn",
        },
        hideClass: {
          popup: "animate__animated animate__zoomOut",
        },
        allowOutsideClick: () => false
      }).then((result) => {
        isAllowed = false;
        location.reload();
      });
    } else {
      Swal.fire({
        title: tensuu + "点!!!" + review,
        html: `<p id="rr">相手が終わるまでお待ち下さい</p>`,
        confirmButtonText: "もう一回遊べるドン！",
        confirmButtonColor: "#f31931",
        showClass: {
          popup: "animate__animated animate__zoomIn",
        },
        hideClass: {
          popup: "animate__animated animate__zoomOut",
        },
        allowOutsideClick: () => false
      }).then((result) => {
        isAllowed = false;
        location.reload();
      });
      await waitWhile(() => bothStopped || enemyPoint !== undefined);
      document.getElementById("rr").innerText = `相手(${enemyname}): ` + enemyPoint + "点\n\n" + (tensuu > enemyPoint ? "勝ち" : tensuu === enemyPoint ? "引き分け" : "負け");
      socket.close();
    }
  }
};

const numGerbong = 10;
let offset, speed, trainElement, button, kedipInterval, lampuAktif = 0;

// Onload: buat kereta dan atur state awal (palang tertutup)
window.onload = () => {
  createTrain();
  // TODO: Atur posisi awal palang ke tertutup jika diperlukan
};

function createTrain() {
  trainElement = document.getElementById('train');
  trainElement.innerHTML = "";
  const locomotive = document.createElement('img');
  locomotive.src = '/gambar/lokomotif.png';
  locomotive.alt = 'Lokomotif';
  trainElement.appendChild(locomotive);
  for (let i = 0; i < numGerbong; i++) {
    const gerbong = document.createElement('img');
    gerbong.src = '/gambar/gerbong.png';
    gerbong.alt = 'Gerbong ' + (i + 1);
    trainElement.appendChild(gerbong);
  }
}

function startTrain() {
  button = document.getElementById('startButton');
  button.disabled = true;
  press.disabled = true;
  const palang = document.getElementById('palang');

  mulaiKedip();
  palang.style.transform = 'rotate(0deg)'; // Turunkan palang
  
  const sirine = document.getElementById('sirine');
  sirine.currentTime = 0; 
  sirine.playbackRate = 2;
  sirine.play();
  
  setTimeout(() => {
    trainElement.style.display = 'block';
    offset = window.innerHeight;
    speed = 30;
    requestAnimationFrame(animateTrain);
    const sepur = document.getElementById('suaraKereta');
    sepur.currentTime = 2;
    sepur.play();
  }, 4000);
}

function animateTrain() {
  offset -= speed;
  trainElement.style.transform = `translateX(-50%) translateY(${offset}px)`;
  if (offset > -trainElement.offsetHeight) {
    requestAnimationFrame(animateTrain);
  } else {
    trainElement.style.display = 'none';
    trainElement.style.transform = 'translateX(-50%) translateY(100vh)';
    setTimeout(berhentiKedip, 4000);
    setTimeout(() => document.getElementById('palang').style.transform = 'rotate(-60deg)', 1000);
    setTimeout(() => {
      const audio = document.getElementById('sirine');
      audio.pause();
      audio.currentTime = 0;
      button.disabled = false;
      press.disabled = false;
    }, 4000);
  }
}

function mulaiKedip() {
  const lampu1 = document.getElementById('lampu1'),
        lampu2 = document.getElementById('lampu2');
  lampuAktif = 0;
  kedipInterval = setInterval(() => {
    if (lampuAktif === 0) {
      lampu1.style.opacity = '1';
      lampu1.style.boxShadow = "0 0 20px red";
      lampu2.style.opacity = '0.2';
      lampu2.style.boxShadow = "0 0 5px red";
      lampuAktif = 1;
    } else {
      lampu1.style.opacity = '0.2';
      lampu1.style.boxShadow = "0 0 5px red";
      lampu2.style.opacity = '1';
      lampu2.style.boxShadow = "0 0 20px red";
      lampuAktif = 0;
    }
  }, 500);
}

function berhentiKedip() {
  clearInterval(kedipInterval);
  document.getElementById('lampu1').style.opacity = '0.2';
  document.getElementById('lampu2').style.opacity = '0.2';
}

// Animasi lompat/wave
const press = document.getElementById("press"),
      lampu = document.getElementById("tiang-lampu"),
      blink = document.getElementById("lampu-container"),
      suaraLompat = document.getElementById("suaraLompat"),
      suaraGoyang = document.getElementById("suaraGoyang");
suaraGoyang.playbackRate = 0.8;
let toggle = true, isAnimating = false;

press.addEventListener("click", () => {
  if (isAnimating) return;
  isAnimating = true;
  let anim = toggle ? "lompat" : "wave",
      suara = toggle ? suaraLompat : suaraGoyang;
  lampu.style.animation = `${anim} 1s linear`;
  blink.style.animation = `${anim} 1s linear`;
  suara.play();
  setTimeout(() => {
    lampu.style.animation = blink.style.animation = "none";
    isAnimating = false;
    toggle = !toggle;
  }, 1000);
});

// Tombol Lonceng & Peluit dengan pemutaran audio
const tombolLonceng = document.getElementById("tombolLonceng"),
      tombolPeluit = document.getElementById("tombolPeluit"),
      suaraLonceng = document.getElementById("suaraLonceng"),
      suaraPeluit = document.getElementById("suaraPeluit");
const statusAudio = new Map();

function mainkanSuara(audio, tombol) {
  if (statusAudio.get(audio)) return;
  statusAudio.set(audio, true);
  tombol.style.display = "none";
  audio.currentTime = 0;
  audio.play();
  audio.onended = () => {
    tombol.style.display = "inline-block";
    statusAudio.set(audio, false);
  };
}

tombolLonceng.addEventListener("click", () => mainkanSuara(suaraLonceng, tombolLonceng));
tombolPeluit.addEventListener("click", () => mainkanSuara(suaraPeluit, tombolPeluit));

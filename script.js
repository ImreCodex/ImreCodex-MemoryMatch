const gameBoard = document.getElementById("gameBoard");

const cardImages = [
  "1.png", "2.png", "3.png", "4.png", "5.png",
  "6.png", "7.png", "8.png", "9.png", "10.png"
];

let cards = [];
let jatekMod = 2;
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let jatekos = 1;
let pont1 = 0;
let pont2 = 0;
let nev1 = "Játékos 1";
let nev2 = "Játékos 2";
let startTime = null;
let timerInterval = null;

// Nevek visszatöltése
document.getElementById("nev1").value = localStorage.getItem("nev1") || "";
document.getElementById("nev2").value = localStorage.getItem("nev2") || "";

// Legjobb idő megjelenítése, ha van
const bestTime = localStorage.getItem("bestTime");
if (bestTime) {
  const idoDiv = document.createElement("div");
  idoDiv.id = "rekordIdo";
  idoDiv.style.color = "#0f0";
  idoDiv.style.marginTop = "8px";
  idoDiv.textContent = `🏆 Legjobb idő: ${bestTime} mp`;
  document.getElementById("idoKijelzo").parentNode.insertBefore(idoDiv, document.getElementById("idoKijelzo").nextSibling);
};

document.getElementById("jatekosMod").addEventListener("change", function () {
  jatekMod = parseInt(this.value);
  document.getElementById("nev2").style.display = jatekMod === 1 ? "none" : "inline-block";
  ujrainditJatekot();
});

document.getElementById("ujJatek").addEventListener("click", ujrainditJatekot);

function hozzaadKep(imageUrl, containerId) {
  const container = document.getElementById(containerId);
  const img = document.createElement("img");
  const cleanedUrl = imageUrl.slice(5, -2); // "url("...")" levágása
  img.src = cleanedUrl;
  img.alt = "Szerzett kártya";
  container.appendChild(img);
}

function handleFlip() {
  if (lockBoard || this.classList.contains("flip")) return;

  this.classList.add("flip");

  if (!firstCard) {
    firstCard = this;
  } else {
    secondCard = this;
    checkForMatch();
  }
}

function checkForMatch() {
  const img1 = firstCard.querySelector(".card-front").style.backgroundImage;
  const img2 = secondCard.querySelector(".card-front").style.backgroundImage;
  const cleanedUrl = img1.slice(5, -2);

  if (img1 === img2) {
    if (jatekMod === 2) {
      if (jatekos === 1) {
        pont1++;
        document.getElementById("pont1").textContent = pont1;
        hozzaadKep(img1, "kepek1");
      } else {
        pont2++;
        document.getElementById("pont2").textContent = pont2;
        hozzaadKep(img1, "kepek2");
      }
    } else {
      hozzaadKep(img1, "kepek1");
    }

    // 👉 Nem engedjük többé kattintani rá
    firstCard.removeEventListener("click", handleFlip);
    secondCard.removeEventListener("click", handleFlip);

    resetCards();
  } else {
    lockBoard = true;
    setTimeout(() => {
      firstCard.classList.remove("flip");
      secondCard.classList.remove("flip");

      if (jatekMod === 2) {
        jatekos = jatekos === 1 ? 2 : 1;
        document.getElementById("kiJon").textContent = `Játékos ${jatekos}`;
      }

      resetCards();
    }, 1000);
  }

  ellenorizVeget();
}

function resetCards() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function ujrainditJatekot() {
  gameBoard.innerHTML = '';
  document.getElementById("gyoztes").textContent = '';
  document.getElementById("kepek1").innerHTML = '';
  document.getElementById("kepek2").innerHTML = '';

  pont1 = 0;
  pont2 = 0;
  jatekos = 1;

  nev1 = document.getElementById("nev1").value || "Játékos 1";
  nev2 = document.getElementById("nev2").value || "Játékos 2";

  document.getElementById("pont1").textContent = '0';
  document.getElementById("pont2").textContent = '0';
  document.getElementById("kiJon").textContent = 'Játékos 1';

  document.getElementById("j1").innerHTML = `👤 ${nev1}: <span id="pont1">0</span><div id="kepek1" class="kepek-gyujto"></div>`;
  document.getElementById("j2").innerHTML = `👤 ${nev2}: <span id="pont2">0</span><div id="kepek2" class="kepek-gyujto"></div>`;

  document.getElementById("j1").style.display = jatekMod === 1 ? "block" : "block";
  document.getElementById("j2").style.display = jatekMod === 1 ? "none" : "block";
  document.getElementById("aktualis").style.display = jatekMod === 1 ? "none" : "block";

  cards = shuffle([...cardImages, ...cardImages]);
  cards.forEach((image) => {
    const card = document.createElement("div");
    card.classList.add("card");

    const inner = document.createElement("div");
    inner.classList.add("card-inner");

    const front = document.createElement("div");
    front.classList.add("card-front");
    front.style.backgroundImage = `url('images/${image}')`;

    const back = document.createElement("div");
    back.classList.add("card-back");

    inner.appendChild(front);
    inner.appendChild(back);
    card.appendChild(inner);
    gameBoard.appendChild(card);

    card.addEventListener("click", handleFlip);
  });
  clearInterval(timerInterval);
   document.getElementById("idoKijelzo").textContent = "⏳ Idő: 0 mp";

   if (jatekMod === 1) {
    startTime = Date.now();
    timerInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    document.getElementById("idoKijelzo").textContent = `⏳ Idő: ${elapsed} mp`;
    }, 1000);
  } else {
    document.getElementById("idoKijelzo").textContent = "";
  }
  localStorage.setItem("nev1", document.getElementById("nev1").value);
  localStorage.setItem("nev2", document.getElementById("nev2").value);
}

function ellenorizVeget() {
  const osszesFelfedett = document.querySelectorAll(".flip");
  if (osszesFelfedett.length === cards.length) {
    let gyoztesSzoveg = '';
    if (pont1 > pont2) {
      gyoztesSzoveg = `🥇 ${nev1} nyert!`+ ' ' +  pont1;
    } else if (pont2 > pont1) {
      gyoztesSzoveg = `🥇 ${nev2} nyert!`+ ' ' +  pont2;
    } else {
      gyoztesSzoveg = "🤝 Döntetlen!";
    }
    document.getElementById("gyoztes").textContent = gyoztesSzoveg;
  }
  if (jatekMod === 1) {
    clearInterval(timerInterval);
    const finalTime = Math.floor((Date.now() - startTime) / 1000);
    document.getElementById("gyoztes").textContent = `🏁 Gratulálunk! Teljesítve: ${finalTime} másodperc alatt!`;
     const bestTime = localStorage.getItem("bestTime");
  if (!bestTime || finalTime < bestTime) {
    localStorage.setItem("bestTime", finalTime);
    document.getElementById("gyoztes").textContent = `🏁 Új rekord! Teljesítve: ${finalTime} mp alatt!`;
  } else {
    document.getElementById("gyoztes").textContent = `🏁 Teljesítve: ${finalTime} mp alatt!`;
  }
}

}
function toggleMenu() {
    const menu = document.getElementById("menu");
    const icon = document.getElementById("menuIcon");

    menu.classList.toggle("show");
	 icon.classList.toggle("open");

    if (menu.classList.contains("show")) {
        icon.textContent = "✖";
    } else {
        icon.textContent = "☰";
    }
}

function showPage(pageId) {
    fetch(`pages/${pageId}.html`)
        .then(res => res.text())
        .then(html => {
            document.getElementById("content").innerHTML = html;
			initMemePage();
        })
        .catch(err => {
            document.getElementById("content").innerHTML = "<p>Lỗi tải trang</p>";
            console.error(err);
        });
}

function handleMenuClick(pageId) {
    // Nếu bạn dùng web không reload (showPage)
    if (typeof showPage === "function") {
        showPage(pageId);
    }

    const menu = document.getElementById("menu");
    const icon = document.getElementById("menuIcon");

    // Đóng menu
    menu.classList.remove("show");
    icon.classList.remove("open");
    icon.textContent = "☰";
}

window.addEventListener("load", () => {
    showPage("home");
});

function initMemePage() {
  const grid = document.getElementById("memeGrid");
  if (!grid) return;

  const TOTAL_MEMES = 1;

  for (let i = 1; i <= TOTAL_MEMES; i++) {
    const imgSrc = `/assets/images/mm${i}.jpg`;
    const soundSrc = `/assets/sounds/smm${i}.mp3`;

    const card = document.createElement("div");
    card.className = "meme-card";

    const audioId = "sound" + i;

    card.innerHTML = `
      <img src="${imgSrc}" alt="Meme ${i}">
      <h3>Meme #${i}</h3>
      <audio id="${audioId}" src="${soundSrc}"></audio>
      <button onclick="document.getElementById('${audioId}').play()">
        ▶ Phát
      </button>
    `;

    grid.appendChild(card);
  }
}



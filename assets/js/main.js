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

let currentMemePage = 1;

function initMemePage() {
  const grid = document.getElementById("memeGrid");
  if (!grid) return;

  const TOTAL_MEMES = 200; // <<< tổng số meme bạn có

  const isMobile = window.innerWidth <= 768;

  const memesPerRow = isMobile ? 3 : 7;
  const maxRows = isMobile ? 20 : 25;
  const memesPerPage = memesPerRow * maxRows;

  const totalPages = Math.ceil(TOTAL_MEMES / memesPerPage);

  function renderPage(page) {
    grid.innerHTML = "";

    const start = (page - 1) * memesPerPage + 1;
    const end = Math.min(start + memesPerPage - 1, TOTAL_MEMES);

    for (let i = start; i <= end; i++) {
      const imgSrc = `/assets/images/mm${i}.jpg`;
      const soundSrc = `/assets/sounds/smm${i}.mp3`;

      const card = document.createElement("div");
      card.className = "meme-card";

      const audioId = "sound" + i;

      card.innerHTML = `
        <img src="${imgSrc}" alt="Meme ${i}" style="width:100%; border-radius:8px;">
        <h4>Meme #${i}</h4>
        <audio id="${audioId}" src="${soundSrc}"></audio>
        <button onclick="document.getElementById('${audioId}').play()">
          ▶
        </button>
      `;

      grid.appendChild(card);
    }

    const pageInfo = document.getElementById("pageInfo");
    if (pageInfo) {
      pageInfo.textContent = `Trang ${page} / ${totalPages}`;
    }
  }

  renderPage(currentMemePage);

  const prevBtn = document.getElementById("prevPage");
  const nextBtn = document.getElementById("nextPage");

  if (prevBtn) {
    prevBtn.onclick = () => {
      if (currentMemePage > 1) {
        currentMemePage--;
        renderPage(currentMemePage);
      }
    };
  }

  if (nextBtn) {
    nextBtn.onclick = () => {
      if (currentMemePage < totalPages) {
        currentMemePage++;
        renderPage(currentMemePage);
      }
    };
  }
}





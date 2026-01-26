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

            if (pageId === "meme") {
                initMemePage();
            }
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
  const pagination = document.getElementById("memePagination");
  if (!grid || !pagination) return;

  const isMobile = window.innerWidth <= 768;
  const memesPerRow = isMobile ? 3 : 7;
  const maxRows = isMobile ? 20 : 25;
  const memesPerPage = memesPerRow * maxRows;

  const MAX_MEMES = 10; // số lớn, chỉ để quét
  let existingMemes = [];

  // 🔍 QUÉT MEME THẬT
  let loaded = 0;

  for (let i = 1; i <= MAX_MEMES; i++) {
    const img = new Image();
    img.src = `/assets/images/mm${i}.jpg`;

    img.onload = () => {
      existingMemes.push(i);
      loaded++;
      checkDone();
    };

    img.onerror = () => {
      loaded++;
      checkDone();
    };
  }

  function checkDone() {
    if (loaded === MAX_MEMES) {
      existingMemes.sort((a, b) => a - b);
      renderPage(currentMemePage);
    }
  }

  function renderPage(page) {
    grid.innerHTML = "";

    const totalPages = Math.ceil(existingMemes.length / memesPerPage);

    // ⚠️ Nếu không có meme → ẨN HẾT PHÂN TRANG
    if (existingMemes.length === 0) {
      pagination.innerHTML = "<p>Chưa có meme nào 😢</p>";
      return;
    }

    if (page > totalPages) page = totalPages;
    if (page < 1) page = 1;

    currentMemePage = page;

    const startIndex = (page - 1) * memesPerPage;
    const pageMemes = existingMemes.slice(
      startIndex,
      startIndex + memesPerPage
    );

    pageMemes.forEach(i => {
      const imgSrc = `/assets/images/mm${i}.jpg`;
      const soundSrc = `/assets/sounds/smm${i}.mp3`;

      const card = document.createElement("div");
      card.className = "meme-card";

      const img = document.createElement("img");
      img.src = imgSrc;

      const title = document.createElement("h4");
      title.textContent = `Meme #${i}`;

      const audio = document.createElement("audio");
      audio.src = soundSrc;

      const btn = document.createElement("button");
      btn.textContent = "▶";
      btn.onclick = () => audio.play();

      card.appendChild(img);
      card.appendChild(title);
      card.appendChild(audio);
      card.appendChild(btn);

      grid.appendChild(card);
    });

    renderPagination(totalPages);
  }

  function renderPagination(totalPages) {
    pagination.innerHTML = "";

    const makeBtn = (text, p, active = false) => {
      const b = document.createElement("button");
      b.textContent = text;
      b.className = active ? "active" : "";
      b.onclick = () => renderPage(p);
      return b;
    };

    pagination.appendChild(makeBtn("‹ Trở về", currentMemePage - 1));
    pagination.appendChild(makeBtn("Đầu", 1));

    let start = Math.max(1, currentMemePage - 4);
    let end = Math.min(totalPages, currentMemePage + 4);

    if (start > 1) pagination.appendChild(document.createTextNode(" ... "));

    for (let i = start; i <= end; i++) {
      pagination.appendChild(makeBtn(i, i, i === currentMemePage));
    }

    if (end < totalPages) pagination.appendChild(document.createTextNode(" ... "));

    pagination.appendChild(makeBtn("Cuối", totalPages));
    pagination.appendChild(makeBtn("Tiếp theo ›", currentMemePage + 1));
  }
}


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

  const TOTAL_MEMES = 1000; // để lớn, chỉ hiện meme có thật

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

      const img = document.createElement("img");
      img.src = imgSrc;
      img.style.width = "100%";
      img.style.borderRadius = "8px";

      img.onerror = () => card.remove();

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
    }

    renderPagination(page);
  }

  function renderPagination(page) {
    pagination.innerHTML = "";

    const makeBtn = (text, p, active = false) => {
      const b = document.createElement("button");
      b.textContent = text;
      b.className = "page-btn" + (active ? " active" : "");
      b.onclick = () => {
        currentMemePage = p;
        renderPage(p);
      };
      return b;
    };

    // Trở về + Đầu
    pagination.appendChild(makeBtn("‹ Trở về", Math.max(1, page - 1)));
    pagination.appendChild(makeBtn("Đầu", 1));

    let start = Math.max(1, page - 4);
    let end = Math.min(totalPages, page + 4);

    if (start > 1) pagination.appendChild(document.createTextNode(" ... "));

    for (let i = start; i <= end; i++) {
      pagination.appendChild(makeBtn(i, i, i === page));
    }

    if (end < totalPages) pagination.appendChild(document.createTextNode(" ... "));

    pagination.appendChild(makeBtn("Cuối", totalPages));
    pagination.appendChild(makeBtn("Tiếp theo ›", Math.min(totalPages, page + 1)));
  }

  renderPage(currentMemePage);
}

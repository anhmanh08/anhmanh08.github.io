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
			if (pageId === "rename") {
    initRenamePage();
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
let existingMemes = [];
let memeNames = {};
let allMemesForRandom = [];


function initMemePage() {
  currentMemePage = 1;   // ✅ RESET PAGE
  existingMemes = [];
  const grid = document.getElementById("memeGrid");
  const pagination = document.getElementById("memePagination");
  const loadingEl = document.getElementById("memeLoading");
  const randomBtn = document.getElementById("randomDailyBtn");
  if (randomBtn) {
    randomBtn.onclick = randomDailyMeme;
	randomBtn.disabled = true;
  const today = new Date().toDateString();
  const last = localStorage.getItem("dailyMemeDate");

  if (last === today) {
    randomBtn.disabled = true;
    randomBtn.innerText = "✅ Đã random hôm nay";
  } else {
    randomBtn.disabled = false;
    randomBtn.innerText = "🎲 Random Meme Hôm Nay";
  }
  }

  if (!grid || !pagination) return;
  if (loadingEl) loadingEl.style.display = "block";
  const isMobile = window.innerWidth <= 768;
  const memesPerRow = isMobile ? 3 : 7;
  const maxRows = isMobile ? 20 : 25;
  const memesPerPage = memesPerRow * maxRows;

  const MAX_MEMES = 10;
	
// LOAD TÊN MEME TỪ JSON
  fetch("/assets/meme-names.json")
    .then(res => res.json())
	.then(data => {
      memeNames = data;
    })
	.catch(err => {
      console.warn("Không load được meme-names.json", err);
    });
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

    // ✅ BUILD DANH SÁCH CHO POPUP RANDOM
    allMemesForRandom = existingMemes.map(i => ({
      img: `/assets/images/mm${i}.jpg`,
      title: memeNames[i] || `Meme #${i}`,
      sound: `/assets/sounds/smm${i}.mp3`
    }));

    if (loadingEl) loadingEl.style.display = "none";

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
      title.textContent = memeNames[i] || `Meme #${i}`;

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

function randomDailyMeme() {
  const today = new Date().toDateString();
  const last = localStorage.getItem("dailyMemeDate");

  // 🔒 ĐÃ RANDOM HÔM NAY → CHỈ MỞ POPUP, KHÔNG RANDOM LẠI
  if (last === today) {
    openDailyPopupFromStorage();
    return;
  }

  if (!allMemesForRandom || allMemesForRandom.length === 0) {
    alert("Chưa load xong meme 😅");
    return;
  }

  const meme = allMemesForRandom[
    Math.floor(Math.random() * allMemesForRandom.length)
  ];

  localStorage.setItem("dailyMemeDate", today);
  localStorage.setItem("dailyMemeImg", meme.img);
  localStorage.setItem("dailyMemeTitle", meme.title);
  localStorage.setItem("dailyMemeSound", meme.sound);

  openDailyPopup(meme);
  disableDailyBtn();
}

function openDailyPopup(meme) {
  const popup = document.getElementById("dailyMemePopup");
  if (!popup) return; // ✅ Không ở trang meme → bỏ qua

  const img = document.getElementById("popupMemeImg");
  const title = document.getElementById("popupMemeTitle");
  const audio = document.getElementById("popupMemeAudio");

  if (!img || !title) return;

  img.src = meme.img;
  title.innerText = meme.title;
  // 🔊 SET + AUTO PLAY SOUND
  if (audio && meme.sound) {
    audio.src = meme.sound;
    audio.currentTime = 0;

    audio.play().catch(err => {
      console.warn("Autoplay bị chặn bởi trình duyệt:", err);
    });
  }
  popup.style.display = "flex";
}

function openDailyPopupFromStorage() {
  const meme = {
    img: localStorage.getItem("dailyMemeImg"),
    title: localStorage.getItem("dailyMemeTitle"),
    sound: localStorage.getItem("dailyMemeSound")
  };

  if (!meme.img) return;

  openDailyPopup(meme);
}

function closeDailyMemePopup() {
  const popup = document.getElementById("dailyMemePopup");
  const audio = document.getElementById("popupMemeAudio");

  if (!popup) return;

  // 🔇 STOP SOUND
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
  }

  popup.style.display = "none";
}

function disableDailyBtn() {
  const btn = document.getElementById("randomDailyBtn");
  if (!btn) return;

  btn.disabled = true;
  btn.innerText = "✅ Đã random hôm nay";
}

function initRenamePage() {

    let matchedFiles = [];

    const previewBtn = document.getElementById("previewBtn");
    const renameBtn = document.getElementById("renameBtn");

    if (!previewBtn || !renameBtn) return;

    previewBtn.onclick = function () {
        const files = document.getElementById("fileInput").files;
        const findNumber = document.getElementById("findNumber").value;
        const fileList = document.getElementById("fileList");

        fileList.innerHTML = "";
        matchedFiles = [];

        if (!files.length) {
            alert("Chọn file trước 😅");
            return;
        }

        if (!findNumber) {
            alert("Nhập số cần tìm");
            return;
        }

        for (let file of files) {
            if (file.name.includes(findNumber)) {
                matchedFiles.push(file);

                const div = document.createElement("div");
                div.textContent = file.name;
                fileList.appendChild(div);
            }
        }

        if (matchedFiles.length === 0) {
            fileList.textContent = "Không tìm thấy file nào.";
        }
    };

     renameBtn.onclick = function () {
    const replaceNumber = document.getElementById("replaceNumber").value;
    const findNumber = document.getElementById("findNumber").value;

    if (!replaceNumber) {
        alert("Nhập số thay thế 😎");
        return;
    }

    if (matchedFiles.length === 0) {
        alert("Không có file nào để đổi.");
        return;
    }

    for (let file of matchedFiles) {
        const newName = file.name.replace(findNumber, replaceNumber);

        const link = document.createElement("a");
        link.href = URL.createObjectURL(file); // dùng trực tiếp file
        link.download = newName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};

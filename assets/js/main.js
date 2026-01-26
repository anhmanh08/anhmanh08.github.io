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
        })
        .catch(err => {
            document.getElementById("content").innerHTML = "<p>Lỗi tải trang</p>";
            console.error(err);
        });
}

function handleMenuClick(pageId) {
    if (typeof showPage === "function") {
        showPage(pageId);
    }

    // Nếu là trang meme thì auto load lại meme
    if (pageId === "meme") {
        setTimeout(() => {
            if (typeof loadMemesFromStorage === "function") {
                loadMemesFromStorage();
            }
        }, 200);
    }

    const menu = document.getElementById("menu");
    const icon = document.getElementById("menuIcon");

    menu.classList.remove("show");
    icon.classList.remove("open");
    icon.textContent = "☰";
}

window.addEventListener("load", () => {
    showPage("home");
});

function addMeme() {
    const imgInput = document.getElementById("memeImg");
    const soundInput = document.getElementById("memeSound");

    if (!imgInput || !soundInput) {
        alert("Trang meme chưa được load!");
        return;
    }

    const imgFile = imgInput.files[0];
    const soundFile = soundInput.files[0];

    if (!imgFile || !soundFile) {
        alert("Vui lòng chọn cả ảnh và âm thanh!");
        return;
    }

    const readerImg = new FileReader();
    const readerSound = new FileReader();

    readerImg.onload = () => {
        readerSound.onload = () => {
            const memeData = {
                img: readerImg.result,
                sound: readerSound.result
            };

            saveMemeToStorage(memeData);
            renderMeme(memeData);
        };

        readerSound.readAsDataURL(soundFile);
    };

    readerImg.readAsDataURL(imgFile);

    imgInput.value = "";
    soundInput.value = "";
}

function saveMemeToStorage(meme) {
    const memes = JSON.parse(localStorage.getItem("memes") || "[]");
    memes.push(meme);
    localStorage.setItem("memes", JSON.stringify(memes));
}

function loadMemesFromStorage() {
    const memeGrid = document.getElementById("memeGrid");
    if (!memeGrid) return;

    memeGrid.innerHTML = ""; // Xóa cũ để tránh bị nhân đôi

    const memes = JSON.parse(localStorage.getItem("memes") || "[]");
    memes.forEach(meme => renderMeme(meme));
}

function renderMeme(meme) {
    const memeGrid = document.getElementById("memeGrid");
    if (!memeGrid) return;

    const memeDiv = document.createElement("div");
    memeDiv.style.background = "#222";
    memeDiv.style.padding = "10px";
    memeDiv.style.borderRadius = "10px";
    memeDiv.style.textAlign = "center";

    memeDiv.innerHTML = `
        <img src="${meme.img}" style="width:100%; border-radius:8px;">
        <p>Meme 😂</p>
        <audio src="${meme.sound}"></audio>
        <button>Phát âm thanh</button>
    `;

    const audio = memeDiv.querySelector("audio");
    const btn = memeDiv.querySelector("button");
    btn.onclick = () => audio.play();

    memeGrid.appendChild(memeDiv);
}
window.addMeme = addMeme;
window.loadMemesFromStorage = loadMemesFromStorage;




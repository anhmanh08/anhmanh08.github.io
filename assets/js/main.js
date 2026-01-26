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

    const imgURL = URL.createObjectURL(imgFile);
    const soundURL = URL.createObjectURL(soundFile);

    const memeGrid = document.getElementById("memeGrid");

    const memeDiv = document.createElement("div");
    memeDiv.style.background = "#222";
    memeDiv.style.padding = "10px";
    memeDiv.style.borderRadius = "10px";
    memeDiv.style.textAlign = "center";

    memeDiv.innerHTML = `
        <img src="${imgURL}" style="width:100%; border-radius:8px;">
        <p>Meme mới 😂</p>
        <audio src="${soundURL}"></audio>
        <button>Phát âm thanh</button>
    `;

    const audio = memeDiv.querySelector("audio");
    const btn = memeDiv.querySelector("button");

    btn.onclick = () => audio.play();

    memeGrid.appendChild(memeDiv);

    imgInput.value = "";
    soundInput.value = "";
}

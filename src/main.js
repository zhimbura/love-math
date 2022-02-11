import {Painter} from "./Painter.js";

function b64EncodeUnicode(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
        function toSolidBytes(match, p1) {
            return String.fromCharCode('0x' + p1);
        }));
}

function b64DecodeUnicode(str) {
    return decodeURIComponent(atob(str).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}

function applyFromData(heart) {
    const color = parseInt(document.getElementById("color").value.replace("#", ""), 16)
    const border = parseInt(document.getElementById("border").value.replace("#", ""), 16)
    const name = document.getElementById("name").value
    heart.color = color
    heart.borderColor = border
    heart.setText(name)
}

function makeLink() {
    const color = document.getElementById("color").value.replace("#", "")
    const border = document.getElementById("border").value.replace("#", "")
    const name = document.getElementById("name").value

    const data = {
        color,
        border,
        name
    }
    const encodeData = b64EncodeUnicode(JSON.stringify(data))
    const link = document.getElementById("generatedLink")
    link.href = `${window.location.href}?data=${encodeData}`
    link.innerText = "Скопируй эту ссылку и отправь"
}

document.addEventListener("DOMContentLoaded",  () => {
    const urlParams = new URLSearchParams(window.location.search)
    const data = urlParams.get("data")
    if (data) {
        const parsedData = JSON.parse(b64DecodeUnicode(data))
        document.getElementById("color").value = `#${parsedData.color}`
        document.getElementById("border").value = `#${parsedData.border}`
        document.getElementById("name").value = parsedData.name
        document.getElementById("controls").classList.add("hidden")
    }
    const painter = new Painter(window.innerWidth, window.innerHeight)
    painter.attach(document)
    painter.fill(255, 255, 255)
    const heart1 = painter.makeHeart("Тихон")
    heart1.play()
    console.log(painter)
    applyFromData(heart1)
    document.getElementById("apply").addEventListener("click", () => {
        applyFromData(heart1)
    })
    document.getElementById("makeLink").addEventListener("click", () => {
        makeLink()
    })
})


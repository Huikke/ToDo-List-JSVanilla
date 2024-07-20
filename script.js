const button = document.getElementById("new_entry")
const textbox = document.getElementById("entry_textbox")
const htmlZone = document.getElementById("entries")

const thelist = JSON.parse(localStorage.getItem("data")) || []


const createEntry = () => {
    const entryData = {
        state: false,
        title: textbox.value,
        content: "",
        creation_time: new Date().toISOString(),
        completion_time: null,
    }

    thelist.push(entryData)
    localStorage.setItem("data", JSON.stringify(thelist));
    updateView()

    textbox.value = ""
}

const updateView = () => {
    htmlZone.innerHTML = ""

    thelist.forEach((element) => {
        htmlZone.innerHTML += `<p><input type="checkbox">${element.title}</p>`
    })
}


updateView()

button.addEventListener("click", createEntry)
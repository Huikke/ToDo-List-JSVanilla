const button = document.getElementById("new_entry")
const textbox = document.getElementById("entry_textbox")

const createEntry = () => {
    const htmlZone = document.getElementById("entries")
    const entry = `<p><input type="checkbox">${textbox.value}</p>`
    htmlZone.insertAdjacentHTML("beforeend", entry)

    textbox.value = ""
}

button.addEventListener("click", createEntry)
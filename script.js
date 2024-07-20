const newEntryBtn = document.getElementById("newEntry")
const textbox = document.getElementById("entryTextbox")
const htmlZone = document.getElementById("entries")
const deletePopup = document.getElementById("deletePopup")
const deletePopupMessage = document.getElementById("deletePopupMessage")
const deletePopupDeleteBtn = document.getElementById("deletePopupDeleteBtn")
const deletePopupCancelBtn = document.getElementById("deletePopupCancelBtn")

const thelist = JSON.parse(localStorage.getItem("data")) || []
let idForDelete = null


const createEntry = () => {
  const entryData = {
    state: false,
    title: textbox.value,
    content: "",
    creation_time: new Date().toISOString(),
    completion_time: null,
  }

  thelist.push(entryData)
  update()

  textbox.value = ""
}

const updateState = (element, id) => {
  if (element.checked == true) {
  thelist[id].state = true
  thelist[id].completion_time = new Date().toISOString()
  } else {
  thelist[id].state = false
  thelist[id].completion_time = null
  }
  update()
}

const confirmDelete = (id) => {
  deletePopup.showModal()
  deletePopupMessage.textContent = `${thelist[id].title} will be permanently deleted`
  idForDelete = id
}

// Handles updating both HTML and localStorage
const update = () => {
  htmlZone.innerHTML = ""
  let id = 0

  thelist.forEach((element) => {
    // Handles initial checkbox state
    let checked = ""
    if (thelist[id].state) {
      checked = "checked"
    }

    htmlZone.innerHTML += `
      <div class="entry" id="${id}">
        <p>
          <input type="checkbox" onchange="updateState(this, ${id})" ${checked}>${element.title}
          <button onclick="confirmDelete(${id})">rm</button>
        </p>
      </div>
    `

    id++
  })

  localStorage.setItem("data", JSON.stringify(thelist))
}


update()

newEntryBtn.addEventListener("click", createEntry)

deletePopupDeleteBtn.addEventListener("click", () => {
  thelist.splice(idForDelete, 1)
  update()
  deletePopup.close()
})

deletePopupCancelBtn.addEventListener("click", () => deletePopup.close())
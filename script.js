const newEntryBtn = document.getElementById("newEntryBtn")
const newEntryTb = document.getElementById("newEntryTb")
const newEntryForm = document.getElementById("newEntryForm")
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
    title: newEntryTb.value,
    content: "",
    important: false,
    creation_time: new Date().toISOString(),
    completion_time: null,
  }

  thelist.push(entryData)
  update()

  newEntryTb.value = ""
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

const toggleImportant = (element, id) => {
  thelist[id].important = !thelist[id].important
  update()
}

// Handles updating both HTML and localStorage
const update = () => {
  htmlZone.innerHTML = ""
  let id = 0

  thelist.forEach((element) => {
    // Handles initial checkbox state
    let checked = ""
    let important = ""
    if (thelist[id].state) {
      checked = "checked"
    }
    if (thelist[id].important) {
      important = "important"
    }
    

    htmlZone.innerHTML += `
      <div class="entry" id="${id}">
        <p>
          <input type="checkbox" onchange="updateState(this, ${id})" ${checked}>${element.title}
          <button class="importantBtn ${important}" onclick="toggleImportant(this, ${id})">star</button>
          <button onclick="confirmDelete(${id})">rm</button>
        </p>
      </div>
    `

    id++
  })

  localStorage.setItem("data", JSON.stringify(thelist))
}


update()

newEntryForm.addEventListener("submit", (e) => {
  e.preventDefault()
  createEntry()
})

deletePopupDeleteBtn.addEventListener("click", () => {
  thelist.splice(idForDelete, 1)
  update()
  deletePopup.close()
})

deletePopupCancelBtn.addEventListener("click", () => deletePopup.close())
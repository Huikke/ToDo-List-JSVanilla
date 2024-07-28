const newEntryBtn = document.getElementById("newEntryBtn")
const newEntryTb = document.getElementById("newEntryTb")
const newEntryForm = document.getElementById("newEntryForm")
const htmlZone = document.getElementById("entries")
const deletePopup = document.getElementById("deletePopup")
const deletePopupMessage = document.getElementById("deletePopupMessage")
const deletePopupDeleteBtn = document.getElementById("deletePopupDeleteBtn")
const deletePopupCancelBtn = document.getElementById("deletePopupCancelBtn")
const sbTitle = document.getElementById("sbTitle")
const sbCb = document.getElementById("sbCb")
const sbContent = document.getElementById("sbContent")
const sbImportantBtn = document.getElementById("sbImportantBtn")
const sbDeleteBtn = document.getElementById("sbDeleteBtn")


const thelist = JSON.parse(localStorage.getItem("data")) || []
let currentId = null


const createEntry = () => {
  const entryData = {
    state: false,
    title: newEntryTb.value,
    content: "",
    important: false,
    creation_time: new Date().toISOString(),
    completion_time: null,
    content_edit_time: null,
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
  sbCb.checked = thelist[id].state // Also updates sidebar checkbox
}

const showConfirmDeletePopup = () => {
  deletePopup.showModal()
  deletePopupMessage.textContent = `${thelist[currentId].title} will be permanently deleted`
}

const toggleImportant = (id) => {
  thelist[id].important = !thelist[id].important
  update()

  // For sidebar
  if (thelist[id].important) {
    sbImportantBtn.classList.add("important")
  } else {
    sbImportantBtn.classList.remove("important")
  }
}

const showDetails = (id) => {
  currentId = id

  sbCb.checked = thelist[id].state
  sbTitle.textContent = thelist[id].title
  sbContent.innerHTML = thelist[id].content
  if (thelist[id].important) {
    sbImportantBtn.classList.add("important")
  } else {
    sbImportantBtn.classList.remove("important")
  }
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
      <article class="entry" id="${id}">
          <div class="entryLeft">
            <input class="entryCb" type="checkbox" onchange="updateState(this, ${id})" ${checked}>
            <span class="entryTitle">${element.title}<span>
          </div>
          <div class="entryRight">
            <button class="importantBtn ${important}" onclick="toggleImportant(${id})">star</button>
            <button class="detailsBtn" onclick="showDetails(${id})">...</button>
          </div>
      </article>
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
  thelist.splice(currentId, 1)
  update()
  deletePopup.close()
})

deletePopupCancelBtn.addEventListener("click", () => deletePopup.close())

sbCb.addEventListener("change", () => {
  updateState(sbCb, currentId)
})

sbTitle.addEventListener("blur", () => {
  thelist[currentId].title = sbTitle.textContent
  update()
})

sbContent.addEventListener("blur", () => {
  if (thelist[currentId].content != sbTitle.textContent) {
    thelist[currentId].content_edit_time = new Date().toISOString()
  }
  thelist[currentId].content = sbContent.innerHTML
  update()
})

sbImportantBtn.addEventListener("click", () => {
  toggleImportant(currentId)
})

sbDeleteBtn.addEventListener("click", () => {
  showConfirmDeletePopup()
})
const newEntryBtn = document.getElementById("newEntryBtn")
const newEntryTb = document.getElementById("newEntryTb")
const newEntryForm = document.getElementById("newEntryForm")
const htmlZone = document.getElementById("entries")

const deletePopup = document.getElementById("deletePopup")
const deletePopupMessage = document.getElementById("deletePopupMessage")
const deletePopupDeleteBtn = document.getElementById("deletePopupDeleteBtn")
const deletePopupCancelBtn = document.getElementById("deletePopupCancelBtn")

const detailsSidebar = document.getElementById("detailsSidebar")
const sbTitle = document.getElementById("sbTitle")
const sbCb = document.getElementById("sbCb")
const sbContent = document.getElementById("sbContent")
const sbImportantBtn = document.getElementById("sbImportantBtn")
const sbDeleteBtn = document.getElementById("sbDeleteBtn")
const sbExitBtn = document.getElementById("sbExitBtn")
const dragbar = document.getElementById("dragbar")

const listTitle = document.getElementById("listTitle")
const listDropdownBtn = document.getElementById("listDropdownBtn")
const listDropdownContent = document.getElementById("listDropdownContent")

const thelists = []
const thelist = JSON.parse(localStorage.getItem("data")) || []
let currentId = null
let detailsSbWidth = "400px"


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
  if (currentId !== id) {
    currentId = id
    detailsSidebar.style.transition = "0.5s"
    detailsSidebar.style.width = detailsSbWidth

    sbCb.checked = thelist[id].state
    sbTitle.textContent = thelist[id].title
    sbContent.innerHTML = thelist[id].content
    if (thelist[id].important) {
      sbImportantBtn.classList.add("important")
    } else {
      sbImportantBtn.classList.remove("important")
    }
    window.setTimeout(() => detailsSidebar.style.transition = "0s", 1);
  } else {
    closeDetails()
  }
}

const closeDetails = () => {
  detailsSidebar.style.transition = "0.5s"
  detailsSidebar.style.width = "0"
  currentId = null
  window.setTimeout(() => detailsSidebar.style.transition = "0s", 1);
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

const updateListDropdown = () => {
  listDropdownContent.innerHTML = ""
  let id = 0

  thelists.forEach((element) => {
    listDropdownContent.innerHTML += `
    <li class="list" id="${id}">
      ${element}
    </li>
    `

    id++
  })

  listDropdownContent.innerHTML += `
    <li class="listOption" id="addList" onclick="summonDropdownForm(this)">Add List</li>
    <li class="listOption" id="renameList" onclick="summonDropdownForm(this)">Rename List</li>
    <li class="listOption" id="removeList" onclick="showConfirmDeletePopup()">Remove List</li>
  `
}


update()
updateListDropdown()

newEntryForm.addEventListener("submit", (e) => {
  e.preventDefault()
  createEntry()
})

deletePopupDeleteBtn.addEventListener("click", () => {
  if (currentId != null) {
    thelist.splice(currentId, 1)
    update()
    closeDetails()
  } else {
    console.log("Nothing to remove!")
  }
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

sbExitBtn.addEventListener("click", closeDetails)


const dragbarMove = (event) => {
  let mouseXPos = event.clientX
  if (window.innerWidth - mouseXPos > 200) {
    detailsSidebar.style.width = `${window.innerWidth - mouseXPos}px`
  } else {
    detailsSidebar.style.width = "200px"
  }
}

const dragbarUp = (event) => {
  let mouseXPos = event.clientX
  if (window.innerWidth - mouseXPos > 200) {
    detailsSbWidth = `${window.innerWidth - event.clientX}px`
  } else {
    detailsSbWidth = "200px"
  }

  document.querySelector("body").classList.remove("noSelect")
  document.removeEventListener("mousemove", dragbarMove)
  document.removeEventListener("mouseup", dragbarUp)
}

dragbar.addEventListener("mousedown", () => {
  document.querySelector("body").classList.add("noSelect")
  document.addEventListener("mousemove", dragbarMove)
  document.addEventListener("mouseup", dragbarUp)
})


// Opens list dropdown
listDropdownBtn.addEventListener("click", () => {
  updateListDropdown()
  listDropdownContent.classList.toggle("show")
})

// Closes list dropdown
window.onclick = (event) => {
  if (!event.target.matches(".listDropdownBtn") && !event.target.matches(".listOption")) {
    listDropdownContent.classList.remove("show")
  }
}

const summonDropdownForm = (element) => {
  switch (element.id) {
    case "addList":
      btnText = "Add" 
      break;
    case "renameList":
      btnText = "Rename"
      break;
  }

  element.onclick = null
  element.innerHTML = `
    <form class="" type="submit" onsubmit="${element.id}(event)">
      <input class="dropdownTb" id="${element.id}Tb" type="text">
      <button class="">${btnText}</button>
    </form>
  `
}

const addList = (e) => {
  e.preventDefault()
  thelists.push(document.getElementById("addListTb").value)
  updateListDropdown()
}

const renameList = (e) => {
  e.preventDefault()
  listTitle.textContent = document.getElementById("renameListTb").value
  updateListDropdown()
}
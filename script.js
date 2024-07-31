const newEntryBtn = document.getElementById("newEntryBtn")
const newEntryTb = document.getElementById("newEntryTb")
const newEntryForm = document.getElementById("newEntryForm")
const entriesContainer = document.getElementById("entriesContainer")

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

const data = JSON.parse(localStorage.getItem("toDoListData")) || []

let currentList = 0
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

  data[currentList].entries.push(entryData)
  update()

  newEntryTb.value = ""
}

const updateState = (element, id) => {
  if (element.checked == true) {
    data[currentList].entries[id].state = true
    data[currentList].entries[id].completion_time = new Date().toISOString()
  } else {
    data[currentList].entries[id].state = false
    data[currentList].entries[id].completion_time = null
  }
  update()
  sbCb.checked = data[currentList].entries[id].state // Also updates sidebar checkbox
}

const showConfirmDeletePopup = () => {
  deletePopup.showModal()
  deletePopupMessage.textContent = `${data[currentList].entries[currentId].title} will be permanently deleted`
}

const toggleImportant = (id) => {
  data[currentList].entries[id].important = !data[currentList].entries[id].important
  update()

  // For sidebar
  if (data[currentList].entries[id].important) {
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

    sbCb.checked = data[currentList].entries[id].state
    sbTitle.textContent = data[currentList].entries[id].title
    sbContent.innerHTML = data[currentList].entries[id].content
    if (data[currentList].entries[id].important) {
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
  entriesContainer.innerHTML = ""
  let id = 0

  listTitle.textContent = data[currentList].title

  data[currentList].entries.forEach((element) => {
    // Handles initial checkbox state
    let checked = ""
    let important = ""
    if (data[currentList].entries[id].state) {
      checked = "checked"
    }
    if (data[currentList].entries[id].important) {
      important = "important"
    }
    
    
    entriesContainer.innerHTML += `
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

  localStorage.setItem("toDoListData", JSON.stringify(data))
}

const updateListDropdown = () => {
  listDropdownContent.innerHTML = ""
  let id = 0

  data.forEach((element) => {
    listDropdownContent.innerHTML += `
    <li class="list" id="${id}">
      ${element.title}
    </li>
    `

    id++
  })

  listDropdownContent.innerHTML += `
    <li class="listOption" id="addList" onclick="summonDropdownForm(this)">Add List</li>
    <li class="listOption" id="renameList" onclick="summonDropdownForm(this)">Rename List</li>
    <li class="listOption" id="removeList" onclick="showConfirmDeletePopup()">Remove List</li>
  `

  localStorage.setItem("toDoListData", JSON.stringify(data))
}

newEntryForm.addEventListener("submit", (e) => {
  e.preventDefault()
  createEntry()
})

deletePopupDeleteBtn.addEventListener("click", () => {
  if (currentId != null) {
    data[currentList].entries.splice(currentId, 1)
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
  data[currentList].entries[currentId].title = sbTitle.textContent
  update()
})

sbContent.addEventListener("blur", () => {
  if (data[currentList].entries[currentId].content != sbTitle.textContent) {
    data[currentList].entries[currentId].content_edit_time = new Date().toISOString()
  }
  data[currentList].entries[currentId].content = sbContent.innerHTML
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
  if (!event.target.matches(".listDropdownBtn") && !event.target.matches(".listOption") && !event.target.matches(".ddMenu")) {
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
    <form class="ddMenu" type="submit" onsubmit="${element.id}(event)">
      <input class="dropdownTb ddMenu" id="${element.id}Tb" type="text">
      <button class="ddMenu">${btnText}</button>
    </form>
  `
}
 
// Parameter e serves two purposes: First is as event.
// Second is triggered by false, is used when data is empty, for making the first list
const addList = (e) => {
  let title = ""
  if (e) {
    e.preventDefault()
    title = document.getElementById("addListTb").value;
  } else {
    title = "To Do List"    
  }

  const newList = {
    title: title,
    creation_time: new Date().toISOString(),
    entries: [],
  }

  data.push(newList)
  updateListDropdown()
}

const renameList = (e) => {
  e.preventDefault()
  
  newName = document.getElementById("renameListTb").value
  listTitle.textContent = newName
  data[currentList].title = newName
  updateListDropdown()
}


if (data.length === 0) {
  addList(false)
}

update()
updateListDropdown()
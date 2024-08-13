const listTitle = document.getElementById("listTitle")
const listDropdownBtn = document.getElementById("listDropdownBtn")
const listDropdownContent = document.getElementById("listDropdownContent")

const entriesContainer = document.getElementById("entriesContainer")
const newEntryBtn = document.getElementById("newEntryBtn")
const newEntryTb = document.getElementById("newEntryTb")
const newEntryForm = document.getElementById("newEntryForm")

const detailsSidebar = document.getElementById("detailsSidebar")
const sbCb = document.getElementById("sbCb")
const sbTitle = document.getElementById("sbTitle")
// Sub-entry starts
const sbShowNewSeFormBtn = document.getElementById("sbShowNewSeFormBtn")
const sbSubentriesContainer = document.getElementById("sbSubentriesContainer")
const sbNewSeForm = document.getElementById("sbNewSeForm")
const sbNewSeCb = document.getElementById("sbNewSeCb")
const sbNewSeTb = document.getElementById("sbNewSeTb")
const sbNewSeBtn = document.getElementById("sbNewSeBtn")
// Sub-entry ends
const sbContent = document.getElementById("sbContent")
const sbImportantBtn = document.getElementById("sbImportantBtn")
const sbDeleteBtn = document.getElementById("sbDeleteBtn")
const sbCreationTime = document.getElementById("sbCreationTime")
const sbModificationTime = document.getElementById("sbModificationTime")
const sbCompletionTime = document.getElementById("sbCompletionTime")
const sbExitBtn = document.getElementById("sbExitBtn")
const dragbar = document.getElementById("dragbar")

const delPopup = document.getElementById("delPopup")
const delPopupMsg = document.getElementById("delPopupMsg")
const delPopupDeleteBtn = document.getElementById("delPopupDeleteBtn")
const delPopupCancelBtn = document.getElementById("delPopupCancelBtn")

const data = JSON.parse(localStorage.getItem("toDoListData")) || []

let currentList = 0
let currentId = null
let detailsSbWidth = "400px"
let removeListBool = false



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

const switchList = (id) => {
  currentList = id
  updateEntries()
}



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

  document.getElementById(`${element.id}Tb`).focus()
}



const createEntry = () => {
  const entryData = {
    state: false,
    title: newEntryTb.value,
    subentries: [],
    content: "",
    important: false,
    creation_time: new Date().toISOString(),
    // completion_time: null,
    // modification_time: null,
  }

  data[currentList].entries.push(entryData)
  updateEntries()

  newEntryTb.value = ""
}

newEntryForm.addEventListener("submit", (e) => {
  e.preventDefault()
  createEntry()

  newEntryTb.focus()
})


const toggleImportant = (id) => {
  data[currentList].entries[id].important = !data[currentList].entries[id].important
  updateEntries()

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
    
    updateSubentries()
    updateTimestamp(id)

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
  window.setTimeout(() => sbNewSeForm.classList.remove("showFlex"), 500);
}

sbCb.addEventListener("change", () => {
  updateState(sbCb, currentId)
})

sbTitle.addEventListener("blur", () => {
  if (data[currentList].entries[currentId].title != sbTitle.textContent) {
    data[currentList].entries[currentId].modification_time = new Date().toISOString()
    data[currentList].entries[currentId].title = sbTitle.textContent
    updateEntries()
    updateTimestamp(currentId)
  }
})

sbShowNewSeFormBtn.addEventListener("click", () => {
  sbNewSeForm.classList.add("showFlex")
  sbNewSeTb.focus()
})

sbNewSeForm.addEventListener("submit", (e) => {
  e.preventDefault()
  const subentryData = {
    state: false,
    title: sbNewSeTb.value,
    creation_time: new Date().toISOString(),
    // completion_time: null,
  }

  data[currentList].entries[currentId].subentries.push(subentryData)
  updateSubentries()

  sbNewSeTb.value = ""
})

sbNewSeCb.addEventListener("change", () => {
  sbNewSeCb.checked = false
})

sbContent.addEventListener("blur", () => {
  if (data[currentList].entries[currentId].content != sbContent.textContent) {
    data[currentList].entries[currentId].modification_time = new Date().toISOString()
    data[currentList].entries[currentId].content = sbContent.innerHTML
    updateEntries()
    updateTimestamp(currentId)
  }
})

sbImportantBtn.addEventListener("click", () => {
  toggleImportant(currentId)
})

sbDeleteBtn.addEventListener("click", (event) => {
  showConfirmDeletePopup(event.currentTarget)
})

sbExitBtn.addEventListener("click", closeDetails)



const showConfirmDeletePopup = (element) => {
  let name = ""
  delPopup.showModal()

  if (element.id == "removeList") {
    removeListBool = true
    name = data[currentList].title
  } else {
    name = data[currentList].entries[currentId].title
  }

  delPopupMsg.textContent = `${name} will be permanently deleted`
}

delPopupDeleteBtn.addEventListener("click", () => {
  if (!removeListBool) {
    data[currentList].entries.splice(currentId, 1)
  } else if (removeListBool) {
    if (data.length <= 1) {
      alert("Can't remove the only list!")
    } else {
      data.splice(currentList, 1)
      currentList = 0
    }
  }

  removeListBool = false
  updateEntries()
  closeDetails()
  delPopup.close()
})

delPopupCancelBtn.addEventListener("click", () => {
  removeListBool = false
  delPopup.close()
})



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
    detailsSbWidth = `${window.innerWidth - mouseXPos}px`
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



let moveTargetEl = ""
let moveToIdEl = ""

const moveEntryBegin = (event, element) => {
  moveTargetEl = element.parentElement.parentElement

  moveTargetEl.classList.add("onMove")
  document.addEventListener("mousemove", moveEntryMouseMove)
  document.addEventListener("mouseup", moveEntryEnd)
  moveEntryMouseMove(event)

  for (let id = 0; id < data[currentList].entries.length; id++) {
    document.getElementById(`e${id}`).addEventListener("mouseenter", moveEntryEnterCont)
    document.getElementById(`e${id}`).addEventListener("mouseleave", moveEntryLeaveCont)
  }
}

const moveEntryEnd = () => {
  moveTargetEl.classList.remove("onMove")
  document.removeEventListener("mousemove", moveEntryMouseMove)
  document.removeEventListener("mouseup", moveEntryEnd)

  for (let id = 0; id < data[currentList].entries.length; id++) {
    document.getElementById(`e${id}`).removeEventListener("mouseenter", moveEntryEnterCont)
    document.getElementById(`e${id}`).removeEventListener("mouseleave", moveEntryLeaveCont)
  }

  if (moveToIdEl) {
    startId = Number(moveTargetEl.id.slice(1))
    endId = Number(moveToIdEl.id.slice(1))
    itemToMove = data[currentList].entries[startId]
    
    data[currentList].entries.splice(startId, 1)
    data[currentList].entries.splice(endId, 0, itemToMove)
    updateEntries()
  }
}

const moveEntryMouseMove = (event) => {
  moveTargetEl.style.left = `${event.clientX}px`
  moveTargetEl.style.top = `${event.clientY}px`
}

const moveEntryEnterCont = (event) => {
  moveToIdEl = event.target
  if (Number(moveTargetEl.id.slice(1)) <  Number(moveToIdEl.id.slice(1))) {
    moveToIdEl.style.borderBottomColor = "gold"
  } else if (Number(moveTargetEl.id.slice(1)) > Number(moveToIdEl.id.slice(1))) {
    moveToIdEl.style.borderTopColor = "gold"
  }
}

const moveEntryLeaveCont = () => {
  if (moveToIdEl) {
    moveToIdEl.style.borderTopColor = "rgb(46, 145, 145)"
    moveToIdEl.style.borderBottomColor = "rgb(46, 145, 145)"
  }
  moveToIdEl = ""
}




// Handles updating both HTML and localStorage
const updateEntries = () => {
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
      <article class="entry" id="e${id}">
          <div class="entryLeft">
            <input class="entryCb" type="checkbox" onchange="updateState(this, ${id})" ${checked}>
            <span class="entryTitle">${element.title}<span>
          </div>
          <div class="entryRight">
            <button class="moveBtn" onmousedown="moveEntryBegin(event, this)">↕</button>
            <button class="importantBtn ${important}" onclick="toggleImportant(${id})">star</button>
            <button class="detailsBtn" onclick="showDetails(${id})">...</button>
          </div>
      </article>
    `

    id++
  })

  localStorage.setItem("toDoListData", JSON.stringify(data))
}

const updateSubentries = () => {
  sbSubentriesContainer.innerHTML = ""
  let id = 0

  data[currentList].entries[currentId].subentries.forEach((element) => {
    // Handles initial checkbox state
    let checked = ""
    if (data[currentList].entries[currentId].subentries[id].state) {
      checked = "checked"
    }


    sbSubentriesContainer.innerHTML += `
      <article class="sbSubentry" id="se${id}">
          <div class="sbSubentryLeft">
            <input class="sbSubentryCb" type="checkbox" onchange="updateSubState(this, ${id})" ${checked}>
            <span class="sbSubentryTitle">${element.title}<span>
          </div>
          <button class="sbSubentryDeleteBtn" onclick="">x</button>
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
    <li class="list" id="l${id}" onclick="switchList(${id})">
      ${element.title}
    </li>
    `

    id++
  })

  listDropdownContent.innerHTML += `
    <li class="listOption" id="addList" onclick="summonDropdownForm(this)">Add List</li>
    <li class="listOption" id="renameList" onclick="summonDropdownForm(this)">Rename List</li>
    <li class="listOption" id="removeList" onclick="showConfirmDeletePopup(this)">Remove List</li>
  `

  localStorage.setItem("toDoListData", JSON.stringify(data))
}

const updateState = (element, id) => {
  if (element.checked == true) {
    data[currentList].entries[id].state = true
    data[currentList].entries[id].completion_time = new Date().toISOString()
  } else {
    data[currentList].entries[id].state = false
    data[currentList].entries[id].completion_time = null
  }
  updateEntries()
  if (currentId == id) {
    updateTimestamp(currentId)
    sbCb.checked = data[currentList].entries[id].state // Also updates sidebar checkbox
  }
}

const updateSubState = (element, id) => {
  if (element.checked == true) {
    data[currentList].entries[currentId].subentries[id].state = true
    data[currentList].entries[currentId].subentries[id].completion_time = new Date().toISOString()
  } else {
    data[currentList].entries[currentId].subentries[id].state = false
    data[currentList].entries[currentId].subentries[id].completion_time = null
  }
  updateSubentries()
}

const updateTimestamp = (id) => {
  const creation_time = data[currentList].entries[id].creation_time
  const modification_time = data[currentList].entries[id].modification_time
  const completion_time = data[currentList].entries[id].completion_time
  // If creation_time and modification time is more than 1 minute apart
  const tsDiff = (new Date(modification_time) - new Date(creation_time))/1000

  sbCreationTime.textContent = "Created " + timestampConverter(creation_time)
  if (modification_time && tsDiff > 60) {
      sbModificationTime.textContent = "Modified " + timestampConverter(modification_time)
  } else {
    sbModificationTime.textContent = ""
  }
  if (completion_time) {
    sbCompletionTime.textContent = "Completed " + timestampConverter(completion_time)
  } else {
    sbCompletionTime.textContent = ""
  }
}

const timestampConverter = (ts) => {
  // This solves timezone convertion by default
  const date = new Date(ts);

  return String(date.getDate()).padStart(2, "0") + "." + 
  String(date.getMonth()+1).padStart(2, "0") + "." + 
  date.getFullYear() + " " + 
  String(date.getHours()).padStart(2, "0") + ":" +
  String(date.getMinutes()).padStart(2, "0");
}


if (data.length === 0) {addList(false)}

updateEntries()
updateListDropdown()
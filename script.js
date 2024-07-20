const button = document.getElementById("newEntry")
const textbox = document.getElementById("entryTextbox")
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

const updateState = (element, id) => {
  if (element.checked == true) {
  thelist[id].state = true
  thelist[id].completion_time = new Date().toISOString()
  } else {
  thelist[id].state = false
  thelist[id].completion_time = null
  }
  localStorage.setItem("data", JSON.stringify(thelist));
}

const updateView = () => {
  htmlZone.innerHTML = ""
  let id = 0

  thelist.forEach((element) => {
    // Handles initial checkbox state
    let checked = ""
    if (thelist[id].state) {
      checked = "checked"
    }

    htmlZone.innerHTML += `
      <div id="${id}">
        <p><input type="checkbox" onchange="updateState(this, ${id})" ${checked}>${element.title}</p>
      </div>
    `

    id++
  })
}


updateView()

button.addEventListener("click", createEntry)
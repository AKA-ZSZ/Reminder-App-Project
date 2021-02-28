let createSubtask = document.querySelector(".create__subtask");
let newSubtask = document.querySelector(".new__subtask");
let deleteSubtask = document.querySelector(".delete__subtask");

let createTag = document.querySelector(".create__tag");
let newTag = document.querySelector(".new__tag");
let deleteTag = document.querySelector(".delete__tag");

// ============= create and delete subtask ===============
if (createSubtask) {
  createSubtask.addEventListener("click", () => {
    //`<input type="text" class="form-control mb-1"  name="reminder_subtask" placeholder="Subtask">`;
    let item = document.createElement("input");
    item.setAttribute("class", "form-control mb-1 display__subtask");
    item.setAttribute("type", "text");
    item.setAttribute("name", "reminder_subtask");
    item.setAttribute("placeholder", "Subtask");
    newSubtask.appendChild(item);
  });
}

if (deleteSubtask) {
  deleteSubtask.addEventListener("click", () => {
    if (newSubtask.hasChildNodes()) {
      newSubtask.removeChild(newSubtask.lastChild);
    }
  });
}

// =============== create and delete tag ========================
//reference = https://css-tricks.com/snippets/javascript/random-hex-color/
if (createTag) {
  createTag.addEventListener("click", () => {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    let item = document.createElement("input");
    item.setAttribute("class", "form-control mb-1 display__tag d-inline");
    item.setAttribute("type", "text");
    item.setAttribute("name", "reminder_tag");
    item.style.backgroundColor = "#" + randomColor;
    newTag.appendChild(item);
  });
}

if (deleteTag) {
  deleteTag.addEventListener("click", () => {
    if (newTag.hasChildNodes()) {
      newTag.removeChild(newTag.lastChild);
    }
  });
}

//======== lauch a youtube video
let youtubeVid = document.querySelector(".youtube-vid");

function displayYoutube(link) {
  youtubeVid.innerHTML = ` 
  <iframe id="ytplayer" type="text/html"
  class="youtube__screen" 
  src="https://www.youtube.com/embed/${link}"
  frameborder="0" allowfullscreen>`;
}

//-===== controll visibility =======
let favoriteBtn = document.querySelector(".btn--absolute");
let favoriteList = document.querySelector(".vid");

if (favoriteBtn) {
  favoriteBtn.addEventListener("click", () => {
    favoriteList.classList.toggle("vid__list");
  });
}

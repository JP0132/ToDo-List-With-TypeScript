//Some node modules will just work as it has type script compatible written in it
//Some my require to add the typescript version, hover over it to see
//Some may not have no type script, need to find a work around or find another solution
import { v4 as uuidV4 } from "uuid"

//Created a custom type for task so it can be specified in parameters
type Task = {
  id: string
  title: string
  completed: boolean
  createdAt: Date
}



//<ELEMENT> can specify the type it is getting in type script.
//Not all generic functions can use this example getElementById
//const form = document.getElementById("new_task_form") as HTMLFormElement

const list = document.querySelector<HTMLUListElement>("#list")
//const form = document.querySelector<HTMLFormElement>("#new_task_form")
const form = document.getElementById("new-task-form") as HTMLFormElement | null
const input = document.querySelector<HTMLInputElement>("#new-task")

//Array in typescript, define the type + array symbol []
const tasks: Task[] = loadTasks()

tasks.forEach(addListItem)

form?.addEventListener("submit", e => {
  e.preventDefault()

  //Question mark is optional chaining. If it is not found return undefined
  if(input?.value == "" || input?.value == null) return
  
  const newTask: Task = {
    id: uuidV4(),
    title: input.value,
    completed: false,
    createdAt: new Date()
  }
  tasks.push(newTask)
  
  addListItem(newTask)
  input.value = ""
})

//Parameters must be specified as what kind of type they are
//the boolean specifies what type of return it is
function addListItem(task: Task){
  const item = document.createElement("li")
  const label = document.createElement("label")

  const checkbox = document.createElement("input")

  const span = document.createElement("span")
  span.innerHTML = "\u00d7"

  if(task.completed){
    label.classList.add("checked");
  }
  
  checkbox.addEventListener("change", () => {
    task.completed = checkbox.checked
    if(task.completed){
      label.classList.add("checked")
    }
    else{
      label.classList.remove("checked")
    }
    saveTasks()
  })

  span.addEventListener("click", () =>{
    item.remove()
    deleteTask(task)

  })

  checkbox.type = "checkbox"
  checkbox.checked = task.completed

  label.append(checkbox, task.title)
  item.append(label)
  item.appendChild(span)

  list?.append(item)
  saveTasks()

}

function saveTasks(){
  localStorage.setItem("TASKS", JSON.stringify(tasks))
}


function deleteTask(task: Task){
  const index = tasks.indexOf(task);
  if(index > -1){
    tasks.splice(index, 1);
  }
  saveTasks()
}

function loadTasks() : Task[]{
  const taskJSON = localStorage.getItem("TASKS")
  if(taskJSON == null) return []
  return JSON.parse(taskJSON)
}



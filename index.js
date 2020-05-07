const todoUlDOM = document.querySelector(".todo-ul");
const todoInputDOM = document.querySelector(".todo-input");
const itemsLeftDOM = document.querySelector(".items-left");

//singleSourceOfTruth
let todoData = [];
let isCompleted = true;

function randomIdGenerator(size=10){
    let randomId = "a";
    let digits = "0123456789"
    for(let i = 0;i < size;i++){
        randomId += digits[Math.floor(Math.random() * size)]
    }
    return randomId;
}

function taskButtonRefresh(){
    document.querySelector(".all-todos").style.background = "transparent";
    document.querySelector(".active-todos").style.background = "transparent";
    document.querySelector(".completed-todos").style.background = "transparent";
    document.querySelector(".clear-completed-todos").style.background = "transparent";
}

function toggleIndividualCheckbox(event){
    const getId = this.parentElement.parentElement.dataset.id;
    todoData = todoData.map(todo => {
        if(todo.id === getId){
            return {...todo,isDone:!todo.isDone}
        } else {
            return todo;
        }
    })
    createUI(todoData);
}

function handleTodoClose(event){
    const getId = this.parentElement.dataset.id;
    todoData = todoData.filter(todo => todo.id !== getId);
    createUI(todoData);
}


function createUI(todos = todoData,event,root = todoUlDOM){
    taskButtonRefresh();
    root.innerHTML = "";
    todos.forEach(todo => {
        const liDOM = document.createElement("li");
        liDOM.className = "todo-item";
        liDOM.setAttribute("data-id",todo.id);
    

        const divCheckboxDOM = document.createElement("div");
        divCheckboxDOM.className = "checkbox-div";
        const inputCheckboxDOM = document.createElement("input");
        inputCheckboxDOM.className = "checkbox-input";
        inputCheckboxDOM.type = "checkbox";
        inputCheckboxDOM.checked = todo.isDone;

        //addEventListener to checkbox
        inputCheckboxDOM.addEventListener("click",toggleIndividualCheckbox)
        divCheckboxDOM.append(inputCheckboxDOM);

        const todoTextDivDOM = document.createElement("div");
        todoTextDivDOM.className = "todo-text";
        todoTextDivDOM.innerText = todo.todoText;

        const clearCloseDivDOM = document.createElement("div");
        clearCloseDivDOM.className = "clear-close";
        clearCloseDivDOM.innerHTML = "&times";
        //addEventlistener to close
        clearCloseDivDOM.addEventListener("click",handleTodoClose);

        if(todo.isDone){
            todoTextDivDOM.style.textDecoration = "line-through";
            todoTextDivDOM.style.opacity = "0.5";
            clearCloseDivDOM.style.opacity = "0.5";
        }else {
            todoTextDivDOM.style.textDecoration = "none";
            todoTextDivDOM.style.opacity = "1";
            clearCloseDivDOM.style.opacity = "1";
        }  
        liDOM.append(divCheckboxDOM,todoTextDivDOM,clearCloseDivDOM);
        root.append(liDOM);
    })

    if(event && todoData.length){
        if(event.target.classList[0] !== "clear-completed-todos")
            event.target.style.background = "#ffc600";
    }

    itemsLeftDOM.textContent = `${todoData.reduce((itemsLeft,todo) => todo.isDone ? itemsLeft : ++itemsLeft ,0)} items left`

}

function addTodo(e){
    if(e.keyCode === 13){
        const todoText = todoInputDOM.value[0].toUpperCase() + todoInputDOM.value.slice(1);
        const id = randomIdGenerator();
        const isDone = false;
        const todoItem = {todoText,id,isDone}
        todoData.push(todoItem);
        todoInputDOM.value = "";
        createUI(todoData);
    }
}

todoInputDOM.addEventListener("keyup",addTodo);

function handleClickOnAllTodosButton(event){
    if(!event.target.closest(".all-todos")) return;
    createUI(todoData,event);
}

function handleClickOnActiveTodosButton(event){
    if(!event.target.closest(".active-todos")) return;
    const activeTodos = todoData.filter(todo => !todo.isDone);
    createUI(activeTodos,event);
}

function handleClickOnCompletedTodosButton(event){
    if(!event.target.closest(".completed-todos")) return;
    const completedTodos = todoData.filter(todo => todo.isDone);
    createUI(completedTodos,event);
}

function handleClickOnClearCompletedButton(event){
    if(!event.target.closest(".clear-completed-todos")) return;
    todoData = todoData.filter(todo => !todo.isDone);
    createUI(todoData,event);
}

function handleClickOnToggler(event){
    if(!event.target.closest(".toggler"))return;
    if(todoData.length){
       
        todoData = todoData.map(todo => {
           return {...todo,isDone:isCompleted}
        })
        createUI(todoData)
        isCompleted = !isCompleted;
    }
}

document.addEventListener("click",function(event){
    handleClickOnAllTodosButton(event);
    handleClickOnActiveTodosButton(event);
    handleClickOnCompletedTodosButton(event);
    handleClickOnClearCompletedButton(event);
    handleClickOnToggler(event);
})

document.addEventListener("dblclick",function(event){
    if(!(event.target.closest(".todo-text")))return;
    let element = event.target.closest(".todo-text");
    const getId = element.parentElement.dataset.id;
    let liElementDOM = document.querySelector(`li[data-id=${getId}]`);
    
    let updateInputDOM = document.createElement("input");
    updateInputDOM.value = element.textContent;
    updateInputDOM.className = "double-click-input";
    liElementDOM.style.padding = "0"; 
    liElementDOM.replaceChild(updateInputDOM,element);
})

function handleEnterOnDoubleClickInput(event){
    let dblClickInput = event.target.closest(".double-click-input");
    let getId = dblClickInput.parentElement.dataset.id;
    let todoText = dblClickInput.value;
    let index = todoData.findIndex(todo => todo.id === getId);
    todoData[index] = {...todoData[index],todoText:todoText};
    createUI(todoData);
}

document.addEventListener("keyup",function(event){
    if(event.keyCode !== 13)return;
    if(!(event.target.closest(".double-click-input")))return;
    handleEnterOnDoubleClickInput(event);

})


// root.innerHTML += `
// <li class="todo-item" data-id=${todo.id}>
//     <div class="checkbox-div">
//         <input class="checkbox-input" type="checkbox" ${todo.isDone ? "checked" : ""}>
//     </div>
//     <div class="todo-text">
//         ${todo.todoText}
//     </div>
//     <div class="clear-close">
//         &times
//     </div>
// </li>
// `
function getAllTodos(){
    fetch("http://localhost:3000/todos", {
        method: "GET"
    })
    .then(response => response.json())
    .then(data => displayAllTodos1(data))
    .catch(error => {
      console.error("An error occurred:", error);
    });
    
    // DOM manipulation started
    function displayAllTodos1(data){
        var listElement = document.getElementById("list-container");
        // get the current children of the listElement and convert it into an array
        var currentChildren = Array.from(listElement.children);

        let added = 0, deleted = 0, updated = 0;
        
        data.forEach((d) => {
            // Check if the child with this id is already existing in the parent list
            var existingChild = currentChildren.find((child) => {
                return child.dataset.id === String(d.id);
            });

            if(existingChild){
                updated++;
                existingChild.children[0].innerHTML = d.title;
                existingChild.children[1].innerHTML = d.description;
                currentChildren = currentChildren.filter((child) => {
                    return child !== existingChild;
                })
            }
            else {
                added++;
                
                var todoElement = document.createElement("div");
                todoElement.dataset.id = d.id;
                todoElement.classList.add("todo");
                todoElement.style.backgroundColor = d.backGroundColor;
        
                    var h3Element = document.createElement("h3");
                    h3Element.classList.add("todoTitle");
                    h3Element.innerHTML = d.title;
        
                    var pElement = document.createElement("p");
                    pElement.classList.add("todoDescription");
                    pElement.innerHTML = d.description;
        
                    var btnElement = document.createElement("div");
                    btnElement.classList.add("buttons");
        
                        var doneBtn = document.createElement("button");
                        doneBtn.id = "doneBtn"
                        doneBtn.innerHTML = "Done";
                        doneBtn.setAttribute("onclick", "doneTodo("+ d.id +")");
        
                        var updateBtn = document.createElement("button");
                        updateBtn.innerHTML = "Update";
                        updateBtn.setAttribute("onclick", "updateTodo("+ d.id +")");
                        
                        var deleteBtn = document.createElement("button");
                        deleteBtn.innerHTML = "Delete";
                        deleteBtn.setAttribute("onclick", "deleteTodo("+ d.id +")");
        
                        btnElement.appendChild(doneBtn);
                        btnElement.appendChild(updateBtn);
                        btnElement.appendChild(deleteBtn);
        
                    todoElement.appendChild(h3Element);
                    todoElement.appendChild(pElement);
                    todoElement.appendChild(btnElement);
        
                listElement.appendChild(todoElement);
            }
        });

        // if any children exists in the currentChildren array are no longer needed. Hence needs to be removed
        currentChildren.forEach((child) => {
            deleted++;
            listElement.removeChild(child);
        })
        
        console.log(added, updated, deleted);
    }
}

// reconciliation:
window.setInterval(() => {
    getAllTodos();
}, 5000);


function addTodo(){
    var title = document.getElementById("title").value;
    var description = document.getElementById("description").value;

    fetch("http://localhost:3000/todos", {
        method: "POST",
        body: JSON.stringify({
            title: title,
            description: description
        }),
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Error while adding todo");
        }
    })
    .catch(error => {
      console.error("An error occurred:", error);
    });
}

function doneTodo(id){
    fetch(`http://localhost:3000/todos/${id}`, {
        method: "GET"
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Error while fetching existing todo");
        }
        return response.json();
    })
    .then(existingTodo => {
        var updatedTodo = {
            title: existingTodo.title,
            description: existingTodo.description,
            backGroundColor: "rgb(92, 209, 119)"
        };
        console.log(updatedTodo);
        fetch(`http://localhost:3000/todos/done/${id}`, {
            method: "PUT",
            body: JSON.stringify(updatedTodo),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(response => {
            if (response.ok) {
                throw new Error("Error while changing todo to done");
            }
        })
        .catch(error => {
        console.error("An error occurred:", error);
        })
        // .finally(() => {
        //     var disableDoneBtn = document.getElementById("doneBtn");
        //     disableDoneBtn.disabled = true;
        // });
    })   
    .catch(error => {
        console.error("An error occurred while fetching existing todo:", error);
    });
}

function updateTodo(id) {
    var title = document.getElementById("title").value;
    var description = document.getElementById("description").value;

    fetch(`http://localhost:3000/todos/${id}`, {
        method: "GET"
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Error while fetching existing todo");
        }
        return response.json();
    })
    .then(existingTodo => {
        var updatedTodo = {
            title: title || existingTodo.title,
            description: description || existingTodo.description
        };

        fetch(`http://localhost:3000/todos/${id}`, {
            method: "PUT",
            body: JSON.stringify(updatedTodo),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(response => {
            if (response.ok) {
                throw new Error("Error while updating todo");
            }
        })
        .catch(error => {
            console.error("An error occurred:", error);
        });
    })
    .catch(error => {
        console.error("An error occurred while fetching existing todo:", error);
    });
}

function deleteTodo(id){
    fetch(`http://localhost:3000/todos/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => {
        if (response.ok) {
            throw new Error("Error while deleting todo");
        }
    })
    .catch(error => {
      console.error("An error occurred:", error);
    });
}
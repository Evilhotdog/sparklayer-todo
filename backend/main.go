package main

import (
    "fmt"
	"encoding/json"
	"net/http"
	"sync"
)

type Todo struct {
	Title string `json:"title"`
	Description string `json:"description"`
}

var todoList []Todo = make([]Todo, 0)
var todoListMutex sync.Mutex

func main() {
	// Your code here
	http.HandleFunc("/", ToDoListHandler)
	http.ListenAndServe(":8080", nil)
}

func ToDoListHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")


	switch r.Method {
	case "GET":
		// TODO: Serialize our todo list and send it back
		todoListMutex.Lock()
		json.NewEncoder(w).Encode(todoList)
		todoListMutex.Unlock()
	case "POST":
		var item Todo
		err := json.NewDecoder(r.Body).Decode(&item)
		if err != nil || len(item.Title) == 0 {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		todoListMutex.Lock()
		todoList = append(todoList, item)
		todoListMutex.Unlock()
		json.NewEncoder(w).Encode(item)
	}
}

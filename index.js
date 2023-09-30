const express = require('express')
const { randomUUID } = require('crypto')
var fs = require('fs')
const inputValidator = require('./helpers/validator')
const tasksDataResponse = require('./tasks.json')

const PORT = 8000
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.get("/", (req, res) => {
    res.status(200).send("Hello World")
})

app.get('/tasks', (req, res) => {
    res.status(200).json({"data": tasksDataResponse.tasks})
})

app.get("/tasks/:id", (req,res) => {
    const requestedTasksid = req.params.id
    const filteredTasksData = tasksDataResponse.tasks.filter(item => item.id == requestedTasksid)
    if (filteredTasksData.length > 0) {
        res.status(200).json({"data": filteredTasksData[0]})
    } else {
        res.status(404).json({"message": `No Tasks found with id: ${requestedTasksid}`})
    }
})

app.get("/tasks/priority/:level", (req,res) => {
    const requestedTasksPriorityLevel = req.params.level
    const filteredTasksData = tasksDataResponse.tasks.filter(item => item.priority == requestedTasksPriorityLevel)
    if (filteredTasksData.length > 0) {
        res.status(200).json({"data": filteredTasksData})
    } else {
        res.status(404).json({"message": `No Tasks found with ${requestedTasksPriorityLevel} priority level`})
    }
})

app.post("/tasks", (req, res) => {
    const userProvidedDetails = req.body
    const createdAt = Date.now()
    userProvidedDetails["id"] = randomUUID()
    userProvidedDetails["createdAt"] =  createdAt
    userProvidedDetails["updatedAt"] =  createdAt
    const isTaskAvailable = tasksDataResponse.tasks.filter(item => item.title == userProvidedDetails.title)
    if (isTaskAvailable.length > 0) {
        res.status(404).json({"message": "Task with given title already exists. Kindly provide a new title"})
    } else {
        const validation = inputValidator(userProvidedDetails)
        if (validation.status) {
            const updatedTasksData = JSON.parse(JSON.stringify(tasksDataResponse));
            updatedTasksData.tasks.push(userProvidedDetails);
            fs.writeFile(__dirname+'/tasks.json', JSON.stringify(updatedTasksData), err => {
                if (err) {
                    res.status(500).json({"message": "Something went wrong while creating the task. Please try again."})
                } else {
                    res.status(201).json({"message": validation.message})
                }
            })
        }
    }

})

app.put("/tasks/:id", (req, res) => {
    const id = req.params.id
    const userProvidedDetails = req.body
    const isTaskAvailable = tasksDataResponse.tasks.filter(item => item.id == id)
    if (isTaskAvailable.length > 0) {
        const updatedAt = Date.now()
        taskIndex = tasksDataResponse.tasks.indexOf(isTaskAvailable[0])
        isTaskAvailable[0].isCompleted = userProvidedDetails?.isCompleted !== undefined && (typeof isCompleted) === "boolean" ? userProvidedDetails?.isCompleted : isTaskAvailable[0].isCompleted
        isTaskAvailable[0].title = userProvidedDetails?.title ? userProvidedDetails?.title : isTaskAvailable[0].title
        isTaskAvailable[0].description = userProvidedDetails?.description ? userProvidedDetails?.description : isTaskAvailable[0].description
        isTaskAvailable[0].priority = userProvidedDetails?.priority ? userProvidedDetails?.priority : isTaskAvailable[0].priority
        isTaskAvailable[0].updatedAt = updatedAt
        tasksDataResponse.tasks[taskIndex] = isTaskAvailable[0]
        const modifiedTasks = JSON.parse(JSON.stringify(tasksDataResponse));
        fs.writeFile(__dirname+'/tasks.json', JSON.stringify(modifiedTasks), err => {
            if (err) {
                res.status(500).json({"message": "Something went wrong while updating the task. Please try again."})
            } else {
                res.status(201).json({"message": "Task Successfully Updated"})
            }
        })
    } else {
        res.status(404).json({"message": `No Tasks found with id: ${id}`})
    }
})

app.delete("/tasks/:id", (req, res) => {
    const id = req.params.id
    const isTaskAvailable = tasksDataResponse.tasks.filter(item => item.id == id)
    if (isTaskAvailable.length > 0) {
        const filteredTasksData = tasksDataResponse.tasks.filter(item => item.id != id)
        fs.writeFile(__dirname+'/tasks.json', JSON.stringify({"tasks": filteredTasksData}), err => {
            if (err) {
                res.status(500).json({"message": "Something went wrong while deleting the task. Please try again."})
            } else {
                res.status(200).json({"message": "Task successfully deleted"})
            }
        })
    } else {
        res.status(404).json({"message": `No Tasks found with id: ${id}`})
    }
    
})

app.listen(PORT, Error => {
    if (Error) {
        console.log('Internal server error')
    } else {
        console.log(`Server is running on port no.- ${PORT}`);
    }
})
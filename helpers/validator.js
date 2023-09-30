const inputValidator = (tasksInfo) => {
    const { title, description, priority, isCompleted } = tasksInfo
    if (title && description && priority && (typeof isCompleted) === "boolean") {
        return {
            "status": true,
            "message": "Task successfully added"
        }
    } else {
        return {
            "status": false,
            "message": "Please provide all the required details"
        }
    }
}

module.exports = inputValidator
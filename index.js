const db = require('./db.js')
const inquirer = require('inquirer')

module.exports.add = async (title)=>{
    //读取任务文件
    const list = await db.read()
    //添加任务
    list.push({title, done: false})
    //储存任务文件
    await db.write(list)
}

module.exports.clear = async ()=>{
    await db.write([])
}

function markAsDone(list, index){
    list[index].done = true
    db.write(list)
}

function markAsUndone(list, index){
    list[index].done = false
    db.write(list)
}

function updateTitle(list, index){
    inquirer
        .prompt({
            type: 'input',
            name: 'title',
            message: '新的任务标题',
            default: list[index].title
        }).then(answer =>{
        list[index].title = answer.title
        db.write(list)
    })
}

function removeTask(list, index){
    list.splice(index, 1)
    db.write(list)
}

function askForActions(list, index){
    const actions = {markAsDone, markAsUndone, updateTitle, removeTask}
    inquirer
        .prompt({
            type: 'list',
            name: 'action',
            message: '选择需要进行的操作',
            choices: [
                {name: '退出', value: 'quit'},
                {name: '已完成', value: 'markAsDone'},
                {name: '未完成', value: 'markAsUndone'},
                {name: '更改标题', value: 'updateTitle'},
                {name: '删除', value: 'removeTask'},
            ]
        }).then(answer =>{
            const action = actions[answer.action]
            action && action(list, index)
    })
}

function askForCreateTask(list){
    inquirer
        .prompt({
            type: 'input',
            name: 'title',
            message: '请输入任务标题'
        }).then(answer =>{
        list.push({
            title: answer.title,
            done: false
        })
        db.write(list)
    })
}

function showTasks(list) {
    inquirer
        .prompt({
            type: 'list',
            name: 'index',
            message: '选择需要操作的任务',
            choices: [{name: '退出',value: '-1'},...list.map((task, index)=>{
                return {name: `${task.done? '[v]' : '[_]'} ${index + 1} - ${task.title}`, value: index.toString()}
            }), {name: '+ 创建新的任务', value: '-2'}]
        })
        .then(
            answer =>{
                const index = parseInt(answer.index)
                if (index >= 0) { //选择已存在任务
                    askForActions(list, index) //问询操作
                }else if (index === -2){ //选择创建新任务
                    askForCreateTask(list)
                }
            }
        )
}


module.exports.showAll = async ()=>{
    //读取任务
    const list = await db.read()
    console.log('．·°∴ ☆．．·°．·°∴ ☆．．·°．·°∴ ☆．．·°Todo List')
    //展示任务
    showTasks(list)
}
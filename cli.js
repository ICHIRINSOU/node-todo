#!/usr/bin/env node

const { Command } = require('commander');
const program = new Command();
const api = require('./index.js')

program.command('add')
    .description('添加一个新任务')
    .action((...args) => {
        const task = args.slice(0,-1).join(' ')
        api.add(task).then(()=>{console.log('成功添加任务'),()=>{console.log('任务添加失败')}})
    });

program.command('clear')
    .description('清空列表')
    .action(() => {
        api.clear( ).then(()=>{console.log('成功清除列表'),()=>{console.log('列表清除失败')}})
    });

program.parse(process.argv);
if (process.argv.length === 2) api.showAll( )
# typescript local modules
- Author: ablozhou <ablozhou@gmail.com>
- repo: https://github.com/ablozhou/tslocalpackage.git
- Date: 2021-12-8

This is a typescript local package example and tutorial.

you can use vscode to debug the local package.

# 最终文件
```
zhh@kico:~/git/testlocalmodule$ tree -I node_modules
.
├── Readme.md
├── myapp
│   ├── index.js
│   ├── index.ts
│   ├── package.json
│   ├── tsconfig.json
│   ├── yarn-error.log
│   └── yarn.lock
└── mypackage
    ├── index.js
    ├── index.ts
    ├── package.json
    ├── tsconfig.json
    └── yarn.lock
```

# 配置

## 初始化本地模块
```
zhh@kico:~/git$ mkdir testlocalmodule
zhh@kico:~/git$ cd testlocalmodule/

zhh@kico:~/git/testlocalmodule$ mkdir mypackage
zhh@kico:~/git/testlocalmodule$ cd mypackage/
zhh@kico:~/git/testlocalmodule/mypackage$ npm init
zhh@kico:~/git/testlocalmodule/mypackage$ yarn add typescript ts-node -D
zhh@kico:~/git/testlocalmodule/mypackage$ npx tsc --init
zhh@kico:~/git/testlocalmodule/mypackage$ npx tsc index.ts
```
ts-node是可以直接执行typescript的环境，这样不需要webpack打包。

npx tsc --init会生成tsconfig.json.注意修改sourceMap为True.

最终模块package如下：
/home/zhh/git/testlocalmodule/mypackage/package.json:
```
{
  "name": "mypackage",
  "version": "1.0.0",
  "description": "",
  "main": "index.ts",
  "scripts": {
    "build": "cross-env webpack",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [
    "local",
    "package"
  ],
  "author": "ablozhou",
  "license": "ISC",
  "devDependencies": {
    "ts-node": "^10.4.0",
    "typescript": "^4.5.2"
  }
}
```
### 模块代码
index.ts 生成 Hello 类并导出
```
export class Hello {
	greeting:string;
	constructor(message:string){
		this.greeting=message;
	}
	greet(name: string){
		let say=`Hello ${name}, ${this.greeting}!`;
		console.log(say);
		return say;
	}
}
```
### 本地链接
```
yarn link
```

## 应用
```
zhh@kico:~/git/testlocalmodule$ mkdir myapp
zhh@kico:~/git/testlocalmodule$ cd myapp
zhh@kico:~/git/testlocalmodule/myapp$ yarn init
zhh@kico:~/git/testlocalmodule/myapp$ yarn add typescript -D
zhh@kico:~/git/testlocalmodule/myapp$ npx tsc --init
zhh@kico:~/git/testlocalmodule/myapp$ cat package.json
{
  "devDependencies": {
    "ts-node": "^10.4.0",
    "typescript": "^4.5.2"
  },
  "name": "myapp",
  "version": "1.0.0",
  "main": "index.ts",
  "author": "ablozhou",
  "license": "MIT"
}
```
### index.ts
```
import {Hello} from 'mypackage';

let hello = new Hello('are you ok?');

hello.greet("zhh")
```
### 执行
链接本地库
```
yarn link mypackage
```
```
zhh@kico:~/git/testlocalmodule/myapp$ npx ts-node index.ts
Hello zhh, are you ok?!
```
### 调试
用vscode打开myapp目录
安装[microsoft js-debug](https://github.com/microsoft/vscode-js-debug)插件和[typescript debugger](https://marketplace.visualstudio.com/items?itemName=kakumei.ts-debug)插件。
### 生成launch.json
安装完插件，生成launch.json时，会出现ts-node的选项，自动生成并修改如下
```
{
    "name": "ts-node",
    "type": "node",
    "request": "launch",
    "args": [
        "${workspaceRoot}/index.ts"
    ],
    "runtimeArgs": [
        "-r",
        "ts-node/register"
    ],
    "cwd": "${workspaceRoot}",
    "protocol": "inspector",
    "internalConsoleOptions": "openOnSessionStart"
}
```

执行调试，可以在ts中添加断点，也能跟踪进package里，但package是sourceMap映射的代码。

# 问题：
## tsnode不识别别名@
 react，angular+typescript 项目中，为了方便文件引入，我们常常 
在 tsconfig.json 里定义的 @ 别名，ts-node不认识报错
用如下命令识别tsconfig.json:
```
ts-node index.ts --files
```
但仍然不识别tsconfig.json里面paths映射的别名。
再装一个 tsconfig-paths 的包
yarn add -D tsconfig-paths
再改改他给的命令：
```
ts-node -r tsconfig-paths/register index.ts --files
```
--
如果要使用webpack，
在tsconfig.json和webpack.resolve.alias中都配置路径映射。
或者使用awesome-typescript-loader代替ts-loader，因为awesome-typescript-loader中提供TsConfigPathsPlugin插件，该插件可以将tsconfig.json中的路径映射copy到webpack.resolve.alias中，我们只需要在tsconfig.json中配置路径映射即可。

# 参考
[ts-node的坑](https://zhuanlan.zhihu.com/p/270592378)

[typescript中文手册](https://typescript.bootcss.com/)

[typescript建项目](https://www.digitalocean.com/community/tutorials/typescript-new-project)
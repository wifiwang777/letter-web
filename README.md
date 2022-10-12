# letter

```text
 __       _______ .___________.___________. _______ .______      
|  |     |   ____||           |           ||   ____||   _  \     
|  |     |  |__   `---|  |----`---|  |----`|  |__   |  |_)  |    
|  |     |   __|      |  |        |  |     |   __|  |      /     
|  `----.|  |____     |  |        |  |     |  |____ |  |\  \----.
|_______||_______|    |__|        |__|     |_______|| _| `._____|
                                                                 
```

基于 go + tauri + vue.js 做的一款通信软件

## 后端代码仓库

[https://github.com/aisuosuo/letter-web](https://github.com/aisuosuo/letter)

### 运行

如果运行失败，请安装最新版的nodejs

```shell
git clone git@github.com:aisuosuo/letter-web.git
cd letter-web

## 网页版
npm run dev

## app版
#dev
npm run "tauri dev" / cargo tauri dev
#release
npm run "tauri build" / cargo tauri build [#可选参数：--debug]

```

### 运行app版需要安装rust以及tauri-cli

* [安装rust](https://www.rust-lang.org/zh-CN/tools/install)
    ```shell
  #macOS
  curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
  ```
* 安装tauri-cli :
    ```shell
    cargo install tauri-cli
    ```

## 截图

本身从没做过前端，所以界面略丑～～

### app

![](src/assets/index_app.png)

### web

![](src/assets/index_web.png)

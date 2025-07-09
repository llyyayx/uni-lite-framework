### uni-lite-framework是什么？
uni-lite-framework 是专为企业内部移动端开发打造的高效开发框架。该框架深度整合了多种实用功能，包括 API 请求、API Host 注入、原生应用用户信息获取、原生应用事件监听、更新检测、工具函数以及移动网关文件化管理等。

基于 Vue3 进行开发，其代码结构工整清晰，核心代码注释详尽，有效提升了代码的可读性与可维护性。所有配置项均统一写入 config 文件中，规范了文件目录结构，并正确的区分了开发环境与生产环境，使得打包过程无需在各个目录间频繁修改配置，极大提高了开发效率。

相较于现有开发框架，uni-lite-framework 展现出更为规范的代码风格、更高效的使用体验、更现代的组件设计，以及对知识产权的严格尊重。组件内部清晰标注了来源、名称、作者及是否为插件市场引入等信息，为开发者快速上手组件提供了极大便利。

好用，是 uni-lite-framework 始终坚守的唯一使命！

### 如何阅读
* HBuilder内点击右上角`预览`按钮即可从内置浏览器查看
* VsCode下载md文件阅读插件

### 前置条件
* 具备javascript的知识储备，代码规范严谨
* 使用HBuilderX开发
* 尊重劳动成果，不得易名改姓

### 目录结构
```
uni-lite-framework
    --api    api请求封装
        --public    公共请求放置位置(里边含示例)
        --index    示例模块(可删除)
        ...    其余模块按顺序排列
        request.js    普通请求的封装(底层，一般不用) 
        gateway.js    企业移动网关请求的封装(底层，一般不用)
        index.js    请求驱动，整合了各种类型的请求(使用这个)
    --automation    自动化脚本
        --proxy-api    文件式管理移动网关
    --components    自己封装组件存放位置
    --config    配置文件
    --pages    页面
    --static    静态资源存在位置
    --uni_modules    插件市场组件
    --unpackage    打包后生成的文件
    --utils    工具函数
    App.vue    起始页
```
[官方目录结构](https://uniapp.dcloud.net.cn/tutorial/project.html)

### 什么是开发环境和生成环境？
HBuilderX中, 点击"运行"编译出来的代码是开发环境, 点击"发行"编译出来的代码是生产环境。并不是配置文件配置dev就是测试环境，配置pro就是生产环境，这里概念是错误的！另外在我们开发时，在区分接口地址、获取身份信息、是否接受app用于注入host，应单独增加配置项控制，而不是单单靠环境变量来区分，试一个场景：本地安装原生开发的基座，本地启动，难到就不可以接受app基座注入的信息么？

```
process.env.NODE_ENV == 'development'     是开发环境
process.env.NODE_ENV == 'production'    是生成环境
```
上边NODE_ENV是环境变量，无需手动设置。我们只需要记住`点击"运行"编译出来的代码是开发环境, 点击"发行"编译出来的代码是生产环境`
[开发环境和生产环境](https://uniapp.dcloud.net.cn/worktile/running-env.html)

### 配置文件
所有配置相关内容统一放入了`/config/index.js`中，初次运行项目时，只需要配置该文件接口，以后打包就无需在东改西配了，直接点击打包即可。
其中核心配置为`appCode`、`serve`、`serveKey`、`reqDrive`、`injectKeys`、`injectHost`、`devToken`，其余非重要配置已在文档中标注。每一项的作用有详尽的注释，这里在详细解释一下核心配置项的作用

| 配置项 | 意义 |
| -------- | -------- |
| appCode | 移动中台门户APP应用的appCode(登录移动中台/进入后第一个页面查看) |
| serve | 配置所有项目中用到的后台服务地址，并给他们起个名-服务名称(对就这么简单 ) |
| serveKey | 项目中主要使用的服务名称(request默认就用这个，特殊的你可以手动传) |
| reqDrive | 主要请求驱动方式，框架封装了三个请求方式，通过请求驱动的方式对外暴露(就是选择哪个请求封装) |
| injectKeys | 在接受app原生注入host情况下，哪些服务地址接受注入 |
| injectHost | 是否接受app原生注入host |
| devToken | 本地运行时，没有登录时，写入的token |

一次配好，往后无忧，可直接启动或直接打包

### API请求
api请求封装以驱动的形式对外暴露，封装在api/index.js，示例请求在public/public.js文件内。这里主要讲述使用方式和各个配置作用。

1、导入请求驱动

```
import config from '/config/index'
```
为什么以整合各个请求方式对外暴露驱动的形式使用呢？这里主要是为了，可以灵活的切换请求方式，比如我今天想用移动中台/网关代理的形式请求数据，明天我想用普通请求的方式请求数据，怎么能做到灵活切换呢？对，可以配置 config文件中的`reqDrive`项，他接受三种驱动方式：`gatewayRequest移动网关、request普通请求、uploadFile文件上传`，这样就很好的控制了请求形式。如果存在特殊请求，可手动导入/api/request.js或/api/gateway.js使用固定请求形式请求。
还有一个常见问题是，我今天想请求a.com，明天想请求b.com，开发环境请求c.com，运行环境请求d.com，这里就体现出serveKey的作用了，serveKey可以动态控制使用哪个后台服务名称，你需要把a-d的地址都写入config的serve配置项内即可，serveKey控制使用哪个。serveKey在请求中可以不用显示传，默认使用config文件中serveKey配置项。配置项分了测试环境和生产环境访问地址，如果地址相同可不做此区分。如果存在特殊请求，可在请求内显示写入serveKey。
简单来说`reqDrive`控制请求形式，`serveKey`控制请求地址。

2、配置请求接口

```
const task = getModuleTask(allTask, ['lwlims.mat.add'])
```
这里请求有两种形式，第一种使用proxy-api生产的add.mjs文件，动态取模块需要的apiId。第二种是直接在模块内书写。[这里模块的意思是：一个页面的请求就是一个模块]，这里推荐使用第一种，这样便于统一管理。两者的使用方式都在`/api/public`内有详尽的示例和注释。
第一种形式使用`npm run gateway:create`生成add.mjs
第二种形式字段规范如下：

```
/**
 * Array[item]
 * item如下字段 
 * @param { String } apiId operationType
 * @param { String } apiName 接口名称
 * @param { String } method 请求类型
 * @param { String } apiUrl 接口url
 */
```

3、发送请求

```
// 示例: 使用默认serveKey
findMenu(data) {
    return publicRequest.run(publicRequest.pack({
        task: findTask(task, 'lwlims.mat.add'),
        data: { test: 1 }
    }))
}
```
publicRequest是选择的驱动，这个包含了两个方法`pack`、`run`，pack方法是用于封装当前驱动所需的参数格式，run方法是用于发送请求的。且每个驱动必须提供这两个方法(即使自己又增加了其他驱动)。一般来说pack只需要传task请求任务和data数据即可(task通过apiId来获取)。详细参数可以查看`api/index`中各个pack注释

提示：method(请求类型)，使用gatewayRequest(移动网关)驱动时是不用设置的(设置了也不生效)，他的类型是在移动中台配置的，除了移动网关这种请求方式之外的可以设置

[文件式管理移动中台/网关](./automation/proxy-api/README.md)

4、返回格式
```
/**
 * tip: 返回结构声明
 * 正常请求: res.data这后台返回的结构体, 例如可能包含{status,data}
 * 移动网关: res.data.data这后台返回的结构体, 例如可能包含{status,data}
 * 为了通用性我们直接返回后台返回结构体，不做深层处理
*/
```
通过移动网关访问的请求会多一层dat包裹，判断接口访问是否成功一般有两层含义，第一层是http请求是否成功，如果不成功会直接进入fail内，如果成功就进入我们常见的业务逻辑判断。第二层是http状态码200，则进行结构体内的状态码判断，也就是业务状态

对于业务状态码的判断成功与否，可通过配置文件内的`successCode`、`gatewaySuccessCode`判断，一个是判断普通请求成功的状态码，一个是判断移动网关请求成功的状态码  
**这两个字段是数组类型，支持多个成功标志(设置成数组类型就是为了防止后台开发不规范，乱返成功码)**

config内
| 配置字段 | 成功标志 |
| -------- | -------- |
| successCode | 0(表示请求成功,string) |
| gatewaySuccessCode | 1(表示代理成功,string) |

如需修改http请求的返回逻辑，可在api/request.js中修改

### 组件
市场组件放入uni_modules，自定义组件放入components。日后组件会逐渐增加。  
**注意：组件ref变量名不要和组件名称相同！**

| 名称 | 组件 | 来源 |
| -------- | -------- | -------- |
| ui框架 | [uv-ui](https://www.uvui.cn/)  | 市场 |
| 下拉分页-列表 | [z-paging](https://z-paging.zxlee.cn/) | 市场 |
| 表格 | [zb-table](https://ext.dcloud.net.cn/plugin?id=7511) | 市场 |
| 分页 | [uni-pagination](https://ext.dcloud.net.cn/plugin?id=32) | 市场 |
| 图标 | [uni-icons](https://uniapp.dcloud.net.cn/component/uniui/uni-icons.html) | 市场 |
| 自定义导航栏 | navbar | 自定义 |
| 扫码 | scan-code | 自定义 |

(来源：市场、自定义)

### 更新
更新一般用于单独成app的情况，如果是以小程序形式放入应用内，则不需要更新(因为门户应用会自动更新)。
config文件内的`openUpdate`用于控制是否启动更新，`updateUrl`用于设置更新相关的接口地址。
注意：只有生产环境下会检查更新

### 用户信息
在生产环境下用户信息必须从app原生应用内注入进来，在测试环境你可以选择是否仍接受注入，如果不接受可以使用假数据。config文件内的`devUserInfo`用于控制测试环境下，用户信息的来源：mock假数据/inject注入。
用户信息的相关细节配置在：`utils/userInfo.js`内。一般的配置了假数据，就需要配置config内的devToken

### 原生事件
目前已知的原生抛入事件有：扫码事件(scanInputResult)

扫码事件使用方式：

```
APP.vue
// 告知原生初始化事件
uni.sendNativeEvent('scanInput')
// 监听原生抛入的事件
uni.onNativeEventReceive((event, data) => {
    uni.$emit('scanInputResult', data)
})
// 页面声明周期内使用: uni.$on('scanInputResult', () =>{})
```

### 启动与打包
* config/index - 首次启动项目：打包配置好配置项，之后无地址、请求方式等修改，打包前可不用二次设置
* package.json - 首次启动项目：修改name字段为项目名称
* manifest.json -  首次启动项目：修改appid、应用名称、应用描述等对应字段信息。  每次打包：更新版本号
* **切记要重新获取appid，否则没有打包权限**  

修改完上述事项后，每次打包只需要修改版本号，然后点击打包即可！

### 其他
* 其他方法封装请放入utils文件内
* 组件以后逐渐丰富
* 建议使用automation/proxy-api管理移动网关
* author: xujiale

### git提交规格
| 类型 | 说明 |
| -------- | -------- |
| feat | 新增功能（feature） |
| fix | 修复 Bug |
| docs | 文档更新（如 README、注释） |
| style | 代码样式调整（如空格、格式化，不改变逻辑） |
| refactor | 代码重构（既不修复 Bug 也不新增功能） |
| perf | 性能优化 |
| test | 添加或修改测试用例 |
| chore | 构建过程或辅助工具的变动（如依赖更新、CI 配置） |
| revert | 回滚之前的提交 |
| build | 构建相关的修改（如打包工具、依赖库版本升级） |
| ci | CI/CD 配置或脚本的修改 |

例如：feat: 描述性文字

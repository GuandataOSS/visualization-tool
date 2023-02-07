# 项目介绍

本项目主要用于开发自定义图表。

## 数据接入

首先需要在 visual-plugins 文件夹下创建 data.js，然后写入如下内容：

```js
const data = [
    [
        {
            name: "店铺名称",
            numberFormat: null,
            data: [
                "湖南分店",
                "青海分店",
                "北京分店",
                "云南分店",
                "广东分店",
                "上海分店",
                "浙江分店",
                "山东分店",
                "吉林分店",
                "江苏分店",
                "福建分店",
            ],
        },
        {
            name: "数量",
            numberFormat: null,
            data: [370, 376, 509, 137, 540, 678, 631, 381, 208, 471, 423],
        },
    ],
];

export default data;
```

其中的数据就是 BI 编辑自定义图表界面中查看数据结构中的数据，直接复制就行。

## 安装依赖

```nodejs
    yarn
```

## 开发图表插件

```nodejs
    yarn dev ${visual-plugin-name}
```

项目启动于 `http://127.0.0.1:3667/`。插件位于 `visual-plugins`目录中，当插件不存在时，会自动创建。

## 构建图表插件

当开发完成后，需要对图表插件进行打包，运行如下指令即可构建图表插件文件。

```nodejs
yarn build ${visual-plugin-name}
```

构建的插件位于 `/dist-visual-plugins/${visual-plugin-name}.json`。
将生成的 `.json` 文件安装至 BI 环境，即可根据安装的插件新建图表卡片。

## 生成图表插件配置文件夹

插件配置文件夹中包含`.css`, `.js`, `.html`, `.json` 等文件。

生成方式有两种:

-   直接初始化
-   根据已有插件对应的 `.json` 文件构建

生成的图表插件位于： `/visual-plugins/${visual-plugin-name}`

### 直接初始化

执行如下指令可创建初始版本图表插件。初始版本会以表格形式展示数据，同时自动启动项目，项目启动于 `http://127.0.0.1:3667/`。

```nodejs
yarn dev ${visual-plugin-name}
```

### 基于已有插件的配置创建

根据 BI 环境中已安装插件对应的配置生成配置文件夹。
步骤：

-   从 BI 中获取插件的配置，`/api/plugin/installed/list`接口中包含有所有已安装插件的配置
-   在 `old-visual-plugins` 新建 `${visual-plugin-name}.json`， 将插件的配置拷贝至该文件中
-   执行下述指令生成对应的配置文件夹

```nodejs
yarn vis-config ${visual-plugin-name}
```

all 或者第三个参数为空默认生成所有 visual-plugins 目录下的插件

## 其他

-   [自定义图表开发帮助文档](https://docs.guandata.com/?g=Doc&m=Article&a=index&id=1&aid=428610763133812736)

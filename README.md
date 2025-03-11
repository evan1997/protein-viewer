# 蛋白分子查看器

这是一个基于React和3Dmol.js的蛋白质分子可视化应用，允许用户通过PDB ID查看和交互式操作蛋白质3D结构。

## 功能特点

- 通过PDB ID加载蛋白质结构
- 支持3D旋转、缩放和自动旋转
- 提供多种示例蛋白质结构
- 响应式设计，适配不同设备

## 技术栈

- React
- TypeScript
- 3Dmol.js
- Axios

## 安装与运行

1. 克隆仓库
```
git clone <repository-url>
cd protein-viewer
```

2. 安装依赖
```
npm install
```

3. 启动开发服务器
```
npm start
```

4. 打开浏览器访问 http://localhost:3000

## 使用方法

1. 在输入框中输入有效的PDB ID（例如：1CRN）
2. 点击"查看"按钮加载蛋白质结构
3. 使用控制按钮旋转、缩放或自动旋转模型
4. 也可以点击示例PDB ID按钮快速查看预设的蛋白质结构

## 示例PDB ID

- **1CRN** - 鸡冠花凝集素（Crambin）
- **4HHB** - 人类血红蛋白
- **1BNA** - B-DNA双螺旋结构
- **1AKE** - 腺苷酸激酶
- **3PQR** - 绿色荧光蛋白（GFP）

## 自定义

您可以通过修改`ProteinViewer`组件的props来自定义查看器：

```jsx
<ProteinViewer 
  pdbId="1CRN" 
  width="800px" 
  height="600px" 
  backgroundColor="#f0f0f0" 
/>
```

## 许可证

MIT

## 致谢

- [3Dmol.js](https://3dmol.org/) - 用于分子可视化的JavaScript库
- [RCSB PDB](https://www.rcsb.org/) - 蛋白质数据库

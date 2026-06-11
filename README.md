# 思维导图编辑器

在线创建、编辑、自动保存和导出思维导图，支持快捷键、主题、小地图和多文件管理。

## 项目主要功能

- 中心节点向外扩展，支持添加子节点和兄弟节点
- 节点文字、颜色标签、图标编辑
- 节点拖拽、折叠/展开、删除子树
- **子树复制粘贴**：选中节点按 `Ctrl+C` 复制整棵子树，`Ctrl+V` 粘贴为当前选中节点的子节点，自动重新生成节点 ID 避免冲突
- Enter、Tab、Delete、F2、Ctrl+Z、Ctrl+Y、Ctrl+C、Ctrl+V 快捷键
- 画布缩放、平移、适配全部和居中选中节点
- 商务蓝、活力橙、清新绿、极简黑白主题
- PNG、JSON、Markdown 大纲导出与 JSON 导入
- **IndexedDB 自动保存 + 当前文件持久化**：多份文件独立管理，刷新页面后自动恢复上次选中的文件和所有编辑内容（包括复制粘贴产生的分支）
- 右下角小地图导航

## 本地开发方式

```bash
cd frontend
npm install
npm run dev
```

访问地址：http://localhost:18413

## 技术栈

| 分类 | 技术 |
| --- | --- |
| 前端框架 | React 18 + TypeScript |
| 画布引擎 | reactflow |
| UI | Tailwind CSS + Radix UI |
| 状态管理 | Zustand + immer |
| 构建工具 | Vite |
| 持久化 | IndexedDB |
| 导出 | html-to-image |

## 项目目录结构

```text
frontend/
├── src/
│   ├── pages/
│   ├── components/
│   │   ├── MindMap/
│   │   ├── Sidebar/
│   │   └── common/
│   ├── hooks/
│   ├── stores/
│   ├── storage/
│   ├── constants/
│   ├── types/
│   ├── utils/
│   ├── styles/
│   └── App.tsx
├── public/
└── package.json
```

## License

MIT

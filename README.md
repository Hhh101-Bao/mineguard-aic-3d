# 矿域智盾 · 三维拆解工作台

用于矿井安全防控机器人的三维交互展示。包含六轴机械臂 CAD 显示几何、程序化车体、部件选择、零件隔离、拆解和旋转缩放交互。

全部运行资源在 dist 目录内。使用 HTML、CSS、JavaScript 和本地 Three.js，无需前端框架、数据库或运行时外网模型服务。

## GitHub Pages 公开入口

[打开三维交互工作台](https://hhh101-bao.github.io/mineguard-aic-3d/)

GitHub Pages 从 gh-pages 分支的根目录发布。该分支只包含 dist 中的静态文件。原始 CAD 数据保留在 vendor/chx3-cad.js，页面通过多个本地脚本并行下载同一份完整几何；拆分前后逐值比对一致，保留全部 99 个零件。

更新 CAD 发布资源时先运行 `node scripts/pack-cad.cjs`，然后运行 `node scripts/verify-dist.cjs`。发布需要同时更新 main 的源文件和 gh-pages 的静态内容。

## Render 发布设置

- 类型：Static Site
- Build Command：`node scripts/verify-dist.cjs`
- Publish Directory：`dist`
- 环境变量：无需设置

也可以使用仓库根目录的 render.yaml。需要先将本仓库推送至 GitHub、GitLab 或 Bitbucket，并让 Render 读取该仓库。

## 访问与验证

桌面支持鼠标旋转、缩放与部件操作；触摸设备采用流畅渲染设置并保留完整几何。需要支持 WebGL 2 的浏览器。

发布后应在目标设备的实际网络中验证首页加载、机械臂显示、旋转缩放、整体拆解和部件隔离。云端部署成功本身不保证每个网络均可达。

Three.js 许可见 dist/vendor/THREE-LICENSE.txt。项目文件随公开页面交付，不代表授予额外的复制或再发布许可。

# 矿域智盾 · 三维拆解工作台

用于矿井安全防控机器人的三维交互展示。包含六轴机械臂 CAD 显示几何、程序化车体、部件选择、零件隔离、拆解和旋转缩放交互。

全部运行资源在 dist 目录内。使用 HTML、CSS、JavaScript 和本地 Three.js，无需前端框架、数据库或运行时外网模型服务。

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

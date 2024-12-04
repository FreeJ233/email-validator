# 使用官方 Node.js 镜像
FROM node:16

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY backend/package*.json ./

# 安装依赖
RUN npm install

# 复制应用代码
COPY backend/ .

# 暴露端口
EXPOSE 3000

# 启动应用
CMD ["node", "app.js"]

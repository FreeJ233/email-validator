# 使用官方的Node.js镜像
FROM node:16

# 设置工作目录
WORKDIR /app

# 复制package.json并安装依赖
COPY package*.json ./
RUN npm install

# 复制应用代码
COPY . .

# 暴露端口
EXPOSE 3000

# 启动应用
CMD ["node", "app.js"]

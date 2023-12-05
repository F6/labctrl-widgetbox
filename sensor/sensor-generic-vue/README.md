# sensor-generic-vue

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

# NOTES

ant-design-vue 版本暂时锁定 4.0.6，因为 4.0.7 版本 button onClick 事件会触发新版本 Wave 的 bug (首次点击时 showWave 中 wave.value 未初始化导致控制台报错。)
见 https://github.com/vueComponent/ant-design-vue/issues/7106

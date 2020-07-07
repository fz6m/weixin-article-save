### 微信公众号文章存档

在 issue 内提交链接后自动抓取为 `.jpg` 格式并 push 保存在该项目根目录下

### workflows

```yml
on:
  issues:
    types: [opened]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: fz6m/weixin-article-save@master
        env:
          TOKEN: ${{ github.token }}
          REPOSITORY: ${{ github.repository }}
          NAME: your name
          EMAIL: your email
```

### 示例

[wexin-save](https://github.com/fz6m/wexin-save)

### 原项目
[duty-machine / weixin-archive-action](https://github.com/duty-machine/weixin-archive-action)
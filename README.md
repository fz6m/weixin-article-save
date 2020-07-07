### 微信公众号文章存档

在 issue 内提交链接后自动抓取为 `.jpg` 格式并 push 保存在该项目根目录下

### 示例

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
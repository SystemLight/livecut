# livecut

> 轻量的网页切图设计稿对比工具

### 效果展示

<img src="./docs/tian.gif" alt="tian.gif" width="50%" />
<img src="./docs/baoxiaohe.gif" alt="baoxiaohe.gif" width="50%" />
<img src="./docs/tencent.gif" alt="tencent.gif" width="50%" />

### 引入方法

```javascript
<script src="./index.js"></script>
<script>
    // 第一个参数：图片对象 | URL网址
    // 第二个参数：可选，object{w:切稿宽度,h:切稿高度}

    // 使用图片对比，创建方法一
    let img = new Image();
    img.src = './cut.png';
    new LiveCut('./cut.png');

    // 使用图片对比，创建方法二
     LiveCut.img('./华硕无双_作业_效果图示例.png');

    // 使用网址最对比，创建方法一
    // url模式创建对比，第二个参数必须填写，获取网址的大小，可以打开目标网址控制台，
    // 输入：`{w:document.body.scrollWidth,h:document.body.scrollHeight}`，复制结果填入
    new LiveCut('https://bing.com/', {w: 1920, h: 1000});

    // 使用网址最对比，创建方法二
    LiveCut.iframe('https://bing.com/', {w: 1920, h: 1000});
  
    // 网页复刻，4361指定网站高度
    LiveCut.reprint('https://lol.qq.com/main.shtml', 4361)
</script>
```

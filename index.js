class LiveCut {
    constructor(diffContent, geometry) {
        this.handleBox = document.createElement('div'); // 伸缩盒子
        this.handle = document.createElement('div'); // 控制把手
        this.diffInstance = null; // 对比实例对象

        this.startX = 0; // 开始坐标
        this.handleWidth = 5; // 控制把手宽度
        this.maxExpand = 0; // 最大展开距离

        if (diffContent instanceof Image) {
            this._renderImage(diffContent, geometry);
        } else if (typeof diffContent === 'string') {
            this._renderIframe(diffContent, geometry);
        } else {
            throw TypeError('diffContent is not support.');
        }

        this.handle.addEventListener('mousedown', this.handleDown);
        this.appendBody();
    }

    _renderImage(diffContent, geometry) {
        this.diffInstance = document.createElement('canvas');
        let ctx = this.diffInstance.getContext('2d');

        if (geometry) {
            this.setDesignGeometry(geometry);
            this.diffInstance.width = geometry.w;
            this.diffInstance.height = geometry.h;
            diffContent.onload = () => {
                ctx.drawImage(diffContent, 0, 0, geometry.w, geometry.h);
            };
        } else {
            diffContent.onload = () => {
                this.setDesignGeometry({
                    w: diffContent.width,
                    h: diffContent.height
                });
                this.diffInstance.width = diffContent.width;
                this.diffInstance.height = diffContent.height;
                ctx.drawImage(diffContent, 0, 0);
            };
        }
    }

    _renderIframe(diffContent, geometry) {
        this.diffInstance = document.createElement('iframe');
        this.diffInstance.src = diffContent;

        if (geometry) {
            this.setDesignGeometry(geometry);
            this.diffInstance.style.cssText = `display: block;width: ${geometry.w}px;height:${geometry.h}px;overflow: hidden;`;
        } else {
            throw TypeError('Missing `geometry` parameter.');
        }
    }

    setDesignGeometry(geometry) {
        this.maxExpand = this.handleWidth + geometry.w;
        this.handleBox.style.cssText = `position:fixed;left:0;top:0;z-index:99999;width:5px;height:${geometry.h}px;overflow:hidden`;
        this.handle.style.cssText = `position:absolute;top:0;right:0;background-color:#333333;height:${geometry.h}px;width:5px;cursor:col-resize;user-select: none;-webkit-user-drag: none;`;
        this.diffInstance.style.cssText = `width:${geometry.w}px;height:${geometry.h}px`;
    }

    handleDown = (e) => {
        this.startX = e.clientX;
        document.removeEventListener('mousemove', this.handleMove);
        document.removeEventListener('mouseup', this.handleUp);
        document.addEventListener('mousemove', this.handleMove);
        document.addEventListener('mouseup', this.handleUp);
    };

    handleMove = (e) => {
        let currentExpand = this.handleWidth + (e.clientX - this.startX);
        if (currentExpand > this.maxExpand) {
            currentExpand = this.maxExpand;
        }
        this.handleBox.style.width = `${currentExpand}px`;
    };

    handleUp = () => {
        document.removeEventListener('mousemove', this.handleMove);
        document.removeEventListener('mouseup', this.handleUp);
        this.handleBox.style.width = `${this.handleWidth}px`;
    };

    appendBody() {
        this.handleBox.append(this.diffInstance);
        this.handleBox.append(this.handle);
        document.body.append(this.handleBox);
    }

    destroy() {
        this.handleBox.remove();
    }
}

class LiveCut {
    constructor(diffContent, geometry) {
        this.handleBox = document.createElement('div'); // 伸缩盒子
        this.handle = document.createElement('div'); // 控制把手
        this.mask = document.createElement('div');
        this.diffInstance = null; // 对比实例对象

        this.isPersist = false;
        this.startX = 0; // 开始坐标
        this.handleWidth = 5; // 控制把手宽度
        this.currentFoldSize = this.handleWidth;
        this.maxExpand = 0; // 最大展开距离

        if (diffContent instanceof Image) {
            this._renderImage(diffContent, geometry);
        } else if (typeof diffContent === 'string') {
            this._renderIframe(diffContent, geometry);
        } else {
            throw TypeError('diffContent is not support.');
        }

        this.handle.addEventListener('mousedown', this._handleDown);
        this.handle.addEventListener('contextmenu', (e) => e.preventDefault());
        this.appendBody();
    }

    static img(imgPath, geometry) {
        let img = new Image();
        img.src = imgPath;
        return new LiveCut(img, geometry);
    }

    static iframe(urlPath, geometry) {
        return new LiveCut(urlPath, geometry);
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
        this.diffInstance.frameBorder = '0';

        if (geometry) {
            this.setDesignGeometry(geometry);
            this.diffInstance.style.cssText = `display: block;width: ${geometry.w}px;height:${geometry.h}px;overflow: hidden;border:none`;
        } else {
            throw TypeError('Missing `geometry` parameter.');
        }
    }

    _handleDown = (e) => {
        this.isPersist = e.button === 2;
        this.startX = e.clientX - this.currentFoldSize;
        this.diffInstance.style.transform = `translate(-${window.scrollX}px,-${window.scrollY}px)`;
        this.refineHandle();
        this.unbindHandle();
        this.bindHandle();
    };

    _handleMove = (e) => {
        this._fold(e.clientX - this.startX);
    };

    _handleUp = () => {
        if (!this.isPersist) {
            this._fold(0);
            this.resetHandle();
        }
        this.unbindHandle();
    };

    bindHandle() {
        document.addEventListener('mousemove', this._handleMove);
        document.addEventListener('mouseup', this._handleUp);
    }

    unbindHandle() {
        document.removeEventListener('mousemove', this._handleMove);
        document.removeEventListener('mouseup', this._handleUp);
    }

    setDesignGeometry(geometry) {
        this.maxExpand = geometry.w;
        this.handleBox.style.cssText = `position:fixed;left:0;top:0;z-index:99999;width:5px;height:${geometry.h}px;overflow:hidden;user-select: none;-webkit-user-drag: none;`;
        this.mask.style.cssText = `position:absolute;left:0;top:0;z-index:100000;width:0;height:${geometry.h}px;`;
        this.handle.style.cssText = `position:absolute;top:0;right:0;width:5px;height:${geometry.h}px;cursor:col-resize;background:linear-gradient(#00022E,#4984B8,#82A67D,#3E82FC,#26F7FD,#070D0D) content-box;`;
        this.diffInstance.style.cssText = `width:${geometry.w}px;height:${geometry.h}px`;
    }

    fold(size) {
        this.refineHandle();
        this._fold(size);
    }

    _fold(size) {
        if (size > this.maxExpand) {
            size = this.maxExpand;
        } else if (size < this.handleWidth) {
            size = this.handleWidth;
        }

        this.currentFoldSize = size;
        this.handleBox.style.width = `${size}px`;
        this.mask.style.width = `${size - this.handleWidth}px`;
    }

    refineHandle() {
        this.handle.style.paddingLeft = '4px';
    }

    resetHandle() {
        this.handle.style.removeProperty('padding-left');
    }

    appendBody() {
        this.handleBox.append(this.mask);
        this.handleBox.append(this.diffInstance);
        this.handleBox.append(this.handle);
        document.body.append(this.handleBox);
    }

    destroy() {
        this.handleBox.remove();
    }
}

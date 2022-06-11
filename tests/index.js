class LiveCut {
    constructor(designImagePath, geometry) {
        this.handleBox = document.createElement("div");
        this.handle = document.createElement("div");
        this.cutCanvas = document.createElement("canvas");
        this.ctx = this.cutCanvas.getContext("2d");

        this.startX = 0;
        this.handleWidth = 5;
        this.maxMoveWidth = 0;

        if (geometry) {
            this.img = new Image(geometry.w, geometry.h);
            this.img.src = designImagePath;
            this.setDesignGeometry(geometry);
            this.img.onload = () => {
                this.ctx.drawImage(this.img, 0, 0, geometry.w, geometry.h);
            };
        } else {
            this.img = new Image();
            this.img.src = designImagePath;
            this.img.onload = () => {
                this.setDesignGeometry({
                    w: this.img.width,
                    h: this.img.height,
                });
                this.ctx.drawImage(this.img, 0, 0);
            };
        }

        this.handle.addEventListener("mousedown", this.handleDown);
        this.appendBody();
    }

    setDesignGeometry(geometry) {
        this.maxMoveWidth = this.handleWidth + geometry.w;
        this.cutCanvas.width = geometry.w;
        this.cutCanvas.height = geometry.h;
        this.cutCanvas.style.cssText = `width:${geometry.w}px;height:${geometry.h}px`;
        this.handleBox.style.cssText = `position:fixed;left:0;top:0;z-index:99999;width:5px;height:${geometry.h}px;overflow:hidden`;
        this.handle.style.cssText = `position:absolute;top:0;right:0;background-color:#333333;height:${geometry.h}px;width:5px;cursor:col-resize;`;
    }

    handleDown = (e) => {
        document.removeEventListener("mousemove", this.handleMove);
        document.removeEventListener("mouseup", this.handleUp);
        this.startX = e.clientX;
        document.addEventListener("mousemove", this.handleMove);
        document.addEventListener("mouseup", this.handleUp);
    };

    handleMove = (e) => {
        let moveWidth = this.handleWidth + (e.clientX - this.startX);
        if (moveWidth > this.maxMoveWidth) {
            moveWidth = this.maxMoveWidth;
        }
        this.handleBox.style.width = `${moveWidth}px`;
    };

    handleUp = () => {
        document.removeEventListener("mousemove", this.handleMove);
        document.removeEventListener("mouseup", this.handleUp);
        this.handleBox.style.width = `${this.handleWidth}px`;
    };

    appendBody() {
        this.handleBox.append(this.cutCanvas);
        this.handleBox.append(this.handle);
        document.body.append(this.handleBox);
    }

    destroy() {
        this.handleBox.remove();
    }
}

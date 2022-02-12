const TWO_PI = Math.PI * 2

class Heart {
    constructor(painter, x, y, name) {
        this.name = name
        this.painter = painter

        this.x = x
        this.y = y
        this._interval = 0
        this.color = 0xFF1100
        this.borderColor = 0xff5500
        this.step = 0
        this.size = 20
        this.heart = new PIXI.Graphics()
        this.nameText = new PIXI.Text(`Это сердце бьется для тебя, ${name}`, {
            fontSize: 36,
            fontWeight: 'bold',
            fill: '#000000',
        })
    }

    play() {
        this.painter.addChild(this.heart)
        this.painter.addChild(this.nameText)
        this.nameText.x = this.painter.fixWidth + this.x - this.nameText.width / 2
        this.nameText.y = -this.size * (6) + this.painter.fixHeight / 2 + this.y
        this._interval = setInterval(() => {
            if (this.step < TWO_PI) {
                this.step += 0.01
                this.#pulse(Math.cos(0.01) * 0.8 + this.size)
            } else {
                this.#pulse(Math.cos(Date.now() * 0.01) * 0.8 + this.size)
            }
        }, 1)
    }

    setColor(r, g, b) {
        this.color = Painter.rgbToHex(r, g, b)
    }

    setText(name) {
        this.name = name
        this.nameText.text = `Это сердце бьется для тебя ${name}`
    }

    setBorderColor(r, g, b) {
        this.borderColor = Painter.rgbToHex(r, g, b)
    }

    stop() {
        clearInterval(this._interval)
    }

    destroy() {
        this.stop()
        if (this.heart) {
            this.painter.remove(this.heart)
        }
    }

    #pulse(r) {
        this.heart.clear()
        this.heart.beginFill(this.color)
        this.heart.lineStyle(4, this.borderColor, 1)
        for (let i = 0; i < this.step; i += 0.01) {
            const x = r * 16 * Math.pow(Math.sin(i), 3) + this.painter.fixWidth + this.x
            const y = -r * (13 * Math.cos(i) - 5 * Math.cos(2 * i) - 2 * Math.cos(3 * i) - Math.cos(4 * i)) + this.painter.fixHeight + this.y
            if (i === 0) {
                this.heart.moveTo(x, y)
            }
            this.heart.lineTo(x, y)
        }
        this.heart.closePath()
        this.heart.endFill()
    }
}

export class Painter {

    /**
     * @param { number } initWidth - init canvas width
     * @param { number } initHeight - init canvas height
     * */
    constructor(initWidth, initHeight) {
        this.app = new PIXI.Application({
            width: initWidth,
            height: initHeight,
            resizeTo: window,
            backgroundColor: 0xffffff
        })
        this._container = new PIXI.Container()
        this._container.interactive = true
        this._intervalId = 0
        this.app.stage.addChild(this._container)
        this.fixHeight = initHeight / 2
        this.fixWidth = initWidth / 2
    }

    start() {
        this._intervalId = setInterval(() => {
            this.#render()
        }, 10)
    }

    pause() {
        clearInterval(this._intervalId)
    }

    /**
     * @param {number} w - Canvas weight
     * @param {number} h - Canvas height
     * */
    resize(w = 0, h = 0) {
        this.app.view.height = h
        this.app.view.width = w
        this.fixHeight = h / 2
        this.fixWidth = w / 2
    }

    /**
     * @param {number} r - red color intensive
     * @param {number} g - green color intensive
     * @param {number} b - blue color intensive
     * */
    fill(r, g, b) {
        this.app.renderer.backgroundColor = Painter.rgbToHex(r, g, b)
    }

    /**
     * @param {Document} document - HTML document
     * */
    attach(document) {
        document.body.appendChild(this.app.view)
    }

    /**
     * @return { Heart }
     * */
    makeHeart(name = "", offsetX = 0, offsetY = 0) {
        return new Heart(this, offsetX, offsetY, name)
    }

    /**
     * @param { PIXI.Graphics } child
     * */
    addChild(child) {
        this._container.addChild(child)
    }

    /**
     * @param { PIXI.Graphics } child
     * */
    removeChild(child) {
        this._container.removeChild(child)
    }

    /**
     *  Clear canvas
     * */
    clear() {
        for (let i = this._container.children.length - 1; i >= 0; i--) {
            this._container.children[i].destroy()
            this._container.removeChild(this._container.children[i])
        }
    }

    #render() {
        this.app.renderer.render(this.app.stage)
    }

    /**
     * @param { number } num
     * @return string
     * */
    static getHexNum(num) {
        const result = Math.min(num, 255).toString(16)
        return result.length === 1 ? 0 + result : result
    }

    /**
     * @param {number} r - red color intensive
     * @param {number} g - green color intensive
     * @param {number} b - blue color intensive
     * @return { number }
     * */
    static rgbToHex(r, g, b) {
        const color = Painter.getHexNum(r) + Painter.getHexNum(g) + Painter.getHexNum(b)
        return parseInt(color, 16)
    }
}

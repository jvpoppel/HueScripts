/**
 * @author Johan van Poppel ( https://github.com/jvpoppel/HueScripts )
 */

/**
 * HueScripts Light Class
 * @param id Light ID
 */
export class Light {

    id: number;
    color: Array<number>;

    constructor(id: number) {
        this.id = id;
        this.color = [0, 0, 0];
    }

    public getID(): number {
        return this.id;
    }

    public toString(): string {
        return String(this.id);
    }

    public getColor(): Array<number> {
        return this.color;
    }

    public setColor(color: Array<number>): Light {
        this.color = color;
        return this;
    }
}
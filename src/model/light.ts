/**
 * @author Johan van Poppel ( https://github.com/jvpoppel/HueScripts )
 */

/**
 * HueScripts Light Class
 * @param id Light ID
 */
export class Light {

    private readonly id: number;

    constructor(id: number) {
        this.id = id;
    }

    public getID(): number {
        return this.id;
    }

    public toString(): string {
        return String("Light " + this.id);
    }
}

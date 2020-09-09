/**
 * @author Johan van Poppel ( https://github.com/jvpoppel/HueScripts )
 */

/**
 * HueScripts Page Class
 * A page binds a sequence to a certain ID
 * @param id Page ID
 *
 */
export class Page {

    id: number;
    commands: string;

    constructor(id: number) {
        this.id = id;
        this.commands = "";
    }

    public getCommands(): string {
        return this.commands;
    }

    public setCommands(commands: string): Page {
        this.commands = commands;
        return this;
    }

    public getID(): number {
        return this.id;
    }


    public toString(): string {
        return String(this.id);
    }
}
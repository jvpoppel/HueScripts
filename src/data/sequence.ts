/**
 * @author Johan van Poppel ( https://github.com/jvpoppel/HueScripts )
 */
import { TSMap } from "typescript-map";
import { Row } from "./row";
/**
 * HueScripts Sequence Class
 * A sequence is a map of rows.
 * Each row is mapped to a certain time
 */
export class Sequence {

    rows: TSMap<number, Set<Row>>;

    public constructor() {
        this.rows = new TSMap<number, Set<Row>>();
    }

    public addRow(time: number, row: Row): Sequence {
        if (!this.rows.has(time)) {
            this.rows.set(time, new Set<Row>());
        }
        this.rows.get(time).add(row);
        return this;
    }

    public deleteRow(row: Row): Sequence {
        this.rows.get(row.getTime()).delete(row);
        return this;
    }


}
/**
 * @author Johan van Poppel ( https://github.com/jvpoppel/HueScripts )
 */
import { TSMap } from "typescript-map";
import { Row } from "./row";
/**
 * HueScripts Sequence Class
 * A sequence is a map of pageRows.
 * Each row is mapped to a certain time
 */
export class Sequence {

    pageRows: TSMap<number, Set<Row>>;

    public constructor() {
        this.pageRows = new TSMap<number, Set<Row>>();
    }

    public rows(): TSMap<number, Set<Row>> {
        return this.pageRows;
    }

    public addRow(time: number, row: Row): Sequence {
        if (!this.pageRows.has(time)) {
            this.pageRows.set(time, new Set<Row>());
        }
        this.pageRows.get(time).add(row);
        return this;
    }

    public deleteRow(row: Row): Sequence {
        this.pageRows.get(row.getTime()).delete(row);
        return this;
    }


}

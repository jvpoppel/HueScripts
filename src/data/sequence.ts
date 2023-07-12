/**
 * @author Johan van Poppel ( https://github.com/jvpoppel/HueScripts )
 */
import { TSMap } from "typescript-map";
import { Row } from "./row";
import {WebElements} from "../static/webElements";
import {Main} from "../main";
/**
 * HueScripts Sequence Class
 * A sequence is a map of pageRows.
 * Each row is mapped to a certain time
 */
export class Sequence {

    private pageRows: TSMap<number, Set<Row>>;

    public constructor() {
        this.pageRows = new TSMap<number, Set<Row>>();
    }

    public getRowById(id: string): Row {
        let foundRow: Row | undefined = undefined;
        this.pageRows.values().forEach(set => {
           set.forEach(row => {
               if (row.getElementId() == id) {
                   foundRow = row;
               }
           }) ;
        });

        if (foundRow === undefined) {
            return null;
        }
        return foundRow;
    }

    public rows(): TSMap<number, Set<Row>> {
        return this.pageRows;
    }

    public addRow(time: number, row: Row): Sequence {
        if (!this.pageRows.has(time)) {
            this.pageRows.set(time, new Set<Row>());
        }
        this.pageRows.get(time).add(row);
        this.updateFrontend();
        return this;
    }

    public deleteRow(row: Row): Sequence {
        this.pageRows.get(row.getTime()).delete(row);
        this.updateFrontend();
        return this;
    }



    /**
     * Generate a new sequence table on the frontend;
     * To be called after a row addition
     */
    public updateFrontend(): void {
        let tableRows: HTMLElement[] = WebElements.ALL_SEQUENCE_ROWS();
        // Clear table
        tableRows.forEach(function(row) {
            if (row.id === 'sequence_head') {
                return;
            }
            Main.get().removeRowEventListeners(row.id);
            row.remove();
        });

        // Rebuild table
        let times: number[] = this.pageRows.keys().sort(function(a, b) { return a - b });
        for (let i = 0; i < times.length; i ++) {
            this.pageRows.get(times[i]).forEach(row => {
                WebElements.SEQUENCE_TABLE.append(row.html());
                Main.get().setupRowEventListeners(row.getElementId());
            })
        }

        // Finally, make the table visible
        if (WebElements.SEQUENCE_TABLE.hasClass('hidden')) {
            WebElements.SEQUENCE_TABLE.removeClass('hidden');
        }
    }

    public clear(): void {
        this.pageRows.clear();
        this.updateFrontend();
    }

}

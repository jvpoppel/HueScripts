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

    rows: TSMap<number, Row>;
}
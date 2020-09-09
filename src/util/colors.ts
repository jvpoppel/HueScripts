import * as colorsAPI from '../../lib/colors';

export class Colors {
    public static convertRGBtoXY(red: number, green: number, blue: number) {
        return colorsAPI.colors().rgbToCIE1931(red, green, blue);
    }
}
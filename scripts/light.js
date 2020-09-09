/**
 * @author Johan van Poppel ( https://github.com/jvpoppel/HueScripts )
 */
/**
 * HueScripts Light Class
 * @param id Light ID
 */
function Light(id) {
    this.id = id;
    this.color = [0, 0, 0];
    this.getID = function () {
        return this.id;
    };
    this.toString = function () {
        return this.id;
    };
    this.getColor = function () {
        return this.color;
    };
    this.setColor = function (red, green, blue) {
        this.color = [red, green, blue];
    };
}

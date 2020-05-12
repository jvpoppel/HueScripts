/**
 * @author Johan van Poppel ( https://github.com/jvpoppel/HueScripts )
 */

/**
 * HueScripts Page Class
 * @param id Page ID
 */
function Page(id) {
    this.id = id;
    this.commands = [];

    this.getCommands = function() {
        return this.commands;
    }

    this.setCommands = function(commands) {
        this.commands = commands;
    }

    this.getID = function() {
        return this.id;
    }


    this.toString = function() {
        return this.id;
    }
}
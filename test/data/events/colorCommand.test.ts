import { expect } from 'chai';
import {ColorCommand} from "../../../src/data/events/colorCommand";

describe('ColorCommand functionality', () => {

    it('Create command', () => {
        let command: ColorCommand = new ColorCommand(1, [255, 255], true)
        expect(command.light).to.be.equal(1, "Light ID should be 1");
        //expect(command.values[0]).to.be.equal(255, "Brightness should be 255");
        //expect(command.values[1]).to.be.equal(255, "Transition time should be 255");
        expect(command.executed).to.be.false("Command should not be executed by default");
    });

    it('Reset a non-executed command', () => {
        let command: ColorCommand = new ColorCommand(1, [255, 255], true)
        expect(command.executed).to.be.false("Command should not be executed by default");
        command.reset();
        expect(command.executed).to.be.false("Command should not be executed after reset");
    });

    it("Execute a command and reset it", () => {
        let command: ColorCommand = new ColorCommand(1, [255, 255], true);
        command.execute();
        expect(command.executed).to.be.true("Command should be executed");
        command.reset();
        expect(command.executed).to.be.false("Command should not be executed after reset");
    });

    it("Execute a command twice without resetting", () => {
        let command: ColorCommand = new ColorCommand(1, [255, 255], true);
        expect(command.execute()).to.be.true("Command should be successfully executed");
        expect(command.execute()).to.be.false("Command should not be successfully executed the second time");
    });

    it("Validation on amount of arguments in values", () => {
        expect(new ColorCommand(1, [])).to.be.an('error', "BrightnessCommand had no values");
        expect(new ColorCommand(1, [1, 2, 3])).to.be.an('error', "BrightnessCommand had too many values");
    });
})

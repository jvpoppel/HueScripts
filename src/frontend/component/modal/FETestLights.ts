import {WebElements} from "../../../static/webElements";
import {Session} from "../../../static/session";
import {Logger} from "../../../util/logger";
import {BrightnessCommand} from "../../../data/events/brightnessCommand";

export class FETestLights {

  public static async createLightTable(): Promise<void> {
    let divTable: HTMLElement = WebElements.LIGHT_MODAL_TABLE.get(0);
    divTable.innerHTML = "";
    let lightIDs: number[] = Session.get().lights();
    Logger.getLogger().info("light IDs = " + lightIDs);
    let content: string = "<table id=\"lightTable\">";
    content += "<thead><tr><th>ID</th><th> </th><th> </th><th>Test button</th></tr></thead><tbody>";

    for (let lightIndex = 0; lightIndex < lightIDs.length; lightIndex++) {
      content += "<tr><td>" + lightIDs[lightIndex] + "</td><td> </td><td> </td>";
      content += "<td><button type=\"button\" id=\"lightTest_" + lightIDs[lightIndex] + "\" class=\"btn btn-info btn-sm\"> Test Light";
      content += "</button></td></tr>";
    }

    content += "</tbody></table>";
    divTable.append(content);

    for (let lightIndex = 0; lightIndex < lightIDs.length; lightIndex++) {
      WebElements.LIGHT_MODAL_LIGHT(lightIndex).get(0).addEventListener("click",(e:Event) => FETestLights.testLight(lightIndex));
    }
  }

  /**
   * Function that sets the brightness of a light first to 50 then to 255
   * @param id Light ID
   */
  public static async testLight(id): Promise<void> {
    Logger.getLogger().debug("Test light " + id);
    new BrightnessCommand(id, [10]).execute();
    await new Promise(f => setTimeout(f, 250));
    new BrightnessCommand(id, [255]).execute();
  }


}


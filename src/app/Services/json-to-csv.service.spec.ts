import { Injectable } from "@angular/core";

@Injectable()
export class JsonToCSVService {
  constructor() {}

  saveText(data, filename, type) {
    var file = new Blob([data], { type: type });
    if (window.navigator.msSaveOrOpenBlob)
      // IE10+
      window.navigator.msSaveOrOpenBlob(file, filename);
    else {
      // Others
      var a = document.createElement("a"),
        url = URL.createObjectURL(file);
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(function() {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 0);
    }
  }

  exportJsonAsCSVFile(json, filename) {
    var fields = Object.keys(json[0]);
    var replacer = function(key, value) {
      return value === null ? "" : value;
    };
    var csv = json.map(function(row) {
      return (
        "\n" +
        fields
          .map(function(fieldName) {
            return JSON.stringify(row[fieldName], replacer);
          })
          .join(",")
      );
    });
    csv.unshift("Card Name,Type,Color Identity,Mana Cost,Rarity,Rating,"); // add header column
    this.saveText(csv, filename, "csv");
  }
}

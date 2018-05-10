import { Component, OnInit } from '@angular/core';
import { ServerCommunication } from './communication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  public pixelsArray: Array<any> = [];
  public palette: Array<string> = [];
  private selectedColor: string = '';
  private selectedTile: number = 0;
  public constant: number = 0;
  private victoryCondition: number = 0;
  public victoryBool: boolean = false;
  private locked: Object = {}

  constructor(private _server: ServerCommunication) {}  

  ngOnInit() {
      this._server.getJSON('data.json').subscribe(
        data => {
          let x = 0;
          this.pixelsArray.push ([]);
          for(let d of data['tiles']) {
              if(d != 99) {
                this.pixelsArray[x].push(d);
                this.constant = Math.max(this.constant, this.pixelsArray[x].length);
                if(d != 0) {
                  this.victoryCondition++;
                }
              }
              else {
                x++;
                this.pixelsArray.push([]);
              }
          }
          this.palette = data['palette'];
          setTimeout(() => {
            for(let i = 0; i < this.pixelsArray.length; i++) {
              for(let j = 0; j < this.pixelsArray[i].length; j++) {
                const id = this.constant * i + j;
                document.getElementById(id.toString()).style.color = this.decideColor(this.pixelsArray[i][j]);
              }
            }
          }, 100);
        },
        error => {
          console.log(error)
        }
      )
  }

  onCLick(id, pixel) {
    if(pixel == 0) {
      return;
    }
    if(this.locked[id] && this.locked[id] == true) { 
      return;
    }
    if(this.selectedTile == 0) {
      return;
    }
    if(this.selectedTile == pixel) {
      document.getElementById(id).style.color = this.selectedColor;
      document.getElementById(id).style.background = this.selectedColor;
      document.getElementById(id).style.filter = 'grayscale(0)';
      document.getElementById(id).style.opacity = '1';
      this.locked[id] = true;
      if(Object.keys(this.locked).length == this.victoryCondition) {
        this.victoryBool = true;
      }
    }
    else {
      document.getElementById(id).style.background = this.selectedColor;
      document.getElementById(id).style.color = this.decideColor(this.selectedTile);
      document.getElementById(id).style.filter = 'grayscale(2%)';
      document.getElementById(id).style.opacity = '.7';
    }
  }

  selectColor(color, i) {
    document.getElementById('selectedColor').style.background = color;
    this.selectedColor = color;
    this.selectedTile = i;
  }

  closeBool() {
    this.victoryBool = false;
  }

  decideColor(pixel) {
    let result: Array<number> = [];
    const c: number = 150;

    if(this.palette[pixel].indexOf('#') != -1) {
      result = this.hexToRgb(this.palette[pixel]);
    }
    else {
      result = this.rgbToArray(this.palette[pixel]);
    }
    if (result[0] >= c && result[1] >= c) {
      return '#000';
    }
    else if (result[0] >= c && result[2] >= c) {
      return '#000';
    }
    else if (result[1] >= c && result[2] >= c) {
      return '#000';
    }
    else {
      return '#FFF';
    }
  }


  hexToRgb(hex: string): Array<number> {
   // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
     ] : null;
  }

  rgbToArray(rgb: string): Array<number> {
    let result: Array<number> = []

    rgb = rgb.substr(rgb.indexOf('(') + 1, rgb.length);
    while(rgb.indexOf(',') != -1) {
      result.push(parseInt(rgb.substr(0, rgb.indexOf(','))));
      rgb = rgb.substr(rgb.indexOf(',') + 1, rgb.length);
    }
    result.push(parseInt(rgb.substr(0, rgb.indexOf(')'))));

    return result
  }
}

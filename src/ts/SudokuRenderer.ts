/// <reference path="./SudokuGrid.ts" />
/// <reference path="./ReactRenderer.tsx" />

import { SudokuGrid } from "./SudokuGrid";
import { RenderGrid } from "./ReactRenderer";

export class SudokuRenderer {
    private grid: SudokuGrid;

    constructor(grid: SudokuGrid) {
        this.grid = grid;
    }

    public renderGrid(element: HTMLElement) {
        // TODO : User better render method
        // this.renderGridUsingStringInjection(element);
         this.renderGridUsingReact(element);
    }

    private renderGridUsingReact(element: HTMLElement) {
        RenderGrid(element, this.grid);
    }

    private renderGridUsingStringInjection(element: HTMLElement) {
        // TODO : Remove this! Only here because React got hard :(
        let html = "<table>";
        for (let i = 1; i <= this.grid.getGridSideLength(); i++) {
            const row = this.grid.getRow(i);
            html += "<tr>";
            for (let j = 0; j <= row.length; j++) {
                const cell = row[j];
                if (cell) {
                    html += "<td>";
                        html += "Row:" + cell.getRowIndex()
                        html += "<br/>Col:" + cell.getColIndex()
                        html += "<br/>Sq:" + cell.getSqIndex()
                        html += "<br/>Val:" + cell.getValues().join(", ");
                    html += "</td>";
                }
            }
            html += "</tr>";
        }
        html += "</table>";
        element.innerHTML = html;
    }
}

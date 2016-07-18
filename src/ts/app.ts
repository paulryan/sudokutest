/// <reference path="./SudokuGrid.ts" />
/// <reference path="./SudokuRenderer.ts" />

import { SudokuGrid } from "./SudokuGrid";
import { SudokuRenderer } from "./SudokuRenderer";

window.onload = () => {
    const sudokuGrid = new SudokuGrid(9);
    const sudokuRenderer = new SudokuRenderer(sudokuGrid);

    sudokuGrid.setCellValue(1, 1, 1);
    sudokuGrid.setCellValue(1, 2, 2);
    sudokuGrid.setCellValue(9, 9, 9);

    const el = document.getElementById("content");
    sudokuRenderer.renderGrid(el);
};

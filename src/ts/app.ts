/// <reference path="./SudokuGrid.ts" />
/// <reference path="./ReactRenderer.tsx" />

import { SudokuGrid } from "./SudokuGrid";
import { RenderGrid } from "./ReactRenderer";

window.onload = () => {
    const isCascade = false;
    const sudokuGrid = new SudokuGrid(9, isCascade);
    //const sudokuRenderer = new SudokuRenderer(sudokuGrid);

    const el = document.getElementById("content");

    // Do logic to build initial state of sudoku grid
    // sudokuGrid.setCellValue(1, 1, 1);
    // sudokuGrid.setCellValue(1, 2, 2);
    // sudokuGrid.setCellValue(9, 9, 9);

    // Render grid. The rendered grid will handle further interations
    RenderGrid(el, sudokuGrid);
};

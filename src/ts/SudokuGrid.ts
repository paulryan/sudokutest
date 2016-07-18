/// <reference path="./SudokuCell.ts" />

import { SudokuCell } from "./SudokuCell";

export class SudokuGrid {
    private gridSideLength: number;
    private sqSideLength: number;
    private cells: Array<SudokuCell>;

    constructor(gridSideLength: number) {
        if (gridSideLength < 1 || !this.isInteger(Math.sqrt(gridSideLength))) {
            throw "SudokuGrid.constructor: Argument Out Of Range Exception: gridSideLength";
        }

        this.gridSideLength = gridSideLength;
        this.sqSideLength = Math.sqrt(this.gridSideLength);
        this.cells = [];

        this.initGrid();
    }

    public getGridSideLength() {
        return this.gridSideLength;
    }

    // TODO : this can be more efficient
    public getRow(index: number) {
        if (index < 1 || index > this.gridSideLength) {
            throw "SudokuGrid.getRow: Argument Out Of Range Exception: index";
        }
        return this.cells.filter(c => c.getRowIndex() === index);
    }

    // TODO : this can be more efficient
    public getCol(index: number) {
        if (index < 1 || index > this.gridSideLength) {
            throw "SudokuGrid.getCol: Argument Out Of Range Exception: index";
        }
        return this.cells.filter(c => c.getColIndex() === index);
    }

    // TODO : this can be more efficient
    public getSqr(index: number) {
        if (index < 1 || index > this.gridSideLength) {
            throw "SudokuGrid.getSqr: Argument Out Of Range Exception: index";
        }
        return this.cells.filter(c => c.getSqIndex() === index);
    }

    public setCellValue(row: number, col: number, cellValue: number) {
        // Validate params
        if (row < 1 || row > this.gridSideLength) {
            throw "SudokuGrid.setCellValue: Argument Out Of Range Exception: row";
        }
        if (col < 1 || col > this.gridSideLength) {
            throw "SudokuGrid.setCellValue: Argument Out Of Range Exception: col";
        }
        if (cellValue < 1 || cellValue > this.gridSideLength) {
            throw "SudokuGrid.setCellValue: Argument Out Of Range Exception: cellValue";
        }
        // Get cell // TODO : this can be more efficient
        const matchingCells = this.cells.filter(c => c.getRowIndex() === row && c.getColIndex() === col);
        if (matchingCells.length < 1) {
            throw "SudokuGrid.setCellValue: Invalid Grid Exception: more than a single cell matched a row/col index";
        }
        const cell = matchingCells[0];
        // Validate that value is legal
        const isValueLegal = cell.isValueLegal(cellValue);
        if (!isValueLegal) {
            throw "SudokuGrid.setCellValue: Invalid Grid Exception: Illegal move";
        }
        cell.setValue(cellValue);
        // Update cells affected by this update
        this.removePossibleValueFromRow(cell.getRowIndex(), cellValue);
        this.removePossibleValueFromCol(cell.getColIndex(), cellValue);
        this.removePossibleValueFromSqr(cell.getSqIndex(), cellValue);
    }

    private initGrid() {
        for (let iCol = 1; iCol <= this.gridSideLength; iCol++) {
            for (let iRow = 1; iRow <= this.gridSideLength; iRow++) {
                const iSq = this.calculateSqIndex(iRow, iCol);
                this.cells.push(new SudokuCell(iRow, iCol, iSq, this.getInitCellValues()));
            }
        }
    }

    private calculateSqIndex(iRow: number, iCol: number) {
        const rowSq = Math.floor((iRow - 1) / this.sqSideLength);
        const colSq = Math.floor((iCol - 1) / this.sqSideLength);
        return (rowSq * this.sqSideLength) + colSq + 1;
    }

    private isInteger(val: number) {
        return typeof val === "number" &&
            isFinite(val) &&
            Math.floor(val) === val;
    }

    private getInitCellValues() {
        // TODO: Must be a more efficient way to achieve this!
        let initCellValues: Array<number> = [];
        for (let i = 1; i <= this.gridSideLength; i++) {
            initCellValues.push(i);
        }
        return initCellValues;
    }

    private removePossibleValueFromRow(rowIndex: number, cellValue: number) {
        this.getRow(rowIndex).forEach(c => c.removeValue(cellValue));
    }

    private removePossibleValueFromCol(colIndex: number, cellValue: number) {
        this.getCol(colIndex).forEach(c => c.removeValue(cellValue));
    }

    private removePossibleValueFromSqr(sqrIndex: number, cellValue: number) {
        this.getSqr(sqrIndex).forEach(c => c.removeValue(cellValue));
    }
}

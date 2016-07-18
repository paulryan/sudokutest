/// <reference path="./SudokuCell.ts" />

import { SudokuCell } from "./SudokuCell";

export class SudokuGrid {
    private isCascade: boolean;
    private gridSideLength: number;
    private sqSideLength: number;
    private cells: Array<SudokuCell>;

    constructor(gridSideLength: number, isCascade: boolean, cells?: SudokuCell[]) {
        if (gridSideLength < 1 || !this.isInteger(Math.sqrt(gridSideLength))) {
            throw "SudokuGrid.constructor: Argument Out Of Range Exception: gridSideLength";
        }

        this.isCascade = isCascade;
        this.gridSideLength = gridSideLength;
        this.sqSideLength = Math.sqrt(this.gridSideLength);

        this.cells = [];
        if (cells) {
            // this.cells = cells;
            for (let i = 0; cells.hasOwnProperty(i.toString()); i++) {
                this.cells.push(cells[i]);
            }
        } else {
            this.initGrid();
        }
    }

    public getIsCascade() {
        return this.isCascade;
    }

    public getGridSideLength() {
        return this.gridSideLength;
    }

    public getCells() {
        return this.cells;
    }

    public getRows() {
        const rows: SudokuCell[][] = [];
        for (let iRow = 1; iRow <= this.gridSideLength; iRow++) {
            const row = this.getRow(iRow);
            rows.push(row);
        }
        return rows;
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

    public setCellValue(row: number, col: number, cellValue: number): boolean {
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
        // Validate that value is legal - that the value is one of the possible values
        // associated with this cell
        const isValueLegal = cell.isValueLegal(cellValue);
        if (!isValueLegal) {
            throw "SudokuGrid.setCellValue: Invalid Grid Exception: Illegal move";
        }

        if (!this.isCascade) {
            // Ensure that another cell isn't preventing this move from being illegal
            const sqr = cell.getSqIndex();
            const rowMatches = this.getRow(row).filter(c => c.getColIndex() !== col && c.getOnlyValueElseNull() === cellValue);
            const colMatches = this.getCol(col).filter(c => c.getRowIndex() !== row && c.getOnlyValueElseNull() === cellValue);
            const sqrMatches = this.getSqr(sqr).filter(c => (c.getRowIndex() !== row || c.getColIndex() !== col) && c.getOnlyValueElseNull() === cellValue);
            if (rowMatches.length > 0 || colMatches.length > 0 || sqrMatches.length > 0) {
                return false;
            }

            // Ensure that any cells which are updated because of this move are not put in an illegal state
            // TODO: Currently the board can get into an illegal state!
        }

        cell.setValue(cellValue);
        // Update cells affected by this update
        this.removePossibleValueFromRow(cell.getRowIndex(), cellValue);
        this.removePossibleValueFromCol(cell.getColIndex(), cellValue);
        this.removePossibleValueFromSqr(cell.getSqIndex(), cellValue);
        return true;
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

    private removeValueAndCascade(cell: SudokuCell, cellValue: number) {
        let didCascase = false;
        const isRemove = cell.removeValue(cellValue);
        if (this.isCascade && isRemove) {
            // If we determined the value of another cell then we must
            // cascade the remove effect there as well
            const onlyPossibleValue = cell.getOnlyValueElseNull();
            if (onlyPossibleValue !== null) {
                this.setCellValue(cell.getRowIndex(), cell.getColIndex(), onlyPossibleValue);
                didCascase = true;
            }
        }
        return didCascase;
    }

    private removePossibleValueFromRow(rowIndex: number, cellValue: number) {
        this.getRow(rowIndex).forEach(c => this.removeValueAndCascade(c, cellValue));
    }

    private removePossibleValueFromCol(colIndex: number, cellValue: number) {
        this.getCol(colIndex).forEach(c => this.removeValueAndCascade(c, cellValue));
    }

    private removePossibleValueFromSqr(sqrIndex: number, cellValue: number) {
        this.getSqr(sqrIndex).forEach(c => this.removeValueAndCascade(c, cellValue));
    }
}

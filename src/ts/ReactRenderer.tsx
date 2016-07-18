
/// <reference path="./SudokuGrid.ts" />
/// <reference path="./SudokuCell.ts" />

import * as React from "react";
import * as ReactDOM from "react-dom";

import { SudokuGrid } from "./SudokuGrid";
import { SudokuCell } from "./SudokuCell";

interface ISudokuGrid {
    initialGrid: SudokuGrid;
}

interface ISudokuGridRow {
    gridRow: SudokuCell[];
    onSetCellValue: (row: number, col: number, cellValue: number) => void;
}

interface ISudokuGridCell {
    gridCell: SudokuCell;
    onSetCellValue: (row: number, col: number, cellValue: number) => void;
}

class GridCellReact extends React.Component<ISudokuGridCell, {}> {
    constructor() {
        super();
        this.handleClick = this.handleClick.bind(this);
    }
    public handleClick(cellVal: number): boolean {
        if (typeof cellVal === "number") {
            const isAllowedMove = this.props.onSetCellValue(
                this.props.gridCell.getRowIndex(),
                this.props.gridCell.getColIndex(),
                cellVal
            );
            if (!isAllowedMove) {
                alert("Illegal move!");
            }
        }
        return false;
    };
    public render() {
        const _self = this;
        const cellBtns = this.props.gridCell.getValues().map(function(cellVal, indx) {
            return (
                <a key={indx} onClick={e => _self.handleClick(cellVal)} href="#">{cellVal}</a>
            );
        });
        return (
            <td onClick={this.handleClick}>
                {cellBtns}
            </td>
        );
    };
}

class GridRowReact extends React.Component<ISudokuGridRow, {}> {
    public render() {
        const _self = this;
        const gridCells = this.props.gridRow.map(function(gridCell, indx) {
            return (
                <GridCellReact key={indx} gridCell={gridCell} onSetCellValue={_self.props.onSetCellValue} />
            );
        });
        return (
            <tr>
                {gridCells}
            </tr>
        );
    };
}

class GridReact extends React.Component<ISudokuGrid, SudokuCell[]> {
    constructor() {
        super();
        this.handleSetCellValue = this.handleSetCellValue.bind(this);
    }

    public componentWillMount() {
        this.setState(this.props.initialGrid.getCells());
    }

    public handleSetCellValue(row: number, col: number, cellVal: number) {
        const stateGrid = this.getStateGrid();
        const isAllowedMove = stateGrid.setCellValue(row, col, cellVal);
        this.setState(stateGrid.getCells());
        return isAllowedMove;
    };

    public getStateGrid() {
        return new SudokuGrid(9, this.props.initialGrid.getIsCascade(), this.state);
    }

    public render() {
        const _self = this;
        const gridRows = this.getStateGrid().getRows().map(function(gridRow, indx) {
            return (
                <GridRowReact key={indx} gridRow={gridRow} onSetCellValue={_self.handleSetCellValue} />
            );
        });
        return (
            <table className="sudokuGrid">
                <tbody>
                    {gridRows}
                </tbody>
            </table>
        );
    };
}

export function RenderGrid (element: HTMLElement, initialGrid: SudokuGrid) {
    ReactDOM.render(
        <GridReact initialGrid={initialGrid} />,
        document.getElementById("content")
    );
}

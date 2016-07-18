export class SudokuCell {
    private rowIndex: number;
    private colIndex: number;
    private sqIndex: number;
    private values: Array<number>

    constructor(row: number, col: number, sq: number, values: Array<number>) {
        this.rowIndex = row;
        this.colIndex = col;
        this.sqIndex = sq;
        this.values = values;
    }

    public getRowIndex() {
        return this.rowIndex;
    }

    public getColIndex() {
        return this.colIndex;
    }

    public getSqIndex() {
        return this.sqIndex;
    }

    public getValues() {
        return this.values;
    }

    public getOnlyPossibleValueElseNull() {
        let onlyPossibleValue = <number>null;
        if (this.values.length === 1) {
            onlyPossibleValue = this.values[0];
        }
        return onlyPossibleValue;
    }

    public isValueLegal(value: number) {
        const isLegal = this.values.filter(v => v === value).length > 0;
        return isLegal;
    }

    public setValue(value: number) {
        if (!this.isValueLegal(value)) {
            throw "SudokuCell.setValue: Argument Out Of Range Exception: Illegal move";
        }
        this.values = this.values.filter(v => v === value);
    }

    public removeValue(value: number) {
        const preCount = this.values.length;
        if (preCount < 2) {
            // Never remove the only value
            return false;
        } else {
            this.values = this.values.filter(v => v !== value);
            const postCount = this.values.length;
            const isValueRemoved = (preCount > postCount);
            return isValueRemoved;
        }
    }
}
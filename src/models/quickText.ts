class QuickText {
  text: string;
  sort: number;
  id: number;
  categoryIds?: number[];

  constructor(text: string, sort: number, id: number, categoryIds?: number[]) {
    this.text = text;
    this.sort = sort;
    this.id = id;
    this.categoryIds = categoryIds;
  }
}
export default QuickText;

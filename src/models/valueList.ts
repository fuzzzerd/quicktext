class ValueList {
  id: number;
  name: string;
  sortOrder: number;
  values: string[];

  constructor(
    id: number,
    name: string,
    sortOrder: number,
    values: string[] = []
  ) {
    this.id = id;
    this.name = name;
    this.sortOrder = sortOrder;
    this.values = values;
  }
}

export default ValueList;

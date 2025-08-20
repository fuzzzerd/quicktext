class Category {
  id: number;
  name: string;
  icon?: string;
  sortOrder: number;
  pin?: string;

  constructor(
    id: number,
    name: string,
    sortOrder: number,
    icon?: string,
    pin?: string
  ) {
    this.id = id;
    this.name = name;
    this.sortOrder = sortOrder;
    this.icon = icon;
    this.pin = pin;
  }
}

export default Category;

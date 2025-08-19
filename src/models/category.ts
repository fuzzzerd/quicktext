class Category {
  id: number;
  name: string;
  icon?: string;
  sortOrder: number;

  constructor(id: number, name: string, sortOrder: number, icon?: string) {
    this.id = id;
    this.name = name;
    this.sortOrder = sortOrder;
    this.icon = icon;
  }
}

export default Category;
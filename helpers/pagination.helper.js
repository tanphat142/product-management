module.exports = (pagination, query, countProducts) => {

  if (query.page) {
    pagination.currentPage = parseInt(query.page);
  }

  pagination.skip = (pagination.currentPage - 1) * pagination.limitItems;

  //tinh tong so trang
  const totalPage = Math.ceil(countProducts / pagination.limitItems);
  pagination.totalPage = totalPage;

  return pagination;
}
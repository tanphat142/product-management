module.exports = (query) => {
  
  let objectSearch = {
    keyword: "",
  }

  if(query.keyword) {
    objectSearch.keyword = query.keyword;
    //"i" là chế độ không phân biệt chữ hoa chữ thường
    const regex = new RegExp(objectSearch.keyword, "i");
    //thêm regex để find vao objectSearch
    objectSearch.regex = regex;
  }

  return objectSearch;
}
class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }
  //   search
  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};
    this.query = this.query.find({ ...keyword });
    return this;
  }
  // filter
  filter() {
    const querycopy = { ...this.queryStr };
    // Removing filed to catrgory
    const removeField = ["keyword", "page", "limit"];
    removeField.forEach((key) => delete querycopy[key]);
    // lasyload
    // Fliter for price
    let queryStr = JSON.stringify(querycopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }
  pagination(resultPerPage) {
    const cureentPage = Number(this.queryStr.page) || 1;
    const skip = resultPerPage * (cureentPage - 1);
    this.query = this.query.limit(resultPerPage).skip(skip);
    return this;
  }
}

module.exports = ApiFeatures;

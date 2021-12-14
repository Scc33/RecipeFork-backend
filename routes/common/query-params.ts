const queryParams = (baseQuery, queryParams) => {
  const where = ('where' in queryParams) ? JSON.parse(queryParams.where) : undefined;
  const sort = ('sort' in queryParams) ? JSON.parse(queryParams.sort) : undefined;
  const select = ('select' in queryParams) ? JSON.parse(queryParams.select) : undefined;
  const skip = ('skip' in queryParams) ? Number(queryParams.skip) : undefined;
  const limit = ('limit' in queryParams) ? Number(queryParams.limit) : undefined;
  const count = ('count' in queryParams) ? JSON.parse(queryParams.count) : undefined;


  let modifiedQuery = baseQuery;

  if (where !== undefined) {
    modifiedQuery = modifiedQuery.where(where);
  }

  if (sort !== undefined) {
    modifiedQuery = modifiedQuery.sort(sort);
  }

  if (select !== undefined) {
    modifiedQuery = modifiedQuery.select(select);
  }

  if (skip !== undefined) {
    modifiedQuery = modifiedQuery.skip(skip);
  }

  if (limit !== undefined) {
    modifiedQuery = modifiedQuery.limit(limit);
  }

  if (count !== undefined) {
    modifiedQuery = modifiedQuery.count(count);
  }

  return modifiedQuery;
}

export default queryParams;
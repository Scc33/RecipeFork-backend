const queryParams = (baseQuery, params) => {
  const where = ('where' in params) ? JSON.parse(params.where) : undefined;
  const sort = ('sort' in params) ? JSON.parse(params.sort) : undefined;
  const select = ('select' in params) ? JSON.parse(params.select) : undefined;
  const skip = ('skip' in params) ? Number(params.skip) : undefined;
  const limit = ('limit' in params) ? Number(params.limit) : undefined;
  const count = ('count' in params) ? JSON.parse(params.count) : undefined;

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
};

export default queryParams;

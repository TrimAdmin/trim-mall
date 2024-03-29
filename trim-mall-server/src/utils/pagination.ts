export function pagination(page: number = 1, limit: number = 10) {
  return {
    skip: limit * (page - 1),
    take: limit
  }
}

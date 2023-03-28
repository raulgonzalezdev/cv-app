const apiUrl =
  process.env.NODE_ENV === 'development'
    ? process.env.NEXT_PUBLIC_SERVICE // development api
    : 'http://localhost:8000' // production api

export { apiUrl }

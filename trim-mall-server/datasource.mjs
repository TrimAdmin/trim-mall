import { DataSource } from 'typeorm'

const dataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '123456',
  database: 'trim_mall',
  entities: ['./src/entity/*.ts'],
  migrations: [
    /*...*/
  ]
})

export default dataSource

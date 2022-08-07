import {Module} from '@nestjs/common'
import {TypeOrmModule} from '@nestjs/typeorm'
import {HomeModule} from './home.module'
import {Home} from '../entities/home.entity'
import {ConfigModule} from '@nestjs/config'

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.PG_HOST,
            port: Number.parseInt(process.env.PG_PORT),
            database: process.env.PG_DB,
            username: process.env.PG_USER,
            password: process.env.PG_PASSWORD,
            entities: [Home],
            synchronize: true,
        }),
        HomeModule,
    ],
    controllers: [],
    providers: [],
})
export class MainModule {
}

import {Module} from '@nestjs/common'
import {HomeService} from '../services/home.service'
import {TypeOrmModule} from '@nestjs/typeorm'
import {Home} from '../entities/home.entity'
import {HomeController} from '../controllers/home.controller'
import {PostController} from '../controllers/post.controller'

@Module({
    imports: [
        TypeOrmModule.forFeature([Home])
    ],
    controllers: [HomeController, PostController],
    providers: [HomeService],
    exports: [TypeOrmModule, HomeService]
})

export class HomeModule {
}

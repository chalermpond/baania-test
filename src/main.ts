import {NestFactory} from '@nestjs/core'
import {MainModule} from './modules/main.module'
import {ValidationPipe} from '@nestjs/common'


    
(async function bootstrap() {
    console.log(process.env)
    const app = await NestFactory.create(MainModule)

    //allow cross-origins
    app.enableCors({
        credentials: true,
        origin: [/^(.*)/],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        preflightContinue: false,
        optionsSuccessStatus: 204,
    })

    // add request validation pipeline
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
        }),
    )

    await app.listen(8000)
})()

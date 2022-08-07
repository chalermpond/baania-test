import {Controller, Get, Inject, Param, Query} from '@nestjs/common'
import {HomeService} from '../services/home.service'
import {PaginationRequest} from '../aggregates/common'
import {DatasourceResponse} from '../aggregates/datasource.response'

@Controller('/postCode')
export class PostController {
    constructor(
        @Inject(HomeService)
        private readonly _homeService: HomeService
    ) {
    }

    @Get('/')
    public getPostCode(
        @Query('skip') skip: number,
        @Query('take') take: number,
    ): Promise<DatasourceResponse<any>> {
        let pagination = new PaginationRequest(skip, take)

        return this._homeService.findPostCodes(pagination)

    }
    
    @Get('/:id')
    public getPostCodeSummary(
        @Param('id') id: string
    ){
        return this._homeService.getPostCodeSummary(id)
    }
}

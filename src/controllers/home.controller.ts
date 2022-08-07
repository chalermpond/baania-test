import {Body, Controller, Delete, Get, Param, Patch, Post, Query} from '@nestjs/common'
import {HomeService} from '../services/home.service'
import {HouseRequest} from '../aggregates/house.request'
import {PaginationRequest} from '../aggregates/common'
import {DatasourceResponse} from '../aggregates/datasource.response'
import {UpdateResponse} from '../aggregates/update.response'
import {CreateResponse} from '../aggregates/create.response'

@Controller('/home')
export class HomeController {
    constructor(private readonly _homeService: HomeService) {
    }

    @Get('/')
    public listHomes(
        @Query('skip') skip,
        @Query('take') take,
    ): Promise<DatasourceResponse<any>> {
        let pagination = new PaginationRequest(skip, take)

        return this._homeService.findAll(pagination)
    }

    @Post('/')
    public createNewHome(
        @Body() data: HouseRequest
    ): Promise<CreateResponse> {
        return this._homeService.createNewHome(data)
    }

    @Patch('/:id')
    public updateHome(
        @Param('id') id: string,
        @Body() data: HouseRequest,
    ): Promise<UpdateResponse> {
        let numId = Number.parseInt(id)
        return this._homeService.updateHome(numId, data)
    }
    
    @Delete('/:id')
    public deleteHome(
        @Param('id') id: string,
    ) {
        let numId = Number.parseInt(id)
        return this._homeService.deleteHome(numId)
    }

}

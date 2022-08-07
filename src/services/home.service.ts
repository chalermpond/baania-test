import {BadRequestException, HttpException, Injectable, Req, Res} from '@nestjs/common'
import {Home} from '../entities/home.entity'
import {FindManyOptions, Repository} from 'typeorm'
import {InjectRepository} from '@nestjs/typeorm'
import {HouseRequest} from '../aggregates/house.request'
import {PaginationRequest} from '../aggregates/common'
import {DatasourceResponse} from '../aggregates/datasource.response'
import {PostcodeResponse} from '../aggregates/postcode.response'
import {CreateResponse} from '../aggregates/create.response'
import {UpdateResponse} from '../aggregates/update.response'
import {DeleteResponse} from '../aggregates/delete.response'
import {PostCodeSummaryResponse} from '../aggregates/postcodesummary.response'
import Decimal from 'decimal.js'

@Injectable()
export class HomeService {

    constructor(
        @InjectRepository(Home)
        private readonly _homeRepository: Repository<Home>,
    ) {
    }

    public async findAll(pagination: PaginationRequest): Promise<DatasourceResponse<Home>> {
        let result = await this._homeRepository.find({
            take: pagination.take,
            skip: pagination.skip,
            order: {
                id: 'asc'
            }
        })

        let total = await this._homeRepository.count()

        let response = new DatasourceResponse<Home>()
        response.payload = result
        response.count = total

        return response
    }

    public async createNewHome(request: HouseRequest): Promise<CreateResponse> {
        let entity = request.toHomeEntity()

        let result = await this._homeRepository.insert(entity)

        return {
            id: result.identifiers[0].id
        }
    }

    public async findPostCodes(pagination: PaginationRequest): Promise<DatasourceResponse<PostcodeResponse>> {
        let query: FindManyOptions<Home> = {
            order: {
                post_code: {direction: 'asc'}
            },
            select: {
                post_code: true,
            }
        }

        let result = await this._homeRepository.find(query)


        let uniquePostCodes = result.reduce((previousValue, currentValue) => {
            if (!!previousValue.find(value => value.post_code === currentValue.post_code)) {
                return previousValue
            }

            previousValue.push(currentValue)
            return previousValue
        }, new Array<Home>())

        let total = uniquePostCodes.length

        let data = uniquePostCodes.slice(pagination.skip, pagination.take)
        let payload = data.map(d => new PostcodeResponse(d.post_code))
        let response = new DatasourceResponse<PostcodeResponse>()
        response.payload = payload
        response.count = total

        return response
    }

    public async updateHome(id: number, data: HouseRequest): Promise<UpdateResponse> {

        let entity = await this._homeRepository.findOneBy({id})
        if (!entity)
            throw new BadRequestException('data not found')

        entity.desc = data.desc
        entity.name = data.name
        entity.price = data.price
        entity.post_code = data.post_code

        await this._homeRepository.update(id, entity)

        return {id}
    }

    public async deleteHome(id: number): Promise<DeleteResponse> {
        let entity = await this._homeRepository.findOneBy({id})
        if (!entity)
            throw new BadRequestException('data not found')

        await this._homeRepository.delete({id})

        return {id}
    }

    public async getPostCodeSummary(id: string): Promise<DatasourceResponse<PostCodeSummaryResponse>> {
        let homes = await this._homeRepository.findBy({post_code: id})
        let response =  new DatasourceResponse<PostCodeSummaryResponse>()
        if (homes.length === 0) {
            
            response.payload = {
                median: '0',
                average: '0',
            }
            return response
        }

        let result = homes.map(h => new Decimal(h.price)).sort()

        let average = Decimal.sum(...result).dividedBy(result.length)

        let median: Decimal = new Decimal(0)

        let midIndex: number = Math.floor(result.length / 2)
        if (result.length % 2 === 0) {
            median = result[midIndex -1].add(result[midIndex]).dividedBy(2)
        } else {
            median = result[midIndex]
        }

        response.payload = {
            average: average.toString(),
            median: median.toString(),
        }
        return response

    }
}

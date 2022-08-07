export class PaginationRequest {
    public skip: number
    public take: number
    constructor(
        skip: number,
        take: number,
    ) {
        this.skip = skip || 0
        this.take = take || 5
    }
}

export abstract class AbstractResourceIdentityResponse {
    public id: number
}

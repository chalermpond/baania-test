import {IsDefined, IsNotEmpty, IsNumber, IsNumberString, IsString} from 'class-validator'
import {Home} from "../entities/home.entity";

export class HouseRequest {
    @IsDefined()
    @IsString()
    @IsNotEmpty()
    public name: string

    @IsDefined()
    @IsString()
    public desc: string

    @IsDefined()
    @IsNumberString()
    @IsNotEmpty()
    public price: string
    
    @IsDefined()
    @IsString()
    @IsNotEmpty()
    public post_code: string
    
    public toHomeEntity(): Home {
        let home = new Home()

        home.name = this.name
        home.desc = this.desc
        home.price = this.price
        home.post_code = this.post_code

        return home
    }
}

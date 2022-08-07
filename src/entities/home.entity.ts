import {Entity, Column, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Home {

    @PrimaryGeneratedColumn()
    public id: number
    
    @Column()

    public name: string
    
    @Column()
    public desc: string
    
    @Column({type: 'decimal'})
    public price: string
    
    @Column()
    public post_code: string
}

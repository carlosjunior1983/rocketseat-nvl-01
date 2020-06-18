import { Request, Response } from 'express'
import knex from '../database/connection';

class PointsController {

    async index( request: Request, response: Response){
        const { city, uf, items } = request.query;
        
        //Convertendo os itens de string para Array numerico
        const parsedItems = String(items).split(',').map(item=> Number(item.trim()) );
        
        //Selecionando os points
        const points = await knex('points')
                                .join('point_items','points.id','=','point_items.point_id')
                                .whereIn('point_items.item_id', parsedItems)
                                .where('city', String(city))
                                .where('uf', String(uf))
                                .distinct()
                                .select('points.*');


        const serializedPoints = points.map( point => {
            return {
                ... point,
                
                image_url: `http://192.168.0.107:3333/uploads/imagepoints/${point.image}`, 
            };
        });

        return response.json(serializedPoints);
    }

    async show( request: Request, response: Response){
        const { id } = request.params; //Pegando o ID vindo pelo GET;

        const point = await knex('points').where('id', id).first();

        if (!point){
            return response.status(400).json({message: 'Point not found.'});
        }


        const items = await knex('items')
                                .join('point_items', 'items.id', '=', 'point_items.item_id' )
                                .where ('point_items.point_id',id)
                                .orderBy('items.title');


        const serializedPoint = {
            ... point,
            image_url: `http://192.168.0.107:3333/uploads/imagepoints/${point.image}`
        };


        return response.json({serializedPoint, items});
    }


    async create(request: Request, response: Response) {
        const { name, email, whatsapp, latitude, longitude, city, uf, items } = request.body;  //Desestruturando para variaveis vindas pela rota
        
        const trx = await knex.transaction();
        const point = {
            image : request.file.filename,
            name, 
            email, 
            whatsapp, 
            latitude,
            longitude, 
            city, 
            uf 
        };


        //Inserindo o ponto de coleta
        const ids = await trx('points').insert(point);
        
        
        const point_id = ids[0];
    
        //Ajustar ITENS para ser inserido na tabela Point_items
        const pointItems = items
            .split(',')
            .map( (item: string) => Number(item.trim()) )
            .map( (item_id: number) => {
                return{
                    item_id,
                    point_id,
                };
        } );
      
        //Inserindo Point_Items
        await trx('point_items').insert(pointItems);
        await trx.commit();

        return response.json({
            id: point_id,
            ... point, 
        });
    
    }

}

export default PointsController;
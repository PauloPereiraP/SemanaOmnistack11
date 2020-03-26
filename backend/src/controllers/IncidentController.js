const connection = require('../database/connection');

module.exports = {
    async store(request, response) {
        const { title, description, value } = request.body;

        const ong_id = request.headers.authorization;
        
        const [id] = await connection('incidents').insert({
            title, 
            description,
            value,
            ong_id,
        });        

        return response.json({ id });   
    },

    async index(req, res){
        const { page = 1, itemsPerPage = 5} = req.query;

        const [count] = await connection('incidents')
                                    .count('id');

        console.log(count);

        var incidents = await connection('incidents')
                                        .join('ongs', 'ongs.id', 'incidents.ong_id')
                                        .limit(itemsPerPage)
                                        .offset((page - 1) * itemsPerPage)
                                        .select(['incidents.*', 'ongs.name', 'ongs.email',
                                                 'ongs.whatsapp', 'ongs.city', 'ongs.uf']);
        res.header('X-Total-Count', count['count(`id`)']);
        return res.json(incidents);
    },

    async delete(request, response){
        const { id } = request.params;
        const ong_id = request.headers.authorization;

        const incident = await connection('incidents')
                                        .where('id', id)
                                        .select('ong_id')
                                        .first();
        
        if(incident.ong_id !== ong_id){
            return response
                        .status(401)
                        .json({ error: 'Operation not permitted.'});
        } 

        await connection('incidents')
                        .where('id', id)
                        .delete();

        return response
                    .status(204)
                    .send();
    }
}
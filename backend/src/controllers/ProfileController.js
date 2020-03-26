const connection = require('../database/connection');

module.exports = {
    async index(request, response){
        var ong_id = request.headers.authorization;
        var incidents = await connection('incidents')
                                        .where('ong_id', ong_id)
                                        .select('*');

        return response.json(incidents);
    }
}
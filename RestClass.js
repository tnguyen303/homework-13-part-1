class RestfulAPI{
    constructor(resource, app, model){
        this.resource = resource;
        this.app = app;
        this.model = model;
    }

    findAll(){
        this.app.get(`/api/${this.resource}`, function(req,res){
            this.model.find({})
                .then(function(data){
                    res.json(data);
                })
                .catch(function(err){
                    res.json(err);
                });
        });
    }

    createNew(){
        this.app.post(`/api/${this.resource}`, function(req,res){
            this.model.create(req.body)
                .then(function(data){
                    res.json(data);
                })
                .catch(function(err){
                    res.json(err);
                });
        });
    }
}

module.exports = RestfulAPI;
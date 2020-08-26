import express, { request } from 'express';
import ClassesController from './controllers/ClassesController';
import ConnectionsController from './controllers/ConnectionsController';


const routes = express.Router();
const classesController = new ClassesController();
const connectionsController = new ConnectionsController();



routes.get('/classes', async (request, response) => {
    const {subject, week_day, time} = request.query;

    

    const item = await classesController.index({
        subject: subject as string, 
        time: time as string, 
        week_day: week_day as string
    });


    return response.json(item)

})

routes.post('/classes', (request, response) => {
    const {name, avatar, whatsapp, bio, subject, cost, schedule} = request.body;

    try {
        

        classesController.create({
            name,
            avatar,
            whatsapp,
            bio,
            subject,
            cost,
            schedule
        });

        return response.json({message: 'works!'})
    }
    catch(err){
        return response.status(400).json(err.message);
    }
})

routes.post('/connections', connectionsController.create);

routes.get('/connections', connectionsController.index);
export default routes;
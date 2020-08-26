import db from '../database/connection';
import convertHourToMinutes from '../utils/convertHourToMinutes';



interface ScheduleItem {
    week_day: number;
    from: string;
    to: string;
}

interface ConvertedScheduleItem {
    class_id: number,
    week_day: number;
    from: number;
    to: number;
}

interface CreateRequest {
    name: string, 
    avatar: string, 
    whatsapp: string, 
    bio: string, 
    subject: string, 
    cost: number,
    schedule: ScheduleItem[]
}

interface FilterIndex {
    week_day: string, 
    subject: string, 
    time: string
}

export default class ClassesController {

    async index({week_day, subject, time}: FilterIndex): Promise<any[]> {
        if(!subject || !week_day || !time){
            throw Error('Missing filters to search classes');
        }

        const timeInMinutes = convertHourToMinutes(time);

        const classes = await db('classes')
            .whereExists(function() {
                this.select('class_schedule.*')
                    .from('class_schedule')
                    .whereRaw('`class_schedule` . `class_id` = `classes` . `id`')
                    .whereRaw('`class_schedule` . `week_day` = ??', [Number(week_day)])
                    .whereRaw('`class_schedule` . `from` <= ??', [timeInMinutes])
                    .whereRaw('`class_schedule` . `to` > ??', [timeInMinutes])
            })
            .where('classes.subject', '=', subject)
            .join('users', 'classes.user_id', '=', 'users.id')
            .select(['classes.*', 'users.*'])


            
        return classes;
    }


    async create({name, avatar, whatsapp, bio, subject, cost, schedule}: CreateRequest): Promise<ConvertedScheduleItem[]> {
        
    
        const trx = await db.transaction();
    
        try {
            const insertedUsersId = await trx('users').insert({
                name, 
                avatar,
                whatsapp,
                bio
            })
        
            const user_id = insertedUsersId[0];
        
            const insertedClassesId = await trx('classes').insert({
                subject,
                cost,
                user_id
            })
        
            const class_id = insertedClassesId[0];
        
            const classSchedule = schedule.map((scheduleItem: ScheduleItem) => {
                return{ 
                    class_id,
                    week_day: scheduleItem.week_day,
                    from: convertHourToMinutes(scheduleItem.from),
                    to: convertHourToMinutes(scheduleItem.to)
                }
            });
        
            await trx('class_schedule').insert(classSchedule);
        
        
            await trx.commit();
        
            return classSchedule;
        }
        catch(err){
    
            await trx.rollback();
    
            throw Error('unexpected!')
        }
    }
}
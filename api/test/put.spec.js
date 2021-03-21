import chai from 'chai';
import chaiHttp from 'chai-http';
import taskModel from '../models/task';

chai.use(chaiHttp)

const app = require('../app');
const request = chai.request.agent(app);
const expect = chai.expect;

describe('put', () => {
    context('quando eu altero uma tarefa', () => {

        let task = {
            _id: require('mongoose').Types.ObjectId(),
            title: 'Comprar Fandangos',
            owner: 'eu@andrey.io',
            done: false
        }

        before((done) => {
            taskModel.insertMany([task])
            done()
        })

        it('entao deve retornar 200', (done) => {
            task.title = 'Comprar Baconzitos',
                task.done = true

            request
                .put('/task/' + task._id)
                .send(task)
                .end((err, res) => {
                    expect(res).to.have.status(200)
                    expect(res.body).to.eql({})
                })
            done();
        })

        it('e deve atualizar os dados', (done) => {
            request
                .get('/task/' + task._id)
                .end((err, res) => {
                    expect(res).to.have.status(200)
                    expect(res.body.data.title).to.eql('Comprar Baconzitos')
                    expect(res.body.data.done).to.be.true
                })
            done();
        })
    })
})
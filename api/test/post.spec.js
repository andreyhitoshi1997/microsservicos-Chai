import chai from 'chai';
import chaiHttp from 'chai-http';
import taskModel from '../models/task';

chai.use(chaiHttp)

const app = require('../app');
const request = chai.request.agent(app);
const expect = chai.expect;
const rabbit = chai.request('http://rabbitmq:15672/')

describe('post', () => {

    context('Quando eu cadastro uma tarefa', () => {

        let task = { title: 'Estudar Mongoose', owner: 'eu@andrey.io', done: false }

        before((done) => {
            rabbit
            .delete('/api/queues%2F/task/dev/contents')
            .auth('guest', 'guest')
            .end((err, res) => {
                expect(res).to.has.status(204)
                done()
            })
        })

        it('entao deve retornar 200', (done) => {
            request
                .post('/task')
                .send(task)
                .end((err, res) => {
                    expect(res).to.has.status(200)
                    expect(res.body.data.title).to.be.an('string')
                    expect(res.body.data.owner).to.be.an('string')
                    expect(res.body.data.done).to.be.an('boolean')
                    done();
                })
        })

        it('e deve enviar um email', (done) => {
            let payload = { 
                vhost: "/",
                name: "tasks",
                truncate: "50000",
                ackmode: "ack_requeue_true",
                encoding: "auto",
                count: "1"
             }

            rabbit
                .post('/api/queues/%2F/tasksdev/get')
                .auth('guest', 'guest')
                .send(payload)
                .end((res, err) => {
                    expect(res).to.has.status(200)
                    expect(res.bod[0].payload).to.contain(`Tarefa ${task.title} criada com sucesso!`)
                    done()
                })
            done();
        })
    })

    context('Quando nao informo o titulo', () => {
        let task = { title: 'Estudar Mongoose', owner: '', done: false }

        it('entao deve retornar 400', (done) => {
            request
                .post('/task')
                .send(task)
                .end((err, res) => {
                    expect(res).to.be.has.status(400);
                    expect(res.body.errors.owner.message).to.equal('Ooops! Owner is required.')
                    done();
                })
        })
    })

    context('Quando nao informo o dono', () => {
        let task = { title: '', owner: 'eu@andrey.io', done: false }

        it('entao deve retornar 400', (done) => {
            request
                .post('/task')
                .send(task)
                .end((err, res) => {
                    expect(res).to.be.has.status(400);
                    expect(res.body.errors.title.message).to.equal('Ooops! Title is required.')
                    done();
                })
        })
    })

    context('Quando a tarefa já existe', () => {
        let task = { title: 'Planejar viagem para a China', owner: 'eu@papito.io', done: false }

        before((done) => {
            request
                .post('/task')
                .send(task)
                .end((err, res) => {
                    expect(res).to.has.status(200)
                    done()
                })
        })

        it('deve retornar 409', (done) => {
            request
                .post('/task')
                .send(task)
                .end((err, res) => {
                    expect(res).to.has.status(409)
                    // console.log(res.body)
                    // expect(res.body.errmsg).to.include('duplicate key')
                    done();
                })
        })
    })
})
import chai from 'chai';
import chaiHttp from 'chai-http';
import taskModel from '../models/task'

chai.use(chaiHttp);

const app = require('../app');
const request = chai.request.agent(app);
const expect = chai.expect;

describe('get', () => {
    context('quando eu tenho tarefas cadastradas', () => {
        before((done) => {
            let tasks = [
                { title: 'Estudar Nodejs', owner: 'eu@andrey.com', done: false },
                { title: 'Contratos', owner: 'eu@andrey2.com', done: false },
                { title: 'Estudar MongoDB', owner: 'eu@andrey2.com', done: false }
            ]

            taskModel.insertMany(tasks)
            done();
        })

        it('Deve retornar uma lista', (done) => {
            request
                .get('/task')
                .end((err, res) => {
                    expect(res).to.has.status(200);
                    expect(res.body.data).to.be.an('array')
                    done();
                })
        })

        it('Deve filtrar por palavra chave', (done) => {
            request
                .get('/task')
                .query({ title: 'Estudar' })
                .end((err, res) => {
                    expect(res).to.has.status(200)
                    // expect(res.body.data[0].title).to.equal('Estudar MongoDB')
                    done();
                })
        })
    })
    //     // console.log(res.body.data)
    context('quando busco por id', () => {

        it('deve retornar uma única tarefa', (done) => {
            let tasks = [
                { title: 'Ler um livro de JavaScript', owner: 'eu@andrey.com', done: false }
            ]
            taskModel.insertMany(tasks, (err, result) => {
                let id = result[0]._id
                request
                    .get('/task/'+ id)
                    .end((err, res) => {
                        expect(res).to.has.status(200);
                        expect(res.body.data.title).to.equal('Ler um livro de JavaScript');
                        expect(res.body.data.title).to.equal(tasks[0].title);
                        done();
                    })
            });
        })
    })

    context('quandoa tarefa não existe', () => {

        it('deve retornar 404', (done) => {
            let id = require('mongoose').Types.ObjectId();
            request
            .get('/task/'+id)
            .end((err, res) => {
                expect(res).to.has.status(404);
                expect(res.body).to.eql({});
                done();
            });
        })
    })
})

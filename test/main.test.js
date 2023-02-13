const expect = require('expect')
const request = require('supertest')

const app = require('../main')
const sample = require('./../model/sample')

beforeEach((done)=>{
    sample.deleteMany({}).then(()=> done())
})

describe('POST /samples',()=>{
    it("data should add to collection",(done)=>{

        var text = "this is a sample test"
        request(app)
            .post('/samples')
            .send({text})
            .expect((res)=>{
                expect(res.body.text).toBe(text)
            })
            .end((err,res)=>{
                if(err){
                    return done(err)
                }
                sample.find().then((samples)=>{
                    expect(samples.length).toBe(1)
                    expect(samples[0].text).toBe(text)
                    done()
                }).catch((e) => done(e))
            })
            
    })
})

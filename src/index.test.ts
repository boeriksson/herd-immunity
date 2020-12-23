import {
    init,
    epidemic
} from './index'

describe('#init', () => {
    it('datest', () => {
        const population = init({populationSize: 10})
        expect(population.length).toBe(10)
    })
})

describe('#epidemic', () => {
    it('datest2', () => {
        const population = init({populationSize: 10})
        epidemic(population)
    })
})
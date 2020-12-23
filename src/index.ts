interface Conf {
    populationSize: number
}

interface Host {
    id: number
    social: number
    infected?: {
        active: boolean,
        aquireDate: number,
        recoverDate?: number
    }
}

interface Virus {
    virulence: number,
    contagiousPeriod: number
}


function getRandomInt(min:number, max:number):number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const virus: Virus = {
    virulence: 1,
    contagiousPeriod: 10
}

export function init(conf: Conf):Host[] {
    const population:Host[] = []
    for (let i = 0; i < conf.populationSize; i++) {
        population.push({
            id: i,
            social: getRandomInt(1, 10)
        })
    }
    return population
}

const infectRandomHost = (day: number, population: Host[]): Host | null =>
    infectHost(getRandomInt(0, population.length - 1), day, population)

function infectHost(ix: number, day:number, population: Host[]): Host | null {
    if (!population[ix].infected) {
        return {
            ...population[ix],
            infected: {
                active: true,
                aquireDate: day
            }
        }
    }
    return null
}

const applyPopulationChange = (changes: Host[], population: Host[]): void =>
    changes.forEach((change) => population[
        population.findIndex((host) => host.id === change.id)
        ] = change)

function infectHosts(targets: number, day: number, population: Host[]): Host[] {
    const changes: Host[] = []
    for(let i = 0; i < targets; i++) {
        const result = infectRandomHost(day, population)
        if (result) {
            changes.push(result)
        }
    }
    return changes
}

export function epidemic(population: Host[]):void {
    let virusExists = true
    let day = 0
    applyPopulationChange([infectRandomHost(day, population)], population)
    day++

    while(virusExists) {
        let populationChanges: Host[] = []
        virusExists = false
        let newInfections = 0
        let infectedCount = 0
        let recovering = 0
        let recovered = 0
        let immune = 0
        day++
        population.forEach((host, ix) => {
            if(host.infected) {
                immune++
                if(host.infected.recoverDate) {
                    recovered++
                }
            }
            if (host.infected?.active) {
                virusExists = true;
                infectedCount++
                // new infections
                const changes = infectHosts(host.social, day, population)
                newInfections += changes.length
                populationChanges = [...populationChanges, ...changes]
                // cure hosts
                const recoverDate = host.infected.aquireDate + virus.contagiousPeriod;
                if (day > recoverDate) {
                    populationChanges.push({
                        ...host,
                        infected: {
                            ...host.infected,
                            active: false,
                            recoverDate
                        }
                    })
                    recovering++
                }
            }
        })
        applyPopulationChange(populationChanges, population)
        console.log(`Day ${day}, infected: ${infectedCount}, newInfections: ${newInfections}, recovering: ${recovering}, recovered: ${recovered}, immune: ${immune}`)
    }
}
import event from 'node:events'

export type User = {
    name: string;
    email: string;
}

export const eventBus = new event.EventEmitter()

eventBus.on('mailService', (user: User) => {
    console.log(`${user?.email} was send to welcome mail`)
});

eventBus.on('user.create', (user: User) => {
    console.log('save in pg db');
})

eventBus.on('demo.create', () => {
    console.log('test user create');
})


function main() {
    console.log('call main fun');
    eventBus.emit('mailService', { name: 'chan', email: 'chan@gmail.com' })
    eventBus.emit('user.create', { name: 'koko', email: 'koko' })
};


main(); //trigger funs 
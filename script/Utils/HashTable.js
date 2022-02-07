export default class HashTable{
    constructor(size){
        this.values = {}
        this.size = size
    }
    add(key , value){
        const hash = this.genHash(key)

        if(!this.values.hasOwnProperty(hash))
            this.values[hash] = {}

        this.values[hash][key] = value;
    }

    remove(key){
        const hash = this.genHash(key)

        if(this.values.hasOwnProperty(hash) && this.values[hash].hasOwnProperty(key))
            delete this.values[hash][key];
    }

    getValue(key){
        const hash = this.genHash(key)

        if(this.values.hasOwnProperty(hash) && this.values[hash].hasOwnProperty(key))
            return this.values[hash][key];
    }

    genHash(key){
        let keyStr = key.toString();
        let sum = 0

        for(let i = 0 ; i < keyStr.length; i++)
            sum += keyStr.charCodeAt(i)

        return sum % this.size;
    }

    printAll(){
        for(const hash in this.values)
            for(const key in this.values[hash])
                console.log(`{ ${key} , ${this.values[hash][key]} } `)
    }
}